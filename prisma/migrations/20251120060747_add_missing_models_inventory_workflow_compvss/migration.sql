/*
  Warnings:

  - The values [TRAVEL_LOGISTICS] on the enum `AdvancingCategory` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[organizationId,name]` on the table `membership_tiers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `membership_tiers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "LoyaltyTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND');

-- CreateEnum
CREATE TYPE "OpportunityCategory" AS ENUM ('RFP_JOB', 'CAREER_FULL_TIME', 'CAREER_PART_TIME', 'CAREER_SEASONAL', 'CAREER_INTERN', 'AUDITION_CASTING', 'CONTRACTOR', 'SUBCONTRACTOR', 'INDEPENDENT', 'SPONSOR', 'BRAND_AMBASSADOR', 'STREET_TEAM', 'INFLUENCER', 'AFFILIATE');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED', 'FILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER_PENDING', 'OFFER_SENT', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'ONBOARDING', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "AdvancingCategory_new" AS ENUM ('ACCESS_CREDENTIALS', 'SITE_INFRASTRUCTURE', 'SITE_ASSETS', 'SITE_UTILITIES', 'SITE_VEHICLES', 'HEAVY_EQUIPMENT', 'TECHNICAL_PRODUCTION', 'HOSPITALITY', 'TRAVEL_LODGING', 'LOGISTICS');
ALTER TABLE "advancing_requests" ALTER COLUMN "category" TYPE "AdvancingCategory_new" USING ("category"::text::"AdvancingCategory_new");
ALTER TYPE "AdvancingCategory" RENAME TO "AdvancingCategory_old";
ALTER TYPE "AdvancingCategory_new" RENAME TO "AdvancingCategory";
DROP TYPE "gvteway"."AdvancingCategory_old";
COMMIT;

-- AlterEnum
ALTER TYPE "AlertType" ADD VALUE 'BACK_IN_STOCK';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'LEGEND_SUPER_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'LEGEND_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'LEGEND_DEVELOPER';
ALTER TYPE "UserRole" ADD VALUE 'LEGEND_COLLABORATOR';
ALTER TYPE "UserRole" ADD VALUE 'LEGEND_SUPPORT';
ALTER TYPE "UserRole" ADD VALUE 'LEGEND_INCOGNITO';

-- DropIndex
DROP INDEX "membership_tiers_name_key";

-- AlterTable
ALTER TABLE "advancing_requests" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "requestedById" TEXT;

-- AlterTable
ALTER TABLE "affiliate_profiles" ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "targetId" TEXT;

-- AlterTable
ALTER TABLE "budget_categories" ADD COLUMN     "allocatedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "crypto_wallets" ADD COLUMN     "chainId" INTEGER,
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'ETHEREUM',
ALTER COLUMN "chain" DROP NOT NULL;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "category" TEXT,
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ADD COLUMN     "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "equipment" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "expense_reports" ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "submittedById" TEXT,
ADD COLUMN     "teamId" TEXT;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "reimbursedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "issue_reports" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "membership_tiers" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "billingPeriod" TEXT NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "readAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "qr_codes" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "social_comments" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "social_posts" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "transferredAt" TIMESTAMP(3),
ADD COLUMN     "transferredTo" TEXT,
ADD COLUMN     "usedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT;

-- AlterTable
ALTER TABLE "wishlists" ADD COLUMN     "notifyOnSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "targetPrice" DECIMAL(10,2);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" BOOLEAN NOT NULL DEFAULT true,
    "push" BOOLEAN NOT NULL DEFAULT true,
    "inApp" BOOLEAN NOT NULL DEFAULT true,
    "statusChanges" BOOLEAN NOT NULL DEFAULT true,
    "comments" BOOLEAN NOT NULL DEFAULT true,
    "assignments" BOOLEAN NOT NULL DEFAULT true,
    "dueDateReminders" BOOLEAN NOT NULL DEFAULT true,
    "socialNotifications" BOOLEAN NOT NULL DEFAULT true,
    "orderUpdates" BOOLEAN NOT NULL DEFAULT true,
    "ticketUpdates" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_link_uses" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_link_uses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_shares" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_activities" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "userId" TEXT,
    "trigger" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "conditions" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRun" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "automations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_executions" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "context" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "logs" JSONB,
    "metadata" JSONB,

    CONSTRAINT "automation_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "OpportunityCategory" NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'DRAFT',
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "eventId" TEXT,
    "location" TEXT,
    "locationType" TEXT,
    "compensationType" TEXT,
    "compensationMin" DECIMAL(10,2),
    "compensationMax" DECIMAL(10,2),
    "compensationCurrency" TEXT DEFAULT 'USD',
    "requirements" JSONB,
    "qualifications" JSONB,
    "responsibilities" JSONB,
    "benefits" JSONB,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "applicationDeadline" TIMESTAMP(3),
    "requireResume" BOOLEAN NOT NULL DEFAULT true,
    "requireCoverLetter" BOOLEAN NOT NULL DEFAULT false,
    "requirePortfolio" BOOLEAN NOT NULL DEFAULT false,
    "customQuestions" JSONB,
    "tags" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "applicationCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_applications" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "resumeUrl" TEXT,
    "coverLetter" TEXT,
    "portfolioUrl" TEXT,
    "customAnswers" JSONB,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "rating" INTEGER,
    "interviewDate" TIMESTAMP(3),
    "interviewNotes" TEXT,
    "offerDetails" JSONB,
    "offerSentAt" TIMESTAMP(3),
    "offerAcceptedAt" TIMESTAMP(3),
    "source" TEXT,
    "referredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_subcategories" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_items" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "specifications" TEXT,
    "standardUnit" TEXT NOT NULL,
    "alternateNames" TEXT[],
    "make" TEXT,
    "model" TEXT,
    "dimensions" TEXT,
    "weight" TEXT,
    "material" TEXT,
    "color" TEXT,
    "capacity" TEXT,
    "powerRequirements" TEXT,
    "searchTerms" TEXT[],
    "tags" TEXT[],
    "typicalQuantity" INTEGER,
    "estimatedCost" TEXT,
    "accessories" JSONB,
    "relatedItems" JSONB,
    "isGlobal" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT,
    "requiresCertification" BOOLEAN NOT NULL DEFAULT false,
    "requiresInsurance" BOOLEAN NOT NULL DEFAULT false,
    "leadTime" TEXT,
    "seasonalAvailability" TEXT[],
    "commonVendors" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_catalog_toggles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "customName" TEXT,
    "customCost" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_catalog_toggles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_catalog_toggles" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "customName" TEXT,
    "customCost" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_catalog_toggles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_catalog_toggles" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "customName" TEXT,
    "customCost" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_catalog_toggles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "properties" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impersonation_sessions" (
    "id" TEXT NOT NULL,
    "impersonatorId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "reason" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "impersonation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impersonation_permissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grantedToId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "impersonation_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "minStockLevel" INTEGER,
    "location" TEXT,
    "supplier" TEXT,
    "cost" DECIMAL(10,2),
    "status" TEXT NOT NULL DEFAULT 'in-stock',
    "lastRestocked" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "automationLevel" TEXT NOT NULL DEFAULT 'manual',
    "tags" TEXT[],
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsed" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compvss_assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "serialNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "location" TEXT,
    "condition" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DECIMAL(10,2),
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compvss_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compvss_asset_checkouts" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "purpose" TEXT,
    "notes" TEXT,
    "checkedOutAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedInAt" TIMESTAMP(3),
    "condition" TEXT,
    "status" TEXT NOT NULL DEFAULT 'checked-out',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compvss_asset_checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compvss_documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "folder" TEXT,
    "permissions" TEXT NOT NULL DEFAULT 'team',
    "tags" TEXT[],
    "fileUrl" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedBy" TEXT,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compvss_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- CreateIndex
CREATE INDEX "wallets_userId_idx" ON "wallets"("userId");

-- CreateIndex
CREATE INDEX "wallet_transactions_walletId_idx" ON "wallet_transactions"("walletId");

-- CreateIndex
CREATE INDEX "wallet_transactions_createdAt_idx" ON "wallet_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "wallet_transactions_status_idx" ON "wallet_transactions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");

-- CreateIndex
CREATE INDEX "api_keys_keyPrefix_idx" ON "api_keys"("keyPrefix");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_orderId_key" ON "invoices"("orderId");

-- CreateIndex
CREATE INDEX "invoices_userId_idx" ON "invoices"("userId");

-- CreateIndex
CREATE INDEX "invoices_orderId_idx" ON "invoices"("orderId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

-- CreateIndex
CREATE INDEX "friendships_userId_idx" ON "friendships"("userId");

-- CreateIndex
CREATE INDEX "friendships_friendId_idx" ON "friendships"("friendId");

-- CreateIndex
CREATE INDEX "friendships_status_idx" ON "friendships"("status");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_userId_friendId_key" ON "friendships"("userId", "friendId");

-- CreateIndex
CREATE INDEX "loyalty_transactions_userId_createdAt_idx" ON "loyalty_transactions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "referral_link_uses_referralId_idx" ON "referral_link_uses"("referralId");

-- CreateIndex
CREATE INDEX "referral_link_uses_referredUserId_idx" ON "referral_link_uses"("referredUserId");

-- CreateIndex
CREATE UNIQUE INDEX "referral_link_uses_referralId_referredUserId_key" ON "referral_link_uses"("referralId", "referredUserId");

-- CreateIndex
CREATE INDEX "document_shares_documentId_idx" ON "document_shares"("documentId");

-- CreateIndex
CREATE INDEX "document_shares_userId_idx" ON "document_shares"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "document_shares_documentId_userId_key" ON "document_shares"("documentId", "userId");

-- CreateIndex
CREATE INDEX "document_activities_documentId_idx" ON "document_activities"("documentId");

-- CreateIndex
CREATE INDEX "document_activities_userId_idx" ON "document_activities"("userId");

-- CreateIndex
CREATE INDEX "document_activities_createdAt_idx" ON "document_activities"("createdAt");

-- CreateIndex
CREATE INDEX "automations_organizationId_idx" ON "automations"("organizationId");

-- CreateIndex
CREATE INDEX "automations_projectId_idx" ON "automations"("projectId");

-- CreateIndex
CREATE INDEX "automations_enabled_idx" ON "automations"("enabled");

-- CreateIndex
CREATE INDEX "automation_executions_automationId_idx" ON "automation_executions"("automationId");

-- CreateIndex
CREATE INDEX "automation_executions_status_idx" ON "automation_executions"("status");

-- CreateIndex
CREATE INDEX "opportunities_organizationId_idx" ON "opportunities"("organizationId");

-- CreateIndex
CREATE INDEX "opportunities_projectId_idx" ON "opportunities"("projectId");

-- CreateIndex
CREATE INDEX "opportunities_eventId_idx" ON "opportunities"("eventId");

-- CreateIndex
CREATE INDEX "opportunities_category_idx" ON "opportunities"("category");

-- CreateIndex
CREATE INDEX "opportunities_status_idx" ON "opportunities"("status");

-- CreateIndex
CREATE INDEX "opportunities_publishedAt_idx" ON "opportunities"("publishedAt");

-- CreateIndex
CREATE INDEX "opportunities_applicationDeadline_idx" ON "opportunities"("applicationDeadline");

-- CreateIndex
CREATE INDEX "opportunity_applications_opportunityId_idx" ON "opportunity_applications"("opportunityId");

-- CreateIndex
CREATE INDEX "opportunity_applications_userId_idx" ON "opportunity_applications"("userId");

-- CreateIndex
CREATE INDEX "opportunity_applications_status_idx" ON "opportunity_applications"("status");

-- CreateIndex
CREATE INDEX "opportunity_applications_createdAt_idx" ON "opportunity_applications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "opportunity_applications_opportunityId_userId_key" ON "opportunity_applications"("opportunityId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_categories_name_key" ON "catalog_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_categories_slug_key" ON "catalog_categories"("slug");

-- CreateIndex
CREATE INDEX "catalog_categories_slug_idx" ON "catalog_categories"("slug");

-- CreateIndex
CREATE INDEX "catalog_categories_active_order_idx" ON "catalog_categories"("active", "order");

-- CreateIndex
CREATE INDEX "catalog_subcategories_categoryId_idx" ON "catalog_subcategories"("categoryId");

-- CreateIndex
CREATE INDEX "catalog_subcategories_active_order_idx" ON "catalog_subcategories"("active", "order");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_subcategories_categoryId_slug_key" ON "catalog_subcategories"("categoryId", "slug");

-- CreateIndex
CREATE INDEX "catalog_items_categoryId_idx" ON "catalog_items"("categoryId");

-- CreateIndex
CREATE INDEX "catalog_items_subcategoryId_idx" ON "catalog_items"("subcategoryId");

-- CreateIndex
CREATE INDEX "catalog_items_organizationId_idx" ON "catalog_items"("organizationId");

-- CreateIndex
CREATE INDEX "catalog_items_isGlobal_active_idx" ON "catalog_items"("isGlobal", "active");

-- CreateIndex
CREATE INDEX "catalog_items_slug_idx" ON "catalog_items"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_items_categoryId_slug_key" ON "catalog_items"("categoryId", "slug");

-- CreateIndex
CREATE INDEX "organization_catalog_toggles_organizationId_idx" ON "organization_catalog_toggles"("organizationId");

-- CreateIndex
CREATE INDEX "organization_catalog_toggles_catalogItemId_idx" ON "organization_catalog_toggles"("catalogItemId");

-- CreateIndex
CREATE INDEX "organization_catalog_toggles_enabled_idx" ON "organization_catalog_toggles"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "organization_catalog_toggles_organizationId_catalogItemId_key" ON "organization_catalog_toggles"("organizationId", "catalogItemId");

-- CreateIndex
CREATE INDEX "project_catalog_toggles_projectId_idx" ON "project_catalog_toggles"("projectId");

-- CreateIndex
CREATE INDEX "project_catalog_toggles_catalogItemId_idx" ON "project_catalog_toggles"("catalogItemId");

-- CreateIndex
CREATE INDEX "project_catalog_toggles_enabled_idx" ON "project_catalog_toggles"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "project_catalog_toggles_projectId_catalogItemId_key" ON "project_catalog_toggles"("projectId", "catalogItemId");

-- CreateIndex
CREATE INDEX "team_catalog_toggles_teamId_idx" ON "team_catalog_toggles"("teamId");

-- CreateIndex
CREATE INDEX "team_catalog_toggles_catalogItemId_idx" ON "team_catalog_toggles"("catalogItemId");

-- CreateIndex
CREATE INDEX "team_catalog_toggles_enabled_idx" ON "team_catalog_toggles"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "team_catalog_toggles_teamId_catalogItemId_key" ON "team_catalog_toggles"("teamId", "catalogItemId");

-- CreateIndex
CREATE INDEX "analytics_data_userId_idx" ON "analytics_data"("userId");

-- CreateIndex
CREATE INDEX "analytics_data_eventType_idx" ON "analytics_data"("eventType");

-- CreateIndex
CREATE INDEX "analytics_data_eventName_idx" ON "analytics_data"("eventName");

-- CreateIndex
CREATE INDEX "analytics_data_timestamp_idx" ON "analytics_data"("timestamp");

-- CreateIndex
CREATE INDEX "analytics_data_sessionId_idx" ON "analytics_data"("sessionId");

-- CreateIndex
CREATE INDEX "impersonation_sessions_impersonatorId_idx" ON "impersonation_sessions"("impersonatorId");

-- CreateIndex
CREATE INDEX "impersonation_sessions_targetUserId_idx" ON "impersonation_sessions"("targetUserId");

-- CreateIndex
CREATE INDEX "impersonation_sessions_startedAt_idx" ON "impersonation_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "impersonation_sessions_endedAt_idx" ON "impersonation_sessions"("endedAt");

-- CreateIndex
CREATE INDEX "impersonation_permissions_userId_idx" ON "impersonation_permissions"("userId");

-- CreateIndex
CREATE INDEX "impersonation_permissions_grantedToId_idx" ON "impersonation_permissions"("grantedToId");

-- CreateIndex
CREATE INDEX "impersonation_permissions_expiresAt_idx" ON "impersonation_permissions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "impersonation_permissions_userId_grantedToId_key" ON "impersonation_permissions"("userId", "grantedToId");

-- CreateIndex
CREATE INDEX "inventory_category_idx" ON "inventory"("category");

-- CreateIndex
CREATE INDEX "inventory_status_idx" ON "inventory"("status");

-- CreateIndex
CREATE INDEX "inventory_location_idx" ON "inventory"("location");

-- CreateIndex
CREATE INDEX "workflows_category_idx" ON "workflows"("category");

-- CreateIndex
CREATE INDEX "workflows_status_idx" ON "workflows"("status");

-- CreateIndex
CREATE INDEX "workflows_createdBy_idx" ON "workflows"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "compvss_assets_serialNumber_key" ON "compvss_assets"("serialNumber");

-- CreateIndex
CREATE INDEX "compvss_assets_status_idx" ON "compvss_assets"("status");

-- CreateIndex
CREATE INDEX "compvss_assets_category_idx" ON "compvss_assets"("category");

-- CreateIndex
CREATE INDEX "compvss_assets_location_idx" ON "compvss_assets"("location");

-- CreateIndex
CREATE INDEX "compvss_asset_checkouts_assetId_idx" ON "compvss_asset_checkouts"("assetId");

-- CreateIndex
CREATE INDEX "compvss_asset_checkouts_userId_idx" ON "compvss_asset_checkouts"("userId");

-- CreateIndex
CREATE INDEX "compvss_asset_checkouts_status_idx" ON "compvss_asset_checkouts"("status");

-- CreateIndex
CREATE INDEX "compvss_documents_folder_idx" ON "compvss_documents"("folder");

-- CreateIndex
CREATE INDEX "compvss_documents_permissions_idx" ON "compvss_documents"("permissions");

-- CreateIndex
CREATE INDEX "compvss_documents_uploadedBy_idx" ON "compvss_documents"("uploadedBy");

-- CreateIndex
CREATE INDEX "affiliate_profiles_organizationId_idx" ON "affiliate_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "alerts_targetId_idx" ON "alerts"("targetId");

-- CreateIndex
CREATE INDEX "check_ins_checkInTime_idx" ON "check_ins"("checkInTime");

-- CreateIndex
CREATE INDEX "crypto_wallets_userId_idx" ON "crypto_wallets"("userId");

-- CreateIndex
CREATE INDEX "crypto_wallets_isPrimary_idx" ON "crypto_wallets"("isPrimary");

-- CreateIndex
CREATE INDEX "expense_reports_submittedById_idx" ON "expense_reports"("submittedById");

-- CreateIndex
CREATE INDEX "expense_reports_organizationId_idx" ON "expense_reports"("organizationId");

-- CreateIndex
CREATE INDEX "expense_reports_teamId_idx" ON "expense_reports"("teamId");

-- CreateIndex
CREATE INDEX "expense_reports_approvedById_idx" ON "expense_reports"("approvedById");

-- CreateIndex
CREATE INDEX "expenses_categoryId_idx" ON "expenses"("categoryId");

-- CreateIndex
CREATE INDEX "issue_reports_organizationId_idx" ON "issue_reports"("organizationId");

-- CreateIndex
CREATE INDEX "issue_reports_assignedToId_idx" ON "issue_reports"("assignedToId");

-- CreateIndex
CREATE INDEX "membership_tiers_priority_idx" ON "membership_tiers"("priority");

-- CreateIndex
CREATE INDEX "membership_tiers_active_idx" ON "membership_tiers"("active");

-- CreateIndex
CREATE UNIQUE INDEX "membership_tiers_organizationId_name_key" ON "membership_tiers"("organizationId", "name");

-- CreateIndex
CREATE INDEX "notifications_priority_idx" ON "notifications"("priority");

-- CreateIndex
CREATE INDEX "products_organizationId_idx" ON "products"("organizationId");

-- CreateIndex
CREATE INDEX "qr_codes_userId_idx" ON "qr_codes"("userId");

-- CreateIndex
CREATE INDEX "social_comments_parentId_idx" ON "social_comments"("parentId");

-- CreateIndex
CREATE INDEX "teams_projectId_idx" ON "teams"("projectId");

-- CreateIndex
CREATE INDEX "teams_organizationId_idx" ON "teams"("organizationId");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comments" ADD CONSTRAINT "social_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "social_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_tiers" ADD CONSTRAINT "membership_tiers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advancing_requests" ADD CONSTRAINT "advancing_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advancing_requests" ADD CONSTRAINT "advancing_requests_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_reports" ADD CONSTRAINT "issue_reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_reports" ADD CONSTRAINT "issue_reports_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_reports" ADD CONSTRAINT "expense_reports_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_reports" ADD CONSTRAINT "expense_reports_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_reports" ADD CONSTRAINT "expense_reports_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_reports" ADD CONSTRAINT "expense_reports_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_link_uses" ADD CONSTRAINT "referral_link_uses_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "referral_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "budget_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_shares" ADD CONSTRAINT "document_shares_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_shares" ADD CONSTRAINT "document_shares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_activities" ADD CONSTRAINT "document_activities_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_activities" ADD CONSTRAINT "document_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automation_executions" ADD CONSTRAINT "automation_executions_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "automations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_applications" ADD CONSTRAINT "opportunity_applications_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_subcategories" ADD CONSTRAINT "catalog_subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_items" ADD CONSTRAINT "catalog_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_items" ADD CONSTRAINT "catalog_items_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "catalog_subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_items" ADD CONSTRAINT "catalog_items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_catalog_toggles" ADD CONSTRAINT "organization_catalog_toggles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_catalog_toggles" ADD CONSTRAINT "organization_catalog_toggles_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_catalog_toggles" ADD CONSTRAINT "project_catalog_toggles_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_catalog_toggles" ADD CONSTRAINT "project_catalog_toggles_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_catalog_toggles" ADD CONSTRAINT "team_catalog_toggles_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_catalog_toggles" ADD CONSTRAINT "team_catalog_toggles_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_data" ADD CONSTRAINT "analytics_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_impersonatorId_fkey" FOREIGN KEY ("impersonatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_permissions" ADD CONSTRAINT "impersonation_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_permissions" ADD CONSTRAINT "impersonation_permissions_grantedToId_fkey" FOREIGN KEY ("grantedToId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compvss_asset_checkouts" ADD CONSTRAINT "compvss_asset_checkouts_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "compvss_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
