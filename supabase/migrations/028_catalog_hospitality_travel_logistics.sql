-- ============================================================================
-- CATALOG ITEMS - HOSPITALITY, TRAVEL, SITE VEHICLES, LOGISTICS
-- Comprehensive coverage of remaining categories
-- ============================================================================

BEGIN;

-- ============================================================================
-- HOSPITALITY - CATERING
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'catering'),
  'Full Breakfast Catering',
  'full-breakfast-catering',
  'Complete breakfast service with hot and cold options',
  'Continental and hot breakfast buffet including eggs, bacon, sausage, pastries, fruit, coffee, juice. Includes setup, service, and cleanup.',
  'person',
  ARRAY['Morning Catering', 'Breakfast Service', 'AM Meal', 'Morning Meal'],
  ARRAY['breakfast', 'morning', 'meal', 'catering', 'food', 'am', 'buffet'],
  ARRAY['meal', 'catering', 'morning', 'breakfast', 'food service'],
  50,
  '$15-25 per person',
  '1 week',
  ARRAY['Local caterers', 'Aramark', 'Sodexo'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'catering'),
  'Boxed Lunch',
  'boxed-lunch',
  'Individual boxed lunch with sandwich, sides, and drink',
  'Pre-packaged individual lunch box with choice of sandwich, chips, fruit, cookie, and bottled beverage. Dietary options available.',
  'person',
  ARRAY['Box Lunch', 'Packed Lunch', 'Lunch Box', 'Grab and Go'],
  ARRAY['lunch', 'box', 'meal', 'sandwich', 'midday', 'boxed', 'portable'],
  ARRAY['meal', 'portable', 'lunch', 'food service'],
  100,
  '$12-18 per person',
  '1 week',
  ARRAY['Local caterers', 'Aramark', 'Sodexo'],
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'catering'),
  'Dinner Buffet',
  'dinner-buffet',
  'Full dinner buffet with multiple entrees and sides',
  'Hot dinner buffet with 2-3 protein options, sides, salad, bread, and dessert. Includes chafing dishes, service, and cleanup.',
  'person',
  ARRAY['Dinner Service', 'Evening Meal', 'Dinner Catering', 'Hot Buffet'],
  ARRAY['dinner', 'buffet', 'meal', 'evening', 'catering', 'hot', 'food'],
  ARRAY['meal', 'catering', 'dinner', 'evening', 'food service'],
  75,
  '$25-40 per person',
  '1 week',
  ARRAY['Local caterers', 'Aramark', 'Sodexo'],
  true,
  true,
  3
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'catering'),
  'Coffee Service (Continuous)',
  'coffee-service-continuous',
  'Continuous coffee and beverage service',
  'All-day coffee, tea, and hot water service with cups, condiments, and attendant.',
  'person',
  ARRAY['Coffee Station', 'Beverage Service', 'Coffee Bar'],
  ARRAY['coffee', 'service', 'beverage', 'tea', 'drinks', 'station'],
  ARRAY['beverage', 'coffee', 'service'],
  50,
  '$3-6 per person',
  '3 days',
  ARRAY['Local caterers', 'Coffee services'],
  true,
  true,
  4
);

-- ============================================================================
-- HOSPITALITY - BEVERAGE SERVICES
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'beverage-services'),
  'Bar Service (Full)',
  'bar-service-full',
  'Full bar service with bartender and alcohol',
  'Complete bar setup with beer, wine, spirits, mixers, bartender, and bar equipment.',
  'person',
  ARRAY['Open Bar', 'Full Bar', 'Hosted Bar', 'Alcohol Service'],
  ARRAY['bar', 'alcohol', 'drinks', 'bartender', 'full', 'open'],
  ARRAY['beverage', 'bar', 'alcohol'],
  100,
  '$15-30 per person',
  '2 weeks',
  ARRAY['Bar service companies', 'Catering companies'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'hospitality'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'beverage-services'),
  'Water Station',
  'water-station',
  'Self-serve water station with cups',
  'Water cooler or dispenser with cups, ice, and refills.',
  'station',
  ARRAY['Water Cooler', 'Hydration Station', 'Water Dispenser'],
  ARRAY['water', 'station', 'cooler', 'hydration', 'dispenser'],
  ARRAY['beverage', 'water', 'hydration'],
  10,
  '$25-50 per day',
  '3 days',
  ARRAY['Event rental', 'Catering companies'],
  true,
  true,
  2
);

