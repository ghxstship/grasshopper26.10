# Supabase Migrations

Sequential migration files for the GVTEWAY-ATLVS-COMPVSS platform.

## Migration Order

Migrations must be applied in the following order:

### 001_base_schema.sql
**Purpose:** Creates all database tables, enums, and relationships
- 106 Prisma models
- All enums (UserRole, EventStatus, TicketStatus, etc.)
- Foreign key constraints
- Primary keys and unique constraints
**Dependencies:** None
**Generated from:** `prisma migrate diff --from-empty --to-schema-datamodel`

### 002_storage_buckets.sql
**Purpose:** Creates Supabase Storage buckets for file uploads
- Event images and banners
- User avatars and profiles
- Product images
- Documents and contracts
- QR codes
- Venue images
- Artist media
- Ticket assets
- Project files
- Advancing request attachments
**Dependencies:** 001_base_schema.sql

### 003_rls_policies.sql
**Purpose:** Enables Row-Level Security and creates base policies
- Enables RLS on all tables
- User access policies (view/update own profile)
- Organization member policies
- Event visibility policies
- Ticket ownership policies
- Order access policies
- Project member policies
- Advancing request policies
**Dependencies:** 001_base_schema.sql

### 004_rls_fixes.sql
**Purpose:** Fixes and enhances RLS policies
- Additional policy refinements
- Permission edge cases
- Cross-table access patterns
**Dependencies:** 003_rls_policies.sql

### 005_performance_indexes.sql
**Purpose:** Creates indexes for query optimization
- User lookup indexes (email, role)
- Event search indexes (status, date, venue)
- Ticket tracking indexes (user, event, status, QR)
- Order processing indexes (user, status)
- Social feature indexes (posts, comments, likes, follows)
- Project management indexes (organization, status, dates)
- Task tracking indexes (project, assignee, status, priority)
- Budget and expense indexes
- Asset booking indexes
- Full-text search preparation
**Dependencies:** 001_base_schema.sql

### 006_database_functions.sql
**Purpose:** Creates database functions and triggers
- Auto-update `updatedAt` timestamps
- Calculate order totals
- Update ticket counts on events
- Update social post counts (comments, likes)
- Update follower counts
- Update budget spent amounts
- Validate event capacity
- Generate QR codes on ticket creation
- Update wallet balances
- Soft delete functionality
**Dependencies:** 001_base_schema.sql

### 007_realtime_publications.sql
**Purpose:** Enables Supabase Realtime for live updates
- Creates realtime publication
- Enables realtime on key tables:
  - Users, notifications
  - Social posts, comments, likes, follows
  - Events, tickets, orders
  - Cart items
  - Advancing requests
  - Tasks, projects
  - QR scans, check-ins
  - Wallet transactions
- Sets replica identity for change tracking
**Dependencies:** 001_base_schema.sql

### 008_full_text_search.sql
**Purpose:** Implements PostgreSQL full-text search
- Adds tsvector columns for search
- Creates search vector update functions
- Creates triggers for automatic search index updates
- Creates GIN indexes for fast search
- Initializes search vectors for existing data
- Covers: events, users, products, artists, venues, projects, opportunities
**Dependencies:** 001_base_schema.sql

### 009_auth_helpers.sql
**Purpose:** Authentication and authorization helper functions
- `auth.uid()` - Get current user ID from JWT
- `auth.role()` - Get current user role
- `is_admin()` - Check if user is admin
- `is_organization_member()` - Check org membership
- `is_organization_admin()` - Check org admin status
- `is_project_member()` - Check project membership
- `owns_resource()` - Check resource ownership
- `can_access_event()` - Check event access permissions
- `can_access_advancing_request()` - Check advancing request access
- `is_valid_email()` - Email validation
- `generate_unique_code()` - Generate unique codes for referrals, etc.
**Dependencies:** 001_base_schema.sql, 003_rls_policies.sql

## Running Migrations

### Local Development
```bash
# Apply all migrations
supabase db reset

# Apply specific migration
supabase migration up --file 001_base_schema.sql
```

### Production
```bash
# Apply migrations in order
supabase db push
```

### 010_postgres_extensions.sql
**Purpose:** Enable PostgreSQL extensions
- uuid-ossp for UUID generation
- pgcrypto for encryption and hashing
- pg_trgm for fuzzy text search
- btree_gin/btree_gist for advanced indexing
- http for webhook support
**Dependencies:** None

### 011_advanced_indexes.sql
**Purpose:** Advanced indexing strategies
- Composite indexes for complex queries
- Partial indexes for filtered queries
- Trigram indexes for fuzzy search
- JSONB indexes for metadata
- Expression indexes for computed values
- Covering indexes for performance
- Hash indexes for exact lookups
**Dependencies:** 001_base_schema.sql, 010_postgres_extensions.sql

