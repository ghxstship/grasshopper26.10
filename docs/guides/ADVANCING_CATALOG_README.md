# ADVANCING CATALOG SYSTEM

## Overview

The Advancing Catalog is a comprehensive, permanent database of all items and services that can be requested through the advancing system. It supports fuzzy search, organization-level customization, and granular control over item availability.

## Architecture

### Global Catalog
- **Permanent Database**: Universal catalog shared across all organizations
- **Comprehensive Coverage**: 500+ items across 19 categories
- **Fuzzy Search**: Multiple search terms and alternate names per item
- **Rich Metadata**: Cost estimates, lead times, certifications, etc.

### Organization Control
- **Toggle System**: Enable/disable global items per organization
- **Custom Items**: Organizations can add their own catalog items
- **Show-Level Defaults**: Pre-configure enabled items per show type
- **Inheritance**: Custom items can reference global items

### Search & Discovery
- **Fuzzy Matching**: Searches across name, alternateNames, searchTerms
- **Category Filtering**: Filter by category and subcategory
- **Tag-Based**: Multi-tag filtering for precise results
- **Related Items**: Automatic suggestions for related items

## Data Structure

### CatalogItem
```typescript
{
  id: string;                    // Unique identifier
  name: string;                  // Display name
  category: string;              // Primary category
  subcategory?: string;          // Optional subcategory
  description: string;           // Full description
  searchTerms: string[];         // For fuzzy search
  alternateNames: string[];      // Common variations
  unit: string;                  // Measurement unit
  typicalQuantity?: number;      // Suggested quantity
  estimatedCost?: string;        // Cost range
  tags: string[];                // Filtering tags
  isGlobal: boolean;             // Global vs custom
  organizationId?: string;       // For custom items
  metadata?: {
    requiresCertification?: boolean;
    requiresInsurance?: boolean;
    leadTime?: string;
    seasonalAvailability?: string[];
    commonVendors?: string[];
    relatedItems?: string[];     // Related item IDs
  };
}
```

## Categories (20 Total - Ordered by Usage Frequency)

1. **Technical** - Audio, lighting, video, backline, staging, decking, rigging, crew
2. **Hospitality** - Catering, meals, beverages
3. **Transportation** - Vehicles, shuttles, cargo
4. **Staffing** - Event staff, volunteers
5. **Security** - Personnel, equipment, monitoring
6. **Site Infrastructure** - Structures, barriers, facilities
7. **Site Utilities** - Power, water, internet, HVAC
8. **Accommodation** - Hotels, lodging
9. **Travel** - Flights, ground transport
10. **Printing** - Signage, graphics, banners, posters
11. **Access** - Credentials, passes, keys
12. **Site Safety** - First aid, PPE, fire safety
13. **Site Assets** - Furniture, storage, supplies
14. **Shipping & Receiving** - Freight, logistics, warehousing
15. **Site Vehicles** - Golf carts, ATVs, trucks
16. **Heavy Equipment** - Lifts, cranes, generators
17. **Permits & Licenses** - Event permits, licenses
18. **Marketing** - Digital, media, advertising
19. **Merchandise** - Apparel, accessories, promotional items
20. **Other** - Custom/miscellaneous

## Sample Items Per Category

### Hospitality (50+ items)
- Full Breakfast Catering
- Boxed Lunch
- Buffet Dinner Service
- Coffee & Tea Station
- Bottled Water
- Soft Drinks
- Energy Drinks
- Snack Boxes
- Vegetarian Meals
- Vegan Meals
- Gluten-Free Options
- Kosher Meals
- Halal Meals

### Technical - Audio (40+ items)
- Line Array Speaker System
- Wireless Microphone System
- Digital Mixing Console
- Subwoofers
- Monitor Speakers
- DI Boxes
- Microphone Stands
- XLR Cables
- Snake Cables
- Headphone Distribution

### Technical - Crew & Management (60+ items)
- Production Manager
- Stage Manager
- Audio Engineer
- Lighting Designer
- Video Engineer
- Rigger
- Stagehand
- Spotlight Operator
- Camera Operator
- Technical Director

### Printing (30+ items)
- Vinyl Banners
- Posters (Various Sizes)
- A-Frame Signs
- Directional Signage
- Wayfinding Graphics
- Stage Backdrops
- Step & Repeat Banners
- Floor Graphics
- Window Clings
- Vehicle Wraps

