/*
  Warnings:

  - The `type` column on the `schedules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `maintenance_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('SHIFT', 'MEETING', 'EVENT', 'BREAK', 'TRAINING');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CONTRACT', 'RIDER', 'PERMIT', 'INSURANCE', 'INVOICE', 'RECEIPT', 'REPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('ROUTINE', 'REPAIR', 'INSPECTION', 'EMERGENCY', 'UPGRADE');

-- DropForeignKey
ALTER TABLE "advancing_requests" DROP CONSTRAINT "advancing_requests_userId_fkey";

-- DropForeignKey
ALTER TABLE "adventure_bookings" DROP CONSTRAINT "adventure_bookings_adventureId_fkey";

-- DropForeignKey
ALTER TABLE "adventure_bookings" DROP CONSTRAINT "adventure_bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_projectId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_projectId_fkey";

-- DropForeignKey
ALTER TABLE "equipment_bookings" DROP CONSTRAINT "equipment_bookings_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "expense_reports" DROP CONSTRAINT "expense_reports_userId_fkey";

-- DropForeignKey
ALTER TABLE "issue_reports" DROP CONSTRAINT "issue_reports_userId_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_userId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectId_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_orderId_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_userId_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "type",
ADD COLUMN     "type" "DocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "maintenance_logs" DROP COLUMN "type",
ADD COLUMN     "type" "MaintenanceType" NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "type",
ADD COLUMN     "type" "ScheduleType" NOT NULL DEFAULT 'SHIFT';

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advancing_comments" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advancing_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advancing_history" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "fromValue" TEXT,
    "toValue" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advancing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advancing_attachments" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advancing_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "email_verification_tokens"("token");

-- CreateIndex
CREATE INDEX "email_verification_tokens_userId_idx" ON "email_verification_tokens"("userId");

-- CreateIndex
CREATE INDEX "email_verification_tokens_token_idx" ON "email_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "advancing_comments_requestId_idx" ON "advancing_comments"("requestId");

-- CreateIndex
CREATE INDEX "advancing_comments_userId_idx" ON "advancing_comments"("userId");

-- CreateIndex
CREATE INDEX "advancing_comments_createdAt_idx" ON "advancing_comments"("createdAt");

-- CreateIndex
CREATE INDEX "advancing_history_requestId_idx" ON "advancing_history"("requestId");

-- CreateIndex
CREATE INDEX "advancing_history_userId_idx" ON "advancing_history"("userId");

-- CreateIndex
CREATE INDEX "advancing_history_createdAt_idx" ON "advancing_history"("createdAt");

-- CreateIndex
CREATE INDEX "advancing_attachments_requestId_idx" ON "advancing_attachments"("requestId");

-- CreateIndex
CREATE INDEX "advancing_attachments_uploadedBy_idx" ON "advancing_attachments"("uploadedBy");

-- CreateIndex
CREATE INDEX "accounts_provider_idx" ON "accounts"("provider");

-- CreateIndex
CREATE INDEX "advancing_requests_eventId_idx" ON "advancing_requests"("eventId");

-- CreateIndex
CREATE INDEX "advancing_requests_dueDate_idx" ON "advancing_requests"("dueDate");

-- CreateIndex
CREATE INDEX "advancing_requests_status_priority_dueDate_idx" ON "advancing_requests"("status", "priority", "dueDate");

-- CreateIndex
CREATE INDEX "adventures_type_capacity_idx" ON "adventures"("type", "capacity");

-- CreateIndex
CREATE INDEX "affiliate_profiles_status_idx" ON "affiliate_profiles"("status");

-- CreateIndex
CREATE INDEX "affiliate_profiles_code_idx" ON "affiliate_profiles"("code");

-- CreateIndex
CREATE INDEX "compvss_users_status_idx" ON "compvss_users"("status");

-- CreateIndex
CREATE INDEX "compvss_users_department_idx" ON "compvss_users"("department");

-- CreateIndex
CREATE INDEX "documents_type_idx" ON "documents"("type");

-- CreateIndex
CREATE INDEX "documents_uploadedBy_idx" ON "documents"("uploadedBy");

-- CreateIndex
CREATE INDEX "equipment_qrCode_idx" ON "equipment"("qrCode");

-- CreateIndex
CREATE INDEX "equipment_location_idx" ON "equipment"("location");

-- CreateIndex
CREATE INDEX "events_featured_idx" ON "events"("featured");

-- CreateIndex
CREATE INDEX "events_status_featured_startDate_idx" ON "events"("status", "featured", "startDate");

-- CreateIndex
CREATE INDEX "expense_reports_category_idx" ON "expense_reports"("category");

-- CreateIndex
CREATE INDEX "expense_reports_date_idx" ON "expense_reports"("date");

-- CreateIndex
CREATE INDEX "expense_reports_approvedBy_idx" ON "expense_reports"("approvedBy");

-- CreateIndex
CREATE INDEX "issue_reports_category_idx" ON "issue_reports"("category");

-- CreateIndex
CREATE INDEX "issue_reports_assignedTo_idx" ON "issue_reports"("assignedTo");

-- CreateIndex
CREATE INDEX "issue_reports_location_idx" ON "issue_reports"("location");

-- CreateIndex
CREATE INDEX "membership_tiers_featured_idx" ON "membership_tiers"("featured");

-- CreateIndex
CREATE INDEX "memberships_status_endDate_idx" ON "memberships"("status", "endDate");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_paymentIntent_idx" ON "orders"("paymentIntent");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "orders_userId_status_createdAt_idx" ON "orders"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "products_featured_idx" ON "products"("featured");

-- CreateIndex
CREATE INDEX "products_stock_idx" ON "products"("stock");

-- CreateIndex
CREATE INDEX "projects_createdBy_idx" ON "projects"("createdBy");

-- CreateIndex
CREATE INDEX "projects_startDate_endDate_idx" ON "projects"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "projects_status_budget_idx" ON "projects"("status", "budget");

-- CreateIndex
CREATE INDEX "schedules_type_idx" ON "schedules"("type");

-- CreateIndex
CREATE INDEX "social_likes_userId_idx" ON "social_likes"("userId");

-- CreateIndex
CREATE INDEX "social_posts_eventId_createdAt_idx" ON "social_posts"("eventId", "createdAt");

-- CreateIndex
CREATE INDEX "tasks_createdBy_idx" ON "tasks"("createdBy");

-- CreateIndex
CREATE INDEX "tasks_dueDate_idx" ON "tasks"("dueDate");

-- CreateIndex
CREATE INDEX "tasks_status_priority_dueDate_idx" ON "tasks"("status", "priority", "dueDate");

-- CreateIndex
CREATE INDEX "tickets_qrCode_idx" ON "tickets"("qrCode");

-- CreateIndex
CREATE INDEX "tickets_eventId_status_idx" ON "tickets"("eventId", "status");

-- CreateIndex
CREATE INDEX "users_role_createdAt_idx" ON "users"("role", "createdAt");

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adventure_bookings" ADD CONSTRAINT "adventure_bookings_adventureId_fkey" FOREIGN KEY ("adventureId") REFERENCES "adventures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adventure_bookings" ADD CONSTRAINT "adventure_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advancing_requests" ADD CONSTRAINT "advancing_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advancing_requests" ADD CONSTRAINT "advancing_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advancing_comments" ADD CONSTRAINT "advancing_comments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "advancing_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advancing_history" ADD CONSTRAINT "advancing_history_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "advancing_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advancing_attachments" ADD CONSTRAINT "advancing_attachments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "advancing_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_reports" ADD CONSTRAINT "issue_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_reports" ADD CONSTRAINT "expense_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_bookings" ADD CONSTRAINT "equipment_bookings_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
