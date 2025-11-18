-- ============================================================================
-- CATALOG COMPREHENSIVE EXPANSION
-- Site Infrastructure, Hospitality, Staffing, and remaining categories
-- Target: Reach 300+ total items
-- ============================================================================

BEGIN;

-- ============================================================================
-- SITE INFRASTRUCTURE - TENTING (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  dimensions, capacity,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tenting'),
  'Frame Tent (20x20 ft)',
  'frame-tent-20x20',
  '20x20 frame tent with no center poles',
  'Free-standing frame tent, white vinyl top, sidewalls optional.',
  'each',
  ARRAY['Frame Tent', 'Tent', '20x20', 'Event Tent'],
  ARRAY['tent', 'frame', '20x20', 'event', 'canopy'],
  ARRAY['infrastructure', 'tent', 'shelter'],
  '20 ft x 20 ft',
  '40-60 people',
  3,
  '$300-600 per day',
  '2 weeks',
  ARRAY['Tent rental companies', 'Event rental'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tenting'),
  'Frame Tent (40x60 ft)',
  'frame-tent-40x60',
  '40x60 frame tent for large events',
  'Large frame tent, white vinyl top, sidewalls and lighting available.',
  'each',
  ARRAY['Frame Tent', 'Tent', '40x60', 'Large Tent'],
  ARRAY['tent', 'frame', '40x60', 'large', 'event'],
  ARRAY['infrastructure', 'tent', 'shelter'],
  '40 ft x 60 ft',
  '200-300 people',
  1,
  '$1500-3000 per day',
  '4 weeks',
  ARRAY['Tent rental companies', 'Event rental'],
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tenting'),
  'Pop-Up Canopy (10x10 ft)',
  'pop-up-canopy-10x10',
  '10x10 instant pop-up canopy',
  'Portable pop-up canopy with aluminum frame, carrying bag included.',
  'each',
  ARRAY['Pop-Up', 'Canopy', 'EZ-Up', 'Instant Tent'],
  ARRAY['pop-up', 'canopy', 'ez-up', '10x10', 'instant', 'portable'],
  ARRAY['infrastructure', 'canopy', 'shelter'],
  '10 ft x 10 ft',
  '8-10 people',
  10,
  '$30-60 per day',
  '3 days',
  ARRAY['Party rental', 'Event rental'],
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tenting'),
  'Tent Sidewall (20 ft)',
  'tent-sidewall-20ft',
  '20-foot tent sidewall panel',
  'White vinyl sidewall with window or solid, velcro attachment.',
  'each',
  ARRAY['Sidewall', 'Tent Wall', 'Tent Panel'],
  ARRAY['sidewall', 'tent', 'wall', 'panel', '20', 'feet'],
  ARRAY['infrastructure', 'tent', 'sidewall'],
  '20 ft x 8 ft',
  NULL,
  20,
  '$15-30 per day',
  '1 week',
  ARRAY['Tent rental companies'],
  true,
  true,
  4
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tenting'),
  'Tent Heater (Propane)',
  'tent-heater-propane',
  'Propane tent heater for climate control',
  '170,000 BTU propane heater with thermostat, vented.',
  'each',
  ARRAY['Tent Heater', 'Propane Heater', 'Space Heater'],
  ARRAY['heater', 'tent', 'propane', 'climate', 'heat', 'hvac'],
  ARRAY['infrastructure', 'hvac', 'heating'],
  NULL,
  NULL,
  4,
  '$100-200 per day',
  '1 week',
  ARRAY['Tent rental', 'HVAC rental'],
  true,
  true,
  5
);

-- ============================================================================
-- SITE INFRASTRUCTURE - FLOORING (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  dimensions, material,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'flooring'),
  'Dance Floor (4x4 ft panel)',
  'dance-floor-4x4-panel',
  '4x4 ft interlocking dance floor panel',
  'Hardwood or vinyl dance floor panel, interlocking edges.',
  'panel',
  ARRAY['Dance Floor', 'Floor Panel', 'Portable Floor'],
  ARRAY['dance', 'floor', 'panel', '4x4', 'interlocking'],
  ARRAY['infrastructure', 'flooring', 'dance'],
  '4 ft x 4 ft',
  'Hardwood or vinyl',
  100,
  '$8-15 per panel/day',
  '2 weeks',
  ARRAY['Event rental', 'Staging companies'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'flooring'),
  'Carpet (Red)',
  'carpet-red',
  'Red carpet runner',
  'Red carpet runner, 3ft or 4ft width, various lengths.',
  'linear foot',
  ARRAY['Red Carpet', 'Carpet Runner', 'Aisle Runner'],
  ARRAY['carpet', 'red', 'runner', 'aisle', 'walkway'],
  ARRAY['infrastructure', 'flooring', 'carpet'],
  '3-4 ft width',
  'Carpet',
  200,
  '$3-8 per linear foot/day',
  '1 week',
  ARRAY['Event rental', 'Party rental'],
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'flooring'),
  'Turf (Artificial Grass)',
  'turf-artificial-grass',
  'Artificial grass turf',
  'Synthetic grass turf, 15ft width rolls, various lengths.',
  'square foot',
  ARRAY['Artificial Grass', 'Fake Grass', 'Synthetic Turf'],
  ARRAY['turf', 'artificial', 'grass', 'synthetic', 'fake'],
  ARRAY['infrastructure', 'flooring', 'turf'],
  '15 ft width rolls',
  'Synthetic grass',
  500,
  '$2-5 per sq ft/day',
  '1 week',
  ARRAY['Event rental', 'Landscaping rental'],
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'flooring'),
  'Ground Protection Mat (4x8 ft)',
  'ground-protection-mat-4x8',
  'Heavy-duty ground protection mat',
  'HDPE ground protection mat for vehicles and equipment, 4x8 ft.',
  'panel',
  ARRAY['Ground Mat', 'Protection Mat', 'Road Mat', 'Access Mat'],
  ARRAY['ground', 'protection', 'mat', 'road', 'access', '4x8'],
  ARRAY['infrastructure', 'flooring', 'protection'],
  '4 ft x 8 ft',
  'HDPE plastic',
  50,
  '$10-20 per panel/day',
  '1 week',
  ARRAY['Equipment rental', 'Event rental'],
  true,
  true,
  4
);

