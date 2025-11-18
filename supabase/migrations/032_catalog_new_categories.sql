-- ============================================================================
-- CATALOG ITEMS - NEW CATEGORIES
-- Staffing, Medical, Insurance, Marketing, Merchandise, Ticketing, Sponsorship, Sustainability
-- ============================================================================

BEGIN;

-- ============================================================================
-- STAFFING & PERSONNEL - Production Staff
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'production-staff'),
  'Stage Manager',
  'stage-manager',
  'Experienced stage manager for event coordination',
  'day',
  ARRAY['SM', 'Production Manager', 'Show Caller'],
  ARRAY['stage', 'manager', 'production', 'coordinator', 'show caller'],
  ARRAY['staffing', 'production', 'management'],
  2, '$400-800 per day', '2 weeks', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'production-staff'),
  'Rigger (Certified)',
  'rigger-certified',
  'Certified rigging professional',
  'day',
  ARRAY['Rigging Tech', 'Arena Rigger', 'Certified Rigger'],
  ARRAY['rigger', 'rigging', 'certified', 'arena', 'tech'],
  ARRAY['staffing', 'rigging', 'technical'],
  4, '$350-600 per day', '2 weeks', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'production-staff'),
  'Loader/Stagehand',
  'loader-stagehand',
  'General labor for load-in/load-out',
  'day',
  ARRAY['Stagehand', 'Loader', 'Labor', 'Crew'],
  ARRAY['loader', 'stagehand', 'labor', 'crew', 'load in'],
  ARRAY['staffing', 'labor', 'production'],
  20, '$200-350 per day', '1 week', true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'production-staff'),
  'Production Runner',
  'production-runner',
  'Production assistant and runner',
  'day',
  ARRAY['Runner', 'PA', 'Production Assistant'],
  ARRAY['runner', 'pa', 'production assistant', 'gopher'],
  ARRAY['staffing', 'production', 'assistant'],
  5, '$150-250 per day', '1 week', true, true, 4
);

-- ============================================================================
-- STAFFING & PERSONNEL - Technical Staff
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'technical-staff'),
  'Audio Engineer (A1)',
  'audio-engineer-a1',
  'Lead audio engineer for FOH or monitors',
  'day',
  ARRAY['A1', 'FOH Engineer', 'Monitor Engineer', 'Sound Engineer'],
  ARRAY['audio', 'engineer', 'a1', 'foh', 'monitor', 'sound'],
  ARRAY['staffing', 'audio', 'technical'],
  2, '$400-800 per day', '2 weeks', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'technical-staff'),
  'Lighting Designer',
  'lighting-designer',
  'Professional lighting designer',
  'day',
  ARRAY['LD', 'Lighting Director', 'Light Designer'],
  ARRAY['lighting', 'designer', 'ld', 'director', 'lights'],
  ARRAY['staffing', 'lighting', 'design'],
  1, '$500-1000 per day', '3 weeks', true, true, 2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'technical-staff'),
  'Video Engineer',
  'video-engineer',
  'Video systems engineer and operator',
  'day',
  ARRAY['Video Tech', 'Video Operator', 'V1'],
  ARRAY['video', 'engineer', 'operator', 'tech', 'v1'],
  ARRAY['staffing', 'video', 'technical'],
  2, '$350-700 per day', '2 weeks', true, true, 3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'technical-staff'),
  'Lighting Technician',
  'lighting-technician',
  'Lighting crew technician',
  'day',
  ARRAY['Light Tech', 'Lighting Crew', 'Electrician'],
  ARRAY['lighting', 'tech', 'technician', 'crew', 'electrician'],
  ARRAY['staffing', 'lighting', 'technical'],
  6, '$250-450 per day', '1 week', true, true, 4
);

-- ============================================================================
-- MEDICAL & EMERGENCY - Medical Tents
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'medical-tents'),
  'Medical Tent (20x20 ft)',
  'medical-tent-20x20',
  'Fully equipped medical treatment tent',
  '20x20 ft tent with medical equipment, cots, supplies, climate control',
  'each',
  ARRAY['Med Tent', 'First Aid Tent', 'Treatment Tent'],
  ARRAY['medical', 'tent', 'first aid', 'treatment', 'emergency'],
  ARRAY['medical', 'emergency', 'tent'],
  2, '$300-600 per day', '2 weeks', true, true, 1
);

