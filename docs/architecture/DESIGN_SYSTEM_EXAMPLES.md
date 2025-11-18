# Design System Usage Examples

> **Real-world examples for implementing the atomic design system**

---

## Example 1: Complete Dashboard Page (ATLVS)

```tsx
'use client';

import { useState } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
import {
  AtlvsLayout,
  ContentLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  DataTable,
  ModalForm,
  FormField,
  Input,
  Textarea,
} from '@/components';

export default function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const user = {
    name: 'Sarah Johnson',
    email: 'sarah@atlvs.com',
    avatar: '/avatars/sarah.jpg',
  };

  const projects = [
    { id: 1, name: 'Summer Festival 2025', status: 'active', budget: 50000 },
    { id: 2, name: 'Corporate Event', status: 'planning', budget: 25000 },
  ];

  return (
    <AtlvsLayout user={user} notifications={3}>
      <ContentLayout
        title="Projects"
        description="Manage your production projects"
        breadcrumbs={[
          { label: 'Dashboard', href: '/atlvs' },
          { label: 'Projects' },
        ]}
        onSearch={setSearchQuery}
        searchPlaceholder="Search projects..."
        onFilter={() => console.log('Filter clicked')}
        actions={[
          {
            label: 'Export',
            icon: <Download className="h-4 w-4" />,
            onClick: () => console.log('Export'),
            variant: 'outline',
          },
        ]}
        primaryAction={{
          label: 'New Project',
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setIsCreateModalOpen(true),
          variant: 'atlvs',
        }}
        variant="atlvs"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card variant="atlvs">
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bebas">12</div>
              <Badge variant="success">+2 this month</Badge>
            </CardContent>
          </Card>
          
          <Card variant="atlvs">
            <CardHeader>
              <CardTitle>Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bebas">$450K</div>
              <Badge variant="info">On track</Badge>
            </CardContent>
          </Card>
          
          <Card variant="atlvs">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bebas">24</div>
              <Badge variant="atlvs">Full capacity</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            <DataTable
              data={projects}
              columns={[
                { key: 'name', label: 'Project Name' },
                { key: 'status', label: 'Status' },
                { key: 'budget', label: 'Budget' },
              ]}
            />
          </CardContent>
        </Card>

        {/* Create Project Modal */}
        <ModalForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Project"
          description="Fill in the project details below"
          onSubmit={() => console.log('Create project')}
          submitLabel="Create Project"
          variant="atlvs"
        >
          <div className="space-y-4">
            <FormField label="Project Name" required>
              <Input placeholder="Enter project name" variant="atlvs" />
            </FormField>
            
            <FormField label="Description">
              <Textarea placeholder="Project description" variant="atlvs" />
            </FormField>
            
            <FormField label="Budget">
              <Input type="number" placeholder="0.00" variant="atlvs" />
            </FormField>
          </div>
        </ModalForm>
      </ContentLayout>
    </AtlvsLayout>
  );
}
```

---

## Example 2: Form with Validation (COMPVSS)

```tsx
'use client';

import { useState } from 'react';
import {
  CompvssLayout,
  ContentLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FormField,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  Alert,
} from '@/components';

export default function AdvancingFormPage() {
  const [formData, setFormData] = useState({
    venue: '',
    date: '',
    notes: '',
    confirmed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    // Validation logic
    const newErrors: Record<string, string> = {};
    if (!formData.venue) newErrors.venue = 'Venue is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit logic
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <CompvssLayout user={{ name: 'Mike Chen' }} notifications={2}>
      <ContentLayout
        title="Advancing Submission"
        description="Submit venue and logistics information"
        breadcrumbs={[
          { label: 'Dashboard', href: '/compvss' },
          { label: 'Advancing', href: '/compvss/advancing' },
          { label: 'New Submission' },
        ]}
        variant="compvss"
        showToolbar={false}
      >
        {showSuccess && (
          <Alert
            variant="success"
            title="Success!"
            onClose={() => setShowSuccess(false)}
          >
            Your advancing submission has been saved.
          </Alert>
        )}

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Venue Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormField
                label="Venue Name"
                required
                error={errors.venue}
                hint="Enter the full venue name"
              >
                <Input
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  placeholder="Madison Square Garden"
                  variant="compvss"
                />
              </FormField>

              <FormField label="Event Date" required error={errors.date}>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  variant="compvss"
                />
              </FormField>

              <FormField label="Category" required>
                <Select variant="compvss">
                  <option value="">Select category</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="transportation">Transportation</option>
                  <option value="accommodation">Accommodation</option>
                </Select>
              </FormField>

              <FormField label="Additional Notes">
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any special requirements or notes..."
                  variant="compvss"
                />
              </FormField>

              <FormField>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.confirmed}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmed: e.target.checked })
                    }
                    variant="compvss"
                  />
                  <span className="text-sm">
                    I confirm all information is accurate
                  </span>
                </label>
              </FormField>

              <div className="flex gap-3">
                <Button variant="outline">Cancel</Button>
                <Button
                  variant="compvss"
                  onClick={handleSubmit}
                  disabled={!formData.confirmed}
                >
                  Submit Advancing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </CompvssLayout>
  );
}
```

