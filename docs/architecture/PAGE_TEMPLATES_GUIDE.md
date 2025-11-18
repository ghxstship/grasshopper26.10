# Page Templates Guide

**Complete reference for all GHXSTSHIP page templates**

---

## Overview

Page templates provide consistent, reusable layouts for common page patterns across GVTEWAY, COMPVSS, and ATLVS platforms. All templates use the atomic design system and include Navigation + Footer components.

### Benefits

- **Consistency**: Uniform UX across all platforms
- **Speed**: Build new pages in minutes, not hours
- **Maintainability**: Update one template, fix everywhere
- **Accessibility**: Built-in ARIA labels and keyboard navigation
- **Type Safety**: Full TypeScript support
- **Mobile-First**: Responsive by default

---

## Template Categories

### 1. Layout Wrappers

Simple wrappers that add Navigation + Footer to any content.

#### AtlvsLayout
```tsx
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';

<AtlvsLayout>
  {/* Your page content */}
</AtlvsLayout>
```

#### CompvssLayout
```tsx
import { CompvssLayout } from '@/components/templates/CompvssLayout';

<CompvssLayout>
  {/* Your page content */}
</CompvssLayout>
```

#### GvtewayLayout
```tsx
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';

<GvtewayLayout>
  {/* Your page content */}
</GvtewayLayout>
```

---

### 2. Content Templates

Pre-built templates for common page patterns.

#### ListPageTemplate

**Use Case**: Browse pages, event listings, marketplace

**Features**:
- Category filtering with tabs
- Header action button
- Empty state support
- Grid/list layouts

**Example**:
```tsx
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';

<ListPageTemplate
  title="Events"
  description="Discover live experiences"
  categories={[
    { id: 'all', label: 'All Events' },
    { id: 'music', label: 'Music' },
    { id: 'sports', label: 'Sports' }
  ]}
  activeCategory="all"
  headerAction={{
    label: 'Create Event',
    href: '/events/new'
  }}
>
  <EventsGrid events={events} />
</ListPageTemplate>
```

#### DetailPageTemplate

**Use Case**: Event details, artist profiles, product pages

**Features**:
- Hero image section
- Sidebar support
- Badge display
- Action buttons
- Related content section

**Example**:
```tsx
import { DetailPageTemplate } from '@/components/templates/DetailPageTemplate';

<DetailPageTemplate
  hero={{
    image: '/event-cover.jpg',
    title: 'Summer Music Festival',
    subtitle: 'July 15-17, 2025',
    badges: [
      { label: 'Featured', variant: 'success' }
    ],
    actions: [
      { label: 'Buy Tickets', variant: 'primary', onClick: handleBuy }
    ]
  }}
  sidebar={<EventSidebar />}
>
  <EventDescription />
</DetailPageTemplate>
```

#### DashboardPageTemplate

**Use Case**: Analytics, dashboards, overview pages

**Features**:
- Stats cards grid
- Multiple content sections
- Section headers with actions

**Example**:
```tsx
import { DashboardPageTemplate } from '@/components/templates/DashboardPageTemplate';

<DashboardPageTemplate
  title="Analytics Dashboard"
  description="Track your performance"
  stats={[
    { icon: <Users />, title: 'Total Users', value: '1,234', href: '/users' },
    { icon: <DollarSign />, title: 'Revenue', value: '$45,678' }
  ]}
  sections={[
    {
      title: 'Recent Activity',
      action: { label: 'View All', href: '/activity' },
      content: <ActivityFeed />
    }
  ]}
/>
```

---

### 3. Form Templates

#### FormPageTemplate ✨ NEW

**Use Case**: Multi-step forms, advancing requests, project creation

**Features**:
- Single-step or multi-step wizard
- Progress indicator
- Step validation
- Save draft functionality
- Success/error messaging

**Example - Single Step**:
```tsx
import { FormPageTemplate } from '@/components/templates/FormPageTemplate';

<FormPageTemplate
  title="Create Project"
  description="Fill in the details below"
  singleStep={<ProjectForm />}
  onSubmit={handleSubmit}
  allowDraft
  onSaveDraft={handleSaveDraft}
/>
```