-- ============================================================================
-- MEDICAL & EMERGENCY - Ambulance Services
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'ambulance-services'),
  'Ambulance (BLS)',
  'ambulance-bls',
  'Basic Life Support ambulance with crew',
  'day',
  ARRAY['BLS Ambulance', 'Basic Ambulance', 'Emergency Vehicle'],
  ARRAY['ambulance', 'bls', 'basic', 'emergency', 'medical'],
  ARRAY['medical', 'emergency', 'ambulance'],
  1, '$800-1500 per day', '3 weeks', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'ambulance-services'),
  'Ambulance (ALS)',
  'ambulance-als',
  'Advanced Life Support ambulance with paramedic crew',
  'day',
  ARRAY['ALS Ambulance', 'Advanced Ambulance', 'Paramedic Unit'],
  ARRAY['ambulance', 'als', 'advanced', 'paramedic', 'emergency'],
  ARRAY['medical', 'emergency', 'ambulance', 'als'],
  1, '$1200-2000 per day', '3 weeks', true, true, 2
);

-- ============================================================================
-- INSURANCE & PERMITS - General Liability
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'general-liability'),
  'Event Liability Insurance ($1M)',
  'event-liability-1m',
  'General liability insurance for events, $1M coverage',
  'policy',
  ARRAY['GL Insurance', 'Liability Coverage', 'Event Insurance'],
  ARRAY['insurance', 'liability', 'coverage', 'event', 'gl'],
  ARRAY['insurance', 'liability', 'legal'],
  '$500-2000 per event', '2 weeks', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'general-liability'),
  'Event Liability Insurance ($2M)',
  'event-liability-2m',
  'General liability insurance for events, $2M coverage',
  'policy',
  ARRAY['GL Insurance', 'Liability Coverage', 'Event Insurance'],
  ARRAY['insurance', 'liability', 'coverage', 'event', 'gl', '2m'],
  ARRAY['insurance', 'liability', 'legal'],
  '$800-3000 per event', '2 weeks', true, true, 2
);

-- ============================================================================
-- MARKETING & PROMOTION - Photography
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'photography'),
  'Event Photographer (Professional)',
  'event-photographer-pro',
  'Professional event photographer with equipment',
  'day',
  ARRAY['Photographer', 'Photo Coverage', 'Event Photos'],
  ARRAY['photographer', 'photography', 'event', 'photos', 'coverage'],
  ARRAY['marketing', 'photography', 'content'],
  2, '$500-1500 per day', '2 weeks', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'photography'),
  'Photo Booth',
  'photo-booth',
  'Interactive photo booth with props and printing',
  'day',
  ARRAY['Photobooth', 'Selfie Station', 'Photo Station'],
  ARRAY['photo', 'booth', 'photobooth', 'selfie', 'interactive'],
  ARRAY['marketing', 'photography', 'interactive'],
  3, '$300-800 per day', '1 week', true, true, 2
);

-- ============================================================================
-- MERCHANDISE & RETAIL - POS Systems
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'pos-systems'),
  'Mobile POS Terminal',
  'mobile-pos-terminal',
  'Wireless POS terminal for merchandise sales',
  'Mobile card reader with receipt printer, accepts all payment types',
  'each',
  ARRAY['POS', 'Card Reader', 'Payment Terminal', 'Square'],
  ARRAY['pos', 'terminal', 'payment', 'card', 'reader', 'mobile'],
  ARRAY['retail', 'pos', 'payment'],
  10, '$50-150 per day', '1 week', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'pos-systems'),
  'Cash Register',
  'cash-register',
  'Traditional cash register for merchandise sales',
  'Cash drawer with receipt printer, manual or electronic',
  'each',
  ARRAY['Register', 'Cash Drawer', 'Till'],
  ARRAY['cash', 'register', 'drawer', 'till', 'payment'],
  ARRAY['retail', 'pos', 'cash'],
  5, '$30-80 per day', '3 days', true, true, 2
);