-- ============================================================================
-- TRAVEL & LODGING - GROUND TRANSPORT
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  capacity,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'ground-transport'),
  'Charter Bus (56 passenger)',
  'charter-bus-56-passenger',
  'Full-size charter bus with driver',
  'Luxury charter bus with restroom, WiFi, power outlets, reclining seats.',
  'day',
  ARRAY['Tour Bus', 'Coach Bus', 'Motor Coach', 'Charter Coach'],
  ARRAY['bus', 'charter', 'coach', '56', 'passenger', 'transport'],
  ARRAY['transport', 'bus', 'charter', 'group'],
  '56 passengers',
  3,
  '$800-1500 per day',
  '2 weeks',
  ARRAY['Charter bus companies', 'Ground transportation'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'ground-transport'),
  'Shuttle Van (15 passenger)',
  'shuttle-van-15-passenger',
  '15-passenger shuttle van with driver',
  'Passenger van with comfortable seating and luggage space.',
  'day',
  ARRAY['Passenger Van', 'Shuttle', '15-Seater', 'Van Service'],
  ARRAY['van', 'shuttle', '15', 'passenger', 'transport'],
  ARRAY['transport', 'van', 'shuttle'],
  '15 passengers',
  5,
  '$300-600 per day',
  '1 week',
  ARRAY['Shuttle companies', 'Ground transportation'],
  true,
  true,
  2
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'ground-transport'),
  'Black Car Service (Sedan)',
  'black-car-sedan',
  'Executive sedan with professional driver',
  'Luxury sedan for VIP transport, professional driver, 3-4 passengers.',
  'hour',
  ARRAY['Executive Car', 'Town Car', 'Sedan Service', 'VIP Transport'],
  ARRAY['sedan', 'car', 'executive', 'vip', 'black car', 'driver'],
  ARRAY['transport', 'vip', 'executive', 'car'],
  '3-4 passengers',
  4,
  '$75-150 per hour',
  '1 week',
  ARRAY['Car service companies', 'Uber Black', 'Lyft Lux'],
  true,
  true,
  3
);

-- ============================================================================
-- TRAVEL & LODGING - HOTELS
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'hotels'),
  'Hotel Room Block (Standard)',
  'hotel-room-block-standard',
  'Block of standard hotel rooms',
  'night',
  ARRAY['Hotel Rooms', 'Room Block', 'Accommodation', 'Lodging'],
  ARRAY['hotel', 'room', 'block', 'accommodation', 'lodging', 'standard'],
  ARRAY['lodging', 'hotel', 'accommodation'],
  '$100-200 per room/night',
  '4 weeks',
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'travel-lodging'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'hotels'),
  'Hotel Suite (Executive)',
  'hotel-suite-executive',
  'Executive or VIP hotel suite',
  'night',
  ARRAY['Suite', 'Executive Suite', 'VIP Suite', 'Luxury Room'],
  ARRAY['hotel', 'suite', 'executive', 'vip', 'luxury'],
  ARRAY['lodging', 'hotel', 'vip', 'suite'],
  '$250-500 per night',
  '4 weeks',
  true,
  true,
  2
);

-- ============================================================================
-- SITE VEHICLES - GOLF CARTS
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  capacity,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'golf-carts'),
  'Golf Cart (4-passenger)',
  'golf-cart-4-passenger',
  'Electric golf cart for site transport',
  'Electric 4-passenger golf cart with lights and horn.',
  'each',
  ARRAY['Golf Cart', 'Cart', 'Electric Cart', '4-Seater'],
  ARRAY['golf', 'cart', 'electric', '4', 'passenger', 'transport'],
  ARRAY['vehicle', 'golf cart', 'transport'],
  '4 passengers',
  10,
  '$75-150 per day',
  '1 week',
  ARRAY['Golf cart rental', 'Event rental companies'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'golf-carts'),
  'Golf Cart (6-passenger)',
  'golf-cart-6-passenger',
  'Extended electric golf cart',
  'Electric 6-passenger golf cart with lights and horn.',
  'each',
  ARRAY['Golf Cart', 'Cart', 'Electric Cart', '6-Seater', 'Stretch Cart'],
  ARRAY['golf', 'cart', 'electric', '6', 'passenger', 'transport', 'stretch'],
  ARRAY['vehicle', 'golf cart', 'transport'],
  '6 passengers',
  6,
  '$100-200 per day',
  '1 week',
  ARRAY['Golf cart rental', 'Event rental companies'],
  true,
  true,
  2
);

