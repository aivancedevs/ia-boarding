const express = require('express');
const { API_GATEWAY_NAME, NODE_ENV } = require('../config/env');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    gateway: API_GATEWAY_NAME,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  });
});

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome to ${API_GATEWAY_NAME}`,
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

module.exports = router;