-- ============================================================================
-- TICKETING & BOX OFFICE - Ticketing Platforms
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'ticketing-platforms'),
  'Online Ticketing Platform',
  'online-ticketing-platform',
  'Full-service online ticketing and registration platform',
  'event',
  ARRAY['Ticketing System', 'Online Tickets', 'Registration Platform'],
  ARRAY['ticketing', 'online', 'platform', 'registration', 'sales'],
  ARRAY['ticketing', 'online', 'sales'],
  '$500-5000 + % per ticket', '2 weeks', true, true, 1
);

-- ============================================================================
-- TICKETING & BOX OFFICE - Box Office Equipment
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'box-office-equipment'),
  'Ticket Printer (Thermal)',
  'ticket-printer-thermal',
  'Thermal ticket printer for box office',
  'High-speed thermal printer for tickets and wristbands',
  'each',
  ARRAY['Printer', 'Ticket Machine', 'Thermal Printer'],
  ARRAY['ticket', 'printer', 'thermal', 'box office', 'printing'],
  ARRAY['ticketing', 'equipment', 'printing'],
  4, '$50-150 per day', '1 week', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'box-office-equipment'),
  'Barcode Scanner (Handheld)',
  'barcode-scanner-handheld',
  'Handheld barcode scanner for ticket validation',
  'Wireless barcode scanner, reads 1D and 2D codes',
  'each',
  ARRAY['Scanner', 'Barcode Reader', 'Ticket Scanner'],
  ARRAY['barcode', 'scanner', 'reader', 'ticket', 'validation'],
  ARRAY['ticketing', 'equipment', 'scanning'],
  10, '$30-80 per day', '3 days', true, true, 2
);

-- ============================================================================
-- WASTE & SUSTAINABILITY - Waste Management
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'waste-management'),
  'Dumpster (10 yard)',
  'dumpster-10-yard',
  '10-yard roll-off dumpster for waste collection',
  'Standard waste dumpster with pickup and disposal service',
  'each',
  ARRAY['Dumpster', 'Roll-Off', 'Waste Container', 'Trash Bin'],
  ARRAY['dumpster', 'waste', 'trash', 'roll-off', '10 yard'],
  ARRAY['waste', 'disposal', 'sustainability'],
  5, '$200-400 per week', '1 week', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'waste-management'),
  'Trash Can (32 gallon)',
  'trash-can-32-gallon',
  '32-gallon outdoor trash receptacle',
  'Heavy-duty plastic trash can with lid and wheels',
  'each',
  ARRAY['Trash Can', 'Garbage Can', 'Waste Bin'],
  ARRAY['trash', 'can', 'garbage', 'waste', 'bin', '32'],
  ARRAY['waste', 'disposal', 'receptacle'],
  50, '$5-15 per day', '3 days', true, true, 2
);

-- ============================================================================
-- WASTE & SUSTAINABILITY - Recycling Programs
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'recycling-programs'),
  'Recycling Bin (Dual Stream)',
  'recycling-bin-dual-stream',
  'Dual-stream recycling bin for paper and containers',
  'Color-coded recycling bin with separate compartments',
  'each',
  ARRAY['Recycle Bin', 'Recycling Container', 'Dual Stream'],
  ARRAY['recycling', 'bin', 'container', 'dual', 'stream', 'eco'],
  ARRAY['recycling', 'sustainability', 'waste'],
  30, '$8-20 per day', '3 days', true, true, 1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'recycling-programs'),
  'Compost Bin (Commercial)',
  'compost-bin-commercial',
  'Commercial compost collection bin',
  'Large compost bin for organic waste collection',
  'each',
  ARRAY['Compost', 'Organic Waste', 'Green Bin'],
  ARRAY['compost', 'organic', 'waste', 'bin', 'green', 'eco'],
  ARRAY['composting', 'sustainability', 'waste'],
  20, '$10-25 per day', '3 days', true, true, 2
);

COMMIT;
