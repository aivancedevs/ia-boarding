const logger = require('../../../config/logger');

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        logger.warn('No user role found in request');
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      if (!allowedRoles.includes(userRole)) {
        logger.warn(`User role ${userRole} not authorized for this endpoint`);
        return res.status(403).json({
          success: false,
          error: 'Forbidden - Insufficient permissions',
        });
      }

      next();
    } catch (error) {
      logger.error('Role validation error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
};

module.exports = roleMiddleware;