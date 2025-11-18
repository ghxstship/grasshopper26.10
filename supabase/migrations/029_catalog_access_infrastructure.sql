-- ============================================================================
-- CATALOG ITEMS - ACCESS & CREDENTIALS
-- Updated to match new subcategory structure
-- ============================================================================

BEGIN;

-- ============================================================================
-- ACCESS & CREDENTIALS - Build & Strike Credentials
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'build-strike-credentials'),
  'Load-In Crew Pass',
  'load-in-crew-pass',
  'Load-in and build crew access credential',
  'each',
  ARRAY['Build Pass', 'Load In Pass', 'Setup Crew', 'Build Crew'],
  ARRAY['load in', 'build', 'setup', 'crew', 'access', 'credential'],
  ARRAY['access', 'build', 'load-in', 'crew'],
  100, '$3-8 per pass', '3 days', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'build-strike-credentials'),
  'Load-Out Crew Pass',
  'load-out-crew-pass',
  'Load-out and strike crew access credential',
  'each',
  ARRAY['Strike Pass', 'Load Out Pass', 'Teardown Crew', 'Strike Crew'],
  ARRAY['load out', 'strike', 'teardown', 'crew', 'access', 'credential'],
  ARRAY['access', 'strike', 'load-out', 'crew'],
  100, '$3-8 per pass', '3 days', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'build-strike-credentials'),
  'Rigger Credential',
  'rigger-credential',
  'Certified rigger access credential',
  'each',
  ARRAY['Rigging Pass', 'Rigger Badge', 'Certified Rigger'],
  ARRAY['rigger', 'rigging', 'certified', 'access', 'credential'],
  ARRAY['access', 'rigging', 'certified', 'safety'],
  20, '$5-12 per pass', '1 week', true, true, 3
);

-- ============================================================================
-- ACCESS & CREDENTIALS - Day of Show Credentials
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'day-of-show-credentials'),
  'All-Access Laminate (AAA)',
  'all-access-laminate-aaa',
  'Top-tier all-access credential with full venue access',
  'each',
  ARRAY['AAA Pass', 'All Access', 'Full Access', 'Laminate'],
  ARRAY['access', 'pass', 'aaa', 'all access', 'credential', 'laminate'],
  ARRAY['access', 'credential', 'show day', 'all access'],
  25, '$5-15 per pass', '1 week', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'day-of-show-credentials'),
  'Production Pass',
  'production-pass',
  'Production team show day credential',
  'each',
  ARRAY['Prod Pass', 'Production Credential', 'Crew Pass'],
  ARRAY['production', 'access', 'pass', 'crew', 'show day'],
  ARRAY['access', 'production', 'crew', 'show day'],
  75, '$3-10 per pass', '1 week', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'day-of-show-credentials'),
  'Artist/Talent Pass',
  'artist-talent-pass',
  'Artist and talent show day credential',
  'each',
  ARRAY['Artist Pass', 'Talent Pass', 'Performer Pass'],
  ARRAY['artist', 'talent', 'performer', 'access', 'pass', 'show day'],
  ARRAY['access', 'artist', 'talent', 'performer'],
  30, '$5-15 per pass', '1 week', true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'day-of-show-credentials'),
  'Guest/VIP Pass',
  'guest-vip-pass',
  'VIP and guest show day credential',
  'each',
  ARRAY['VIP Pass', 'Guest Pass', 'VIP Credential'],
  ARRAY['vip', 'guest', 'access', 'pass', 'show day'],
  ARRAY['access', 'vip', 'guest'],
  50, '$5-12 per pass', '1 week', true, true, 4
);

