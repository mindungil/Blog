import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from './errorHandler.js';

// 유효성 검증 결과 처리
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const details = {};
    errors.array().forEach(error => {
      if (!details[error.param]) {
        details[error.param] = [];
      }
      details[error.param].push(error.msg);
    });
    
    throw new ValidationError('유효성 검증 실패', details);
  }
  
  next();
};

// 회원가입 유효성 검증
export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문자와 숫자를 포함해야 합니다.'),
  body('username')
    .isLength({ min: 2, max: 20 })
    .withMessage('사용자명은 2자 이상 20자 이하여야 합니다.')
    .matches(/^[a-zA-Z0-9가-힣_]+$/)
    .withMessage('사용자명은 영문, 숫자, 한글, 언더스코어만 사용 가능합니다.'),
  handleValidationErrors
];

// 로그인 유효성 검증
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.'),
  handleValidationErrors
];

// 게시글 작성/수정 유효성 검증
export const validatePost = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('제목은 1자 이상 255자 이하여야 합니다.')
    .trim(),
  body('content')
    .optional()
    .isLength({ max: 65535 })
    .withMessage('내용은 65535자 이하여야 합니다.'),
  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('발행 상태는 true 또는 false여야 합니다.'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('태그는 배열 형태여야 합니다.'),
  body('tags.*')
    .isLength({ min: 1, max: 50 })
    .withMessage('태그는 1자 이상 50자 이하여야 합니다.'),
  handleValidationErrors
];

// 댓글 작성/수정 유효성 검증
export const validateComment = [
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('댓글은 1자 이상 1000자 이하여야 합니다.')
    .trim(),
  handleValidationErrors
];

// 메모 작성/수정 유효성 검증
export const validateMemo = [
  body('content')
    .isLength({ min: 1, max: 65535 })
    .withMessage('메모는 1자 이상 65535자 이하여야 합니다.')
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('태그는 배열 형태여야 합니다.'),
  body('tags.*')
    .isLength({ min: 1, max: 50 })
    .withMessage('태그는 1자 이상 50자 이하여야 합니다.'),
  handleValidationErrors
];

// 일정 작성/수정 유효성 검증
export const validateSchedule = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('일정 제목은 1자 이상 255자 이하여야 합니다.')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('일정 설명은 1000자 이하여야 합니다.'),
  body('start_date')
    .isISO8601()
    .withMessage('시작 날짜는 유효한 날짜 형식이어야 합니다.'),
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('종료 날짜는 유효한 날짜 형식이어야 합니다.'),
  body('is_all_day')
    .optional()
    .isBoolean()
    .withMessage('하루 종일 여부는 true 또는 false여야 합니다.'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('태그는 배열 형태여야 합니다.'),
  body('reminders')
    .optional()
    .isArray()
    .withMessage('알림은 배열 형태여야 합니다.'),
  handleValidationErrors
];

// ID 파라미터 유효성 검증
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('유효한 ID를 입력해주세요.'),
  handleValidationErrors
];

// 페이지네이션 유효성 검증
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('제한 수는 1 이상 100 이하의 정수여야 합니다.'),
  handleValidationErrors
];