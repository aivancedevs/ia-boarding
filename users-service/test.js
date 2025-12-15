console.log('========================================');
console.log('TEST STARTED');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('========================================');

try {
  console.log('Loading dotenv...');
  require('dotenv').config();
  console.log('✅ dotenv loaded');
  
  console.log('Loading config...');
  const config = require('./src/config/env');
  console.log('✅ config loaded:', config.app);
  
  console.log('Loading logger...');
  const logger = require('./src/config/logger');
  console.log('✅ logger loaded');
  
  logger.info('Test message from logger');
  
  console.log('========================================');
  console.log('ALL MODULES LOADED SUCCESSFULLY');
  console.log('========================================');
  
  // Mantener el proceso vivo
  setInterval(() => {
    console.log('Process still running...');
  }, 5000);
  
} catch (error) {
  console.error('========================================');
  console.error('ERROR CAUGHT:');
  console.error(error);
  console.error('========================================');
  process.exit(1);
}