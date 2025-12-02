const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    } else {
      logger.http(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    }
  });

  next();
};

module.exports = { loggerMiddleware };