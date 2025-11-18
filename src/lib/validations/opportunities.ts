import { z } from 'zod';
import { idSchema, dateSchema,  } from './common';

// Opportunity category enum
export const opportunityCategorySchema = z.enum([
  'RFP_JOB',
  'CAREER_FULL_TIME',
  'CAREER_PART_TIME',
  'CAREER_SEASONAL',
  'CAREER_INTERN',
  'AUDITION_CASTING',
  'CONTRACTOR',
  'SUBCONTRACTOR',
  'INDEPENDENT',
  'SPONSOR',
  'BRAND_AMBASSADOR',
  'STREET_TEAM',
  'INFLUENCER',
  'AFFILIATE',
]);

export type OpportunityCategory = z.infer<typeof opportunityCategorySchema>;

// Opportunity status enum
export const opportunityStatusSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'PAUSED',
  'CLOSED',
  'FILLED',
  'CANCELLED',
]);

export type OpportunityStatus = z.infer<typeof opportunityStatusSchema>;

// Application status enum
export const applicationStatusSchema = z.enum([
  'SUBMITTED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFER_PENDING',
  'OFFER_SENT',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
  'ONBOARDING',
  'COMPLETED',
]);

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

// Location type
export const locationTypeSchema = z.enum(['onsite', 'remote', 'hybrid']);

// Compensation type
export const compensationTypeSchema = z.enum([
  'hourly',
  'salary',
  'project',
  'commission',
  'volunteer',
]);

// Create opportunity
export const createOpportunitySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10),
  category: opportunityCategorySchema,
  organizationId: idSchema,
  projectId: idSchema.optional(),
  eventId: idSchema.optional(),
  
  // Details
  location: z.string().optional(),
  locationType: locationTypeSchema.optional(),
  compensationType: compensationTypeSchema.optional(),
  compensationMin: z.number().nonnegative().optional(),
  compensationMax: z.number().nonnegative().optional(),
  compensationCurrency: z.string().length(3).default('USD'),
  
  // Requirements (JSON arrays)
  requirements: z.array(z.string()).optional(),
  qualifications: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  
  // Timeline
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  applicationDeadline: dateSchema.optional(),
  
  // Application settings
  requireResume: z.boolean().default(true),
  requireCoverLetter: z.boolean().default(false),
  requirePortfolio: z.boolean().default(false),
  customQuestions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['text', 'textarea', 'select', 'multiselect']),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(false),
  })).optional(),
  
  // Metadata
  tags: z.array(z.string()).default([]),
});

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;

// Update opportunity
export const updateOpportunitySchema = createOpportunitySchema
  .partial()
  .omit({ organizationId: true });

export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;

// Publish opportunity
export const publishOpportunitySchema = z.object({
  publishedBy: idSchema,
});

// Opportunity filters
export const opportunityFiltersSchema = z.object({
  organizationId: idSchema.optional(),
  projectId: idSchema.optional(),
  eventId: idSchema.optional(),
  category: opportunityCategorySchema.optional(),
  status: opportunityStatusSchema.optional(),
  locationType: locationTypeSchema.optional(),
  compensationType: compensationTypeSchema.optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  deadlineBefore: dateSchema.optional(),
  deadlineAfter: dateSchema.optional(),
});

export type OpportunityFilters = z.infer<typeof opportunityFiltersSchema>;

// Create application
export const createApplicationSchema = z.object({
  opportunityId: idSchema,
  userId: idSchema,
  
  // Application data
  resumeUrl: z.string().url().optional(),
  coverLetter: z.string().optional(),
  portfolioUrl: z.string().url().optional(),
  customAnswers: z.record(z.string(), z.any()).optional(),
  
  // Contact info
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  
  // Metadata
  source: z.string().optional(),
  referredBy: idSchema.optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

// Update application status
export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
  reviewedBy: idSchema.optional(),
  reviewNotes: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  interviewDate: dateSchema.optional(),
  interviewNotes: z.string().optional(),
  offerDetails: z.record(z.string(), z.any()).optional(),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

// Application filters
export const applicationFiltersSchema = z.object({
  opportunityId: idSchema.optional(),
  userId: idSchema.optional(),
  status: applicationStatusSchema.optional(),
  rating: z.number().int().min(1).max(5).optional(),
  submittedAfter: dateSchema.optional(),
  submittedBefore: dateSchema.optional(),
});

export type ApplicationFilters = z.infer<typeof applicationFiltersSchema>;