### Merchandise (40+ items)
- T-Shirts (Various Styles)
- Hoodies
- Hats/Caps
- Tote Bags
- Water Bottles
- Lanyards
- Pins/Buttons
- Stickers
- Posters (Collectible)
- Limited Edition Items

### Shipping & Receiving (25+ items)
- LTL Freight Service
- FTL Freight Service
- International Shipping
- Expedited Shipping
- Receiving Labor
- Dock Services
- Warehousing (Short-term)
- Customs Brokerage
- Crating Services
- Pallet Jack Rental

### Security (30+ items)
- Event Security Guard
- Crowd Control Specialist
- VIP Protection Officer
- K-9 Unit
- Metal Detectors
- X-Ray Machines
- Security Cameras
- Two-Way Radios
- Barricades

### Site Safety (40+ items)
- First Aid Kit (Basic)
- First Aid Kit (Advanced)
- AED (Defibrillator)
- EMT/Paramedic Services
- Hard Hats
- Safety Vests
- Safety Glasses
- Ear Protection
- Fire Extinguishers
- Fire Blankets
- Eye Wash Stations
- Spill Kits

## Usage Examples

### 1. Organization Setup
```typescript
// Enable specific items for organization
const orgSettings = {
  organizationId: "org-123",
  enabledGlobalItems: ["hosp-001", "hosp-002", "trans-001"],
  disabledGlobalItems: ["hosp-003"], // Disable buffet service
  customItems: [
    {
      id: "custom-001",
      name: "Branded Water Bottles",
      category: "hospitality",
      isGlobal: false,
      organizationId: "org-123",
      // ... other fields
    }
  ]
};
```

### 2. Fuzzy Search
```typescript
// Search for "mic" finds:
// - "Wireless Microphone System"
// - "Microphone Stands"
// - "Microphone Cables"
// Via searchTerms: ['microphone', 'mic', 'wireless']
```

### 3. Show-Level Defaults
```typescript
// Pre-configure for "Festival" show type
const festivalDefaults = {
  hospitality: ["hosp-001", "hosp-002", "hosp-004", "hosp-005"],
  security: ["sec-001", "sec-002", "sec-003"],
  site_safety: ["safety-001", "safety-002", "safety-009"]
};
```

## Implementation Status

### ✅ Completed
- Type definitions
- Category structure (19 categories)
- Sample items (100+ across all categories)
- Search interface design

### 🚧 In Progress
- Full catalog population (target: 500+ items)
- Fuzzy search implementation
- Organization settings UI
- Custom item management UI

### 📋 Planned
- Vendor integration
- Cost estimation AI
- Seasonal availability tracking
- Automatic recommendations
- Historical usage analytics

## Database Schema

### Tables
1. `catalog_items` - Global catalog items
2. `organization_catalog_settings` - Org-level toggles
3. `custom_catalog_items` - Organization-specific items
4. `show_catalog_defaults` - Show-type defaults
5. `advancing_requests` - Links to catalog items

### Relationships
- `advancing_requests.catalog_item_id` → `catalog_items.id`
- `custom_catalog_items.organization_id` → `organizations.id`
- `organization_catalog_settings.organization_id` → `organizations.id`

## API Endpoints

```
GET  /api/catalog/items              - List all items
GET  /api/catalog/items/:id          - Get specific item
GET  /api/catalog/search             - Fuzzy search
GET  /api/catalog/categories         - List categories
POST /api/catalog/custom             - Create custom item
PUT  /api/catalog/custom/:id         - Update custom item
GET  /api/catalog/org/:id/settings   - Get org settings
PUT  /api/catalog/org/:id/settings   - Update org settings
GET  /api/catalog/org/:id/enabled    - Get enabled items
```

## Future Enhancements

1. **AI-Powered Recommendations**
   - Suggest items based on event type
   - Learn from historical requests
   - Predict quantities based on attendance

2. **Vendor Marketplace**
   - Link catalog items to approved vendors
   - Real-time pricing and availability
   - Automated RFQ generation

3. **Budget Optimization**
   - Suggest alternatives within budget
   - Bundle discounts
   - Seasonal pricing

4. **Compliance Tracking**
   - Auto-flag items requiring permits
   - Certification expiry tracking
   - Insurance requirement alerts

---

**Built with GHXSTSHIP precision ⚓️**
