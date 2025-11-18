-- =====================================================
-- AUTHENTICATION HELPERS
-- Helper functions for auth and RLS policies
-- =====================================================

-- Function to get current user ID from JWT
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS TEXT AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    ),
    ''
  )::text;
$$ LANGUAGE sql STABLE;

-- Function to get current user role
CREATE OR REPLACE FUNCTION auth.role()
RETURNS TEXT AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.role', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
    ),
    ''
  )::text;
$$ LANGUAGE sql STABLE;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()::text
    AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is organization member
CREATE OR REPLACE FUNCTION is_organization_member(org_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE "organizationId" = org_id
    AND "userId" = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is organization admin
CREATE OR REPLACE FUNCTION is_organization_admin(org_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE "organizationId" = org_id
    AND "userId" = auth.uid()::text
    AND role IN ('OWNER', 'ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is project member
CREATE OR REPLACE FUNCTION is_project_member(proj_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members
    WHERE "projectId" = proj_id
    AND "userId" = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns resource
CREATE OR REPLACE FUNCTION owns_resource(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid()::text = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check event access
CREATE OR REPLACE FUNCTION can_access_event(event_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Public events are accessible to all
  IF EXISTS (
    SELECT 1 FROM events
    WHERE id = event_id
    AND visibility = 'PUBLIC'
    AND status = 'PUBLISHED'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user is organization member for private events
  RETURN EXISTS (
    SELECT 1 FROM events e
    INNER JOIN organization_members om ON om."organizationId" = e."organizationId"
    WHERE e.id = event_id
    AND om."userId" = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check advancing request access
CREATE OR REPLACE FUNCTION can_access_advancing_request(request_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM advancing_requests
    WHERE id = request_id
    AND (
      "userId" = auth.uid()::text
      OR "assignedToId" = auth.uid()::text
      OR "requestedById" = auth.uid()::text
    )
  ) OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate unique code
CREATE OR REPLACE FUNCTION generate_unique_code(prefix TEXT, length INT DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := prefix || '-';
  i INT;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;
