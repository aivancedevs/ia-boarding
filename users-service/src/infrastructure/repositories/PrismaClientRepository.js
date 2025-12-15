const ClientRepository = require('../../domain/repositories/ClientRepository');
const Client = require('../../domain/entities/Client');
const { prisma } = require('../../config/db');

class PrismaClientRepository extends ClientRepository {
  async create(clientData) {
    const client = await prisma.client.create({
      data: clientData,
      include: {
        users: true,
        projects: true,
      },
    });
    return new Client(client);
  }

  async findAll({ page = 1, limit = 10, status } = {}) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          users: true,
          projects: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      data: clients.map((c) => new Client(c)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        users: true,
        projects: true,
      },
    });
    return client ? new Client(client) : null;
  }

  async findByEmail(email) {
    const client = await prisma.client.findUnique({
      where: { email },
      include: {
        users: true,
        projects: true,
      },
    });
    return client ? new Client(client) : null;
  }

  async update(id, clientData) {
    const client = await prisma.client.update({
      where: { id },
      data: clientData,
      include: {
        users: true,
        projects: true,
      },
    });
    return new Client(client);
  }

  async delete(id) {
    const client = await prisma.client.update({
      where: { id },
      data: { status: 'INACTIVE' },
      include: {
        users: true,
        projects: true,
      },
    });
    return new Client(client);
  }
}

module.exports = PrismaClientRepository;