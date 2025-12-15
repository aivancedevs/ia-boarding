const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { validate, projectSchemas } = require('../middlewares/validator');

function createProjectRoutes(projectController) {
  console.log('🔧 [projectRoutes] createProjectRoutes called');
  
  const router = express.Router();

  /**
   * @swagger
   * /projects/client/{clientId}:
   *   get:
   *     summary: Get projects by client
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: clientId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of projects
   */
  router.get('/client/:clientId', authMiddleware, (req, res, next) => {
    console.log('🎯 [projectRoutes] GET /client/:clientId CALLED');
    console.log('🎯 [projectRoutes] clientId:', req.params.clientId);
    projectController.getProjectsByClient(req, res, next);
  });

  /**
   * @swagger
   * /projects/{id}:
   *   get:
   *     summary: Get project by ID
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Project details
   */
  router.get('/:id', authMiddleware, (req, res, next) => {
    console.log('🎯 [projectRoutes] GET /:id CALLED');
    projectController.getProjectById(req, res, next);
  });

  router.post(
    '/',
    authMiddleware,
    roleMiddleware(['ADMIN', 'CLIENT_ADMIN']),
    validate(projectSchemas.create),
    (req, res, next) => {
      console.log('🎯 [projectRoutes] POST / CALLED');
      projectController.createProject(req, res, next);
    }
  );

  router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'CLIENT_ADMIN']),
    validate(projectSchemas.update),
    (req, res, next) => {
      console.log('🎯 [projectRoutes] PUT /:id CALLED');
      projectController.updateProject(req, res, next);
    }
  );

  router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['ADMIN', 'CLIENT_ADMIN']),
    (req, res, next) => {
      console.log('🎯 [projectRoutes] DELETE /:id CALLED');
      projectController.deleteProject(req, res, next);
    }
  );

  console.log('✅ [projectRoutes] Router created');
  return router;
}

module.exports = createProjectRoutes;