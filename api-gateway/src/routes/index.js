const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const healthRoutes = require('./health.routes');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authRateLimiter } = require('../middlewares/rateLimiter.middleware');
const { AUTH_SERVICE_URL, USERS_SERVICE_URL, IA_SERVICE_URL } = require('../config/env');
const logger = require('../utils/logger');

const router = express.Router();

// Health check del gateway
router.use('/', healthRoutes);

// ===== AUTH SERVICE PROXY =====
router.use('/auth', authRateLimiter, createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // Remueve /auth del path
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`[Auth Proxy] ${req.method} ${req.path} -> ${AUTH_SERVICE_URL}${req.path.replace('/auth', '')}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    logger.info(`[Auth Proxy] Response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    logger.error('[Auth Proxy] Error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'auth-service is currently unavailable',
        error: err.message,
        code: err.code
      });
    }
  }
}));

// ===== USERS SERVICE PROXY =====
router.use('/users', authenticateToken, createProxyMiddleware({
  target: USERS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/users': '/api', // /users -> /api en users-service
  },
  onProxyReq: (proxyReq, req, res) => {
    const newPath = req.path.replace('/users', '/api');
    logger.info(`[Users Proxy] ${req.method} ${req.path} -> ${USERS_SERVICE_URL}${newPath}`);
    
    // Propagar headers de usuario
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.userId || req.user.id);
      proxyReq.setHeader('X-User-Email', req.user.email || '');
      proxyReq.setHeader('X-User-Role', req.user.role || 'USER');
    }
    
    // Fix para POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    logger.info(`[Users Proxy] Response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    logger.error('[Users Proxy] Error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'users-service is currently unavailable',
        error: err.message,
        code: err.code
      });
    }
  }
}));

// ===== IA SERVICE PROXY (para futuro) =====
if (IA_SERVICE_URL) {
  router.use('/ia', authenticateToken, createProxyMiddleware({
    target: IA_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/ia': '/api',
    },
    onProxyReq: (proxyReq, req, res) => {
      logger.info(`[IA Proxy] ${req.method} ${req.path} -> ${IA_SERVICE_URL}${req.path.replace('/ia', '/api')}`);
      
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId || req.user.id);
        proxyReq.setHeader('X-User-Email', req.user.email || '');
        proxyReq.setHeader('X-User-Role', req.user.role || 'USER');
      }
    },
    onError: (err, req, res) => {
      logger.error('[IA Proxy] Error:', err.message);
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message: 'ia-service is currently unavailable',
          error: err.message
        });
      }
    }
  }));
}

logger.info('✅ All routes configured successfully');
logger.info(`   - /auth -> ${AUTH_SERVICE_URL}`);
logger.info(`   - /users -> ${USERS_SERVICE_URL}`);
if (IA_SERVICE_URL) logger.info(`   - /ia -> ${IA_SERVICE_URL}`);

module.exports = router;