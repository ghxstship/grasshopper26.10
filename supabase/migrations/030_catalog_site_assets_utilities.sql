-- ============================================================================
-- CATALOG ITEMS - SITE ASSETS + SITE SERVICES
-- Updated to match new subcategory structure
-- ============================================================================

BEGIN;

-- ============================================================================
-- SITE ASSETS - Furniture
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  dimensions, weight, material,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'furniture'),
  'Round Table (60" diameter)',
  'round-table-60in',
  '60-inch round banquet table',
  'Round folding table, seats 8-10 people, plastic top with steel frame',
  'each',
  ARRAY['Round Table', '60 inch Table', 'Banquet Round'],
  ARRAY['table', 'round', '60', 'banquet', 'seating'],
  ARRAY['furniture', 'table', 'seating'],
  '60" diameter x 30" height',
  '45 lbs',
  'Plastic top, steel frame',
  30, '$12-20 per day', '3 days', true, true, 4
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'furniture'),
  'Cocktail Table (30" high)',
  'cocktail-table-30in',
  'Standing height cocktail table',
  '30" diameter cocktail table, 42" height, ideal for standing receptions',
  'each',
  ARRAY['Cocktail Table', 'High Top', 'Standing Table', 'Bistro Table'],
  ARRAY['cocktail', 'table', 'high top', 'standing', 'bistro'],
  ARRAY['furniture', 'table', 'cocktail'],
  '30" diameter x 42" height',
  '25 lbs',
  'Plastic top, steel frame',
  25, '$10-18 per day', '3 days', true, true, 5
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'furniture'),
  'Chiavari Chair (Gold)',
  'chiavari-chair-gold',
  'Gold chiavari chair for elegant events',
  'Stackable chiavari chair with cushion, gold finish',
  'each',
  ARRAY['Chiavari', 'Gold Chair', 'Ballroom Chair', 'Wedding Chair'],
  ARRAY['chair', 'chiavari', 'gold', 'elegant', 'wedding'],
  ARRAY['furniture', 'seating', 'elegant'],
  '16" x 17" x 36"',
  '10 lbs',
  'Resin or wood, gold finish',
  100, '$5-10 per day', '1 week', true, true, 6
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'furniture'),
  'Lounge Sofa (3-seater)',
  'lounge-sofa-3-seater',
  'Modern lounge sofa for VIP areas',
  'Contemporary 3-seat sofa, leather or fabric upholstery',
  'each',
  ARRAY['Sofa', 'Couch', 'Lounge Seating', 'VIP Furniture'],
  ARRAY['sofa', 'couch', 'lounge', 'vip', 'seating'],
  ARRAY['furniture', 'lounge', 'vip'],
  '84" x 36" x 32"',
  '120 lbs',
  'Wood frame, upholstered',
  10, '$75-150 per day', '1 week', true, true, 7
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'furniture'),
  'Director Chair',
  'director-chair',
  'Folding director chair with canvas back',
  'Classic director chair, folding frame, canvas seat and back',
  'each',
  ARRAY['Director Chair', 'Canvas Chair', 'Folding Director'],
  ARRAY['director', 'chair', 'canvas', 'folding', 'backstage'],
  ARRAY['furniture', 'seating', 'backstage'],
  '22" x 18" x 32"',
  '12 lbs',
  'Wood frame, canvas',
  40, '$6-12 per day', '3 days', true, true, 8
);

