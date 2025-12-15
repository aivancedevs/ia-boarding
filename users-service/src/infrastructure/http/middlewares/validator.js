const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details,
      });
    }

    req.validatedBody = value;
    next();
  };
};

const userSchemas = {
  create: Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('ADMIN', 'CLIENT_ADMIN', 'USER').default('USER'),
    clientId: Joi.string().uuid().optional(),
  }),
  update: Joi.object({
    email: Joi.string().email().optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    clientId: Joi.string().uuid().optional().allow(null),
  }),
  updateRole: Joi.object({
    role: Joi.string().valid('ADMIN', 'CLIENT_ADMIN', 'USER').required(),
  }),
};

const clientSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(20).optional(),
    address: Joi.string().max(200).optional(),
  }),
  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().max(20).optional(),
    address: Joi.string().max(200).optional(),
  }),
};

const projectSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    clientId: Joi.string().uuid().required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  }),
  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    status: Joi.string().valid('ACTIVE', 'ARCHIVED').optional(),
  }),
};

module.exports = {
  validate,
  userSchemas,
  clientSchemas,
  projectSchemas,
};