/**
 * Mock data generators for testing
 */

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockEvent = {
  id: 'test-event-id',
  title: 'Test Event',
  description: 'A test event description',
  date: new Date('2024-12-31'),
  venue: 'Test Venue',
  city: 'Test City',
  state: 'TS',
  price: 50.00,
  category: 'Music',
  imageUrl: '/test-image.jpg',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockTicket = {
  id: 'test-ticket-id',
  eventId: 'test-event-id',
  userId: 'test-user-id',
  qrCode: 'TEST-QR-CODE',
  status: 'active',
  purchaseDate: new Date('2024-01-01'),
  price: 50.00,
}

export const mockProject = {
  id: 'test-project-id',
  name: 'Test Project',
  description: 'A test project description',
  status: 'active',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  budget: 100000,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockTask = {
  id: 'test-task-id',
  projectId: 'test-project-id',
  title: 'Test Task',
  description: 'A test task description',
  status: 'todo',
  priority: 'medium',
  assigneeId: 'test-user-id',
  dueDate: new Date('2024-12-31'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockAdvancingRequest = {
  id: 'test-request-id',
  projectId: 'test-project-id',
  category: 'Access & Credentials',
  title: 'Test Request',
  description: 'A test advancing request',
  status: 'pending',
  priority: 'medium',
  requesterId: 'test-user-id',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// Factory functions for generating multiple mock items
export const createMockUsers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockUser,
    id: `test-user-${i}`,
    email: `test${i}@example.com`,
    name: `Test User ${i}`,
  }))
}

export const createMockEvents = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockEvent,
    id: `test-event-${i}`,
    title: `Test Event ${i}`,
  }))
}

export const createMockProjects = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockProject,
    id: `test-project-${i}`,
    name: `Test Project ${i}`,
  }))
}
