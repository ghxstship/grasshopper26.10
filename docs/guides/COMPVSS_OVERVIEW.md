# COMPVSS: External Teams & Day-of-Show Operations Platform

## Overview

COMPVSS is the third platform in the GVTEWAY + COMPVSS + ATLVS ecosystem, designed specifically for external teams, collaborators, and day-of-show personnel. Inspired by ConnectTeam, COMPVSS bridges the gap between consumers (GVTEWAY) and internal production teams (ATLVS).

## Platform Positioning

```
GVTEWAY  →  Consumer-facing (Fans, Attendees, Members)
COMPVSS  →  External Teams (Crews, Staff, Media, Partners, Affiliates)
ATLVS    →  Internal Teams (Event Organizers, Production Managers)
```

## Who Uses COMPVSS?

### Primary User Groups

1. **Production Crews** - Technical staff, stagehands, riggers
2. **Event Staff** - Security, ushers, box office, volunteers
3. **Media & Press** - Journalists, photographers, videographers
4. **Sponsors** - Brand representatives, activation teams
5. **Partners** - Co-producers, venue staff, vendors
6. **Brand Ambassadors** - Promotional staff, influencers
7. **Affiliates** - Sales partners, referral networks
8. **Industry Guests** - VIPs, industry professionals
9. **Government Agencies** - Permits, inspections, safety officials

## Core Features

### 1. Team Onboarding
- Streamlined registration and verification
- Role-based access assignment
- Credential management
- Training and compliance tracking
- Document submission and approval

### 2. Production Advancing (Moved from GVTEWAY)
**9 Category Submission System:**
- Access & Credentials
- Site Infrastructure
- Site Assets
- Site Utilities
- Site Vehicles
- Heavy Equipment
- Technical Production
- Hospitality
- Travel & Logistics

**Workflow:**
- External teams submit requests via COMPVSS
- Internal teams review and approve in ATLVS
- Bi-directional communication and updates
- Real-time status tracking

### 3. Day-of-Show Operations

**Live Dashboards:**
- Real-time event status
- Team locations and check-ins
- Task completion tracking
- Issue alerts and notifications
- Weather and safety updates

**QR Code Management:**
- Access control and verification
- Equipment check-in/check-out
- Meal voucher redemption
- Attendance tracking
- Credential scanning

### 4. Issue Reporting
- Priority-based issue submission
- Photo/video attachments
- Location tagging
- Assignment and routing
- Resolution tracking
- Escalation workflows

### 5. Expense Reports
- Receipt scanning and upload
- Expense categorization
- Approval workflows
- Reimbursement tracking
- Budget allocation
- Multi-currency support

### 6. Affiliate Management
- Affiliate registration and onboarding
- Commission tracking
- Performance analytics
- Payout management
- Marketing materials access
- Campaign tracking

### 7. Referral System
- Referral link generation
- Conversion tracking
- Reward tiers
- Leaderboards
- Automated payouts
- Performance insights

### 8. Credential Verification
- Digital credential storage
- Certification verification
- Background check integration
- Access level management
- Expiration tracking
- Renewal reminders

### 9. Communication Hub
- Team messaging
- Announcements and alerts
- Shift schedules
- Call sheets
- Emergency protocols
- Document sharing

## Design System

### Brand Colors (Tertiary Palette)