-- ============================================================================
-- SITE ASSETS - Safety Equipment
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'safety-equipment'),
  'Hard Hat (ANSI Certified)',
  'hard-hat-ansi',
  'ANSI-certified hard hat for head protection',
  'Type I hard hat, ANSI Z89.1 certified, adjustable suspension',
  'each',
  ARRAY['Hard Hat', 'Safety Helmet', 'Construction Hat', 'PPE'],
  ARRAY['hard hat', 'helmet', 'safety', 'ppe', 'head protection'],
  ARRAY['safety', 'ppe', 'head protection'],
  100, '$3-8 per day', '3 days', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'safety-equipment'),
  'Safety Vest (Hi-Vis)',
  'safety-vest-hi-vis',
  'High-visibility safety vest',
  'ANSI Class 2 or 3 hi-vis vest, reflective strips, multiple sizes',
  'each',
  ARRAY['Safety Vest', 'Hi-Vis Vest', 'Reflective Vest', 'PPE'],
  ARRAY['safety', 'vest', 'hi-vis', 'reflective', 'ppe', 'visibility'],
  ARRAY['safety', 'ppe', 'visibility'],
  150, '$2-6 per day', '3 days', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'safety-equipment'),
  'Work Gloves (Heavy Duty)',
  'work-gloves-heavy-duty',
  'Heavy-duty work gloves for hand protection',
  'Cut-resistant work gloves, multiple sizes, reinforced palms',
  'pair',
  ARRAY['Work Gloves', 'Safety Gloves', 'PPE Gloves'],
  ARRAY['gloves', 'work', 'safety', 'ppe', 'hand protection'],
  ARRAY['safety', 'ppe', 'hand protection'],
  200, '$2-5 per day', '3 days', true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'safety-equipment'),
  'Safety Glasses',
  'safety-glasses',
  'ANSI-certified safety glasses',
  'Impact-resistant safety glasses, ANSI Z87.1 certified, anti-fog coating',
  'each',
  ARRAY['Safety Glasses', 'Eye Protection', 'PPE Glasses'],
  ARRAY['safety', 'glasses', 'eye protection', 'ppe', 'goggles'],
  ARRAY['safety', 'ppe', 'eye protection'],
  100, '$2-5 per day', '3 days', true, true, 4
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'safety-equipment'),
  'First Aid Kit (Large)',
  'first-aid-kit-large',
  'Comprehensive first aid kit for events',
  'OSHA-compliant first aid kit, 100+ person capacity, wall-mountable',
  'kit',
  ARRAY['First Aid', 'Medical Kit', 'Emergency Kit'],
  ARRAY['first aid', 'medical', 'emergency', 'safety', 'kit'],
  ARRAY['safety', 'medical', 'emergency'],
  10, '$15-30 per day', '3 days', true, true, 5
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'safety-equipment'),
  'Fire Extinguisher (10 lb ABC)',
  'fire-extinguisher-10lb-abc',
  '10-pound ABC fire extinguisher',
  'Multi-purpose ABC fire extinguisher, 10 lb capacity, wall bracket included',
  'each',
  ARRAY['Fire Extinguisher', 'ABC Extinguisher', 'Safety Equipment'],
  ARRAY['fire', 'extinguisher', 'safety', 'abc', 'emergency'],
  ARRAY['safety', 'fire', 'emergency'],
  20, '$10-20 per day', '3 days', true, true, 6
);

-- ============================================================================
-- SITE ASSETS - Tools & Equipment
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tools-equipment'),
  'Tool Kit (Basic)',
  'tool-kit-basic',
  'Basic hand tool kit for general use',
  'Includes hammer, screwdrivers, pliers, wrenches, tape measure, utility knife',
  'kit',
  ARRAY['Tool Kit', 'Hand Tools', 'Basic Tools', 'Tool Set'],
  ARRAY['tools', 'kit', 'hand tools', 'basic', 'set'],
  ARRAY['tools', 'equipment', 'maintenance'],
  '18" x 12" x 8" case',
  '15 lbs',
  'Steel tools, plastic case',
  NULL,
  5, '$15-30 per day', '3 days', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tools-equipment'),
  'Cordless Drill Kit',
  'cordless-drill-kit',
  'Cordless drill/driver with batteries',
  '18V cordless drill with 2 batteries, charger, and carrying case',
  'kit',
  ARRAY['Drill', 'Power Drill', 'Cordless Drill', 'Drill Kit'],
  ARRAY['drill', 'cordless', 'power tool', 'battery', 'driver'],
  ARRAY['tools', 'power tools', 'equipment'],
  NULL,
  '5 lbs',
  NULL,
  NULL,
  3, '$20-40 per day', '3 days', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tools-equipment'),
  'Extension Ladder (20 ft)',
  'extension-ladder-20ft',
  '20-foot aluminum extension ladder',
  'Type IA aluminum extension ladder, 300 lb capacity, extends to 20 feet',
  'each',
  ARRAY['Ladder', 'Extension Ladder', '20 ft Ladder'],
  ARRAY['ladder', 'extension', '20', 'aluminum', 'climbing'],
  ARRAY['tools', 'ladder', 'access'],
  '20 ft extended',
  '45 lbs',
  'Aluminum',
  '300 lbs',
  4, '$15-30 per day', '3 days', true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-assets'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'tools-equipment'),
  'Step Ladder (6 ft)',
  'step-ladder-6ft',
  '6-foot aluminum step ladder',
  'Type IA aluminum step ladder, 300 lb capacity, 6 feet height',
  'each',
  ARRAY['Step Ladder', '6 ft Ladder', 'A-Frame Ladder'],
  ARRAY['ladder', 'step', '6', 'aluminum', 'a-frame'],
  ARRAY['tools', 'ladder', 'access'],
  '6 ft height',
  '25 lbs',
  'Aluminum',
  '300 lbs',
  8, '$10-20 per day', '3 days', true, true, 4
);

