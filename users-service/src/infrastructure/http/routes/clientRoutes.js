const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validate, clientSchemas } = require('../middlewares/validator');

function createClientRoutes(clientController) {
  console.log('🔧 [clientRoutes] createClientRoutes called');
  console.log('🔧 [clientRoutes] clientController:', clientController);
  console.log('🔧 [clientRoutes] clientController.getClients type:', typeof clientController.getClients);
  
  const router = express.Router();

  /**
   * @swagger
   * /clients:
   *   get:
   *     summary: Get all clients
   *     tags: [Clients]
   *     responses:
   *       200:
   *         description: List of clients
   */
  router.get('/', (req, res, next) => {
    console.log('🎯 [clientRoutes] GET / route handler CALLED');
    console.log('🎯 [clientRoutes] req.path:', req.path);
    console.log('🎯 [clientRoutes] req.originalUrl:', req.originalUrl);
    
    authMiddleware(req, res, (err) => {
      if (err) {
        console.log('❌ [clientRoutes] authMiddleware error:', err);
        return next(err);
      }
      console.log('✅ [clientRoutes] authMiddleware passed');
      console.log('🎯 [clientRoutes] Calling clientController.getClients...');
      
      try {
        clientController.getClients(req, res, next);
      } catch (error) {
        console.log('❌ [clientRoutes] Error calling getClients:', error);
        next(error);
      }
    });
  });

  router.get('/:id', authMiddleware, (req, res, next) => {
    console.log('🎯 [clientRoutes] GET /:id route handler CALLED');
    clientController.getClientById(req, res, next);
  });

  router.post(
    '/',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    validate(clientSchemas.create),
    (req, res, next) => {
      console.log('🎯 [clientRoutes] POST / route handler CALLED');
      clientController.createClient(req, res, next);
    }
  );

  router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'CLIENT_ADMIN']),
    validate(clientSchemas.update),
    (req, res, next) => {
      console.log('🎯 [clientRoutes] PUT /:id route handler CALLED');
      clientController.updateClient(req, res, next);
    }
  );

  router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    (req, res, next) => {
      console.log('🎯 [clientRoutes] DELETE /:id route handler CALLED');
      clientController.deleteClient(req, res, next);
    }
  );

  console.log('✅ [clientRoutes] Router created and returned');
  return router;
}

module.exports = createClientRoutes;