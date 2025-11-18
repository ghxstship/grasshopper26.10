# Global Catalog System Implementation

## Overview

Comprehensive production advancing catalog system with normalized data structure, inspired by U-Line's hierarchical organization. Enables granular permission management at organization, project, and team levels.

## Database Schema

### Core Models

#### CatalogCategory
- Hierarchical top-level categories (10 main categories)
- Fields: name, slug, description, icon, order, active

#### CatalogSubcategory
- Secondary categorization within each category
- 5 subcategories per category (50 total)
- Fields: category_id, name, slug, description, order, active

#### CatalogItem
- Individual catalog items with comprehensive metadata
- **Universal Fields:**
  - name, slug, description, specifications
  - standardUnit (each, hour, day, person, lb, ft, etc.)
  - alternateNames[] (for fuzzy searching)
  - searchTerms[], tags[]
  
- **Contextual Fields (optional):**
  - make, model, dimensions, weight
  - material, color, capacity
  - powerRequirements
  
- **Pricing & Availability:**
  - typicalQuantity, estimatedCost
  - requiresCertification, requiresInsurance
  - leadTime, seasonalAvailability[]
  - commonVendors[]
  
- **Relationships:**
  - accessories (JSON array of related item IDs)
  - relatedItems (JSON array of related item IDs)
  
- **Management:**
  - isGlobal (true for global catalog, false for org-specific)
  - organizationId (null for global items)

### Permission Management Models

#### OrganizationCatalogToggle
- Enable/disable catalog items per organization
- Override item name and cost for specific org
- Fields: organizationId, catalogItemId, enabled, customName, customCost, notes

#### ProjectCatalogToggle
- Enable/disable catalog items per project
- Project-specific customization
- Fields: projectId, catalogItemId, enabled, customName, customCost, notes

#### TeamCatalogToggle
- Enable/disable catalog items per team
- Team-specific access control
- Fields: teamId, catalogItemId, enabled, customName, customCost, notes

## Catalog Categories (18 Total)

### 1. Access & Credentials (11 subcategories)
- Build & Strike Credentials
- Day of Show Credentials
- Zone Credentials
- Vehicle Credentials
- Secondary Credentials
- Digital Credentials
- Parking Passes
- Endorsements
- Wristbands
- Lanyards & Holders
- Access Control Systems

### 2. Site Infrastructure (9 subcategories)
- Trailers
- Containers
- Staging
- Fencing
- Tenting
- Flooring
- Sanitation
- Signage & Wayfinding
- Accessibility

### 3. Site Assets (8 subcategories)
- Furniture
- Tools & Equipment
- Safety Equipment
- Supplies
- Crowd Control
- Communications Equipment
- Office Equipment
- Signage Materials

### 4. Site Services (8 subcategories)
- Power Distribution
- Water Services
- HVAC
- IT & Connectivity
- Printing
- Security
- Cleaning Services
- Pest Control

### 5. Site Vehicles (5 subcategories)
- Golf Carts
- Utility Vehicles
- Cargo Trucks
- Trailers
- Vehicle Accessories

### 6. Heavy Equipment (18 subcategories)
- Scissor Lifts
- Boom Lifts
- Vertical Lifts
- Forklifts
- Telehandlers
- Skid Steers
- Cranes
- Excavators
- Loaders
- Dozers
- Compaction Equipment
- Generators
- Light Towers
- Air Compressors
- Welders
- Pumps
- Rigging Equipment
- Equipment Attachments

### 7. Technical Production (12 subcategories)
- Audio
- Lighting
- Video
- Broadcast
- Control Systems
- Backline
- Special FX
- Decking & Risers
- Production Comms
- Show Power
- Truss & Rigging
- Scenic Elements

### 8. Hospitality (8 subcategories)
- Catering
- Green Rooms
- Dressing Rooms
- Amenities
- Beverage Services
- Meal Services
- Special Dietary
- VIP Services

### 9. Staffing & Personnel (8 subcategories)
- Production Staff
- Technical Staff
- Security Personnel
- Medical Staff
- Hospitality Staff
- Administrative Staff
- Specialty Personnel
- Volunteer Management

### 10. Medical & Emergency (6 subcategories)
- Medical Tents
- Ambulance Services
- AED & Emergency Equipment
- Medical Supplies
- Emergency Response Teams
- Fire Safety

### 11. Insurance & Permits (9 subcategories)
- General Liability
- Equipment Insurance
- Cancellation Insurance
- Venue Permits
- Alcohol Licenses
- Pyro Permits
- Drone Permits
- COI Management
- Bonding

