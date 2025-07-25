// backend/src/middleware/errorHandler.js
import { ValidationError } from 'sequelize';

// 커스텀 에러 클래스들
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = '인증이 필요합니다.') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = '권한이 없습니다.') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다.') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = '이미 존재하는 데이터입니다.') {
    super(message, 409, 'CONFLICT');
  }
}

// 에러 핸들러 미들웨어
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 로그 출력 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Sequelize 유효성 검증 에러
  if (err.name === 'SequelizeValidationError') {
    const details = {};
    err.errors.forEach(error => {
      if (!details[error.path]) {
        details[error.path] = [];
      }
      details[error.path].push(error.message);
    });
    
    error = new ValidationError('유효성 검증 실패', details);
  }

  // Sequelize 고유 제약 조건 에러
  if (err.name === 'SequelizeUniqueConstraintError') {
    const details = {};
    err.errors.forEach(error => {
      if (!details[error.path]) {
        details[error.path] = [];
      }
      details[error.path].push('이미 존재하는 값입니다.');
    });
    
    error = new ConflictError('중복된 데이터입니다.', details);
  }

  // Sequelize 외래 키 제약 조건 에러
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = new ValidationError('참조 무결성 제약 조건 위반입니다.');
  }

  // Cast 에러 (잘못된 ID 형식 등)
  if (err.name === 'CastError') {
    error = new ValidationError('잘못된 데이터 형식입니다.');
  }

  // JWT 에러들은 auth 미들웨어에서 처리되므로 여기서는 기본 처리
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = new AuthenticationError('인증 토큰이 유효하지 않습니다.');
  }

  // 운영 환경에서는 isOperational이 true인 에러만 클라이언트에게 전송
  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    error = new AppError('서버 내부 오류가 발생했습니다.');
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || '서버 내부 오류가 발생했습니다.',
      ...(error.details && { details: error.details })
    }
  });
};

// 404 에러 핸들러
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`${req.originalUrl} 경로를 찾을 수 없습니다.`);
  next(error);
};

// 비동기 함수 에러 캐치 헬퍼
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};