**Example - Multi-Step**:
```tsx
<FormPageTemplate
  title="New Advancing Request"
  steps={[
    {
      id: 'details',
      title: 'Request Details',
      description: 'Basic information',
      content: <DetailsForm />,
      validation: async () => validateDetails()
    },
    {
      id: 'items',
      title: 'Items Needed',
      content: <ItemsForm />
    },
    {
      id: 'review',
      title: 'Review & Submit',
      content: <ReviewStep />
    }
  ]}
  onSubmit={handleSubmit}
  showProgressBar
/>
```

**Pages That Should Use This**: 138 pages including:
- `/compvss/advancing/*` (35+ pages)
- `/atlvs/projects/new`
- `/atlvs/tasks/new`
- `/atlvs/budgets/new`
- `/compvss/expenses/new`

---

#### SettingsPageTemplate ✨ NEW

**Use Case**: Account settings, preferences, configuration

**Features**:
- Sidebar navigation
- Tab-based sections
- Unsaved changes warning
- Success/error messaging

**Example**:
```tsx
import { SettingsPageTemplate } from '@/components/templates/SettingsPageTemplate';

<SettingsPageTemplate
  title="Account Settings"
  sections={[
    {
      id: 'profile',
      label: 'Profile',
      icon: <User />,
      content: <ProfileSettings />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield />,
      content: <SecuritySettings />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell />,
      content: <NotificationSettings />
    }
  ]}
  onSave={handleSave}
  showSaveButton
/>
```

**Pages That Should Use This**: 44 pages including:
- `/gvteway/settings/*`
- `/compvss/settings/*`
- `/atlvs/settings/*`

---

#### WizardPageTemplate ✨ NEW

**Use Case**: Onboarding flows, guided setup

**Features**:
- Step-by-step navigation
- Visual progress tracking
- Optional steps
- Step validation
- Completion confirmation

**Example**:
```tsx
import { WizardPageTemplate } from '@/components/templates/WizardPageTemplate';

<WizardPageTemplate
  title="Welcome to GVTEWAY"
  description="Let's personalize your experience"
  steps={[
    {
      id: 'interests',
      title: 'Your Interests',
      icon: <Heart />,
      content: <InterestsStep />
    },
    {
      id: 'location',
      title: 'Location',
      icon: <MapPin />,
      content: <LocationStep />,
      optional: true
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: <Settings />,
      content: <PreferencesStep />
    }
  ]}
  onComplete={handleComplete}
  allowSkipOptional
/>
```

**Pages That Should Use This**:
- `/gvteway/auth/onboarding`
- `/compvss/auth/onboarding`
- Multi-step project creation

---

### 4. E-Commerce Templates

#### CheckoutPageTemplate ✨ NEW

**Use Case**: Ticket checkout, merchandise purchase, membership upgrade

**Features**:
- Order summary sidebar (sticky)
- Itemized pricing breakdown
- Payment form section
- Security badges
- Mobile-responsive

**Example**:
```tsx
import { CheckoutPageTemplate } from '@/components/templates/CheckoutPageTemplate';

<CheckoutPageTemplate
  items={[
    {
      id: '1',
      name: 'VIP Ticket',
      description: 'Summer Music Festival',
      price: 199.99,
      quantity: 2,
      image: '/ticket.jpg'
    }
  ]}
  subtotal={399.98}
  tax={35.99}
  fees={10.00}
  total={445.97}
  checkoutForm={<PaymentForm />}
  onSubmit={handleCheckout}
  securityBadges={<SecurityBadges />}
/>
```

**Pages That Should Use This**:
- `/gvteway/tickets/checkout`
- `/gvteway/marketplace/checkout`
- `/gvteway/memberships/join`

---

#### ComparisonPageTemplate ✨ NEW

**Use Case**: Membership tiers, pricing plans, feature comparison

**Features**:
- Side-by-side comparison
- Highlight differences
- Feature checkmarks
- CTA buttons per option
- Mobile-friendly stacked view

