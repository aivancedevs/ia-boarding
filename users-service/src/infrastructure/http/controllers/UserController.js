const logger = require('../../../config/logger');

class UserController {
  constructor(useCases) {
    this.useCases = useCases
    
    this.getUsers = this.getUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
  }

  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, status, role, clientId } = req.query;
      const result = await this.useCases.getUsers.execute({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        role,
        clientId,
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.useCases.getUserById.execute(id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await this.useCases.createUser.execute(req.validatedBody);
      logger.info(`User created: ${user.email}`);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.useCases.updateUser.execute(id, req.validatedBody);
      logger.info(`User updated: ${user.email}`);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.useCases.deleteUser.execute(id);
      logger.info(`User deactivated: ${user.email}`);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.validatedBody;
      const user = await this.useCases.updateUserRole.execute(id, role);
      logger.info(`User role updated: ${user.email} -> ${role}`);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;