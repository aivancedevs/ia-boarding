console.log('========================================');
console.log('🔍 SERVER.JS STARTING');
console.log('========================================');

console.log('1. Loading express...');
const express = require('express');
console.log('✅ Express loaded');

console.log('2. Loading cors...');
const cors = require('cors');
console.log('✅ CORS loaded');

console.log('3. Loading helmet...');
const helmet = require('helmet');
console.log('✅ Helmet loaded');

console.log('4. Loading rateLimit...');
const rateLimit = require('express-rate-limit');
console.log('✅ RateLimit loaded');

console.log('5. Loading config...');
const config = require('./config/env');
console.log('✅ Config loaded:', config.app);

console.log('6. Loading logger...');
const logger = require('./config/logger');
console.log('✅ Logger loaded');

console.log('7. Loading db...');
const { connectDatabase } = require('./config/db');
console.log('✅ DB module loaded');

console.log('8. Loading swagger...');
const { setupSwagger } = require('./infrastructure/http/swagger/swagger');
console.log('✅ Swagger loaded');

console.log('9. Loading routes...');
const setupRoutes = require('./infrastructure/http/routes');
console.log('✅ Routes loaded');

console.log('10. Loading errorHandler...');
const errorHandler = require('./infrastructure/http/middlewares/errorHandler');
console.log('✅ ErrorHandler loaded');

console.log('11. Loading repositories...');
const PrismaUserRepository = require('./infrastructure/repositories/PrismaUserRepository');
const PrismaClientRepository = require('./infrastructure/repositories/PrismaClientRepository');
const PrismaProjectRepository = require('./infrastructure/repositories/PrismaProjectRepository');
console.log('✅ Repositories loaded');

console.log('12. Loading use cases...');
const CreateUser = require('./application/use-cases/users/CreateUser');
const GetUsers = require('./application/use-cases/users/GetUsers');
const GetUserById = require('./application/use-cases/users/GetUserById');
const UpdateUser = require('./application/use-cases/users/UpdateUser');
const DeleteUser = require('./application/use-cases/users/DeleteUser');
const UpdateUserRole = require('./application/use-cases/users/UpdateUserRole');

const CreateClient = require('./application/use-cases/clients/CreateClient');
const GetClients = require('./application/use-cases/clients/GetClients');
const GetClientById = require('./application/use-cases/clients/GetClientById');
const UpdateClient = require('./application/use-cases/clients/UpdateClient');
const DeleteClient = require('./application/use-cases/clients/DeleteClient');

const CreateProject = require('./application/use-cases/projects/CreateProject');
const GetProjectsByClient = require('./application/use-cases/projects/GetProjectsByClient');
const GetProjectById = require('./application/use-cases/projects/GetProjectById');
const UpdateProject = require('./application/use-cases/projects/UpdateProject');
const DeleteProject = require('./application/use-cases/projects/DeleteProject');
console.log('✅ Use cases loaded');

console.log('13. Loading controllers...');
const UserController = require('./infrastructure/http/controllers/UserController');
const ClientController = require('./infrastructure/http/controllers/ClientController');
const ProjectController = require('./infrastructure/http/controllers/ProjectController');
console.log('✅ Controllers loaded');

console.log('========================================');
console.log('ALL IMPORTS LOADED - CALLING startServer()');
console.log('========================================');

async function startServer() {
  console.log('📍 Inside startServer function');
  try {
    console.log('📍 Connecting to database...');
    await connectDatabase();
    console.log('✅ Database connected');

    console.log('📍 Creating express app...');
    const app = express();
    console.log('✅ Express app created');

    console.log('📍 Setting up security middleware...');
    app.use(helmet());
    app.use(cors());
    console.log('✅ Security middleware setup');

    console.log('📍 Setting up rate limiting...');
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP',
    });
    app.use('/api', limiter);
    console.log('✅ Rate limiting setup');

    console.log('📍 Setting up body parsing...');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    console.log('✅ Body parsing setup');

    console.log('📍 Setting up request logging...');
    app.use((req, res, next) => {
      logger.http(`${req.method} ${req.path}`);
      next();
    });
    console.log('✅ Request logging setup');

    console.log('📍 Initializing repositories...');
    const userRepository = new PrismaUserRepository();
    const clientRepository = new PrismaClientRepository();
    const projectRepository = new PrismaProjectRepository();
    console.log('✅ Repositories initialized');

    console.log('📍 Initializing use cases...');
    const userUseCases = {
      createUser: new CreateUser(userRepository),
      getUsers: new GetUsers(userRepository),
      getUserById: new GetUserById(userRepository),
      updateUser: new UpdateUser(userRepository),
      deleteUser: new DeleteUser(userRepository),
      updateUserRole: new UpdateUserRole(userRepository),
    };

    const clientUseCases = {
      createClient: new CreateClient(clientRepository),
      getClients: new GetClients(clientRepository),
      getClientById: new GetClientById(clientRepository),
      updateClient: new UpdateClient(clientRepository),
      deleteClient: new DeleteClient(clientRepository),
    };

    const projectUseCases = {
      createProject: new CreateProject(projectRepository, clientRepository),
      getProjectsByClient: new GetProjectsByClient(projectRepository),
      getProjectById: new GetProjectById(projectRepository),
      updateProject: new UpdateProject(projectRepository),
      deleteProject: new DeleteProject(projectRepository),
    };
    console.log('✅ Use cases initialized');

    console.log('📍 Initializing controllers...');
    const controllers = {
      userController: new UserController(userUseCases),
      clientController: new ClientController(clientUseCases),
      projectController: new ProjectController(projectUseCases),
    };
    console.log('✅ Controllers initialized');

    console.log('📍 Setting up routes...');
    setupRoutes(app, controllers);
    console.log('✅ Routes setup');

    console.log('📍 Setting up Swagger...');
    setupSwagger(app);
    console.log('✅ Swagger setup');

    console.log('📍 Setting up error handler...');
    app.use(errorHandler);
    console.log('✅ Error handler setup');

    console.log('📍 Starting server on port', config.app.port);
    const server = app.listen(config.app.port, '0.0.0.0', () => {
      console.log('✅ SERVER STARTED SUCCESSFULLY!!!');
      logger.info(`🚀 ${config.app.serviceName} running on port ${config.app.port}`);
      logger.info(`📚 API Documentation: http://localhost:${config.app.port}/api-docs`);
      logger.info(`🏥 Health check: http://localhost:${config.app.port}/api/health`);
      logger.info(`Environment: ${config.app.nodeEnv}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ ERROR IN startServer:', error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

console.log('📍 About to call startServer()...');
startServer();