### 12. Marketing & Promotion (9 subcategories)
- Print Advertising
- Digital Advertising
- Radio & TV
- Social Media
- Promotional Materials
- Photography
- Videography
- PR & Media Relations
- Influencer Marketing

### 13. Merchandise & Retail (6 subcategories)
- Merchandise Production
- POS Systems
- Retail Fixtures
- Inventory Management
- Cash Handling
- E-commerce

### 14. Ticketing & Box Office (6 subcategories)
- Ticketing Platforms
- Box Office Equipment
- Will Call Services
- Ticket Scanning
- Access Control Integration
- Mobile Ticketing

### 15. Sponsorship & Branding (6 subcategories)
- Sponsor Activations
- Branded Environments
- Experiential Marketing
- Brand Collateral
- Sponsor Hospitality
- Brand Ambassadors

### 16. Travel & Lodging (11 subcategories)
- Flights
- Trains
- Ground Transport
- Hotels
- Short-term Rentals
- RVs & Motorhomes
- Campsites
- Per Diem
- Travel Insurance
- Visa Services
- Airport Services

### 17. Logistics (9 subcategories)
- Freight Services
- Equipment Transport
- Warehousing
- Customs & Carnet
- Last Mile Delivery
- Cross-Docking
- Inventory Management
- Asset Tracking
- Packing & Crating

### 18. Waste & Sustainability (8 subcategories)
- Waste Management
- Recycling Programs
- Composting Services
- Waste Audits
- Carbon Offsetting
- Sustainable Materials
- Water Conservation
- Green Certifications

## Migration Files

### 026_global_catalog_seed.sql (UPDATED)
- Creates all 18 catalog categories
- Creates 150+ subcategories
- Establishes comprehensive hierarchical structure
- Includes new categories: Staffing, Medical, Insurance, Marketing, Merchandise, Ticketing, Sponsorship, Sustainability

### 027_catalog_items_seed.sql (Initial Sample)
- Technical Production items (Audio, Lighting)
- Heavy Equipment items (Lifts, Generators)
- Sample items with full metadata

### 028_catalog_items_hospitality_transport.sql (Initial Sample)
- Hospitality items (Catering, Services)
- Travel & Lodging items (Vehicles, Hotels)
- Site Assets items (Furniture, Equipment)
- Site Vehicles items (Carts, Forklifts)

### 029_catalog_access_infrastructure.sql (REORGANIZED & EXPANDED)
- **Access & Credentials:** 17 items across new subcategories
  - Build & Strike Credentials (3 items)
  - Day of Show Credentials (4 items)
  - Zone Credentials (4 items)
  - Vehicle Credentials (4 items)
  - Parking Passes (2 items)
- **Site Infrastructure:** 13 items across new subcategories
  - Trailers (3 items: office, star, wardrobe)
  - Containers (2 items: storage, office)
  - Staging (4 items: decks, risers, stairs, skirting)
  - Fencing (3 items: chain link, privacy, plastic barriers)

### 030_catalog_site_assets_utilities.sql (REORGANIZED & EXPANDED)
- **Site Assets:** 19 items across new subcategories
  - Furniture (5 items: round tables, cocktail tables, chiavari, lounge, director chairs)
  - Safety Equipment (6 items: hard hats, vests, gloves, glasses, first aid, fire extinguishers)
  - Tools & Equipment (4 items: tool kits, drills, extension ladders, step ladders)
- **Site Services:** 7 items (renamed from Site Utilities)
  - Power Distribution (4 items: distro boxes, spider boxes, extension cables, cam-lok)
  - Water Services (3 items: tanks, hoses, hand wash stations)

### 031_catalog_technical_video_rigging.sql (Comprehensive Expansion)
- **Technical Production - Video:** 5 items
  - LED video walls, projectors, screens, cameras, switchers
- **Technical Production - Broadcast:** 3 items
  - Streaming encoders, wireless video, teleprompters
- **Technical Production - Control Systems:** 4 items
  - Lighting consoles, DMX splitters, network switches, wireless DMX
- **Heavy Equipment - Rigging:** 5 items
  - Chain hoists, truss, shackles, spansets, ground support towers

### 032_catalog_new_categories.sql (NEW CATEGORIES)
- **Staffing & Personnel:** 8 items
  - Production Staff (4 items: stage manager, rigger, loader, runner)
  - Technical Staff (4 items: audio engineer, lighting designer, video engineer, lighting tech)
- **Medical & Emergency:** 3 items
  - Medical Tents (1 item)
  - Ambulance Services (2 items: BLS, ALS)
- **Insurance & Permits:** 2 items
  - General Liability ($1M, $2M coverage)
- **Marketing & Promotion:** 4 items
  - Photography (2 items: photographer, photo booth)
