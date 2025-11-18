-- =====================================================
-- GEOSPATIAL FEATURES
-- Location-based queries and distance calculations
-- =====================================================

-- Enable PostGIS extension for advanced geospatial features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geometry columns for venues (point locations)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

-- Add geometry columns for check-ins
ALTER TABLE check_ins ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

-- Create spatial indexes for fast location queries
CREATE INDEX IF NOT EXISTS idx_venues_geom ON venues USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_check_ins_geom ON check_ins USING GIST(geom);

-- Function to update venue geometry from lat/lon
CREATE OR REPLACE FUNCTION update_venue_geometry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update check-in geometry from lat/lon
CREATE OR REPLACE FUNCTION update_checkin_geometry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER venue_geometry_trigger
    BEFORE INSERT OR UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_venue_geometry();

CREATE TRIGGER checkin_geometry_trigger
    BEFORE INSERT OR UPDATE ON check_ins
    FOR EACH ROW EXECUTE FUNCTION update_checkin_geometry();

-- Function to find nearby venues
CREATE OR REPLACE FUNCTION find_nearby_venues(
    p_latitude FLOAT,
    p_longitude FLOAT,
    p_radius_km FLOAT DEFAULT 50
)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    address TEXT,
    distance_km FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        v.address,
        ST_Distance(
            v.geom::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography
        ) / 1000 as distance_km
    FROM venues v
    WHERE v.geom IS NOT NULL
    AND ST_DWithin(
        v.geom::geography,
        ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
        p_radius_km * 1000
    )
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Function to find events near a location
CREATE OR REPLACE FUNCTION find_nearby_events(
    p_latitude FLOAT,
    p_longitude FLOAT,
    p_radius_km FLOAT DEFAULT 50
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    venue_name TEXT,
    distance_km FLOAT,
    "startDate" TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        v.name as venue_name,
        ST_Distance(
            v.geom::geography,
            ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography
        ) / 1000 as distance_km,
        e."startDate"
    FROM events e
    INNER JOIN venues v ON v.id = e."venueId"
    WHERE v.geom IS NOT NULL
    AND ST_DWithin(
        v.geom::geography,
        ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
        p_radius_km * 1000
    )
    ORDER BY distance_km, e."startDate";
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 FLOAT,
    lon1 FLOAT,
    lat2 FLOAT,
    lon2 FLOAT
)
RETURNS FLOAT AS $$
BEGIN
    RETURN ST_Distance(
        ST_SetSRID(ST_MakePoint(lon1, lat1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)::geography
    ) / 1000; -- Return in kilometers
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get check-ins within a geofence
CREATE OR REPLACE FUNCTION get_checkins_in_area(
    p_center_lat FLOAT,
    p_center_lon FLOAT,
    p_radius_meters FLOAT
)
RETURNS TABLE (
    id TEXT,
    "userId" TEXT,
    type TEXT,
    location TEXT,
    "checkInTime" TIMESTAMPTZ,
    distance_meters FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c."userId",
        c.type,
        c.location,
        c."checkInTime",
        ST_Distance(
            c.geom::geography,
            ST_SetSRID(ST_MakePoint(p_center_lon, p_center_lat), 4326)::geography
        ) as distance_meters
    FROM check_ins c
    WHERE c.geom IS NOT NULL
    AND ST_DWithin(
        c.geom::geography,
        ST_SetSRID(ST_MakePoint(p_center_lon, p_center_lat), 4326)::geography,
        p_radius_meters
    )
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;

-- Initialize geometry for existing records
UPDATE venues 
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND geom IS NULL;

UPDATE check_ins
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND geom IS NULL;

-- Create view for venue locations with event counts
CREATE OR REPLACE VIEW venue_locations AS
SELECT 
    v.id,
    v.name,
    v.address,
    v.city,
    v.state,
    v.country,
    v.latitude,
    v.longitude,
    v.geom,
    COUNT(e.id) as event_count,
    COUNT(e.id) FILTER (WHERE e.status = 'PUBLISHED') as published_event_count
FROM venues v
LEFT JOIN events e ON e."venueId" = v.id
GROUP BY v.id, v.name, v.address, v.city, v.state, v.country, v.latitude, v.longitude, v.geom;