-- ============================================================================
-- ACCESS & CREDENTIALS - Zone Credentials
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'zone-credentials'),
  'Backstage Pass',
  'backstage-pass',
  'Backstage area access credential',
  'each',
  ARRAY['Stage Pass', 'Backstage Access', 'Stage Area'],
  ARRAY['backstage', 'stage', 'access', 'pass', 'zone'],
  ARRAY['access', 'backstage', 'stage', 'zone'],
  60, '$3-8 per pass', '3 days', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'zone-credentials'),
  'FOH Pass',
  'foh-pass',
  'Front of house area access credential',
  'each',
  ARRAY['Front of House', 'FOH Access', 'House Pass'],
  ARRAY['foh', 'front of house', 'access', 'pass', 'zone'],
  ARRAY['access', 'foh', 'front of house', 'zone'],
  40, '$3-8 per pass', '3 days', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'zone-credentials'),
  'Production Office Pass',
  'production-office-pass',
  'Production office area access credential',
  'each',
  ARRAY['Office Pass', 'Prod Office', 'Admin Pass'],
  ARRAY['production', 'office', 'access', 'pass', 'zone', 'admin'],
  ARRAY['access', 'office', 'production', 'zone'],
  30, '$3-8 per pass', '3 days', true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'zone-credentials'),
  'Catering Area Pass',
  'catering-area-pass',
  'Catering and hospitality area access credential',
  'each',
  ARRAY['Catering Pass', 'Food Area', 'Hospitality Pass'],
  ARRAY['catering', 'food', 'hospitality', 'access', 'pass', 'zone'],
  ARRAY['access', 'catering', 'hospitality', 'zone'],
  50, '$3-8 per pass', '3 days', true, true, 4
);

-- ============================================================================
-- ACCESS & CREDENTIALS - Vehicle Credentials
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'vehicle-credentials'),
  'Production Vehicle Pass',
  'production-vehicle-pass',
  'Production vehicle parking and access permit',
  'each',
  ARRAY['Prod Vehicle', 'Vehicle Pass', 'Parking Permit'],
  ARRAY['parking', 'permit', 'vehicle', 'production', 'pass'],
  ARRAY['parking', 'vehicle', 'production'],
  50, '$5-15 per permit', '1 week', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'vehicle-credentials'),
  'Artist/VIP Vehicle Pass',
  'artist-vip-vehicle-pass',
  'Reserved parking for artists and VIP guests',
  'each',
  ARRAY['VIP Parking', 'Artist Parking', 'Reserved Parking'],
  ARRAY['parking', 'vip', 'artist', 'reserved', 'permit', 'vehicle'],
  ARRAY['parking', 'vip', 'artist', 'vehicle'],
  20, '$10-25 per permit', '1 week', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'vehicle-credentials'),
  'Load-In/Load-Out Vehicle Pass',
  'load-in-out-vehicle-pass',
  'Temporary loading zone vehicle permit',
  'each',
  ARRAY['Loading Zone', 'Load In', 'Truck Parking', 'Dock Pass'],
  ARRAY['parking', 'loading', 'load in', 'truck', 'permit', 'vehicle', 'dock'],
  ARRAY['parking', 'loading', 'logistics', 'vehicle'],
  25, '$15-30 per permit', '1 week', true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'access-credentials'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'vehicle-credentials'),
  'Golf Cart Pass',
  'golf-cart-pass',
  'Golf cart and utility vehicle permit',
  'each',
  ARRAY['Cart Pass', 'UTV Pass', 'Utility Vehicle'],
  ARRAY['golf cart', 'cart', 'utv', 'vehicle', 'permit', 'utility'],
  ARRAY['vehicle', 'golf cart', 'utility'],
  40, '$5-12 per permit', '3 days', true, true, 4
);

