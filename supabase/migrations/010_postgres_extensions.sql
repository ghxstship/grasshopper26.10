-- =====================================================
-- POSTGRESQL EXTENSIONS
-- Enable required PostgreSQL extensions
-- =====================================================

-- UUID generation (required for CUID-like IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cryptographic functions (for password hashing, tokens)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigram similarity for fuzzy search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Additional GIN/GiST index support
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- HTTP client for webhooks (optional but useful)
CREATE EXTENSION IF NOT EXISTS "http";

-- PostGIS for location-based features (venues, events)
-- Uncomment if you need geospatial features
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- EXTENSION USAGE NOTES
-- =====================================================

-- uuid-ossp: Used for generating UUIDs
-- Example: SELECT uuid_generate_v4();

-- pgcrypto: Used for encryption and hashing
-- Example: SELECT crypt('password', gen_salt('bf'));

-- pg_trgm: Used for fuzzy text search and similarity
-- Example: SELECT similarity('hello', 'helo');

-- btree_gin/btree_gist: Enhanced indexing for complex queries
-- Allows composite indexes with different operator classes

-- http: Make HTTP requests from database
-- Useful for webhooks and external API calls
-- Example: SELECT * FROM http_get('https://api.example.com/webhook');