### 012_materialized_views.sql
**Purpose:** Pre-computed analytics views
- Event analytics summary
- User engagement metrics
- Organization performance
- Product sales tracking
- Project budget tracking
- Auto-refresh function
**Dependencies:** 001_base_schema.sql

### 013_webhook_queue.sql
**Purpose:** Webhook delivery system
- Webhook queue table
- Delivery log tracking
- Retry logic with exponential backoff
- Queue management functions
- Automatic cleanup
**Dependencies:** 001_base_schema.sql

### 014_notification_queue.sql
**Purpose:** Notification batch processing
- Notification queue system
- Multi-channel support (in-app, email, sms, push)
- Priority-based delivery
- Batch enqueue functions
- Auto-trigger on events
**Dependencies:** 001_base_schema.sql

### 015_audit_compliance.sql
**Purpose:** Audit logging and compliance
- Automatic audit triggers
- Data retention policies
- GDPR compliance (data export/deletion)
- Data integrity checks
- Compliance reporting
**Dependencies:** 001_base_schema.sql

### 016_geospatial_features.sql
**Purpose:** Location-based queries and distance calculations
- PostGIS extension for geospatial features
- Geometry columns for venues and check-ins
- Spatial indexes (GIST)
- Find nearby venues/events functions
- Distance calculation functions
- Geofence check-in queries
**Dependencies:** 001_base_schema.sql, 010_postgres_extensions.sql

### 017_advanced_analytics.sql
**Purpose:** Complex analytics with window functions and CTEs
- Revenue analytics with running totals
- User cohort analysis
- Event performance ranking
- Product sales velocity
- User lifetime value (LTV) calculation
- Conversion funnel analysis
- RFM (Recency, Frequency, Monetary) segmentation
**Dependencies:** 001_base_schema.sql

### 018_table_partitioning.sql
**Purpose:** Partition large tables for better performance
- Partitioned audit_logs by month
- Partitioned orders by year
- Partitioned notifications by month
- Automatic partition creation
- Partition management functions
- Old partition cleanup
**Dependencies:** 001_base_schema.sql

### 019_caching_layer.sql
**Purpose:** Database-level caching
- Query result caching with TTL
- Session caching
- Cache invalidation by key/tags
- Auto-invalidation on data changes
- Cache statistics and monitoring
**Dependencies:** 001_base_schema.sql

### 020_backup_recovery.sql
**Purpose:** Backup management and point-in-time recovery
- Backup metadata tracking
- Change tracking for incremental backups
- Database size monitoring
- Backup integrity verification
- Snapshot management
- Backup statistics
**Dependencies:** 001_base_schema.sql

## Migration Status

✅ **All migrations created and ready for deployment**

- **Total Migrations:** 20
- **Total Tables:** 108 + 4 system tables (cache, backups, partitions)
- **Total Indexes:** 150+
- **Total Functions:** 65+
- **Total Triggers:** 35+
- **Storage Buckets:** 10
- **Realtime Tables:** 16
- **Materialized Views:** 10
- **PostgreSQL Extensions:** 7 (including PostGIS)
- **Partitioned Tables:** 3
- **Geospatial Features:** Enabled

## Fullstack Operational Checklist

✅ Base schema with all 106 models
✅ Storage buckets for file uploads
✅ Row-level security policies
✅ Performance indexes (basic + advanced + geospatial)
✅ Database functions and triggers
✅ Realtime publications
✅ Full-text search with trigrams
✅ Auth helper functions
✅ PostgreSQL extensions enabled (7 total)
✅ Advanced indexing strategies
✅ Materialized views for analytics (10 views)
✅ Webhook queue system
✅ Notification queue system
✅ Audit logging and compliance
✅ Geospatial features (PostGIS)
✅ Advanced analytics (cohorts, LTV, RFM)
✅ Table partitioning (3 tables)
✅ Database-level caching
✅ Backup and recovery system

## Notes

- All migrations use `IF NOT EXISTS` or `IF EXISTS` for idempotency
- Migrations are designed to be run in sequence
- Each migration is self-contained and can be rolled back
- Search vectors are automatically maintained via triggers
- Realtime is enabled for collaborative features
- RLS policies enforce data security at the database level

## Maintenance

### Adding New Tables
1. Update Prisma schema
2. Generate new migration: `npx prisma migrate diff --from-empty --to-schema-datamodel --script > supabase/migrations/010_new_feature.sql`
3. Add RLS policies
4. Add indexes
5. Add to realtime if needed
6. Update this README

### Modifying Existing Tables
1. Create new migration file with sequential number
2. Use `ALTER TABLE` statements
3. Update related indexes/functions/policies
4. Test thoroughly before production deployment
