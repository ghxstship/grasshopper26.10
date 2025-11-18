# Organizational Hierarchy Quick Reference

## Department & Team Structure

### 0000 - Executive
- **0100** Executive Leadership (9 positions)

### 1000 - Creative
- **1100** Creative Direction (6 positions)
- **1200** Content Production (7 positions)
- **1300** Brand & Identity (5 positions)

### 2000 - Marketing
- **2100** Marketing Strategy (5 positions)
- **2200** Digital Marketing (7 positions)
- **2300** Public Relations (5 positions)
- **2400** Sponsorship (5 positions)

### 3000 - Talent
- **3100** Talent Buying (4 positions)
- **3200** Artist Relations (4 positions)

### 4000 - Production
- **4100** Production Management (5 positions)
- **4200** Stage Management (4 positions)
- **4300** Audio (6 positions)
- **4400** Lighting (5 positions)
- **4500** Video (5 positions)
- **4600** Rigging (3 positions)

### 5000 - Operations
- **5100** Site Operations (4 positions)
- **5200** Logistics (5 positions)
- **5300** Transportation (4 positions)
- **5400** Facilities (5 positions)

### 6000 - Experience
- **6100** Guest Experience (5 positions)
- **6200** Accessibility Services (4 positions)
- **6300** Ticketing & Box Office (4 positions)

### 7000 - Hospitality
- **7100** Food & Beverage (8 positions)
- **7200** VIP Services (4 positions)

### 8000 - Entertainment
- **8100** Entertainment Programming (3 positions)
- **8200** Performers (7 positions)

### 9000 - Technology
- **9100** Engineering (6 positions)
- **9200** Product (5 positions)
- **9300** IT Operations (6 positions)
- **9400** Data & Analytics (4 positions)

## Common Position Codes

### Executive Leadership
- `0101` - Chief Executive Officer (CEO)
- `0102` - Chief Operating Officer (COO)
- `0103` - Chief Financial Officer (CFO)
- `0104` - Chief Technology Officer (CTO)

### Production
- `4101` - Production Director
- `4102` - Production Manager
- `4201` - Stage Manager
- `4302` - Front of House Engineer (FOH)
- `4303` - Monitor Engineer
- `4401` - Lighting Director (LD)
- `4501` - Video Director
- `4601` - Head Rigger

### Operations
- `5101` - Site Director
- `5201` - Logistics Director
- `5301` - Transportation Manager
- `5401` - Facilities Manager

### Guest Experience
- `6101` - Guest Experience Director
- `6102` - Guest Services Manager
- `6301` - Box Office Manager

### Hospitality
- `7101` - F&B Director
- `7104` - Chef
- `7107` - Bartender
- `7201` - VIP Services Director

### Technology
- `9101` - VP of Engineering
- `9104` - Senior Software Engineer
- `9201` - VP of Product
- `9301` - IT Director

## Position Levels

| Level | Description | Experience |
|-------|-------------|------------|
| entry | Entry-level | 0-2 years |
| mid | Mid-level | 2-5 years |
| senior | Senior | 5+ years |
| lead | Team Lead | 5+ years + leadership |
| manager | Manager | 7+ years + people management |
| director | Director | 10+ years + strategic leadership |
| executive | C-Suite | 15+ years + executive leadership |

## Positions Requiring Certifications

### Production
- `4601` Head Rigger - ETCP Rigging
- `4602` Rigger - ETCP Rigging

### Operations
- `5303` Driver - CDL
- `5404` Electrician - Licensed Electrician
- `5405` Plumber - Licensed Plumber

### Hospitality
- `7107` Bartender - TIPS, ServSafe
- `7108` Server - Food Handler

## Search Tips

### By Department
```typescript
// All Production positions
where: { metadata: { path: ['departmentCode'], equals: '4000' } }
```

### By Team
```typescript
// All Audio team positions
where: { metadata: { path: ['teamCode'], equals: '4300' } }
```

### By Level
```typescript
// All senior-level positions
where: { metadata: { path: ['level'], equals: 'senior' } }
```

### By Certification
```typescript
// All positions requiring certifications
where: { requiresCertification: true }
```

## Quick Stats

- **Total Departments:** 10
- **Total Teams:** 40
- **Total Positions:** 200+
- **Positions with Certifications:** 8
- **Seniority Levels:** 7

## Usage Examples

### Assign User to Position
```typescript
await prisma.compvssUser.update({
  where: { userId },
  data: {
    position: '4302', // FOH Engineer
    department: '4000' // Production
  }
});
```

### Find All Engineers
```typescript
await prisma.catalogItem.findMany({
  where: {
    name: { contains: 'Engineer', mode: 'insensitive' },
    metadata: { path: ['type'], equals: 'position' }
  }
});
```

### Get Team Roster
```typescript
await prisma.compvssUser.findMany({
  where: {
    metadata: { path: ['teamCode'], equals: '4300' }
  },
  include: { user: true }
});
```
