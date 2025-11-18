-- B2C Features Migration
-- Adds tables for Music (Artists, Labels), Shops, Destinations, and Adventures

-- ============================================================================
-- ARTISTS TABLE (Spotify Integration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  genres TEXT[],
  image_url TEXT,
  followers INTEGER DEFAULT 0,
  popularity INTEGER DEFAULT 0,
  shopify_store_id UUID REFERENCES stores(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_artists_spotify_id ON artists(spotify_id);
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_name ON artists(name);

-- ============================================================================
-- RECORD LABELS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS record_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  logo_url TEXT,
  website VARCHAR(500),
  shopify_store_id UUID REFERENCES stores(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_labels_slug ON record_labels(slug);

-- ============================================================================
-- ARTIST-LABEL RELATIONSHIP
-- ============================================================================
CREATE TABLE IF NOT EXISTS artist_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  label_id UUID REFERENCES record_labels(id) ON DELETE CASCADE,
  signed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(artist_id, label_id)
);

-- ============================================================================
-- STORES TABLE (Shopify Integration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_store_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  store_type VARCHAR(50) NOT NULL CHECK (store_type IN ('artist', 'venue', 'label', 'brand')),
  logo_url TEXT,
  owner_id UUID, -- Can link to artist, venue, or label
  owner_type VARCHAR(50) CHECK (owner_type IN ('artist', 'venue', 'label', 'brand')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_type ON stores(store_type);
CREATE INDEX idx_stores_shopify_id ON stores(shopify_store_id);

-- ============================================================================
-- DESTINATIONS TABLE (Google Places Integration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('stay', 'dining', 'shopping', 'wellness')),
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  rating DECIMAL(2, 1),
  review_count INTEGER DEFAULT 0,
  photos TEXT[],
  phone_number VARCHAR(50),
  website VARCHAR(500),
  opening_hours JSONB,
  user_submitted BOOLEAN DEFAULT FALSE,
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_category ON destinations(category);
CREATE INDEX idx_destinations_location ON destinations USING GIST (
  ll_to_earth(lat, lng)
);
CREATE INDEX idx_destinations_google_place_id ON destinations(google_place_id);

-- ============================================================================
-- ADVENTURES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('poi', 'tour', 'outdoor', 'cultural', 'food', 'nightlife')),
  duration VARCHAR(50),
  price_range VARCHAR(50),
  price_amount DECIMAL(10, 2),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  booking_link TEXT,
  google_place_id VARCHAR(255),
  images TEXT[],
  user_submitted BOOLEAN DEFAULT FALSE,
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_adventures_slug ON adventures(slug);
CREATE INDEX idx_adventures_category ON adventures(category);
CREATE INDEX idx_adventures_location ON adventures USING GIST (
  ll_to_earth(lat, lng)
);

-- ============================================================================
-- USER SAVED ITEMS (Bookmarks/Favorites)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('artist', 'store', 'destination', 'adventure', 'event')),
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX idx_saved_items_user ON user_saved_items(user_id);
CREATE INDEX idx_saved_items_type ON user_saved_items(item_type);

-- ============================================================================
-- EVENT ENHANCEMENTS (Link events to artists and stores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_enhancements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, artist_id)
);

CREATE INDEX idx_event_enhancements_event ON event_enhancements(event_id);
CREATE INDEX idx_event_enhancements_artist ON event_enhancements(artist_id);

-- ============================================================================
-- MEMBER REVIEWS (For destinations and adventures)
-- ============================================================================
CREATE TABLE IF NOT EXISTS member_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('destination', 'adventure')),
  item_id UUID NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE INDEX idx_reviews_item ON member_reviews(item_type, item_id);
CREATE INDEX idx_reviews_user ON member_reviews(user_id);

-- ============================================================================
-- TRIP PLANS (User itineraries)
-- ============================================================================
CREATE TABLE IF NOT EXISTS trip_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255),
  date DATE,
  destinations UUID[],
  adventures UUID[],
  notes TEXT,
  shared_with UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_trip_plans_user ON trip_plans(user_id);
CREATE INDEX idx_trip_plans_event ON trip_plans(event_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Artists: Public read, admin write
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artists are viewable by everyone" ON artists FOR SELECT USING (true);
CREATE POLICY "Artists are editable by admins" ON artists FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Labels: Public read, admin write
ALTER TABLE record_labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Labels are viewable by everyone" ON record_labels FOR SELECT USING (true);
CREATE POLICY "Labels are editable by admins" ON record_labels FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Stores: Public read, admin write
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stores are viewable by everyone" ON stores FOR SELECT USING (true);
CREATE POLICY "Stores are editable by admins" ON stores FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Destinations: Public read, authenticated users can submit
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Destinations are viewable by everyone" ON destinations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit destinations" ON destinations FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own destinations" ON destinations FOR UPDATE USING (
  submitted_by = auth.uid()
);

-- Adventures: Public read, authenticated users can submit
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adventures are viewable by everyone" ON adventures FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit adventures" ON adventures FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);
CREATE POLICY "Users can update their own adventures" ON adventures FOR UPDATE USING (
  submitted_by = auth.uid()
);

-- User Saved Items: Users can only see and manage their own
ALTER TABLE user_saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own saved items" ON user_saved_items FOR SELECT USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can manage their own saved items" ON user_saved_items FOR ALL USING (
  user_id = auth.uid()
);

-- Member Reviews: Public read, users manage their own
ALTER TABLE member_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON member_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON member_reviews FOR INSERT WITH CHECK (
  user_id = auth.uid()
);
CREATE POLICY "Users can update their own reviews" ON member_reviews FOR UPDATE USING (
  user_id = auth.uid()
);
CREATE POLICY "Users can delete their own reviews" ON member_reviews FOR DELETE USING (
  user_id = auth.uid()
);

-- Trip Plans: Users can only see and manage their own or shared plans
ALTER TABLE trip_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own trip plans" ON trip_plans FOR SELECT USING (
  user_id = auth.uid() OR auth.uid() = ANY(shared_with)
);
CREATE POLICY "Users can manage their own trip plans" ON trip_plans FOR ALL USING (
  user_id = auth.uid()
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labels_updated_at BEFORE UPDATE ON record_labels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adventures_updated_at BEFORE UPDATE ON adventures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON member_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_plans_updated_at BEFORE UPDATE ON trip_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
