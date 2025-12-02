const jwt = require('jsonwebtoken');
const { JWT_SECRET, PUBLIC_ROUTES } = require('../config/env');
const logger = require('../utils/logger');

const isPublicRoute = (path) => {
  return PUBLIC_ROUTES.some(route => {
    if (route.endsWith('/*')) {
      const baseRoute = route.slice(0, -2);
      return path.startsWith(baseRoute);
    }
    if (route.endsWith('*')) {
      const baseRoute = route.slice(0, -1);
      return path.startsWith(baseRoute);
    }
    return path === route || path.startsWith(route);
  });
};

const authenticateToken = (req, res, next) => {
  const path = req.path;

  if (isPublicRoute(path)) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn(`Authentication failed: No token provided for ${path}`);
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    logger.info(`User ${decoded.userId || decoded.id} authenticated successfully`);
    next();
  } catch (error) {
    logger.error(`JWT verification failed: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      logger.warn(`Optional auth failed: ${error.message}`);
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  isPublicRoute
};