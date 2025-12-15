const express = require('express');
const createUserRoutes = require('./userRoutes');
const createClientRoutes = require('./clientRoutes');
const createProjectRoutes = require('./projectRoutes');

function setupRoutes(app, controllers) {
  console.log('🔧 setupRoutes: Starting route setup...');
  
  const apiRouter = express.Router();

  // Health check en el router principal
  apiRouter.get('/health', (req, res) => {
    console.log('✅ Health check hit');
    res.json({
      success: true,
      service: 'users-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  // Crear los routers individuales
  console.log('🔧 Creating user routes...');
  const userRouter = createUserRoutes(controllers.userController);
  
  console.log('🔧 Creating client routes...');
  const clientRouter = createClientRoutes(controllers.clientController);
  
  console.log('🔧 Creating project routes...');
  const projectRouter = createProjectRoutes(controllers.projectController);

  // Montar los routers con sus prefijos
  console.log('🔧 Mounting /users routes...');
  apiRouter.use('/users', userRouter);
  
  console.log('🔧 Mounting /clients routes...');
  apiRouter.use('/clients', clientRouter);
  
  console.log('🔧 Mounting /projects routes...');
  apiRouter.use('/projects', projectRouter);

  // Montar el router de API en /api
  console.log('🔧 Mounting /api router...');
  app.use('/api', apiRouter);
  
  console.log('✅ All routes mounted successfully!');
  console.log('📍 Available routes:');
  console.log('   - GET  /api/health');
  console.log('   - GET  /api/users');
  console.log('   - GET  /api/clients');
  console.log('   - GET  /api/projects/client/:clientId');
}

module.exports = setupRoutes;