**Cyan** (#00FFFF)
- Primary accent color
- Represents connectivity and communication
- Used for CTAs and highlights

**Teal** (#00CED1)
- Secondary accent color
- Represents collaboration and trust
- Used for success states and confirmations

**Indigo** (#4B0082)
- Tertiary accent color
- Represents professionalism and depth
- Used for premium features and badges

### Gradient Usage

```css
/* COMPVSS Gradient Background */
.compvss-gradient {
  background: linear-gradient(to right, #00FFFF, #00CED1, #4B0082);
}

/* COMPVSS Gradient Text */
.compvss-text-gradient {
  background: linear-gradient(to right, #00FFFF, #00CED1, #4B0082);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Key Differentiators

### vs GVTEWAY
- **GVTEWAY**: Consumer-facing, event discovery, ticketing
- **COMPVSS**: Professional tools, operational focus, team coordination

### vs ATLVS
- **ATLVS**: Internal teams, planning and approval, full production suite
- **COMPVSS**: External teams, execution and reporting, day-of-show focus

## Production Advancing Workflow

### Before COMPVSS (Old Model)
```
GVTEWAY (Vendors) → Submit Requests → ATLVS (Approvers)
```
**Problem**: Vendors and consumers mixed in same platform

### With COMPVSS (New Model)
```
COMPVSS (External Teams) → Submit Requests → ATLVS (Internal Teams) → Approve/Assign
                                                    ↓
                                            Results Dashboard
                                                    ↓
                                            COMPVSS (Notifications)
```
**Benefits:**
- Clear separation of concerns
- Professional tools for professional users
- Better security and access control
- Streamlined workflows
- Improved communication

## Integration Points

### With GVTEWAY
- Shared credential system
- Event information sync
- Ticket validation for staff
- Attendee data (anonymized)

### With ATLVS
- Production advancing approvals
- Resource allocation
- Budget tracking
- Team assignments
- Real-time updates

### With N8N
- Automated onboarding workflows
- Advancing request routing
- Notification triggers
- Report generation
- Data synchronization

## Mobile-First Design

COMPVSS is optimized for mobile use, as most external teams work on-site with mobile devices:

- **Progressive Web App (PWA)** capabilities
- **Offline mode** for critical features
- **QR code scanning** with device camera
- **GPS integration** for location tracking
- **Push notifications** for real-time alerts
- **Touch-optimized** interface

## Security & Access Control

### Role-Based Permissions
- **Crew Member**: Basic access, task viewing, issue reporting
- **Crew Lead**: Team management, advanced reporting
- **Vendor**: Advancing submissions, expense reports
- **Media**: Credential verification, content upload
- **Affiliate**: Referral tracking, commission viewing
- **Admin**: Full COMPVSS access, user management

### Data Protection
- End-to-end encryption for sensitive data
- Role-based data access
- Audit logging
- Session management
- Device authorization
- Two-factor authentication

## Success Metrics

### Onboarding
- Time to first login
- Profile completion rate
- Credential verification time
- Training completion rate

### Operations
- Issue response time
- Task completion rate
- Check-in accuracy
- QR scan success rate

### Engagement
- Daily active users
- Feature adoption rate
- Mobile vs desktop usage
- Session duration

### Financial
- Expense report processing time
- Affiliate conversion rate
- Referral program ROI
- Commission payout accuracy

## Future Enhancements

### Phase 2
- AI-powered task assignment
- Predictive issue detection
- Automated scheduling
- Smart credential verification

### Phase 3
- AR wayfinding
- Voice commands
- Wearable integration
- Biometric authentication

### Phase 4
- Machine learning insights
- Predictive analytics
- Automated reporting
- Advanced automation

## Technical Implementation

### Database Models (New)
- `CompvssUser`
- `CompvssTeam`
- `CompvssRole`
- `DayOfShowTask`
- `IssueReport`
- `ExpenseReport`
- `AffiliateProfile`
- `ReferralLink`
- `QRCode`
- `CheckIn`

### API Endpoints
```
/api/compvss/
├── onboarding/
├── advancing/
├── day-of-show/
├── issues/
├── expenses/
├── affiliates/
├── referrals/
├── qr-codes/
└── credentials/
```

### Real-time Features
- WebSocket connections for live updates
- Supabase Realtime for database changes
- Push notifications via service workers
- GPS tracking for location-based features

---

**COMPVSS completes the three-platform ecosystem, providing professional tools for external teams while maintaining clear separation between consumers, collaborators, and internal production staff.**

**Built with GHXSTSHIP precision ⚓️**
