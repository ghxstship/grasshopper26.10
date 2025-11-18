import { beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@/lib/prisma';

// Global test setup
beforeAll(async () => {
  console.log('🧪 Setting up test environment...');
  
  // Connect to test database
  await prisma.$connect();
  
  // Clean up test data
  await cleanupTestData();
  
  console.log('✅ Test environment ready');
});

// Global test teardown
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');
  
  // Clean up test data
  await cleanupTestData();
  
  // Disconnect from database
  await prisma.$disconnect();
  
  console.log('✅ Test environment cleaned up');
});

async function cleanupTestData() {
  // Delete test data in correct order (respecting foreign keys)
  await prisma.orderItem.deleteMany({ where: { order: { user: { email: { contains: 'test' } } } } });
  await prisma.order.deleteMany({ where: { user: { email: { contains: 'test' } } } });
  await prisma.ticket.deleteMany({ where: { user: { email: { contains: 'test' } } } });
  await prisma.event.deleteMany({ where: { name: { contains: 'Test' } } });
  await prisma.user.deleteMany({ where: { email: { contains: 'test' } } });
}