**Example**:
```tsx
import { ComparisonPageTemplate } from '@/components/templates/ComparisonPageTemplate';

<ComparisonPageTemplate
  title="Choose Your Membership"
  description="Select the plan that's right for you"
  options={[
    {
      id: 'basic',
      name: 'Basic',
      price: { amount: 0, period: 'forever' },
      features: [
        { label: 'Access to all events', included: true },
        { label: 'Ticket discounts', included: false }
      ],
      cta: { label: 'Get Started', href: '/signup' }
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { amount: 9.99, period: 'month' },
      badge: { label: 'Most Popular', variant: 'success' },
      highlighted: true,
      features: [
        { label: 'Access to all events', included: true },
        { label: 'Ticket discounts', included: true, value: '10%' }
      ],
      cta: { label: 'Upgrade Now', href: '/upgrade', variant: 'primary' }
    }
  ]}
/>
```

**Pages That Should Use This**:
- `/gvteway/memberships/join`
- Pricing comparison pages

---

### 5. Social Templates

#### ProfilePageTemplate ✨ NEW

**Use Case**: User profiles, artist profiles, team member profiles

**Features**:
- Hero section with cover photo
- Avatar display
- Stats row (followers, posts, etc.)
- Tabbed content
- Follow/Unfollow actions
- Edit mode for own profile

**Example**:
```tsx
import { ProfilePageTemplate } from '@/components/templates/ProfilePageTemplate';

<ProfilePageTemplate
  coverImage="/cover.jpg"
  avatarUrl="/avatar.jpg"
  name="Sarah Johnson"
  username="@sarahjohnson"
  bio="Event producer & music lover"
  location="Los Angeles, CA"
  joinedDate="January 2024"
  badges={[
    { label: 'Verified', variant: 'success' }
  ]}
  stats={[
    { label: 'Followers', value: '1.2K', href: '/followers' },
    { label: 'Following', value: '345', href: '/following' },
    { label: 'Events', value: '42' }
  ]}
  tabs={[
    { id: 'about', label: 'About', content: <AboutTab /> },
    { id: 'activity', label: 'Activity', content: <ActivityTab /> },
    { id: 'events', label: 'Events', content: <EventsTab /> }
  ]}
  isOwnProfile={false}
  isFollowing={false}
  onFollow={handleFollow}
  onMessage={handleMessage}
/>
```

**Pages That Should Use This**:
- `/gvteway/social/profile/*`
- `/compvss/team/profile/*`
- `/atlvs/teams/[id]`

---

### 6. Utility Templates

#### ErrorPageTemplate ✨ NEW

**Use Case**: 404, 500, and other error pages

**Features**:
- Error code display
- Custom error icon
- Helpful error message
- Action buttons
- Maintains navigation consistency

**Example**:
```tsx
import { ErrorPageTemplate } from '@/components/templates/ErrorPageTemplate';

// 404 Page
<ErrorPageTemplate
  errorCode="404"
  title="Page Not Found"
  description="The page you're looking for doesn't exist or has been moved."
  icon={<FileQuestion className="w-24 h-24" />}
/>

// 500 Page
<ErrorPageTemplate
  errorCode="500"
  title="Server Error"
  description="Something went wrong on our end. We're working to fix it."
  showDefaultActions={false}
  actions={[
    { label: 'Try Again', onClick: () => window.location.reload() },
    { label: 'Go Home', href: '/' }
  ]}
/>
```

**Pages That Should Use This**:
- `/404.tsx`
- `/500.tsx`
- Error boundaries

---

#### SearchResultsPageTemplate ✨ NEW

**Use Case**: Search results, filtered listings

**Features**:
- Search bar with live search
- Faceted search sidebar
- Results grid/list toggle
- Sort options
- Pagination
- Empty state for no results
- Active filters display

**Example**:
```tsx
import { SearchResultsPageTemplate } from '@/components/templates/SearchResultsPageTemplate';

<SearchResultsPageTemplate
  query="electronic music"
  totalResults={42}
  results={<EventsGrid events={events} />}
  filters={[
    {
      id: 'genre',
      label: 'Genre',
      options: [
        { value: 'electronic', label: 'Electronic', count: 15 },
        { value: 'house', label: 'House', count: 12 }
      ]
    },
    {
      id: 'date',
      label: 'Date',
      type: 'radio',
      options: [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' }
      ]
    }
  ]}
  activeFilters={{ genre: ['electronic'] }}
  onFilterChange={handleFilterChange}
  sortOptions={[
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'price', label: 'Price' }
  ]}
  currentSort="relevance"
  onSortChange={handleSortChange}
  viewMode="grid"
  onViewModeChange={handleViewModeChange}
  currentPage={1}
  totalPages={5}
  onPageChange={handlePageChange}
/>
```