-- ============================================================================
-- SITE INFRASTRUCTURE - SANITATION (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'sanitation'),
  'Portable Restroom (Standard)',
  'portable-restroom-standard',
  'Standard portable restroom unit',
  'Single-occupancy portable toilet with hand sanitizer dispenser.',
  'each',
  ARRAY['Porta-Potty', 'Portable Toilet', 'Restroom', 'Porta-John'],
  ARRAY['portable', 'restroom', 'toilet', 'porta-potty', 'bathroom'],
  ARRAY['infrastructure', 'sanitation', 'restroom'],
  10,
  '$100-200 per day',
  '1 week',
  ARRAY['Portable restroom companies', 'Event rental'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'sanitation'),
  'Portable Restroom (ADA)',
  'portable-restroom-ada',
  'ADA-compliant portable restroom',
  'Wheelchair-accessible portable restroom with handrails.',
  'each',
  ARRAY['ADA Restroom', 'Accessible Toilet', 'Handicap Restroom'],
  ARRAY['portable', 'restroom', 'ada', 'accessible', 'handicap', 'wheelchair'],
  ARRAY['infrastructure', 'sanitation', 'restroom', 'ada'],
  2,
  '$150-300 per day',
  '1 week',
  ARRAY['Portable restroom companies'],
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'sanitation'),
  'Portable Restroom Trailer (4-stall)',
  'portable-restroom-trailer-4-stall',
  'Luxury restroom trailer with 4 stalls',
  'Climate-controlled restroom trailer with running water, 2 men/2 women stalls.',
  'each',
  ARRAY['Restroom Trailer', 'Luxury Restroom', 'VIP Restroom'],
  ARRAY['restroom', 'trailer', 'luxury', 'vip', '4', 'stall', 'portable'],
  ARRAY['infrastructure', 'sanitation', 'restroom', 'vip'],
  1,
  '$500-1000 per day',
  '2 weeks',
  ARRAY['Portable restroom companies', 'Luxury rental'],
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'sanitation'),
  'Hand Washing Station (Portable)',
  'hand-washing-station-portable',
  'Portable hand washing station',
  'Self-contained hand wash station with fresh/waste tanks, 4-6 users.',
  'each',
  ARRAY['Hand Wash', 'Wash Station', 'Portable Sink'],
  ARRAY['hand', 'wash', 'washing', 'station', 'portable', 'sink'],
  ARRAY['infrastructure', 'sanitation', 'hygiene'],
  6,
  '$50-100 per day',
  '1 week',
  ARRAY['Portable restroom companies', 'Event rental'],
  true,
  true,
  4
);

