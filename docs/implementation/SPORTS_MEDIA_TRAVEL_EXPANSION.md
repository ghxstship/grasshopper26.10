# Sports, Media, and Travel Expansion - Complete

## Overview

Successfully added comprehensive positions from **Sports Entertainment, Media & Broadcasting, and Travel & Tourism** industries, bringing the total organizational catalog to **429 positions** across **11 departments** and **51 teams**.

## Expansion Summary

### Before vs After

| Metric | Before | After | Increase |
|--------|--------|-------|----------|
| **Departments** | 10 | 11 | +1 |
| **Teams** | 43 | 51 | +19% |
| **Positions** | 355 | 429 | **+21%** |
| **Total Items** | 398 | 480 | +21% |

## New Industries Added

### ✅ Sports Entertainment (18 positions)
**Team 8300 - Sports Entertainment**
- Professional Athlete
- Head Coach & Assistant Coach
- Athletic Trainer (Certified)
- Strength & Conditioning Coach
- Sports Psychologist
- Team Physician (MD/DO)
- Physical Therapist (PT License)
- Equipment Manager
- Scout
- Referee/Official (Certified)
- Umpire (Certified)
- Mascot Performer
- Cheerleader & Cheer Coach
- Dance Team Member
- Esports Player & Coach

### ✅ Game Day Operations (10 positions)
**Team 8400 - Game Day Operations**
- Game Day Operations Director
- Game Day Manager & Coordinator
- Stadium Announcer (PA Announcer)
- In-Game Host
- Hype Team Member
- Ball Person
- Bat Boy/Girl
- Ice Crew Member
- Field Crew Member

### ✅ Media & Broadcasting (11 positions)
**Team 2500 - Media & Broadcasting**
- Media Director & Manager
- Broadcast Producer
- Sports Broadcaster (Play-by-Play Announcer)
- Color Commentator
- Sideline Reporter
- Sports Journalist
- Content Creator
- Podcast Producer
- Social Media Producer
- Media Coordinator

### ✅ Sports Marketing (8 positions)
**Team 2600 - Sports Marketing**
- Sports Marketing Director
- Fan Engagement Manager
- Game Day Marketing Manager
- Promotions Manager & Coordinator
- Street Team Coordinator
- Brand Ambassador Coordinator
- Mascot Coordinator

### ✅ Travel & Tourism (25 positions)
**New Department 8500 - Travel & Tourism**

#### Travel Management (7 positions)
- Travel Director & Manager
- Travel Coordinator
- Travel Agent
- Group Travel Specialist
- Corporate Travel Manager
- Travel Consultant

#### Tour Operations (8 positions)
- Tour Director & Manager
- Tour Coordinator
- Tour Guide
- Tour Escort
- Road Manager
- Advance Person
- Tour Accountant

#### Accommodation Services (5 positions)
- Accommodation Manager
- Hotel Liaison
- Housing Coordinator
- Rooming Coordinator
- Venue Liaison

#### Ground Transportation (5 positions)
- Ground Transportation Manager
- Bus Captain
- Tour Bus Driver (CDL)
- Driver Coordinator
- Charter Coordinator

## Enhanced Marketing Department

### Expanded Teams
1. **Marketing Strategy** (7 positions)
2. **Digital Marketing** (9 positions)
3. **Public Relations** (8 positions)
4. **Sponsorship & Partnerships** (8 positions) - *Expanded*
5. **Media & Broadcasting** (11 positions) - *NEW*
6. **Sports Marketing** (8 positions) - *NEW*

### New Positions in Sponsorship
- Activation Manager
- Sponsorship Sales Executive

## Certification Requirements

### New Certifications Added
- **Certified Athletic Trainer** - Athletic Trainer
- **MD/DO** - Team Physician
- **PT License** - Physical Therapist
- **Sport-Specific Certification** - Referee/Official, Umpire

