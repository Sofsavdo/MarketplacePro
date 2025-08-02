const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Default error
  let error = {
    message: 'Server xatoligi',
    statusCode: 500
  };
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Ma\'lumotlar noto\'g\'ri';
    error.statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    error.message = 'Avtorizatsiya talab qilinadi';
    error.statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    error.message = 'Ruxsat yo\'q';
    error.statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    error.message = 'Ma\'lumot topilmadi';
    error.statusCode = 404;
  } else if (err.name === 'ConflictError') {
    error.message = 'Ma\'lumot allaqachon mavjud';
    error.statusCode = 409;
  } else if (err.code === '23505') { // PostgreSQL unique constraint
    error.message = 'Ma\'lumot allaqachon mavjud';
    error.statusCode = 409;
  } else if (err.code === '23503') { // PostgreSQL foreign key constraint
    error.message = 'Bog\'liq ma\'lumot topilmadi';
    error.statusCode = 400;
  } else if (err.message) {
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
  }
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    error.stack = undefined;
  } else {
    error.stack = err.stack;
  }
  
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

module.exports = errorHandler; 