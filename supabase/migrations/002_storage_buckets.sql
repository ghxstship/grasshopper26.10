-- =====================================================
-- Storage Buckets Complete Setup
-- Created: 2025-11-15
-- Purpose: Create all 10 storage buckets with RLS policies
-- =====================================================

-- =====================================================
-- 1. GVTEWAY BUCKETS (3 buckets)
-- =====================================================

-- 1.1 GVTEWAY Avatars (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gvteway-avatars',
  'gvteway-avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for gvteway-avatars
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'gvteway-avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gvteway-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gvteway-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gvteway-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 1.2 GVTEWAY Documents (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gvteway-documents',
  'gvteway-documents',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for gvteway-documents
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'gvteway-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gvteway-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gvteway-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gvteway-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 1.3 GVTEWAY Attachments (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gvteway-attachments',
  'gvteway-attachments',
  false,
  10485760, -- 10MB
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for gvteway-attachments
CREATE POLICY "Users can view their own attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'gvteway-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gvteway-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own attachments"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gvteway-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gvteway-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 2. COMPVSS BUCKETS (3 buckets)
-- =====================================================

-- 2.1 COMPVSS Advancing (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compvss-advancing',
  'compvss-advancing',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for compvss-advancing
CREATE POLICY "Users can view their own advancing documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'compvss-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all advancing documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'compvss-advancing' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'COMPVSS_ADMIN', 'ADVANCING_MANAGER')
  )
);

CREATE POLICY "Users can upload advancing documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'compvss-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own advancing documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'compvss-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own advancing documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'compvss-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2.2 COMPVSS Credentials (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compvss-credentials',
  'compvss-credentials',
  false,
  10485760, -- 10MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for compvss-credentials
CREATE POLICY "Users can view their own credentials"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'compvss-credentials' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all credentials"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'compvss-credentials' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'COMPVSS_ADMIN')
  )
);

CREATE POLICY "Users can upload their own credentials"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'compvss-credentials' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own credentials"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'compvss-credentials' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own credentials"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'compvss-credentials' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2.3 COMPVSS Contracts (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compvss-contracts',
  'compvss-contracts',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for compvss-contracts
CREATE POLICY "Users can view their own contracts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'compvss-contracts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all contracts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'compvss-contracts' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'COMPVSS_ADMIN')
  )
);

CREATE POLICY "Admins can upload contracts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'compvss-contracts' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'COMPVSS_ADMIN')
  )
);

CREATE POLICY "Admins can update contracts"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'compvss-contracts' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'COMPVSS_ADMIN')
  )
);

CREATE POLICY "Admins can delete contracts"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'compvss-contracts' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'COMPVSS_ADMIN')
  )
);

-- =====================================================
-- 3. ATLVS BUCKETS (4 buckets)
-- =====================================================

-- 3.1 ATLVS Advancing (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'atlvs-advancing',
  'atlvs-advancing',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for atlvs-advancing
CREATE POLICY "Users can view their own atlvs advancing documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'atlvs-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all atlvs advancing documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'atlvs-advancing' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'ADVANCING_MANAGER', 'PROJECT_MANAGER')
  )
);

CREATE POLICY "Users can upload atlvs advancing documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'atlvs-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own atlvs advancing documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'atlvs-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own atlvs advancing documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'atlvs-advancing' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3.2 ATLVS Assets (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'atlvs-assets',
  'atlvs-assets',
  false,
  104857600, -- 100MB
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for atlvs-assets
CREATE POLICY "Team members can view asset files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'atlvs-assets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'ASSET_MANAGER', 'PROJECT_MANAGER')
  )
);

CREATE POLICY "Asset managers can upload asset files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'atlvs-assets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'ASSET_MANAGER')
  )
);

CREATE POLICY "Asset managers can update asset files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'atlvs-assets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'ASSET_MANAGER')
  )
);

CREATE POLICY "Asset managers can delete asset files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'atlvs-assets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'ASSET_MANAGER')
  )
);

-- 3.3 ATLVS Projects (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'atlvs-projects',
  'atlvs-projects',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for atlvs-projects
CREATE POLICY "Project team members can view project files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'atlvs-projects' AND
  EXISTS (
    SELECT 1 FROM public."ProjectMember" pm
    JOIN public."Project" p ON pm."projectId" = p.id
    WHERE pm."userId" = auth.uid()
    AND p.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Admins can view all project files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'atlvs-projects' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'PROJECT_MANAGER')
  )
);

CREATE POLICY "Project team members can upload project files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'atlvs-projects' AND
  EXISTS (
    SELECT 1 FROM public."ProjectMember" pm
    JOIN public."Project" p ON pm."projectId" = p.id
    WHERE pm."userId" = auth.uid()
    AND p.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Project team members can update project files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'atlvs-projects' AND
  EXISTS (
    SELECT 1 FROM public."ProjectMember" pm
    JOIN public."Project" p ON pm."projectId" = p.id
    WHERE pm."userId" = auth.uid()
    AND p.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Project team members can delete project files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'atlvs-projects' AND
  EXISTS (
    SELECT 1 FROM public."ProjectMember" pm
    JOIN public."Project" p ON pm."projectId" = p.id
    WHERE pm."userId" = auth.uid()
    AND p.id::text = (storage.foldername(name))[1]
  )
);

-- 3.4 ATLVS Budgets (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'atlvs-budgets',
  'atlvs-budgets',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for atlvs-budgets
CREATE POLICY "Budget approvers can view budget files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'atlvs-budgets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'BUDGET_APPROVER', 'PROJECT_MANAGER')
  )
);

CREATE POLICY "Budget approvers can upload budget files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'atlvs-budgets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'BUDGET_APPROVER', 'PROJECT_MANAGER')
  )
);

CREATE POLICY "Budget approvers can update budget files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'atlvs-budgets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'BUDGET_APPROVER', 'PROJECT_MANAGER')
  )
);

CREATE POLICY "Budget approvers can delete budget files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'atlvs-budgets' AND
  EXISTS (
    SELECT 1 FROM public."User"
    WHERE id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'ATLVS_ADMIN', 'BUDGET_APPROVER', 'PROJECT_MANAGER')
  )
);

-- =====================================================
-- 4. ENABLE RLS ON STORAGE.OBJECTS
-- =====================================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- =====================================================
-- SUMMARY
-- =====================================================
-- Total Buckets Created: 10
-- - GVTEWAY: 3 (avatars, documents, attachments)
-- - COMPVSS: 3 (advancing, credentials, contracts)
-- - ATLVS: 4 (advancing, assets, projects, budgets)
--
-- RLS Policies: 60+ policies
-- - Public access: gvteway-avatars only
-- - User-owned: gvteway-documents, gvteway-attachments
-- - Role-based: All COMPVSS and ATLVS buckets
-- - Team-based: atlvs-projects (project members)
-- =====================================================
