const logger = require('../../../config/logger');

const authMiddleware = (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userEmail || !userRole) {
      logger.warn('Missing authentication headers');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Missing authentication headers',
      });
    }

    req.user = {
      id: userId,
      email: userEmail,
      role: userRole,
    };

    logger.debug(`Authenticated user: ${userEmail} (${userRole})`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }
};

module.exports = authMiddleware;