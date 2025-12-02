const { AUTH_SERVICE_URL } = require('../config/env');
const { createServiceProxy } = require('./proxyConfig');

const authProxy = createServiceProxy(AUTH_SERVICE_URL, 'auth');

module.exports = authProxy;