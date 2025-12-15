const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');
const { prisma } = require('../../config/db');

class PrismaUserRepository extends UserRepository {
  async create(userData) {
    const user = await prisma.user.create({
      data: userData,
      include: { client: true },
    });
    return new User(user);
  }

  async findAll({ page = 1, limit = 10, status, role, clientId } = {}) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (role) where.role = role;
    if (clientId) where.clientId = clientId;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { client: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => new User(u)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { client: true },
    });
    return user ? new User(user) : null;
  }

  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { client: true },
    });
    return user ? new User(user) : null;
  }

  async update(id, userData) {
    const user = await prisma.user.update({
      where: { id },
      data: userData,
      include: { client: true },
    });
    return new User(user);
  }

  async delete(id) {
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
      include: { client: true },
    });
    return new User(user);
  }

  async updateRole(id, role) {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      include: { client: true },
    });
    return new User(user);
  }
}

module.exports = PrismaUserRepository;