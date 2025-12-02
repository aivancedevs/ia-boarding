const cors = require('cors');
const { CORS_ORIGIN, CORS_CREDENTIALS } = require('./env');

const corsOptions = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (CORS_ORIGIN.includes('*') || CORS_ORIGIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
});

module.exports = { corsOptions };