-- ============================================================================
-- SITE INFRASTRUCTURE - Trailers
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  dimensions, typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'trailers'),
  'Production Office Trailer (40 ft)',
  'production-office-trailer-40ft',
  '40-foot mobile office trailer with AC/heat',
  'Climate-controlled office trailer with desks, chairs, power, internet hookups',
  'each',
  ARRAY['Office Trailer', 'Mobile Office', 'Prod Office'],
  ARRAY['trailer', 'office', 'production', 'mobile', '40'],
  ARRAY['infrastructure', 'office', 'trailer'],
  '40 ft x 8 ft',
  2, '$200-400 per day', '2 weeks',
  ARRAY['Mobile Modular', 'Williams Scotsman', 'Local trailer rental'],
  true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'trailers'),
  'Star Trailer (Luxury)',
  'star-trailer-luxury',
  'Luxury artist/talent trailer with full amenities',
  'High-end trailer with bedroom, bathroom, kitchenette, lounge, AC/heat',
  'each',
  ARRAY['Artist Trailer', 'Talent Trailer', 'Luxury Trailer', 'Dressing Room'],
  ARRAY['trailer', 'star', 'artist', 'luxury', 'dressing room'],
  ARRAY['infrastructure', 'hospitality', 'trailer', 'vip'],
  '53 ft x 8.5 ft',
  3, '$500-1500 per day', '3 weeks',
  ARRAY['Junk Yard Dog', 'Hemphill Brothers', 'Tour Supply'],
  true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'trailers'),
  'Wardrobe Trailer',
  'wardrobe-trailer',
  'Mobile wardrobe and costume trailer',
  'Trailer with hanging racks, storage, mirrors, AC/heat for wardrobe department',
  'each',
  ARRAY['Costume Trailer', 'Wardrobe Unit'],
  ARRAY['trailer', 'wardrobe', 'costume', 'clothing', 'storage'],
  ARRAY['infrastructure', 'wardrobe', 'trailer'],
  '28 ft x 8 ft',
  2, '$150-300 per day', '2 weeks',
  ARRAY['Local trailer rental', 'Production trailer companies'],
  true, true, 3
);

-- ============================================================================
-- SITE INFRASTRUCTURE - Containers
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  dimensions, typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'containers'),
  'Storage Container (20 ft)',
  'storage-container-20ft',
  '20-foot steel storage container',
  'Weather-resistant steel container for equipment and gear storage',
  'each',
  ARRAY['Shipping Container', 'Conex', 'Sea Container', '20ft Container'],
  ARRAY['container', 'storage', '20', 'shipping', 'conex'],
  ARRAY['infrastructure', 'storage', 'container'],
  '20 ft x 8 ft x 8.5 ft',
  5, '$100-200 per month', '1 week',
  ARRAY['PODS', 'Mobile Mini', 'Local container rental'],
  true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'containers'),
  'Office Container (Modified)',
  'office-container-modified',
  'Modified container with office setup',
  'Climate-controlled container converted to office space with power, lighting, AC',
  'each',
  ARRAY['Container Office', 'Modified Container', 'Office Box'],
  ARRAY['container', 'office', 'modified', 'workspace'],
  ARRAY['infrastructure', 'office', 'container'],
  '20 ft x 8 ft x 8.5 ft',
  3, '$150-300 per month', '2 weeks',
  ARRAY['Mobile Modular', 'Container modifications companies'],
  true, true, 2
);

