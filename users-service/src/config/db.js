const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query}`);
  logger.debug(`Duration: ${e.duration}ms`);
});

prisma.$on('error', (e) => {
  logger.error(`Prisma error: ${e.message}`);
});

prisma.$on('warn', (e) => {
  logger.warn(`Prisma warning: ${e.message}`);
});

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase,
};