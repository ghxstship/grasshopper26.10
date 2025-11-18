import { createAdvancingRequestSchema, AdvancingCategory, AdvancingPriority } from '../advancing';

describe('createAdvancingRequestSchema', () => {
  const advancingRequestSchema = createAdvancingRequestSchema;

  it('should validate a valid advancing request', () => {
    const validRequest = {
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      category: 'ACCESS' as AdvancingCategory,
      title: 'Test Request',
      description: 'Test description',
      priority: 'HIGH' as AdvancingPriority,
      requestedBy: '123e4567-e89b-12d3-a456-426614174001',
    };

    const result = advancingRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('should reject request without required fields', () => {
    const invalidRequest = {
      category: 'ACCESS',
    };

    const result = advancingRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should reject invalid category', () => {
    const invalidRequest = {
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      category: 'INVALID_CATEGORY',
      title: 'Test Request',
      description: 'Test description',
      priority: 'HIGH',
      requestedBy: '123e4567-e89b-12d3-a456-426614174001',
    };

    const result = advancingRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should reject invalid priority', () => {
    const invalidRequest = {
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      category: 'ACCESS',
      title: 'Test Request',
      description: 'Test description',
      priority: 'INVALID_PRIORITY',
      requestedBy: '123e4567-e89b-12d3-a456-426614174001',
    };

    const result = advancingRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });

  it('should accept optional fields', () => {
    const requestWithOptionals = {
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      category: 'ACCESS' as AdvancingCategory,
      title: 'Test Request',
      description: 'Test description',
      priority: 'HIGH' as AdvancingPriority,
      requestedBy: '123e4567-e89b-12d3-a456-426614174001',
      dueDate: new Date('2024-12-31').toISOString(),
      requirements: { venue: 'Test Venue' },
    };

    const result = advancingRequestSchema.safeParse(requestWithOptionals);
    expect(result.success).toBe(true);
  });
});