---

## Example 3: Search & Filter Interface (GVTEWAY)

```tsx
'use client';

import { useState } from 'react';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import {
  GvtewayLayout,
  ContentLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FilterPanel,
  Badge,
  Button,
  EmptyState,
  Pagination,
} from '@/components';

export default function EventsPage() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filterGroups = [
    {
      id: 'category',
      label: 'Category',
      options: [
        { label: 'Music', value: 'music', count: 45 },
        { label: 'Sports', value: 'sports', count: 23 },
        { label: 'Arts', value: 'arts', count: 12 },
      ],
    },
    {
      id: 'price',
      label: 'Price Range',
      options: [
        { label: 'Free', value: 'free', count: 8 },
        { label: 'Under $50', value: 'under-50', count: 34 },
        { label: '$50-$100', value: '50-100', count: 28 },
        { label: 'Over $100', value: 'over-100', count: 15 },
      ],
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: 'July 15, 2025',
      location: 'Central Park',
      price: '$75',
    },
    // ... more events
  ];

  return (
    <GvtewayLayout user={{ name: 'Alex Rivera' }} notifications={5}>
      <ContentLayout
        title="Discover Events"
        description="Find your next adventure"
        onSearch={(query) => console.log('Search:', query)}
        searchPlaceholder="Search events..."
        variant="gvteway"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <FilterPanel
                  groups={filterGroups}
                  selectedFilters={filters}
                  onFilterChange={(groupId, values) =>
                    setFilters({ ...filters, [groupId]: values })
                  }
                  onClear={() => setFilters({})}
                  variant="gvteway"
                />
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3 space-y-6">
            {events.length === 0 ? (
              <EmptyState
                icon={<Calendar className="h-12 w-12" />}
                title="No events found"
                description="Try adjusting your filters or search query"
                action={{
                  label: 'Clear Filters',
                  onClick: () => setFilters({}),
                  variant: 'gvteway',
                }}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <Card key={event.id} variant="gvteway">
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <Badge variant="gvteway">{event.price}</Badge>
                            <Button variant="gvteway" size="sm">
                              Get Tickets
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                  variant="gvteway"
                />
              </>
            )}
          </div>
        </div>
      </ContentLayout>
    </GvtewayLayout>
  );
}
```

---

## Example 4: Command Palette Integration

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Settings, Users, Calendar } from 'lucide-react';
import { CommandPalette } from '@/components';

export default function AppWithCommandPalette({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Open with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    {
      id: 'new-project',
      label: 'Create New Project',
      description: 'Start a new production project',
      icon: <Plus className="h-4 w-4" />,
      shortcut: '⌘N',
      onSelect: () => console.log('New project'),
      category: 'Actions',
    },
    {
      id: 'search-events',
      label: 'Search Events',
      description: 'Find events and shows',
      icon: <Search className="h-4 w-4" />,
      shortcut: '⌘E',
      onSelect: () => console.log('Search events'),
      category: 'Navigation',
    },
    {
      id: 'team-settings',
      label: 'Team Settings',
      description: 'Manage team members and permissions',
      icon: <Users className="h-4 w-4" />,
      onSelect: () => console.log('Team settings'),
      category: 'Settings',
    },
  ];

  return (
    <>
      {children}
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={commands}
        variant="atlvs"
      />
    </>
  );
}
```

---

## Example 5: Responsive Sidebar with Mobile Support

```tsx
'use client';

import { useState } from 'react';
import {
  Sidebar,
  Navbar,
  type SidebarSection,
} from '@/components';
import { Home, Calendar, Users, Settings } from 'lucide-react';

export default function ResponsiveLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarSections: SidebarSection[] = [
    {
      items: [
        { label: 'Dashboard', href: '/', icon: <Home className="h-5 w-5" /> },
        { label: 'Events', href: '/events', icon: <Calendar className="h-5 w-5" /> },
        { label: 'Team', href: '/team', icon: <Users className="h-5 w-5" /> },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Preferences', href: '/settings', icon: <Settings className="h-5 w-5" /> },
      ],
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          sections={sidebarSections}
          variant="atlvs"
          collapsible
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <Sidebar
              sections={sidebarSections}
              variant="atlvs"
              collapsible={false}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          logo={<span className="font-bebas text-xl">ATLVS</span>}
          user={{ name: 'John Doe' }}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          variant="atlvs"
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

**Built with GHXSTSHIP precision ⚓️**
