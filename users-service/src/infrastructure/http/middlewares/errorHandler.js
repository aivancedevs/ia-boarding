const logger = require('../../../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.details,
    });
  }

  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: err.message,
    });
  }

  if (err.message.includes('already exists') || err.message.includes('already in use')) {
    return res.status(409).json({
      success: false,
      error: err.message,
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Unique constraint violation',
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

module.exports = errorHandler;