### All Certifications (Updated List)
1. ETCP Rigging - Head Rigger, Rigger
2. CDL - Driver, Tour Bus Driver
3. Licensed Electrician - Electrician
4. Licensed Plumber - Plumber
5. Part 107 - Drone Operator
6. TIPS - Bartender
7. ServSafe - Bartender
8. Food Handler - Server
9. EMT/Paramedic - EMT/Paramedic
10. Certified Athletic Trainer - Athletic Trainer
11. MD/DO - Team Physician
12. PT License - Physical Therapist
13. Sport-Specific Certification - Referee/Official, Umpire

## Department Breakdown

### 0000 - Executive (4 teams, 37 positions)
Finance, Legal, HR, Executive Leadership

### 1000 - Creative (8 teams, 73 positions)
Film/TV Production, Art, Costume, Hair/Makeup

### 2000 - Marketing (6 teams, 51 positions) ⭐ EXPANDED
Strategy, Digital, PR, Sponsorship, **Media & Broadcasting**, **Sports Marketing**

### 3000 - Talent (3 teams, 16 positions)
Booking, Artist Relations, Casting

### 4000 - Production (8 teams, 84 positions)
Audio, Lighting, Video, Broadcast, Post-Production

### 5000 - Operations (5 teams, 37 positions)
Site Ops, Logistics, Transportation, Facilities, Security

### 6000 - Experience (3 teams, 18 positions)
Guest Services, Accessibility, Box Office

### 7000 - Hospitality (2 teams, 16 positions)
F&B, VIP Services

### 8000 - Entertainment (4 teams, 46 positions) ⭐ EXPANDED
Programming, Performers, **Sports Entertainment**, **Game Day Operations**

### 8500 - Travel & Tourism (4 teams, 25 positions) ⭐ NEW
Travel Management, Tour Operations, Accommodation, Ground Transportation

### 9000 - Technology (4 teams, 26 positions)
Engineering, Product, IT Ops, Data & Analytics

## Use Cases

### Sports Venue/Team
```typescript
// Get all sports-related positions
const sportsPositions = await prisma.catalogItem.findMany({
  where: {
    OR: [
      { metadata: { path: ['teamCode'], equals: '8300' } }, // Sports Entertainment
      { metadata: { path: ['teamCode'], equals: '8400' } }, // Game Day Operations
      { metadata: { path: ['teamCode'], equals: '2600' } }, // Sports Marketing
    ]
  }
});
```

### Media/Broadcasting Organization
```typescript
// Get all media and broadcast roles
const mediaRoles = await prisma.catalogItem.findMany({
  where: {
    OR: [
      { metadata: { path: ['teamCode'], equals: '2500' } }, // Media & Broadcasting
      { metadata: { path: ['teamCode'], equals: '4700' } }, // Broadcast Operations
    ]
  }
});
```

### Touring Production
```typescript
// Get all travel and tour positions
const tourPositions = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['departmentCode'],
      equals: '8500' // Travel & Tourism
    }
  }
});
```

### Find Certified Sports Medicine Staff
```typescript
const sportsMedical = await prisma.catalogItem.findMany({
  where: {
    requiresCertification: true,
    metadata: {
      path: ['teamCode'],
      equals: '8300' // Sports Entertainment
    }
  }
});
// Returns: Athletic Trainer, Team Physician, Physical Therapist
```

## Integration Examples

### Assign Sports Role
```typescript
await prisma.compvssUser.update({
  where: { userId },
  data: {
    position: '8304', // Athletic Trainer
    department: '8000', // Entertainment
    teamId: sportsTeamId
  }
});
```

### Build Game Day Staff Roster
```typescript
const gameDayStaff = await prisma.compvssUser.findMany({
  where: {
    metadata: {
      path: ['teamCode'],
      equals: '8400' // Game Day Operations
    }
  },
  include: { user: true }
});
```

