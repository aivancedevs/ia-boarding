const ProjectRepository = require('../../domain/repositories/ProjectRepository');
const Project = require('../../domain/entities/Project');
const { prisma } = require('../../config/db');

class PrismaProjectRepository extends ProjectRepository {
  async create(projectData) {
    const project = await prisma.project.create({
      data: projectData,
      include: { client: true },
    });
    return new Project(project);
  }

  async findAll({ page = 1, limit = 10, status, clientId } = {}) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: { client: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data: projects.map((p) => new Project(p)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { client: true },
    });
    return project ? new Project(project) : null;
  }

  async findByClientId(clientId) {
    const projects = await prisma.project.findMany({
      where: { clientId },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
    return projects.map((p) => new Project(p));
  }

  async update(id, projectData) {
    const project = await prisma.project.update({
      where: { id },
      data: projectData,
      include: { client: true },
    });
    return new Project(project);
  }

  async delete(id) {
    const project = await prisma.project.update({
      where: { id },
      data: { status: 'ARCHIVED' },
      include: { client: true },
    });
    return new Project(project);
  }
}

module.exports = PrismaProjectRepository;