-- ============================================================================
-- SITE INFRASTRUCTURE - Staging
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  dimensions, weight, material, capacity,
  typical_quantity, estimated_cost, requires_certification, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'staging'),
  'Stage Deck (4x8 ft)',
  'stage-deck-4x8',
  'Standard 4x8 ft stage deck platform',
  'Modular stage deck with adjustable legs, non-slip surface, load capacity 125 lbs/sq ft',
  'each',
  ARRAY['Stage Platform', 'Deck', 'Stage Section', 'Platform'],
  ARRAY['stage', 'deck', 'platform', '4x8', 'modular'],
  ARRAY['staging', 'platform', 'infrastructure'],
  '48" x 96" x variable height',
  '75 lbs',
  'Aluminum frame, plywood deck',
  '125 lbs/sq ft',
  50, '$15-30 per day', false, '1 week',
  ARRAY['Staging Concepts', 'Stageline', 'Wenger'],
  true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'staging'),
  'Stage Riser (8" height)',
  'stage-riser-8in',
  '8-inch stage riser for elevation',
  'Modular riser platform, 8" height, connects to standard stage decks',
  'each',
  ARRAY['Riser', 'Platform Riser', 'Stage Elevation'],
  ARRAY['riser', 'stage', 'platform', '8 inch', 'elevation'],
  ARRAY['staging', 'riser', 'infrastructure'],
  '48" x 96" x 8"',
  '45 lbs',
  'Aluminum frame, plywood top',
  '125 lbs/sq ft',
  30, '$10-20 per day', false, '1 week',
  ARRAY['Staging Concepts', 'Stageline', 'Wenger'],
  true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'staging'),
  'Stage Stairs (4-step)',
  'stage-stairs-4-step',
  'Four-step stage access stairs',
  'Modular stage stairs with handrail, 32" height, non-slip treads',
  'each',
  ARRAY['Stage Steps', 'Access Stairs', 'Platform Stairs'],
  ARRAY['stairs', 'steps', 'stage', 'access', 'handrail'],
  ARRAY['staging', 'access', 'safety'],
  '48" x 48" x 32"',
  '85 lbs',
  'Aluminum frame, non-slip treads',
  '300 lbs',
  8, '$25-45 per day', false, '1 week',
  ARRAY['Staging Concepts', 'Stageline', 'Wenger'],
  true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'staging'),
  'Stage Skirting (8 ft section)',
  'stage-skirting-8ft',
  'Stage skirting fabric panel',
  'Pleated fabric skirting for stage perimeter, velcro attachment, flame retardant',
  'each',
  ARRAY['Stage Skirt', 'Platform Skirting', 'Stage Drape'],
  ARRAY['skirting', 'skirt', 'stage', 'drape', 'fabric'],
  ARRAY['staging', 'drape', 'aesthetics'],
  '96" x 32"',
  '5 lbs',
  'Flame retardant fabric',
  NULL,
  40, '$5-12 per day', false, '3 days',
  ARRAY['Rose Brand', 'Staging Concepts', 'Local rental'],
  true, true, 4
);

-- ============================================================================
-- SITE INFRASTRUCTURE - Fencing
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  dimensions, weight, material,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'fencing'),
  'Chain Link Fence (6 ft panel)',
  'chain-link-fence-6ft',
  'Temporary chain link fence panel',
  '6ft height chain link fence panel with stabilizing feet',
  'each',
  ARRAY['Fence Panel', 'Chain Link', 'Temporary Fence'],
  ARRAY['fence', 'chain link', 'panel', 'temporary', 'perimeter'],
  ARRAY['safety', 'perimeter', 'fencing'],
  '72" x 120"',
  '55 lbs',
  'Galvanized steel chain link',
  100, '$5-12 per day', '1 week',
  ARRAY['United Rentals', 'Sunbelt Rentals', 'Local fence rental'],
  true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'fencing'),
  'Privacy Fence Panel (8 ft)',
  'privacy-fence-panel-8ft',
  'Solid privacy fence panel',
  '8ft height solid panel fence for privacy screening',
  'each',
  ARRAY['Privacy Screen', 'Solid Fence', 'Screen Panel'],
  ARRAY['fence', 'privacy', 'panel', 'screen', 'solid'],
  ARRAY['privacy', 'perimeter', 'fencing'],
  '96" x 96"',
  '65 lbs',
  'Vinyl or wood composite',
  50, '$8-18 per day', '1 week',
  ARRAY['Local fence rental', 'Event rental companies'],
  true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'fencing'),
  'Plastic Safety Barrier',
  'plastic-safety-barrier',
  'Lightweight plastic safety barrier',
  'Interlocking plastic barrier for pedestrian control, water-fillable base',
  'each',
  ARRAY['Plastic Barrier', 'Water Barrier', 'Jersey Barrier'],
  ARRAY['barrier', 'plastic', 'safety', 'water fill', 'pedestrian'],
  ARRAY['safety', 'barrier', 'pedestrian'],
  '72" x 18" x 42"',
  '25 lbs (empty)',
  'HDPE plastic',
  75, '$4-10 per day', '3 days',
  ARRAY['Local rental', 'Traffic safety suppliers'],
  true, true, 3
);

COMMIT;
