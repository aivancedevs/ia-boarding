const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validate, userSchemas } = require('../middlewares/validator');

function createUserRoutes(userController) {
  const router = express.Router();

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [ACTIVE, INACTIVE]
   *       - in: query
   *         name: role
   *         schema:
   *           type: string
   *           enum: [ADMIN, CLIENT_ADMIN, USER]
   *     responses:
   *       200:
   *         description: List of users
   */
  router.get('/', authMiddleware, (req, res, next) =>
    userController.getUsers(req, res, next)
  );

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User details
   */
  router.get('/:id', authMiddleware, (req, res, next) =>
    userController.getUserById(req, res, next)
  );

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - firstName
   *               - lastName
   *             properties:
   *               email:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [ADMIN, CLIENT_ADMIN, USER]
   *               clientId:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created
   */
  router.post(
    '/',
    authMiddleware,
    roleMiddleware(['ADMIN', 'CLIENT_ADMIN']),
    validate(userSchemas.create),
    (req, res, next) => userController.createUser(req, res, next)
  );

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Update user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User updated
   */
  router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'CLIENT_ADMIN']),
    validate(userSchemas.update),
    (req, res, next) => userController.updateUser(req, res, next)
  );

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Deactivate user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deactivated
   */
  router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    (req, res, next) => userController.deleteUser(req, res, next)
  );

  /**
   * @swagger
   * /users/{id}/role:
   *   patch:
   *     summary: Update user role
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Role updated
   */
  router.patch(
    '/:id/role',
    authMiddleware,
    roleMiddleware(['ADMIN']),
    validate(userSchemas.updateRole),
    (req, res, next) => userController.updateUserRole(req, res, next)
  );

  return router;
}

module.exports = createUserRoutes;