-- ============================================================================
-- SITE VEHICLES - UTILITY VEHICLES
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  make, model, capacity,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'utility-vehicles'),
  'UTV (Side-by-Side)',
  'utv-side-by-side',
  'Utility terrain vehicle for rough terrain',
  'Gas or electric UTV with cargo bed, 2-4 passengers, 4WD.',
  'each',
  ARRAY['UTV', 'Side-by-Side', 'Utility Vehicle', 'ATV'],
  ARRAY['utv', 'side-by-side', 'utility', 'vehicle', 'terrain', '4wd'],
  ARRAY['vehicle', 'utv', 'utility', 'terrain'],
  'Polaris',
  'Ranger',
  '1000 lbs cargo',
  4,
  '$150-300 per day',
  '1 week',
  ARRAY['Equipment rental', 'Powersports rental'],
  true,
  true,
  1
);

-- ============================================================================
-- SITE VEHICLES - CARGO TRUCKS
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description, specifications,
  standard_unit, alternate_names, search_terms, tags,
  capacity,
  typical_quantity, estimated_cost, lead_time,
  common_vendors, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'cargo-trucks'),
  'Box Truck (16 ft)',
  'box-truck-16ft',
  '16-foot box truck with liftgate',
  'Box truck with hydraulic liftgate, 16ft cargo area.',
  'day',
  ARRAY['Box Truck', 'Cube Truck', 'Moving Truck', '16ft Truck'],
  ARRAY['box', 'truck', 'cargo', '16', 'feet', 'liftgate', 'moving'],
  ARRAY['vehicle', 'truck', 'cargo', 'logistics'],
  '10,000 lbs',
  3,
  '$100-200 per day',
  '1 week',
  ARRAY['U-Haul', 'Penske', 'Budget Truck'],
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'site-vehicles'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'cargo-trucks'),
  'Box Truck (26 ft)',
  'box-truck-26ft',
  '26-foot box truck with liftgate',
  'Large box truck with hydraulic liftgate, 26ft cargo area.',
  'day',
  ARRAY['Box Truck', 'Cube Truck', 'Moving Truck', '26ft Truck'],
  ARRAY['box', 'truck', 'cargo', '26', 'feet', 'liftgate', 'moving'],
  ARRAY['vehicle', 'truck', 'cargo', 'logistics'],
  '20,000 lbs',
  2,
  '$150-300 per day',
  '1 week',
  ARRAY['U-Haul', 'Penske', 'Budget Truck'],
  true,
  true,
  2
);

-- ============================================================================
-- LOGISTICS - FREIGHT SERVICES
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'logistics'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'freight-services'),
  'LTL Freight Shipping',
  'ltl-freight-shipping',
  'Less-than-truckload freight shipping',
  'shipment',
  ARRAY['LTL', 'Freight', 'Shipping', 'Less Than Truckload'],
  ARRAY['ltl', 'freight', 'shipping', 'less than truckload', 'cargo'],
  ARRAY['logistics', 'freight', 'shipping'],
  '$200-1000 per shipment',
  '1 week',
  true,
  true,
  1
),
(
  (SELECT id FROM catalog_categories WHERE slug = 'logistics'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'freight-services'),
  'FTL Freight Shipping',
  'ftl-freight-shipping',
  'Full truckload freight shipping',
  'shipment',
  ARRAY['FTL', 'Full Truckload', 'Dedicated Truck', 'Freight'],
  ARRAY['ftl', 'freight', 'full truckload', 'dedicated', 'shipping'],
  ARRAY['logistics', 'freight', 'shipping'],
  '$1500-5000 per load',
  '1 week',
  true,
  true,
  2
);

-- ============================================================================
-- LOGISTICS - WAREHOUSING
-- ============================================================================

INSERT INTO catalog_items (
  category_id, subcategory_id, name, slug, description,
  standard_unit, alternate_names, search_terms, tags,
  estimated_cost, lead_time, is_global, active, "order"
) VALUES
(
  (SELECT id FROM catalog_categories WHERE slug = 'logistics'),
  (SELECT id FROM catalog_subcategories WHERE slug = 'warehousing'),
  'Warehouse Storage (Pallet)',
  'warehouse-storage-pallet',
  'Warehouse pallet storage space',
  'month',
  ARRAY['Storage', 'Warehouse', 'Pallet Storage', 'Inventory Storage'],
  ARRAY['warehouse', 'storage', 'pallet', 'inventory', 'space'],
  ARRAY['logistics', 'warehousing', 'storage'],
  '$50-150 per pallet/month',
  '1 week',
  true,
  true,
  1
);

COMMIT;
