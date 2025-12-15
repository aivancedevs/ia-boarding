const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create a sample client
  const client = await prisma.client.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'Example Corporation',
      description: 'A sample client company',
      email: 'client@example.com',
      phone: '+1234567890',
      address: '123 Business St, City',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Sample client created:', client.name);

  // Create client admin
  const clientAdmin = await prisma.user.upsert({
    where: { email: 'clientadmin@example.com' },
    update: {},
    create: {
      email: 'clientadmin@example.com',
      firstName: 'Client',
      lastName: 'Admin',
      role: 'CLIENT_ADMIN',
      status: 'ACTIVE',
      clientId: client.id,
    },
  });

  console.log('✅ Client admin created:', clientAdmin.email);

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
      status: 'ACTIVE',
      clientId: client.id,
    },
  });

  console.log('✅ Regular user created:', regularUser.email);

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete redesign of corporate website',
      status: 'ACTIVE',
      clientId: client.id,
      startDate: new Date('2024-01-01'),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'iOS and Android application',
      status: 'ACTIVE',
      clientId: client.id,
      startDate: new Date('2024-02-01'),
    },
  });

  console.log('✅ Sample projects created:', project1.name, project2.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });