const express = require('express');
const healthRoutes = require('./health.routes');
const authProxy = require('../proxies/authProxy');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authRateLimiter } = require('../middlewares/rateLimiter.middleware');
const { createServiceProxy } = require('../proxies/proxyConfig');
const { USERS_SERVICE_URL, IA_SERVICE_URL } = require('../config/env');
const logger = require('../utils/logger');

const router = express.Router();

router.use('/', healthRoutes);

router.use('/auth', authRateLimiter, authProxy);

router.use('/users', authenticateToken, createServiceProxy(USERS_SERVICE_URL, 'users'));

router.use('/ia', authenticateToken, createServiceProxy(IA_SERVICE_URL, 'ia'));

logger.info('✅ All routes configured successfully');

module.exports = router;