-- ============================================================================
-- SITE SERVICES - Power Distribution
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  power_requirements, capacity,
  typical_quantity, estimated_cost, requires_certification, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-services'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'power-distribution'),
  'Power Distribution Box (200A)',
  'power-distro-200a',
  '200-amp power distribution box',
  'Cam-Lok input, multiple outputs (Edison, 20A, 30A), circuit breakers, weatherproof',
  'each',
  ARRAY['Distro', 'Power Distro', 'Distro Box', 'Power Box'],
  ARRAY['power', 'distribution', 'distro', '200a', 'electrical'],
  ARRAY['power', 'electrical', 'distribution'],
  '208V 3-phase',
  '200A',
  5, '$75-150 per day', true, '1 week',
  ARRAY['Local electrical rental', 'Production electrical companies'],
  true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-services'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'power-distribution'),
  'Spider Box (100A)',
  'spider-box-100a',
  '100-amp spider distribution box',
  '6-way spider box with circuit breakers, Cam-Lok input, multiple Edison outputs',
  'each',
  ARRAY['Spider Box', 'Spider Distro', '100A Distro'],
  ARRAY['spider', 'box', 'power', 'distribution', '100a'],
  ARRAY['power', 'electrical', 'distribution'],
  '120/208V',
  '100A',
  10, '$40-80 per day', true, '1 week',
  ARRAY['Local electrical rental', 'Production electrical companies'],
  true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-services'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'power-distribution'),
  'Extension Cable (100 ft, 12/3)',
  'extension-cable-100ft',
  '100-foot 12-gauge extension cable',
  'Heavy-duty 12/3 SJTW extension cord, lighted ends, 15A capacity',
  'each',
  ARRAY['Extension Cord', 'Power Cable', 'Extension Cable'],
  ARRAY['extension', 'cord', 'cable', 'power', '100', 'feet'],
  ARRAY['power', 'cable', 'electrical'],
  '120V',
  '15A',
  50, '$5-12 per day', false, '3 days',
  ARRAY['Hardware stores', 'Electrical supply'],
  true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-services'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'power-distribution'),
  'Cam-Lok Cable (50 ft, 4/0)',
  'cam-lok-cable-50ft',
  '50-foot 4/0 Cam-Lok feeder cable',
  'Single conductor 4/0 cable with Cam-Lok connectors, rated for 200A',
  'each',
  ARRAY['Cam-Lok', 'Feeder Cable', 'Power Cable', '4/0 Cable'],
  ARRAY['cam-lok', 'camlok', 'cable', 'feeder', '4/0', 'power'],
  ARRAY['power', 'cable', 'electrical'],
  '208V',
  '200A',
  20, '$15-30 per day', true, '1 week',
  ARRAY['Production electrical companies', 'Electrical rental'],
  true, true, 4
);

-- ============================================================================
-- SITE UTILITIES - Water Services
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  capacity,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-services'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'water-services'),
  'Water Tank (500 gallon)',
  'water-tank-500gal',
  '500-gallon potable water tank',
  'Food-grade plastic water tank with spigot, stackable',
  'each',
  ARRAY['Water Tank', 'Storage Tank', 'Water Container'],
  ARRAY['water', 'tank', 'storage', '500', 'gallon', 'potable'],
  ARRAY['water', 'utilities', 'storage'],
  '500 gallons',
  2, '$50-100 per day', '1 week', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-services'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'water-services'),
  'Water Hose (100 ft)',
  'water-hose-100ft',
  '100-foot garden hose',
  'Heavy-duty garden hose with brass fittings, drinking water safe',
  'each',
  ARRAY['Garden Hose', 'Water Hose', 'Hose'],
  ARRAY['hose', 'water', 'garden', '100', 'feet'],
  ARRAY['water', 'utilities', 'hose'],
  NULL,
  10, '$8-15 per day', '3 days', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-services'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'water-services'),
  'Portable Hand Wash Station',
  'portable-hand-wash-station',
  'Self-contained hand washing station',
  'Portable sink with fresh and waste water tanks, foot pump operation',
  'each',
  ARRAY['Hand Wash', 'Portable Sink', 'Wash Station'],
  ARRAY['hand', 'wash', 'sink', 'portable', 'hygiene'],
  ARRAY['water', 'hygiene', 'utilities'],
  '5 gallon fresh, 6 gallon waste',
  6, '$25-50 per day', '3 days', true, true, 3
);

COMMIT;
