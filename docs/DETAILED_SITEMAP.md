# Detailed Sitemap & Workflows

> **Complete navigation structure and user flows for GVTEWAY, COMPVSS, and ATLVS**  
> **Last Updated:** November 20, 2025

---

## 📋 Table of Contents

1. [Public Pages](#public-pages)
2. [GVTEWAY Platform](#gvteway-platform)
3. [COMPVSS Platform](#compvss-platform)
4. [ATLVS Platform](#atlvs-platform)
5. [Workflows](#workflows)

---

## 🌐 Public Pages

### Landing & Marketing (10 pages)

```
/                           # Homepage
├── /about                  # About GHXSTSHIP
├── /pricing               # Pricing plans
├── /contact               # Contact form
├── /terms                 # Terms of service
├── /privacy               # Privacy policy
├── /security              # Security information
├── /blog                  # Blog listing
│   └── /blog/[slug]       # Blog post detail
├── /careers               # Careers page
└── /press                 # Press kit
```

---

## 🎫 GVTEWAY Platform (Consumer)

### Authentication (6 pages)

```
/auth/
├── /login                 # Login page
├── /register              # Registration
├── /forgot-password       # Password reset request
├── /reset-password        # Password reset form
├── /verify-email          # Email verification
├── /onboarding            # New user onboarding
└── /connect-wallet        # Web3 wallet connection
```

### Events Module (8 pages)

```
/events/
├── /                      # Event listing (all events)
├── /[id]                  # Event detail page
├── /category/[slug]       # Category browsing
├── /venue/[id]            # Venue detail & events
├── /artist/[id]           # Artist profile & events
├── /map                   # Map view of events
├── /calendar              # Calendar view
└── /search                # Advanced search
```

### Ticketing Module (8 pages)

```
/tickets/
├── /                      # My tickets dashboard
├── /[id]                  # Ticket detail
├── /transfer/[id]         # Transfer ticket
├── /sell/[id]             # Sell/list ticket
├── /checkout              # Ticket checkout
├── /success               # Purchase confirmation
├── /orders                # Order history
└── /orders/[id]           # Order detail
```

### Wallet Module (7 pages)

```
/wallet/
├── /                      # Wallet dashboard
├── /passes                # Digital passes
├── /nft                   # NFT collection
├── /credentials           # Credentials vault
├── /loyalty               # Loyalty points
├── /apple                 # Apple Wallet integration
└── /google                # Google Wallet integration
```

### Marketplace Module (6 pages)

```
/marketplace/
├── /                      # Marketplace home
├── /products              # Product listing
├── /products/[id]         # Product detail
├── /cart                  # Shopping cart
├── /checkout              # Checkout flow
└── /orders                # Order history
```

### Social Module (8 pages)

```
/social/
├── /feed                  # Social feed
├── /profile/[username]    # User profile
├── /profile/edit          # Edit profile
├── /post/[id]             # Post detail
├── /following             # Following list
├── /followers             # Followers list
├── /messages              # Direct messages
└── /notifications         # Notifications
```

### Adventures Module (6 pages)

```
/adventures/
├── /                      # Adventures listing
├── /[id]                  # Adventure detail
├── /vip                   # VIP experiences
├── /meet-greet            # Meet & greets
├── /tours                 # Tours listing
└── /bookings              # My bookings
```

### Memberships Module (5 pages)

```
/memberships/
├── /tiers                 # Membership tiers
├── /join                  # Join membership
├── /dashboard             # Member dashboard
├── /benefits              # Benefits overview
└── /exclusive             # Exclusive content
```

### Analytics Module (4 pages)

```
/analytics/
├── /personal              # Personal dashboard
├── /events                # Event history
├── /spending              # Spending insights
└── /recommendations       # Personalized recommendations
```

### Wishlist Module (2 pages)

```
/wishlist/
├── /saved                 # Saved events
└── /alerts                # Price/availability alerts
```

### Settings (6 pages)

```
/settings/
├── /account               # Account settings
├── /profile               # Profile settings
├── /payment               # Payment methods
├── /notifications         # Notification preferences
├── /privacy               # Privacy settings
└── /security              # Security settings (2FA, etc.)
```

---

## 🔷 COMPVSS Platform (External Teams)

### Authentication (5 pages)

```
/compvss/auth/
├── /login                 # Login page
├── /register              # Registration
├── /invite                # Invite acceptance
├── /onboarding            # Team onboarding
└── /verify                # Verification
```

### Dashboard (4 pages)

```
/compvss/
├── /                      # Main dashboard
├── /day-of-show           # Day-of-show dashboard
├── /tasks                 # My tasks
└── /schedule              # My schedule
```

### Team Module (5 pages)

```
/compvss/team/
├── /directory             # Team directory
├── /profile/[id]          # Team member profile
├── /members               # Team members list
├── /roles                 # Role assignments
└── /availability          # Availability calendar
```

### Production Advancing (15 pages)

```
/compvss/advancing/
├── /                      # Advancing dashboard
├── /new                   # New request
├── /requests              # My requests
├── /requests/[id]         # Request detail
├── /results               # Results dashboard
│
├── /access-credentials    # Category 1: Access & Credentials
├── /site-infrastructure   # Category 2: Site Infrastructure
├── /site-assets           # Category 3: Site Assets
├── /site-utilities        # Category 4: Site Utilities
├── /site-vehicles         # Category 5: Site Vehicles
├── /heavy-equipment       # Category 6: Heavy Equipment
├── /technical-production  # Category 7: Technical Production
├── /hospitality           # Category 8: Hospitality
└── /travel-logistics      # Category 9: Travel & Logistics
```

### Operations Module (6 pages)

```
/compvss/operations/
├── /hub                   # Operations hub
├── /checkin               # Check-in interface
├── /tasks                 # Task management
├── /schedule              # Schedule view
├── /map                   # Site map
└── /contacts              # Contact directory
```

### QR Code Module (5 pages)

```
/compvss/qr/
├── /hub                   # QR hub
├── /scan                  # QR scanner
├── /generate              # Generate QR codes
├── /history               # Scan history
└── /access                # Access control
```

### Issue Reporting (5 pages)

```
/compvss/issues/
├── /                      # Issue dashboard
├── /new                   # Report new issue
├── /[id]                  # Issue detail
├── /my-issues             # My reported issues
└── /assigned              # Assigned to me
```

### Expense Reports (6 pages)

```
/compvss/expenses/
├── /                      # Expense dashboard
├── /new                   # New expense report
├── /[id]                  # Expense detail
├── /submit                # Submit for approval
├── /history               # Expense history
└── /reimbursements        # Reimbursement status
```

### Affiliates Module (6 pages)

```
/compvss/affiliates/
├── /                      # Affiliate dashboard
├── /links                 # Affiliate links
├── /performance           # Performance metrics
├── /commissions           # Commission tracking
├── /payouts               # Payout history
└── /marketing             # Marketing materials
```

### Referrals Module (5 pages)

```
/compvss/referrals/
├── /                      # Referral dashboard
├── /generate              # Generate referral links
├── /track                 # Track referrals
├── /rewards               # Rewards earned
└── /leaderboard           # Referral leaderboard
```

### Credentials Module (5 pages)

```
/compvss/credentials/
├── /vault                 # Credential vault
├── /upload                # Upload documents
├── /verify                # Verification status
├── /certifications        # Certifications
└── /background            # Background checks
```

### Settings (4 pages)

```
/compvss/settings/
├── /account               # Account settings
├── /profile               # Profile settings
├── /notifications         # Notification preferences
└── /security              # Security settings
```

---

## 🟢 ATLVS Platform (Internal Production)

### Authentication (3 pages)

```
/atlvs/auth/
├── /login                 # Login page
├── /register              # Registration
└── /invite                # Invite acceptance
```

### Dashboard (4 pages)

```
/atlvs/
├── /                      # Main dashboard
├── /overview              # Overview analytics
├── /calendar              # Master calendar
└── /analytics             # Analytics hub
```

### Projects Module (9 pages)

```
/atlvs/projects/
├── /                      # Project list
├── /new                   # Create project
├── /[id]                  # Project detail
├── /[id]/overview         # Project overview
├── /[id]/timeline         # Timeline (Gantt)
├── /[id]/milestones       # Milestones
├── /[id]/phases           # Project phases
├── /[id]/files            # File management
└── /[id]/settings         # Project settings
```

### Tasks Module (7 pages)

```
/atlvs/tasks/
├── /all                   # All tasks
├── /board                 # Kanban board
├── /list                  # List view
├── /calendar              # Calendar view
├── /[id]                  # Task detail
├── /my-tasks              # My tasks
└── /assigned              # Tasks I assigned
```

### Teams Module (8 pages)

```
/atlvs/teams/
├── /                      # Teams overview
├── /[id]                  # Team detail
├── /[id]/members          # Team members
├── /[id]/roles            # Role management
├── /[id]/schedule         # Team schedule
├── /directory             # Team directory
├── /availability          # Availability tracking
└── /time-tracking         # Time tracking
```

### Budgets Module (7 pages)

```
/atlvs/budgets/
├── /                      # Budget overview
├── /[id]                  # Budget detail
├── /expenses              # Expense tracking
├── /forecasting           # Budget forecasting
├── /variance              # Variance analysis
├── /approvals             # Approval queue
└── /reports               # Financial reports
```

### Assets Module (7 pages)

```
/atlvs/assets/
├── /inventory             # Asset inventory
├── /equipment             # Equipment catalog
├── /[id]                  # Asset detail
├── /bookings              # Booking system
├── /maintenance           # Maintenance logs
├── /vehicles              # Vehicle tracking
└── /qr-tracking           # QR tracking
```

### Advancing Module (9 pages)

```
/atlvs/advancing/
├── /                      # Advancing dashboard
├── /requests              # All requests
├── /pending               # Pending approvals
├── /approved              # Approved requests
├── /[id]                  # Request detail
├── /review                # Review interface
├── /assign                # Resource assignment
├── /results               # Results dashboard
└── /analytics             # Advancing analytics
```

### Documents Module (7 pages)

```
/atlvs/documents/
├── /library               # Document library
├── /contracts             # Contracts
├── /riders                # Riders
├── /permits               # Permits
├── /insurance             # Insurance documents
├── /[id]                  # Document detail
├── /templates             # Document templates
└── /versions              # Version control
```

### N8N Automation (9 pages)

```
/atlvs/n8n/
├── /hub                   # Automation hub
├── /workflows             # Workflow list
├── /new                   # Create workflow
├── /[id]                  # Workflow detail
├── /edit/[id]             # Workflow editor
├── /executions            # Execution history
├── /templates             # Workflow templates
├── /credentials           # Credential management
└── /webhooks              # Webhook configuration
```

### Vendors Module (4 pages)

```
/atlvs/vendors/
├── /directory             # Vendor directory
├── /[id]                  # Vendor profile
├── /contracts             # Contract management
└── /performance           # Performance tracking
```

### Analytics Module (7 pages)

```
/atlvs/analytics/
├── /hub                   # Analytics hub
├── /projects              # Project analytics
├── /budgets               # Budget reports
├── /teams                 # Team performance
├── /advancing             # Advancing analytics
├── /reports               # Custom reports
└── /scheduled             # Scheduled reports
```

### Settings (9 pages)

```
/atlvs/settings/
├── /organization          # Organization settings
├── /users                 # User management
├── /roles                 # Role management
├── /permissions           # Permission management
├── /integrations          # Integration settings
├── /billing               # Billing & subscription
├── /security              # Security settings
├── /audit-log             # Audit log
└── /api-keys              # API key management
```

---

## 🔄 Workflows

### GVTEWAY Workflows

#### 1. Event Discovery & Ticket Purchase Flow
```
User Journey:
1. Browse Events (/events)
   ├── Filter by category, date, location
   ├── View on map (/events/map)
   └── View calendar (/events/calendar)
   
2. Event Detail (/events/[id])
   ├── View event information
   ├── Check ticket availability
   └── Select tickets
   
3. Ticket Selection
   ├── Choose ticket type
   ├── Select quantity
   └── Add to cart
   
4. Checkout (/tickets/checkout)
   ├── Review order
   ├── Apply promo codes
   ├── Enter payment info
   └── Complete purchase
   
5. Confirmation (/tickets/success)
   ├── Receive confirmation email
   ├── Add to Apple/Google Wallet
   └── View ticket in dashboard (/tickets)
```

#### 2. NFT Ticket Minting Flow
```
User Journey:
1. Purchase Ticket (standard flow)
   
2. Mint NFT Option
   ├── Connect Web3 wallet (/auth/connect-wallet)
   ├── Choose blockchain (Ethereum/Polygon)
   └── Confirm minting transaction
   
3. NFT Created
   ├── View in wallet (/wallet/nft)
   ├── Transfer ownership
   └── Verify on blockchain
```

#### 3. Social Engagement Flow
```
User Journey:
1. Create Post (/social/feed)
   ├── Write content
   ├── Add media (photos/videos)
   ├── Tag event/artist
   └── Publish
   
2. Engage with Content
   ├── Like posts
   ├── Comment
   ├── Share
   └── Follow users
   
3. Event Check-in
   ├── Scan QR code at venue
   ├── Auto-post check-in
   └── Unlock exclusive content
```

#### 4. Membership Enrollment Flow
```
User Journey:
1. Browse Tiers (/memberships/tiers)
   ├── Compare benefits
   ├── View pricing
   └── Select tier
   
2. Join Membership (/memberships/join)
   ├── Enter payment info
   ├── Set up recurring billing
   └── Complete enrollment
   
3. Member Dashboard (/memberships/dashboard)
   ├── View benefits
   ├── Access exclusive content
   ├── Track loyalty points
   └── Manage subscription
```

#### 5. Adventure Booking Flow
```
User Journey:
1. Browse Adventures (/adventures)
   ├── Filter by type (VIP, Meet & Greet, Tours)
   ├── View availability
   └── Select adventure
   
2. Adventure Detail (/adventures/[id])
   ├── View details & requirements
   ├── Check availability
   └── Select date/time
   
3. Booking
   ├── Enter participant info
   ├── Add special requests
   ├── Complete payment
   └── Receive confirmation
   
4. My Bookings (/adventures/bookings)
   ├── View upcoming adventures
   ├── Manage bookings
   └── Access digital passes
```

---

### COMPVSS Workflows

#### 1. Team Onboarding Flow
```
User Journey:
1. Receive Invite
   ├── Email invitation link
   └── Click to accept (/compvss/auth/invite)
   
2. Registration (/compvss/auth/register)
   ├── Create account
   ├── Set password
   └── Verify email
   
3. Profile Setup (/compvss/auth/onboarding)
   ├── Complete profile
   ├── Upload credentials
   ├── Select roles/skills
   └── Set availability
   
4. Verification (/compvss/auth/verify)
   ├── Submit documents
   ├── Background check (if required)
   └── Await approval
   
5. Access Granted
   ├── Dashboard access (/compvss)
   └── Assigned to projects
```

#### 2. Production Advancing Submission Flow
```
User Journey:
1. Advancing Dashboard (/compvss/advancing)
   ├── View assigned projects
   ├── Check deadlines
   └── Start new request
   
2. Select Category (/compvss/advancing/new)
   ├── Access & Credentials
   ├── Site Infrastructure
   ├── Site Assets
   ├── Site Utilities
   ├── Site Vehicles
   ├── Heavy Equipment
   ├── Technical Production
   ├── Hospitality
   └── Travel & Logistics
   
3. Fill Form (/compvss/advancing/[category])
   ├── Enter requirements
   ├── Add specifications
   ├── Upload supporting docs
   ├── Set quantities/dates
   └── Add notes
   
4. Review & Submit
   ├── Review all details
   ├── Attach files
   ├── Submit to ATLVS
   └── Receive confirmation
   
5. Track Request (/compvss/advancing/requests/[id])
   ├── Monitor status
   ├── Respond to questions
   ├── View approvals
   └── Receive results
   
6. View Results (/compvss/advancing/results)
   ├── See approved items
   ├── View assignments
   ├── Download reports
   └── Confirm receipt
```

#### 3. Day-of-Show Operations Flow
```
User Journey:
1. Pre-Show Prep
   ├── Review schedule (/compvss/schedule)
   ├── Check assigned tasks (/compvss/tasks)
   └── Download site map (/compvss/operations/map)
   
2. Check-In (/compvss/operations/checkin)
   ├── Scan QR code
   ├── Confirm arrival
   ├── Receive credentials
   └── Get task assignments
   
3. Task Execution (/compvss/operations/tasks)
   ├── View task list
   ├── Mark tasks complete
   ├── Report issues
   └── Update status
   
4. Issue Reporting (/compvss/issues/new)
   ├── Describe issue
   ├── Add photos/videos
   ├── Set priority
   ├── Assign category
   └── Submit report
   
5. Issue Resolution (/compvss/issues/[id])
   ├── Track progress
   ├── Communicate with team
   ├── Confirm resolution
   └── Close issue
```

#### 4. Expense Report Submission Flow
```
User Journey:
1. Create Report (/compvss/expenses/new)
   ├── Enter expense details
   ├── Upload receipts
   ├── Categorize expenses
   └── Add notes
   
2. Review & Submit (/compvss/expenses/submit)
   ├── Verify all information
   ├── Attach documentation
   └── Submit for approval
   
3. Track Status (/compvss/expenses/[id])
   ├── Monitor approval process
   ├── Respond to questions
   └── View approval status
   
4. Reimbursement (/compvss/expenses/reimbursements)
   ├── View approved amount
   ├── Check payment status
   └── Receive payment
```

#### 5. Affiliate Program Flow
```
User Journey:
1. Affiliate Dashboard (/compvss/affiliates)
   ├── View performance metrics
   ├── Check commissions
   └── Access marketing materials
   
2. Generate Links (/compvss/affiliates/links)
   ├── Create custom links
   ├── Set tracking parameters
   └── Copy/share links
   
3. Track Performance (/compvss/affiliates/performance)
   ├── View clicks
   ├── Monitor conversions
   ├── Track revenue
   └── Analyze trends
   
4. Earn Commissions (/compvss/affiliates/commissions)
   ├── View earned commissions
   ├── Check pending amounts
   └── Track payment schedule
   
5. Request Payout (/compvss/affiliates/payouts)
   ├── Request withdrawal
   ├── Select payment method
   ├── Confirm details
   └── Receive payment
```

---

### ATLVS Workflows

#### 1. Project Creation & Management Flow
```
User Journey:
1. Create Project (/atlvs/projects/new)
   ├── Enter project details
   ├── Set dates & deadlines
   ├── Assign team members
   ├── Set budget
   └── Define phases
   
2. Project Setup (/atlvs/projects/[id])
   ├── Create milestones (/atlvs/projects/[id]/milestones)
   ├── Define phases (/atlvs/projects/[id]/phases)
   ├── Build timeline (/atlvs/projects/[id]/timeline)
   └── Upload files (/atlvs/projects/[id]/files)
   
3. Task Creation (/atlvs/tasks/board)
   ├── Create tasks
   ├── Assign to team members
   ├── Set dependencies
   ├── Add deadlines
   └── Track progress
   
4. Team Coordination (/atlvs/teams/[id])
   ├── Assign roles
   ├── Set schedules
   ├── Track availability
   └── Monitor time
   
5. Budget Management (/atlvs/budgets/[id])
   ├── Track expenses
   ├── Approve purchases
   ├── Monitor variance
   └── Generate reports
   
6. Project Monitoring (/atlvs/projects/[id]/overview)
   ├── Track progress
   ├── Review milestones
   ├── Analyze metrics
   └── Adjust plans
```

#### 2. Production Advancing Approval Flow
```
User Journey:
1. Review Queue (/atlvs/advancing/pending)
   ├── View new requests
   ├── Filter by category
   ├── Sort by priority
   └── Select request
   
2. Request Review (/atlvs/advancing/[id])
   ├── Read requirements
   ├── Check specifications
   ├── Review documents
   └── Assess feasibility
   
3. Approval Decision (/atlvs/advancing/review)
   ├── Approve request
   ├── Request modifications
   ├── Reject with reason
   └── Add comments
   
4. Resource Assignment (/atlvs/advancing/assign)
   ├── Assign team members
   ├── Allocate equipment
   ├── Set timeline
   └── Confirm availability
   
5. Results Publication (/atlvs/advancing/results)
   ├── Compile approved items
   ├── Generate reports
   ├── Notify COMPVSS users
   └── Track completion
   
6. Analytics (/atlvs/advancing/analytics)
   ├── Review approval rates
   ├── Track turnaround time
   ├── Analyze trends
   └── Optimize process
```

#### 3. Budget Approval Workflow
```
User Journey:
1. Expense Submission
   ├── Team member submits expense
   └── Appears in approval queue
   
2. Review Queue (/atlvs/budgets/approvals)
   ├── View pending expenses
   ├── Filter by project/category
   └── Select expense
   
3. Expense Review
   ├── Verify receipts
   ├── Check budget availability
   ├── Validate against policy
   └── Review justification
   
4. Approval Decision
   ├── Approve expense
   ├── Request more info
   ├── Reject with reason
   └── Set payment priority
   
5. Budget Tracking (/atlvs/budgets/[id])
   ├── Update budget totals
   ├── Track variance
   ├── Monitor forecasts
   └── Generate reports
```

#### 4. Asset Management Flow
```
User Journey:
1. Asset Inventory (/atlvs/assets/inventory)
   ├── View all assets
   ├── Filter by type/status
   ├── Check availability
   └── Search assets
   
2. Asset Booking (/atlvs/assets/bookings)
   ├── Select asset
   ├── Choose dates
   ├── Assign to project
   └── Confirm booking
   
3. Maintenance Scheduling (/atlvs/assets/maintenance)
   ├── Schedule maintenance
   ├── Assign technician
   ├── Track completion
   └── Update asset status
   
4. QR Tracking (/atlvs/assets/qr-tracking)
   ├── Generate QR codes
   ├── Attach to assets
   ├── Scan for location
   └── Track movement
```

#### 5. N8N Workflow Automation Flow
```
User Journey:
1. Workflow Hub (/atlvs/n8n/hub)
   ├── Browse templates
   ├── View active workflows
   └── Check executions
   
2. Create Workflow (/atlvs/n8n/new)
   ├── Choose template or start blank
   ├── Name workflow
   └── Set trigger
   
3. Workflow Editor (/atlvs/n8n/edit/[id])
   ├── Add nodes
   ├── Configure connections
   ├── Set conditions
   ├── Test workflow
   └── Save changes
   
4. Credential Management (/atlvs/n8n/credentials)
   ├── Add API keys
   ├── Configure OAuth
   ├── Set permissions
   └── Test connections
   
5. Webhook Setup (/atlvs/n8n/webhooks)
   ├── Generate webhook URL
   ├── Configure payload
   ├── Set security
   └── Test webhook
   
6. Execution Monitoring (/atlvs/n8n/executions)
   ├── View execution history
   ├── Check success/failure
   ├── Debug errors
   └── Analyze performance
```

#### 6. Document Management Flow
```
User Journey:
1. Document Library (/atlvs/documents/library)
   ├── Browse documents
   ├── Filter by type
   ├── Search documents
   └── View recent
   
2. Upload Document
   ├── Select file
   ├── Add metadata
   ├── Set permissions
   └── Upload
   
3. Version Control (/atlvs/documents/versions)
   ├── Upload new version
   ├── Compare versions
   ├── Restore previous
   └── Track changes
   
4. Contract Management (/atlvs/documents/contracts)
   ├── Create contract
   ├── Send for signature
   ├── Track status
   └── Store signed copy
   
5. Document Sharing
   ├── Set permissions
   ├── Generate share link
   ├── Send to recipients
   └── Track access
```

---

## 🔗 Cross-Platform Workflows

### 1. Universal Credential Flow
```
Multi-Platform Journey:
1. COMPVSS: Upload Credential (/compvss/credentials/upload)
   ├── Submit document
   ├── Add details
   └── Request verification
   
2. ATLVS: Verify Credential (/atlvs/advancing/review)
   ├── Review submission
   ├── Verify authenticity
   ├── Approve/reject
   └── Update status
   
3. GVTEWAY: Use Credential (/wallet/credentials)
   ├── View verified credential
   ├── Add to digital wallet
   ├── Present at venue
   └── Scan for access
```

### 2. Event Lifecycle Flow
```
Multi-Platform Journey:
1. ATLVS: Create Event (/atlvs/projects/new)
   ├── Set up project
   ├── Define requirements
   ├── Create budget
   └── Assign team
   
2. COMPVSS: Submit Advancing (/compvss/advancing/new)
   ├── Review requirements
   ├── Submit requests
   └── Track approvals
   
3. ATLVS: Approve & Assign (/atlvs/advancing/review)
   ├── Review requests
   ├── Approve items
   ├── Assign resources
   └── Publish results
   
4. GVTEWAY: Publish Event (/events/[id])
   ├── Event goes live
   ├── Tickets available
   └── Users can purchase
   
5. COMPVSS: Day-of-Show (/compvss/operations/hub)
   ├── Execute operations
   ├── Manage tasks
   └── Report issues
   
6. GVTEWAY: Attend Event
   ├── Check-in with ticket
   ├── Social engagement
   └── Post-event feedback
```

### 3. Payment & Commission Flow
```
Multi-Platform Journey:
1. GVTEWAY: Purchase Made
   ├── User buys ticket/product
   └── Payment processed (Stripe)
   
2. COMPVSS: Affiliate Tracking (/compvss/affiliates/performance)
   ├── Track referral
   ├── Calculate commission
   └── Update dashboard
   
3. ATLVS: Financial Tracking (/atlvs/budgets/[id])
   ├── Record revenue
   ├── Track commissions
   ├── Update forecasts
   └── Generate reports
   
4. COMPVSS: Commission Payout (/compvss/affiliates/payouts)
   ├── Request payout
   ├── Process payment
   └── Confirm receipt
```

---

**Built with GHXSTSHIP precision ⚓️**
