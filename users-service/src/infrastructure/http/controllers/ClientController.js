const logger = require('../../../config/logger');

class ClientController {
  constructor(useCases) {
    this.useCases = useCases;

    this.getClients = this.getClients.bind(this);
    this.getClientById = this.getClientById.bind(this);
    this.createClient = this.createClient.bind(this);
    this.updateClient = this.updateClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
  }

  async getClients(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await this.useCases.getClients.execute({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
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

  async getClientById(req, res, next) {
    try {
      const { id } = req.params;
      const client = await this.useCases.getClientById.execute(id);

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async createClient(req, res, next) {
    try {
      const client = await this.useCases.createClient.execute(req.validatedBody);
      logger.info(`Client created: ${client.name}`);

      res.status(201).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    try {
      const { id } = req.params;
      const client = await this.useCases.updateClient.execute(id, req.validatedBody);
      logger.info(`Client updated: ${client.name}`);

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next) {
    try {
      const { id } = req.params;
      const client = await this.useCases.deleteClient.execute(id);
      logger.info(`Client deactivated: ${client.name}`);

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClientController;