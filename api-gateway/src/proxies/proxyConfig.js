const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../utils/logger');

const createServiceProxy = (serviceUrl, serviceName) => {
  logger.info(`📡 Creating proxy for ${serviceName} -> ${serviceUrl}`);
  
  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    logLevel: 'debug',
    
    // NO reescribir path - mantener original
    pathRewrite: (path, req) => {
      logger.info(`Proxying ${serviceName}: ${path} -> ${serviceUrl}${path}`);
      return path; // Mantiene el path completo
    },
    
    onProxyReq: (proxyReq, req, res) => {
      const fullUrl = `${serviceUrl}${req.url}`;
      logger.debug(`Proxy request: ${req.method} ${req.url} -> ${fullUrl}`);
      
      // Headers de usuario
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId || req.user.id);
        proxyReq.setHeader('X-User-Email', req.user.email || '');
        proxyReq.setHeader('X-User-Role', req.user.role || 'user');
      }
      
      // FIX para POST/PUT/PATCH - reenviar body
      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        const bodyData = JSON.stringify(req.body);
        
        logger.debug(`📦 Body data: ${bodyData}`);
        
        // Sobrescribir headers
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        
        // Escribir body
        proxyReq.write(bodyData);
      }
    },
    
    onProxyRes: (proxyRes, req, res) => {
      logger.info(`✅ Response from ${serviceName}: ${proxyRes.statusCode}`);
    },
    
    onError: (err, req, res) => {
      logger.error(`❌ Proxy error for ${serviceName}:`, {
        message: err.message,
        code: err.code
      });
      
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message: `${serviceName} service is currently unavailable`,
          error: err.message,
          code: err.code
        });
      }
    },
    
    // Timeouts generosos
    timeout: 30000,
    proxyTimeout: 30000,
    
    // Otras opciones
    secure: false,
    ws: true,
    followRedirects: true
  });
};

module.exports = { createServiceProxy };