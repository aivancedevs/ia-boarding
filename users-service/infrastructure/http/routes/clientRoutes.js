const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validate, clientSchemas } = require('../middlewares/validator');

function createClientRoutes(clientController) {
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
  router.get('/', authMiddleware, (req, res, next) =>
    clientController.getClients(req, res, next)
  );

  /**
   * @swagger
   * /clients/{id}:
   *   get:
   *     summary: Get client by ID
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Client details
   */
  router.get('/:id', authMiddleware, (req, res, next) =>
    clientController.getClientById(req, res, next)
  );

  /**
   * @swagger
   * /clients:
   *   post:
   *     summary: Create a new client
   *     tags: [Clients]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               description:
   *                 type: string
   *               phone:
   *                 type: string
   *               address:
   *                 type: string
   *     responses:
   *       201:
   *         description: Client created
   */
  router.post(
    '/',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    validate(clientSchemas.create),
    (req, res, next) => clientController.createClient(req, res, next)
  );

  /**
   * @swagger
   * /clients/{id}:
   *   put:
   *     summary: Update client
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Client updated
   */
  router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'CLIENT_ADMIN']),
    validate(clientSchemas.update),
    (req, res, next) => clientController.updateClient(req, res, next)
  );

  /**
   * @swagger
   * /clients/{id}:
   *   delete:
   *     summary: Deactivate client
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Client deactivated
   */
  router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    (req, res, next) => clientController.deleteClient(req, res, next)
  );

  return router;
}

module.exports = createClientRoutes;