-- ============================================================================
-- HOSPITALITY - MEAL SERVICES (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'meal-services'),
  'Craft Services (Full Day)',
  'craft-services-full-day',
  'All-day craft services with snacks and beverages',
  'person',
  ARRAY['Craft Services', 'Crafty', 'Snack Table', 'Crew Snacks'],
  ARRAY['craft', 'services', 'crafty', 'snacks', 'crew', 'food'],
  ARRAY['hospitality', 'catering', 'craft services'],
  50,
  '$8-15 per person',
  '1 week',
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'meal-services'),
  'Hot Breakfast Buffet',
  'hot-breakfast-buffet',
  'Hot breakfast buffet with eggs, bacon, and sides',
  'person',
  ARRAY['Breakfast Buffet', 'Hot Breakfast', 'Morning Buffet'],
  ARRAY['breakfast', 'buffet', 'hot', 'morning', 'eggs', 'bacon'],
  ARRAY['hospitality', 'catering', 'breakfast'],
  75,
  '$18-28 per person',
  '1 week',
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'meal-services'),
  'Plated Dinner Service',
  'plated-dinner-service',
  'Formal plated dinner with service staff',
  'person',
  ARRAY['Plated Dinner', 'Formal Dinner', 'Sit-Down Dinner'],
  ARRAY['plated', 'dinner', 'formal', 'service', 'sit-down'],
  ARRAY['hospitality', 'catering', 'dinner', 'formal'],
  100,
  '$35-60 per person',
  '2 weeks',
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'meal-services'),
  'Hors d\'oeuvres Service',
  'hors-doeuvres-service',
  'Passed hors d\'oeuvres with service staff',
  'person',
  ARRAY['Hors d\'oeuvres', 'Appetizers', 'Passed Apps', 'Canapes'],
  ARRAY['hors', 'doeuvres', 'appetizers', 'passed', 'apps', 'canapes'],
  ARRAY['hospitality', 'catering', 'appetizers'],
  75,
  '$12-25 per person',
  '1 week',
  true,
  true,
  4
);

-- ============================================================================
-- STAFFING & PERSONNEL - SECURITY PERSONNEL (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'security-personnel'),
  'Security Guard (Unarmed)',
  'security-guard-unarmed',
  'Unarmed security guard for event security',
  'day',
  ARRAY['Security', 'Guard', 'Security Officer', 'Event Security'],
  ARRAY['security', 'guard', 'unarmed', 'officer', 'event'],
  ARRAY['staffing', 'security', 'personnel'],
  10,
  '$200-350 per day',
  '2 weeks',
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'security-personnel'),
  'Security Supervisor',
  'security-supervisor',
  'Security supervisor for team coordination',
  'day',
  ARRAY['Security Lead', 'Security Manager', 'Head of Security'],
  ARRAY['security', 'supervisor', 'manager', 'lead', 'coordinator'],
  ARRAY['staffing', 'security', 'management'],
  2,
  '$300-500 per day',
  '2 weeks',
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'security-personnel'),
  'Crowd Control Specialist',
  'crowd-control-specialist',
  'Trained crowd control and management specialist',
  'day',
  ARRAY['Crowd Control', 'Crowd Manager', 'Barrier Guard'],
  ARRAY['crowd', 'control', 'specialist', 'management', 'barrier'],
  ARRAY['staffing', 'security', 'crowd control'],
  8,
  '$250-400 per day',
  '2 weeks',
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'security-personnel'),
  'K9 Security Unit',
  'k9-security-unit',
  'K9 security unit with handler',
  'day',
  ARRAY['K9 Unit', 'Dog Security', 'Canine Unit'],
  ARRAY['k9', 'dog', 'canine', 'security', 'unit', 'handler'],
  ARRAY['staffing', 'security', 'k9'],
  2,
  '$500-800 per day',
  '3 weeks',
  true,
  true,
  4
);

-- ============================================================================
-- STAFFING & PERSONNEL - HOSPITALITY STAFF (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'hospitality-staff'),
  'Server (Food Service)',
  'server-food-service',
  'Professional food service server',
  'day',
  ARRAY['Server', 'Waiter', 'Waitress', 'Food Server'],
  ARRAY['server', 'waiter', 'waitress', 'food', 'service'],
  ARRAY['staffing', 'hospitality', 'food service'],
  15,
  '$150-250 per day',
  '1 week',
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'hospitality-staff'),
  'Bartender',
  'bartender',
  'Professional bartender for bar service',
  'day',
  ARRAY['Bartender', 'Mixologist', 'Bar Staff'],
  ARRAY['bartender', 'mixologist', 'bar', 'staff', 'drinks'],
  ARRAY['staffing', 'hospitality', 'bar'],
  4,
  '$200-350 per day',
  '1 week',
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'hospitality-staff'),
  'Catering Captain',
  'catering-captain',
  'Catering team lead and supervisor',
  'day',
  ARRAY['Catering Lead', 'Service Captain', 'Catering Manager'],
  ARRAY['catering', 'captain', 'lead', 'supervisor', 'manager'],
  ARRAY['staffing', 'hospitality', 'management'],
  2,
  '$250-400 per day',
  '1 week',
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'hospitality-staff'),
  'Barista',
  'barista',
  'Professional barista for coffee service',
  'day',
  ARRAY['Barista', 'Coffee Server', 'Espresso Maker'],
  ARRAY['barista', 'coffee', 'espresso', 'service'],
  ARRAY['staffing', 'hospitality', 'coffee'],
  3,
  '$150-250 per day',
  '1 week',
  true,
  true,
  4
);

