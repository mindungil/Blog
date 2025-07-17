export { authenticate, optionalAuth } from './auth.js';
export { 
  errorHandler, 
  notFoundHandler, 
  asyncHandler,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError
} from './errorHandler.js';
export {
  validateRegister,
  validateLogin,
  validatePost,
  validateComment,
  validateMemo,
  validateSchedule,
  validateId,
  validatePagination,
  handleValidationErrors
} from './validation.js';

// backend/src/utils/jwt.js
import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};