-- ============================================================================
-- FIX ADVANCING CATEGORY ENUM
-- Aligns AdvancingCategory enum between Supabase and Prisma
-- Changes: TRAVEL_LOGISTICS -> TRAVEL_LODGING + LOGISTICS
-- ============================================================================

BEGIN;

-- Add new enum values
ALTER TYPE "AdvancingCategory" ADD VALUE IF NOT EXISTS 'TRAVEL_LODGING';
ALTER TYPE "AdvancingCategory" ADD VALUE IF NOT EXISTS 'LOGISTICS';

-- Note: We cannot remove TRAVEL_LOGISTICS if it's in use
-- The application should migrate existing TRAVEL_LOGISTICS records to either TRAVEL_LODGING or LOGISTICS
-- This migration adds the new values to support both old and new schemas during transition

COMMIT;
