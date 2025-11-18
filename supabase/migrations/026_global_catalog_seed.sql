-- ============================================================================
-- GLOBAL CATALOG SEED MIGRATION
-- Comprehensive production advancing catalog inspired by U-Line
-- ============================================================================

BEGIN;

-- ============================================================================
-- CATALOG CATEGORIES
-- ============================================================================

INSERT INTO catalog_categories (id, name, slug, description, icon, "order", active) VALUES
('cat_access', 'Access & Credentials', 'access-credentials', 'Passes, badges, parking permits, and access control', 'KeyRound', 1, true),
('cat_site_infra', 'Site Infrastructure', 'site-infrastructure', 'Stages, barriers, signage, and structural elements', 'Building2', 2, true),
('cat_site_assets', 'Site Assets', 'site-assets', 'Tables, chairs, tents, and general equipment', 'Boxes', 3, true),
('cat_site_util', 'Site Services', 'site-services', 'Power, water, internet, security, and essential services', 'Zap', 4, true),
('cat_site_vehicles', 'Site Vehicles', 'site-vehicles', 'Carts, forklifts, trucks, and transport', 'Truck', 5, true),
('cat_heavy_equip', 'Heavy Equipment', 'heavy-equipment', 'Cranes, lifts, generators, and machinery', 'Construction', 6, true),
('cat_technical', 'Technical Production', 'technical-production', 'Audio, video, lighting, and AV equipment', 'Radio', 7, true),
('cat_hospitality', 'Hospitality', 'hospitality', 'Catering, green rooms, and guest services', 'UtensilsCrossed', 8, true),
('cat_staffing', 'Staffing & Personnel', 'staffing-personnel', 'Production staff, technical crew, and event personnel', 'Users', 9, true),
('cat_medical', 'Medical & Emergency', 'medical-emergency', 'Medical services, emergency response, and safety', 'HeartPulse', 10, true),
('cat_insurance', 'Insurance & Permits', 'insurance-permits', 'Event insurance, permits, licenses, and compliance', 'ShieldCheck', 11, true),
('cat_marketing', 'Marketing & Promotion', 'marketing-promotion', 'Advertising, PR, social media, and promotional services', 'Megaphone', 12, true),
('cat_merchandise', 'Merchandise & Retail', 'merchandise-retail', 'Merch production, POS systems, and retail services', 'ShoppingBag', 13, true),
('cat_ticketing', 'Ticketing & Box Office', 'ticketing-box-office', 'Ticketing platforms, box office, and access control', 'Ticket', 14, true),
('cat_sponsorship', 'Sponsorship & Branding', 'sponsorship-branding', 'Sponsor activations, branded environments, and experiences', 'Award', 15, true),
('cat_travel', 'Travel & Lodging', 'travel-lodging', 'Transportation, accommodation, and travel services', 'Plane', 16, true),
('cat_logistics', 'Logistics', 'logistics', 'Freight, shipping, and cargo transport', 'Package', 17, true),
('cat_sustainability', 'Waste & Sustainability', 'waste-sustainability', 'Recycling, composting, and environmental services', 'Leaf', 18, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- CATALOG SUBCATEGORIES
-- ============================================================================

-- Access & Credentials
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Build & Strike Credentials', 'build-strike-credentials', 'Load-in and load-out access', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Day of Show Credentials', 'day-of-show-credentials', 'Event day access credentials', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Zone Credentials', 'zone-credentials', 'Area-specific access credentials', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Vehicle Credentials', 'vehicle-credentials', 'Vehicle access and parking', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Secondary Credentials', 'secondary-credentials', 'ADA Section Access, VIP Suite Access, Media Pit Access, Command Center Access, etc.', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Digital Credentials', 'digital-credentials', 'Digital passes and mobile credentials', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Parking Passes', 'parking-passes', 'Vehicle parking permits', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Endorsements', 'endorsements', 'Golf Cart Driver, Heavy Equipment Operator, Professional Camera Operator, Drone Pilot, etc.', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Wristbands', 'wristbands', 'RFID, Tyvek, Fabric wristbands', 9, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Lanyards & Holders', 'lanyards-holders', 'Badge lanyards and credential holders', 10, true),
((SELECT id FROM catalog_categories WHERE slug = 'access-credentials'), 'Access Control Systems', 'access-control-systems', 'Turnstiles, Scanners, RFID Readers', 11, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Site Infrastructure
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Trailers', 'trailers', 'Semi-permanent trailers (office, star, production)', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Containers', 'containers', 'Office & Storage Containers', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Staging', 'staging', 'Stage platforms and risers', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Fencing', 'fencing', 'Crowd control and safety barriers', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Tenting', 'tenting', 'Weather protection structures', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Flooring', 'flooring', 'Temporary flooring and surfaces', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Sanitation', 'sanitation', 'Restroom Units, Shower Units, Handwashing Stations, etc.', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Signage & Wayfinding', 'signage-wayfinding', 'Directional, Informational, Emergency Exit signs', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-infrastructure'), 'Accessibility', 'accessibility', 'ADA Ramps, Accessible Viewing Platforms', 9, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Site Assets
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Furniture', 'furniture', 'Tables, Chairs, etc.', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Tools & Equipment', 'tools-equipment', 'Hand tools and small equipment', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Safety Equipment', 'safety-equipment', 'PPE, basic safety gear, safety supplies', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Supplies', 'supplies', 'Consumables, Zip ties, Gaffe Tape, Ice, Water, etc.', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Crowd Control', 'crowd-control', 'Stanchions, Bike Rack Barricade, etc.', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Communications Equipment', 'communications-equipment', 'Walkie-Talkies, Headsets, Com Systems', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Office Equipment', 'office-equipment', 'Copiers, Printers, Computers, Monitors', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-assets'), 'Signage Materials', 'signage-materials', 'Banners, Flags, A-Frames', 8, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Site Services
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'Power Distribution', 'power-distribution', 'Electrical power and distribution', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'Water Services', 'water-services', 'Water supply and distribution', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'HVAC', 'hvac', 'Heating, ventilation, and cooling', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'IT & Connectivity', 'it-connectivity', 'Internet, Wifi, Network Infrastructure', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'Printing', 'printing', 'Printing services and equipment', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'Security', 'security', 'Security Cameras, Guards, etc.', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'Cleaning Services', 'cleaning-services', 'Janitorial, Event Cleanup, Pressure Washing', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-services'), 'Pest Control', 'pest-control', 'Preventative and Emergency Response', 8, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Site Vehicles
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'), 'Golf Carts', 'golf-carts', 'Electric and gas golf carts', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'), 'Utility Vehicles', 'utility-vehicles', 'UTVs, side-by-sides, and work vehicles', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'), 'Cargo Trucks', 'cargo-trucks', 'Box trucks and cargo vehicles', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'), 'Trailers', 'trailers-vehicles', 'Mobile trailers (utility, cargo, transport)', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'), 'Vehicle Accessories', 'vehicle-accessories', 'Vehicle accessories and attachments', 5, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Heavy Equipment
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Scissor Lifts', 'scissor-lifts', 'Vertical scissor lift platforms', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Boom Lifts', 'boom-lifts', 'Articulating and telescopic lifts', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Vertical Lifts', 'vertical-lifts', 'Personnel and push-around lifts', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Forklifts', 'forklifts', 'Material handling forklifts', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Telehandlers', 'telehandlers', 'Telescopic handlers and reach forklifts', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Skid Steers', 'skid-steers', 'Skid steer loaders and attachments', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Cranes', 'cranes', 'Mobile and tower cranes', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Excavators', 'excavators', 'Mini and standard excavators', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Loaders', 'loaders', 'Wheel loaders and track loaders', 9, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Dozers', 'dozers', 'Bulldozers and track dozers', 10, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Compaction Equipment', 'compaction-equipment', 'Rollers and compactors', 11, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Generators', 'generators', 'Power generation equipment', 12, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Light Towers', 'light-towers', 'Portable lighting towers', 13, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Air Compressors', 'air-compressors', 'Portable air compressors', 14, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Welders', 'welders', 'Welding equipment and machines', 15, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Pumps', 'pumps', 'Water and trash pumps', 16, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Rigging Equipment', 'rigging-equipment', 'Hoists, chains, and rigging', 17, true),
((SELECT id FROM catalog_categories WHERE slug = 'heavy-equipment'), 'Equipment Attachments', 'equipment-attachments', 'Equipment accessories and attachments', 18, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Technical Production
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Audio', 'audio', 'Sound systems and equipment', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Lighting', 'lighting', 'Stage and venue lighting', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Video', 'video', 'Screens, cameras, and video', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Broadcast', 'broadcast', 'Live streaming and broadcast', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Control Systems', 'control-systems', 'DMX, networking, and control', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Backline', 'backline', 'Musical instruments and amplifiers', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Special FX', 'special-fx', 'Pyrotechnics, fog, and effects', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Decking & Risers', 'decking-risers', 'Stage decking and riser platforms', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Production Comms', 'production-comms', 'Clear-Com, Walkie Systems, IFB', 9, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Show Power', 'show-power', 'Distros, Cable, Cam-Lok', 10, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Truss & Rigging', 'truss-rigging', 'Ground Support, Roof Rigging, Chain Motors', 11, true),
((SELECT id FROM catalog_categories WHERE slug = 'technical-production'), 'Scenic Elements', 'scenic-elements', 'Backdrops, Scrims, Projection Surfaces', 12, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Hospitality
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'Catering', 'catering', 'Food and beverage services', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'Green Rooms', 'green-rooms', 'Artist and talent spaces', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'Dressing Rooms', 'dressing-rooms', 'Changing and preparation areas', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'Amenities', 'amenities', 'Guest services and amenities', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'Beverage Services', 'beverage-services', 'Bars, Coffee Stations, Water Stations', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'Meal Services', 'meal-services', 'Breakfast, Lunch, Dinner, Craft Services', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'Special Dietary', 'special-dietary', 'Vegan, Gluten-Free, Kosher, Halal', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'hospitality'), 'VIP Services', 'vip-services', 'Meet & Greet, VIP Lounges, Concierge', 8, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Travel & Lodging
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Flights', 'flights', 'Air travel and flights', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Trains', 'trains', 'Rail transportation', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Ground Transport', 'ground-transport', 'Buses, vans, and shuttles', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Hotels', 'hotels', 'Hotel accommodations', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Short-term Rentals', 'short-term-rentals', 'Airbnb and vacation rentals', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'RVs & Motorhomes', 'rvs-motorhomes', 'Recreational vehicles and motorhomes', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Campsites', 'campsites', 'Camping and campsite accommodations', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Per Diem', 'per-diem', 'Per diem management and tracking', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Travel Insurance', 'travel-insurance', 'Travel and trip insurance', 9, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Visa Services', 'visa-services', 'Visa and immigration services', 10, true),
((SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'), 'Airport Services', 'airport-services', 'Meet & Greet, Fast Track', 11, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Logistics
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Freight Services', 'freight-services', 'Cargo and freight shipping', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Equipment Transport', 'equipment-transport', 'Specialized equipment shipping', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Warehousing', 'warehousing', 'Storage and warehousing', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Customs & Carnet', 'customs-carnet', 'International shipping services', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Last Mile Delivery', 'last-mile-delivery', 'Final delivery services', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Cross-Docking', 'cross-docking', 'Cross-docking and transloading services', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Inventory Management', 'inventory-management', 'Inventory tracking and management', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Asset Tracking', 'asset-tracking', 'GPS and RFID asset tracking', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'logistics'), 'Packing & Crating', 'packing-crating', 'Professional packing and crating services', 9, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Staffing & Personnel
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Production Staff', 'production-staff', 'Stage Managers, Riggers, Loaders, Runners', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Technical Staff', 'technical-staff', 'Audio Engineers, Lighting Techs, Video Operators', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Security Personnel', 'security-personnel', 'Event Security, Crowd Control, K9 Units', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Medical Staff', 'medical-staff', 'EMTs, Paramedics, Nurses', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Hospitality Staff', 'hospitality-staff', 'Catering Staff, Bartenders, Servers', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Administrative Staff', 'administrative-staff', 'Coordinators, Assistants, Office Staff', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Specialty Personnel', 'specialty-personnel', 'Interpreters, Translators, Accessibility Coordinators', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'staffing-personnel'), 'Volunteer Management', 'volunteer-management', 'Volunteer coordination and training', 8, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Medical & Emergency
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'), 'Medical Tents', 'medical-tents', 'Medical tents and treatment stations', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'), 'Ambulance Services', 'ambulance-services', 'On-site ambulance and transport', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'), 'AED & Emergency Equipment', 'aed-emergency-equipment', 'Defibrillators and emergency gear', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'), 'Medical Supplies', 'medical-supplies', 'First aid and medical consumables', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'), 'Emergency Response Teams', 'emergency-response-teams', 'EMT and paramedic teams', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'medical-emergency'), 'Fire Safety', 'fire-safety', 'Fire extinguishers, fire watch, fire marshal, fire suppression', 6, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insurance & Permits
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'General Liability', 'general-liability', 'General liability insurance', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'Equipment Insurance', 'equipment-insurance', 'Equipment and gear insurance', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'Cancellation Insurance', 'cancellation-insurance', 'Event cancellation coverage', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'Venue Permits', 'venue-permits', 'Venue and location permits', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'Alcohol Licenses', 'alcohol-licenses', 'Liquor licenses and permits', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'Pyro Permits', 'pyro-permits', 'Pyrotechnics and special effects permits', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'Drone Permits', 'drone-permits', 'UAV and drone operation permits', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'COI Management', 'coi-management', 'Certificate of Insurance tracking', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'insurance-permits'), 'Bonding', 'bonding', 'Bonding and indemnification', 9, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Marketing & Promotion
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Print Advertising', 'print-advertising', 'Print ads, posters, flyers', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Digital Advertising', 'digital-advertising', 'Online ads, display, programmatic', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Radio & TV', 'radio-tv', 'Broadcast advertising', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Social Media', 'social-media', 'Social media management and ads', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Promotional Materials', 'promotional-materials', 'Merch, swag, promotional items', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Photography', 'photography', 'Event and promotional photography', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Videography', 'videography', 'Video production and content', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'PR & Media Relations', 'pr-media-relations', 'Public relations and press', 8, true),
((SELECT id FROM catalog_categories WHERE slug = 'marketing-promotion'), 'Influencer Marketing', 'influencer-marketing', 'Influencer partnerships and campaigns', 9, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Merchandise & Retail
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'), 'Merchandise Production', 'merchandise-production', 'T-shirts, hats, posters, and merch', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'), 'POS Systems', 'pos-systems', 'Point of sale hardware and software', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'), 'Retail Fixtures', 'retail-fixtures', 'Display cases, racks, and fixtures', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'), 'Inventory Management', 'inventory-management-retail', 'Stock tracking and management', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'), 'Cash Handling', 'cash-handling', 'Cash management and security', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'merchandise-retail'), 'E-commerce', 'e-commerce', 'Online store and fulfillment', 6, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Ticketing & Box Office
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'), 'Ticketing Platforms', 'ticketing-platforms', 'Online ticketing systems', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'), 'Box Office Equipment', 'box-office-equipment', 'Printers, scanners, terminals', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'), 'Will Call Services', 'will-call-services', 'Will call and guest list management', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'), 'Ticket Scanning', 'ticket-scanning', 'Barcode and RFID scanning systems', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'), 'Access Control Integration', 'access-control-integration', 'Turnstile and gate integration', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'ticketing-box-office'), 'Mobile Ticketing', 'mobile-ticketing', 'Mobile and digital ticket delivery', 6, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Sponsorship & Branding
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'sponsorship-branding'), 'Sponsor Activations', 'sponsor-activations', 'Interactive sponsor experiences', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'sponsorship-branding'), 'Branded Environments', 'branded-environments', 'Branded spaces and installations', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'sponsorship-branding'), 'Experiential Marketing', 'experiential-marketing', 'Immersive brand experiences', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'sponsorship-branding'), 'Brand Collateral', 'brand-collateral', 'Signage, banners, and materials', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'sponsorship-branding'), 'Sponsor Hospitality', 'sponsor-hospitality', 'VIP and sponsor entertainment', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'sponsorship-branding'), 'Brand Ambassadors', 'brand-ambassadors', 'Promotional staff and ambassadors', 6, true)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Waste & Sustainability
INSERT INTO catalog_subcategories (category_id, name, slug, description, "order", active) VALUES
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Waste Management', 'waste-management', 'Trash collection and disposal services', 1, true),
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Recycling Programs', 'recycling-programs', 'Recycling collection and processing', 2, true),
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Composting Services', 'composting-services', 'Organic waste composting', 3, true),
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Waste Audits', 'waste-audits', 'Waste stream analysis and reporting', 4, true),
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Carbon Offsetting', 'carbon-offsetting', 'Carbon credit and offset programs', 5, true),
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Sustainable Materials', 'sustainable-materials', 'Eco-friendly and biodegradable products', 6, true),
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Water Conservation', 'water-conservation', 'Water saving and management', 7, true),
((SELECT id FROM catalog_categories WHERE slug = 'waste-sustainability'), 'Green Certifications', 'green-certifications', 'Environmental certification programs', 8, true)
ON CONFLICT (category_id, slug) DO NOTHING;

COMMIT;