- **Merchandise & Retail:** 2 items
  - POS Systems (mobile terminal, cash register)
- **Ticketing & Box Office:** 3 items
  - Ticketing Platforms (1 item)
  - Box Office Equipment (2 items: printer, scanner)
- **Waste & Sustainability:** 4 items
  - Waste Management (2 items: dumpster, trash cans)
  - Recycling Programs (2 items: recycling bins, compost bins)

### 033_catalog_heavy_equipment.sql (COMPREHENSIVE HEAVY EQUIPMENT)
- **Scissor Lifts:** 3 items (19ft, 26ft, 32ft)
- **Boom Lifts:** 2 items (45ft articulating, 60ft telescopic)
- **Forklifts:** 2 items (5000lb, 8000lb capacity)
- **Generators:** 3 items (20kW, 60kW, 100kW)
- **Light Towers:** 2 items (metal halide, LED solar)
- **Rigging Equipment:** 6 items (chain hoists, truss, shackles, spansets, towers)

**Total Items Across All Migrations: 150+ comprehensive catalog items**

## Catalog Statistics

- **18 Categories**
- **150+ Subcategories**
- **150+ Catalog Items**
- **7 Migration Files**

### Coverage by Category
- ✅ Access & Credentials: 17 items
- ✅ Site Infrastructure: 13 items
- ✅ Site Assets: 19 items
- ✅ Site Services: 7 items
- ✅ Technical Production: 30+ items (Audio, Lighting, Backline, FX, Comms)
- ✅ Heavy Equipment: 18 items (Lifts, Forklifts, Generators, Rigging)
- ✅ Staffing & Personnel: 8 items
- ✅ Medical & Emergency: 3 items
- ✅ Insurance & Permits: 2 items
- ✅ Marketing & Promotion: 4 items
- ✅ Merchandise & Retail: 2 items
- ✅ Ticketing & Box Office: 3 items
- ✅ Waste & Sustainability: 4 items
- ⏳ Hospitality: Sample items in migration 028
- ⏳ Travel & Lodging: Sample items in migration 028
- ⏳ Site Vehicles: Sample items in migration 028
- ⏳ Logistics: Ready for expansion
- ⏳ Sponsorship & Branding: Ready for expansion

## Sample Catalog Items

### Technical Production - Audio
1. **Line Array Speaker System** - L-Acoustics K2
   - $2000-5000/day, requires certification & insurance
   - 2-week lead time
   
2. **Subwoofer (18" Powered)** - Meyer Sound 1100-LFC
   - $150-300/day, requires insurance
   - 1-week lead time
   
3. **Digital Mixing Console** - DiGiCo SD12
   - $300-800/day, requires certification
   - 2-week lead time

### Heavy Equipment
1. **Scissor Lift (26ft)** - Genie GS-2632
   - $150-250/day, requires certification & insurance
   
2. **Boom Lift (45ft)** - JLG 450AJ
   - $300-500/day, requires certification & insurance
   
3. **Generator (100kW)** - Caterpillar XQ100
   - $400-700/day, requires certification & insurance

### Hospitality - Catering
1. **Full Breakfast Catering** - $15-25/person
2. **Boxed Lunch** - $12-18/person
3. **Dinner Buffet** - $25-40/person
4. **Coffee Service** - $3-6/person

## Usage Workflow

### In ATLVS (Organization Management)
1. View global catalog
2. Toggle items on/off for organization
3. Set custom names/costs per organization
4. Configure project-level access
5. Configure team-level access

### In COMPVSS (Production Advancing)
1. Select category for advancing request
2. Browse available items (filtered by org/project/team permissions)
3. Search with fuzzy matching on alternateNames
4. Select items from catalog
5. Submit advancing request with catalog references

## Next Steps

1. **Create Catalog Service** (`src/lib/services/atlvs/catalog.service.ts`)
   - CRUD operations for catalog items
   - Toggle management for org/project/team
   - Search and filtering with fuzzy matching
   
2. **Create ATLVS Catalog Management UI**
   - Category/subcategory browser
   - Item management interface
   - Toggle controls for permissions
   
3. **Integrate with COMPVSS Advancing Forms**
   - Catalog item selector component
   - Category-specific item filtering
   - Add selected items to advancing requests

## Benefits

- **Standardization**: Consistent item naming and specifications
- **Efficiency**: Quick item selection vs manual entry
- **Accuracy**: Reduced errors from standardized data
- **Flexibility**: Organization-specific customization
- **Scalability**: Easy to add new items and categories
- **Searchability**: Fuzzy search with alternate names
- **Relationships**: Link related items and accessories
- **Vendor Management**: Track common vendors per item
