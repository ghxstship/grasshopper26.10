-- =====================================================
-- FULL-TEXT SEARCH
-- PostgreSQL full-text search indexes
-- =====================================================

-- Add tsvector columns for full-text search
ALTER TABLE events ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE users ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vectors
CREATE OR REPLACE FUNCTION update_event_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_artist_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.genre, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_venue_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.address, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_opportunity_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.requirements, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for search vector updates
CREATE TRIGGER events_search_vector_update
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_event_search_vector();

CREATE TRIGGER users_search_vector_update
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_search_vector();

CREATE TRIGGER products_search_vector_update
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

CREATE TRIGGER artists_search_vector_update
    BEFORE INSERT OR UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_artist_search_vector();

CREATE TRIGGER venues_search_vector_update
    BEFORE INSERT OR UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_venue_search_vector();

CREATE TRIGGER projects_search_vector_update
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_project_search_vector();

CREATE TRIGGER opportunities_search_vector_update
    BEFORE INSERT OR UPDATE ON opportunities
    FOR EACH ROW EXECUTE FUNCTION update_opportunity_search_vector();

-- Create GIN indexes for fast full-text search
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_artists_search ON artists USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_venues_search ON venues USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_opportunities_search ON opportunities USING GIN(search_vector);

-- Update existing records with search vectors
UPDATE events SET search_vector = 
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(location, '')), 'C');

UPDATE users SET search_vector = 
    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(email, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(bio, '')), 'C');

UPDATE products SET search_vector = 
    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(category, '')), 'C');

UPDATE artists SET search_vector = 
    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(bio, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(genre, '')), 'C');

UPDATE venues SET search_vector = 
    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(address, '')), 'C');

UPDATE projects SET search_vector = 
    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B');

UPDATE opportunities SET search_vector = 
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(requirements, '')), 'C');