### Tour Crew Assignment
```typescript
const tourCrew = await prisma.compvssUser.findMany({
  where: {
    department: '8500', // Travel & Tourism
    position: { startsWith: '852' } // Tour Operations team
  }
});
```

## Query Examples

### All Sports-Related Positions
```typescript
const allSports = await prisma.catalogItem.findMany({
  where: {
    OR: [
      { name: { contains: 'sport', mode: 'insensitive' } },
      { name: { contains: 'coach', mode: 'insensitive' } },
      { name: { contains: 'athlete', mode: 'insensitive' } },
      { searchTerms: { hasSome: ['sports', 'game', 'team'] } }
    ],
    metadata: { path: ['type'], equals: 'position' }
  }
});
```

### All Media/Broadcast Positions
```typescript
const mediaBroadcast = await prisma.catalogItem.findMany({
  where: {
    OR: [
      { name: { contains: 'broadcast', mode: 'insensitive' } },
      { name: { contains: 'media', mode: 'insensitive' } },
      { name: { contains: 'journalist', mode: 'insensitive' } }
    ],
    metadata: { path: ['type'], equals: 'position' }
  }
});
```

### All Travel Positions
```typescript
const travelPositions = await prisma.catalogItem.findMany({
  where: {
    metadata: {
      path: ['departmentCode'],
      equals: '8500'
    }
  },
  orderBy: { order: 'asc' }
});
```

## Benefits

1. **Sports Coverage** - Complete sports venue, team, and event staffing
2. **Media Integration** - Broadcasting, journalism, and content creation roles
3. **Travel Management** - Comprehensive tour and travel coordination
4. **Marketing Depth** - Sports marketing and fan engagement specialists
5. **Game Day Operations** - Complete event day staffing structure
6. **Certification Tracking** - Medical and sports-specific certifications
7. **Industry Flexibility** - Supports sports, entertainment, media, and travel industries

## Files Modified

1. **`prisma/seeds/organizational-hierarchy-expanded.ts`**
   - Added 74 new positions
   - Added 8 new teams
   - Added 1 new department (Travel & Tourism)

2. **`prisma/seeds/seed-organizational-catalog-expanded.ts`**
   - No changes needed (automatically handles new data)

## Statistics

### Position Distribution by Industry
- **Events & Concerts**: ~120 positions
- **Film Production**: ~80 positions
- **TV Production**: ~60 positions
- **Broadcast Operations**: ~40 positions
- **Sports Entertainment**: ~50 positions
- **Travel & Tourism**: ~25 positions
- **Technology**: ~26 positions
- **Operations**: ~28 positions

### Certification Requirements
- **13 different certifications** tracked
- **~30 positions** require certifications
- **Medical certifications**: MD, DO, PT, Athletic Trainer, EMT/Paramedic
- **Technical certifications**: ETCP, CDL, Part 107
- **Safety certifications**: TIPS, ServSafe, Food Handler
- **Sports certifications**: Sport-Specific for Officials

## Next Steps

✅ Sports entertainment positions added
✅ Media & broadcasting roles added
✅ Travel & tourism department created
✅ Sports marketing team added
✅ Game day operations team added
✅ Database seeded with 429 positions
✅ Documentation complete

**The organizational catalog now covers 11 major industries with 429 comprehensive positions!**

## Documentation

- **Original Implementation**: `docs/implementation/ORGANIZATIONAL_CATALOG_IMPLEMENTATION.md`
- **First Expansion**: `docs/implementation/EXPANDED_ORGANIZATIONAL_CATALOG.md`
- **This Expansion**: `docs/implementation/SPORTS_MEDIA_TRAVEL_EXPANSION.md`
- **Full Guide**: `docs/guides/ORGANIZATIONAL_HIERARCHY_GUIDE.md`
- **Quick Reference**: `docs/guides/ORGANIZATIONAL_HIERARCHY_QUICK_REFERENCE.md`