-- ============================================================================
-- SITE ASSETS - COMMUNICATIONS EQUIPMENT (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'communications-equipment'),
  'Walkie-Talkie (FRS/GMRS)',
  'walkie-talkie-frs-gmrs',
  'Consumer-grade walkie-talkie radio',
  'FRS/GMRS handheld radio, 22 channels, 2-5 mile range.',
  'each',
  ARRAY['Walkie-Talkie', 'Two-Way Radio', 'Handheld Radio'],
  ARRAY['walkie', 'talkie', 'radio', 'frs', 'gmrs', 'two-way'],
  ARRAY['communications', 'radio', 'walkie-talkie'],
  30,
  '$10-20 per day',
  '3 days',
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'communications-equipment'),
  'Headset (Walkie-Talkie)',
  'headset-walkie-talkie',
  'Headset for walkie-talkie radio',
  'Single or dual-ear headset with PTT button, compatible with most radios.',
  'each',
  ARRAY['Radio Headset', 'Earpiece', 'PTT Headset'],
  ARRAY['headset', 'earpiece', 'radio', 'ptt', 'walkie-talkie'],
  ARRAY['communications', 'headset', 'radio'],
  25,
  '$5-15 per day',
  '3 days',
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'communications-equipment'),
  'Megaphone (Battery Powered)',
  'megaphone-battery',
  'Battery-powered megaphone for announcements',
  'Handheld megaphone with siren, 25W output, battery powered.',
  'each',
  ARRAY['Megaphone', 'Bullhorn', 'PA Horn'],
  ARRAY['megaphone', 'bullhorn', 'pa', 'announcement', 'horn'],
  ARRAY['communications', 'megaphone', 'announcement'],
  5,
  '$15-30 per day',
  '3 days',
  true,
  true,
  3
);

-- ============================================================================
-- SITE ASSETS - OFFICE EQUIPMENT (Expanded)
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'office-equipment'),
  'Printer/Copier (Multifunction)',
  'printer-copier-multifunction',
  'Multifunction printer/copier/scanner',
  'All-in-one printer with copy, scan, print, fax capabilities.',
  'each',
  ARRAY['Printer', 'Copier', 'MFP', 'All-in-One'],
  ARRAY['printer', 'copier', 'scanner', 'multifunction', 'mfp'],
  ARRAY['office', 'equipment', 'printer'],
  3,
  '$50-100 per day',
  '1 week',
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'office-equipment'),
  'Laptop Computer',
  'laptop-computer',
  'Standard business laptop computer',
  'Windows or Mac laptop with standard office software.',
  'each',
  ARRAY['Laptop', 'Computer', 'Notebook'],
  ARRAY['laptop', 'computer', 'notebook', 'pc', 'mac'],
  ARRAY['office', 'equipment', 'computer'],
  5,
  '$40-80 per day',
  '1 week',
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'office-equipment'),
  'Monitor (24" LCD)',
  'monitor-24-lcd',
  '24-inch LCD computer monitor',
  'Full HD 1920x1080 LCD monitor with HDMI/DisplayPort.',
  'each',
  ARRAY['Monitor', 'Display', 'Screen', 'LCD'],
  ARRAY['monitor', 'display', 'screen', '24', 'lcd', 'computer'],
  ARRAY['office', 'equipment', 'monitor'],
  8,
  '$20-40 per day',
  '3 days',
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'office-equipment'),
  'Desk (Folding)',
  'desk-folding',
  'Folding office desk',
  '6-foot folding desk with adjustable height.',
  'each',
  ARRAY['Desk', 'Table', 'Work Table', 'Office Desk'],
  ARRAY['desk', 'table', 'folding', 'office', 'work'],
  ARRAY['office', 'furniture', 'desk'],
  10,
  '$15-30 per day',
  '3 days',
  true,
  true,
  4
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'office-equipment'),
  'Office Chair',
  'office-chair',
  'Ergonomic office chair',
  'Adjustable office chair with wheels and lumbar support.',
  'each',
  ARRAY['Chair', 'Office Chair', 'Desk Chair'],
  ARRAY['chair', 'office', 'desk', 'ergonomic', 'seating'],
  ARRAY['office', 'furniture', 'chair'],
  15,
  '$10-20 per day',
  '3 days',
  true,
  true,
  5
);

COMMIT;
