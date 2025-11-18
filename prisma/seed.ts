import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gvteway.com' },
    update: {},
    create: {
      email: 'admin@gvteway.com',
      name: 'System Admin',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create test organization
  const org = await prisma.organization.upsert({
    where: { slug: 'test-org' },
    update: {},
    create: {
      name: 'Test Organization',
      slug: 'test-org',
      description: 'Test organization for development',
    },
  });

  console.log('✅ Created organization:', org.name);

  // Add admin to organization
  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      userId: admin.id,
      role: 'OWNER',
    },
  });

  // Create event categories
  const categories = [
    { name: 'Music', slug: 'music', icon: '🎵', color: '#FF0000' },
    { name: 'Sports', slug: 'sports', icon: '⚽', color: '#00FF00' },
    { name: 'Arts', slug: 'arts', icon: '🎨', color: '#0066FF' },
    { name: 'Technology', slug: 'technology', icon: '💻', color: '#FFD700' },
    { name: 'Food & Drink', slug: 'food-drink', icon: '🍔', color: '#FF8800' },
  ];

  for (const category of categories) {
    await prisma.eventCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Created event categories');

  // Create test venue
  const venue = await prisma.venue.upsert({
    where: { slug: 'test-venue' },
    update: {},
    create: {
      name: 'Test Venue',
      slug: 'test-venue',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94102',
      capacity: 5000,
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  console.log('✅ Created venue:', venue.name);

  // Create membership tiers
  const tiers = [
    {
      name: 'Free',
      description: 'Basic access to events',
      price: 0,
      interval: 'month',
      benefits: ['Event discovery', 'Basic ticketing'],
    },
    {
      name: 'Premium',
      description: 'Enhanced features and perks',
      price: 9.99,
      interval: 'month',
      benefits: ['Priority booking', 'Exclusive events', 'Discounts'],
      featured: true,
    },
    {
      name: 'VIP',
      description: 'Ultimate event experience',
      price: 29.99,
      interval: 'month',
      benefits: ['All Premium benefits', 'VIP access', 'Concierge service'],
    },
  ];

  for (const tier of tiers) {
    const existing = await prisma.membershipTier.findFirst({
      where: { 
        organizationId: org.id,
        name: tier.name
      }
    });
    
    if (!existing) {
      await prisma.membershipTier.create({
        data: {
          ...tier,
          organization: {
            connect: { id: org.id }
          },
        },
      });
    }
  }

  console.log('✅ Created membership tiers');

  // Create test users for each platform
  const testUsers = [
    {
      email: 'consumer@test.com',
      name: 'Test Consumer',
      role: 'CONSUMER' as const,
    },
    {
      email: 'crew@test.com',
      name: 'Test Crew Member',
      role: 'EXTERNAL_TEAM' as const,
    },
    {
      email: 'manager@test.com',
      name: 'Test Manager',
      role: 'INTERNAL_TEAM' as const,
    },
  ];

  const password = await hash('test123', 12);

  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password,
        emailVerified: new Date(),
      },
    });

    // Create platform-specific profiles
    if (userData.role === 'EXTERNAL_TEAM') {
      await prisma.compvssUser.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          position: 'Production Crew',
          department: 'Technical',
          status: 'APPROVED',
        },
      });
    }

    if (userData.role === 'INTERNAL_TEAM') {
      await prisma.atlvsUser.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          role: 'MANAGER',
          department: 'Production',
          title: 'Production Manager',
        },
      });
    }

    console.log('✅ Created test user:', user.email);
  }

  // Create N8N instance
  await prisma.n8NInstance.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Default N8N Instance',
      url: 'http://localhost:5678',
      apiKey: 'development-key',
      version: '1.0.0',
      status: 'active',
    },
  });

  console.log('✅ Created N8N instance');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
