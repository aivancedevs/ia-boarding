const logger = require('../../../config/logger');

class ProjectController {
  constructor(useCases) {
    this.useCases = useCases;

    // Bind methods
    this.getProjectsByClient = this.getProjectsByClient.bind(this);
    this.getProjectById = this.getProjectById.bind(this);
    this.createProject = this.createProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  async getProjectsByClient(req, res, next) {
    try {
      const { clientId } = req.params;
      const projects = await this.useCases.getProjectsByClient.execute(clientId);

      res.json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const project = await this.useCases.getProjectById.execute(id);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProject(req, res, next) {
    try {
      const project = await this.useCases.createProject.execute(req.validatedBody);
      logger.info(`Project created: ${project.name}`);

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await this.useCases.updateProject.execute(id, req.validatedBody);
      logger.info(`Project updated: ${project.name}`);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await this.useCases.deleteProject.execute(id);
      logger.info(`Project archived: ${project.name}`);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;