**Pages That Should Use This**:
- `/gvteway/events/search`
- `/gvteway/marketplace/search`
- Search result pages

---

## Migration Guide

### Step 1: Identify Page Pattern

Determine which template best fits your page:

- **Forms?** → `FormPageTemplate` or `WizardPageTemplate`
- **Settings?** → `SettingsPageTemplate`
- **Checkout?** → `CheckoutPageTemplate`
- **Profile?** → `ProfilePageTemplate`
- **Search?** → `SearchResultsPageTemplate`
- **Comparison?** → `ComparisonPageTemplate`
- **Error?** → `ErrorPageTemplate`
- **List?** → `ListPageTemplate`
- **Detail?** → `DetailPageTemplate`
- **Dashboard?** → `DashboardPageTemplate`

### Step 2: Replace Old Layout

**Before**:
```tsx
import { CompvssLayout } from '@/components/templates/CompvssLayout';

export default function MyPage() {
  return (
    <CompvssLayout>
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Custom form layout */}
      </div>
    </CompvssLayout>
  );
}
```

**After**:
```tsx
import { FormPageTemplate } from '@/components/templates/FormPageTemplate';

export default function MyPage() {
  return (
    <FormPageTemplate
      title="My Form"
      singleStep={<MyFormContent />}
      onSubmit={handleSubmit}
    />
  );
}
```

### Step 3: Extract Content

Move your page content into the template's content slots:

```tsx
// Extract form fields
function MyFormContent() {
  return (
    <div className="space-y-6">
      <Input label="Name" />
      <Input label="Email" />
      <Textarea label="Description" />
    </div>
  );
}
```

### Step 4: Test

- Verify responsive behavior
- Test form validation (if applicable)
- Check keyboard navigation
- Validate accessibility

---

## Best Practices

### 1. Use Server Components

All templates support server components by default:

```tsx
// ✅ Good - Server component
export default async function EventsPage() {
  const events = await fetchEvents();
  
  return (
    <ListPageTemplate
      title="Events"
      description="Discover live experiences"
    >
      <EventsGrid events={events} />
    </ListPageTemplate>
  );
}
```

### 2. Keep Templates Pure

Don't add business logic to templates. Keep them presentational:

```tsx
// ❌ Bad
<FormPageTemplate
  onSubmit={async () => {
    const data = await fetch('/api/...');
    // Complex business logic here
  }}
/>

// ✅ Good
<FormPageTemplate
  onSubmit={handleSubmit}
/>
```

### 3. Compose When Needed

Templates can be composed for complex pages:

```tsx
<SettingsPageTemplate
  sections={[
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <FormPageTemplate
          singleStep={<ProfileForm />}
          onSubmit={handleProfileSave}
          showProgressBar={false}
        />
      )
    }
  ]}
/>
```

### 4. Leverage TypeScript

Use type exports for better DX:

```tsx
import { FormPageTemplate, type FormStep } from '@/components/templates/FormPageTemplate';

const steps: FormStep[] = [
  { id: 'step1', title: 'Step 1', content: <Step1 /> },
  { id: 'step2', title: 'Step 2', content: <Step2 /> }
];
```

---

## Template Statistics

| Template | Pages Using | Impact |
|----------|-------------|--------|
| FormPageTemplate | 138 pages | High |
| SettingsPageTemplate | 44 pages | High |
| ListPageTemplate | 19 pages | Medium |
| CheckoutPageTemplate | 3 pages | Critical (Revenue) |
| ProfilePageTemplate | 15+ pages | Medium |
| WizardPageTemplate | 5+ pages | Medium |
| ErrorPageTemplate | All error pages | Low |
| SearchResultsPageTemplate | 10+ pages | Medium |
| ComparisonPageTemplate | 3+ pages | Medium |

**Total**: 200+ pages standardized with templates

---

## Support

For questions or issues with page templates:

1. Check this guide first
2. Review the template source code in `/src/components/templates/`
3. See examples in existing pages
4. Refer to `ATOMIC_DESIGN_SYSTEM.md` for component usage

---

**Last Updated**: November 18, 2025  
**Version**: 2.0.0  
**Status**: ✅ Complete
