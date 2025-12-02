const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../utils/logger');

const createServiceProxy = (serviceUrl, serviceName) => {
  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const prefix = `/${serviceName}`;
      const newPath = path.replace(prefix, '');
      logger.info(`Proxying ${serviceName}: ${path} -> ${serviceUrl}${newPath}`);
      return newPath;
    },
    onProxyReq: (proxyReq, req, res) => {
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId || req.user.id);
        proxyReq.setHeader('X-User-Email', req.user.email || '');
        proxyReq.setHeader('X-User-Role', req.user.role || 'user');
      }
      logger.debug(`Proxy request: ${req.method} ${req.path} -> ${serviceUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      logger.debug(`Proxy response: ${proxyRes.statusCode} from ${serviceName}`);
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${serviceName}:`, err.message);
      res.status(502).json({
        success: false,
        message: `${serviceName} is currently unavailable`,
        error: err.message
      });
    },
    secure: false,
    ws: true,
    timeout: 30000,
    proxyTimeout: 30000
  });
};

module.exports = { createServiceProxy };