# CSS & Component Quick Reference

Quick reference for the optimized CSS architecture after Nov 18, 2025 refactoring.

---

## Typography

### ✅ Use Components (Recommended)

```tsx
import { 
  HeroTitle, 
  PageTitle, 
  SectionHeader,
  SubsectionHeader,
  CardTitle,
  SmallHeader,
  Subtitle,
  BodyText,
  Metadata,
  Caption
} from "@/components/atoms/Typography";

// Hero title (h1)
<HeroTitle>Welcome to GVTEWAY</HeroTitle>

// Page title (h2)
<PageTitle>Discover Events</PageTitle>

// Section header (h3)
<SectionHeader>Featured Artists</SectionHeader>

// Subsection header (h4)
<SubsectionHeader>Upcoming Shows</SubsectionHeader>

// Card title (h5)
<CardTitle>Event Name</CardTitle>

// Small header (h6)
<SmallHeader>Details</SmallHeader>

// Subtitle
<Subtitle>Join 5,000+ members</Subtitle>

// Body text
<BodyText>Regular paragraph content goes here.</BodyText>

// Metadata (monospace)
<Metadata>Updated 2 hours ago</Metadata>

// Caption (small monospace)
<Caption>Photo by Artist Name</Caption>
```

---

## Buttons

### ✅ Use Button Component

```tsx
import { Button } from "@/components/atoms/Button";

// Standard variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Brand variants
<Button variant="gvteway">GVTEWAY</Button>
<Button variant="atlvs">ATLVS</Button>
<Button variant="compvss">COMPVSS</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icons
<Button leftIcon={<Icon />}>With Icon</Button>
<Button loading>Loading...</Button>
```

---

## Cards

### ✅ Use Card Component

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent, 
  CardFooter 
} from "@/components/atoms/Card";

<Card variant="default">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Brand variants
<Card variant="gvteway">...</Card>
<Card variant="atlvs">...</Card>
<Card variant="compvss">...</Card>
<Card variant="glass">...</Card>
```

---

## Layout

### ✅ Use Tailwind Utilities

#### Containers
```tsx
// Wide container (1440px)
<div className="max-w-7xl mx-auto px-8">
  {/* content */}
</div>

// Standard container (1200px)
<div className="max-w-6xl mx-auto px-8">
  {/* content */}
</div>

// Section padding
<section className="section-padding">
  {/* 6rem top/bottom, 3rem on mobile */}
</section>
```

#### Grids
```tsx
// 2 column grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// 3 column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// 4 column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

---

## Colors

### ✅ Use Tailwind Color Utilities

#### Grayscale
```tsx
// Background
<div className="bg-gray-100">Light background</div>
<div className="bg-gray-900">Dark background</div>

// Text
<p className="text-gray-700">Secondary text</p>
<p className="text-gray-500">Muted text</p>

// Border
<div className="border border-gray-300">Bordered</div>
```

#### Brand Colors
```tsx
// GVTEWAY
<div className="bg-gvteway-red-500">Red</div>
<div className="bg-gvteway-yellow-500">Yellow</div>
<div className="bg-gvteway-blue-500">Blue</div>

// ATLVS
<div className="bg-atlvs-green-500">Green</div>
<div className="bg-atlvs-orange-500">Orange</div>
<div className="bg-atlvs-purple-500">Purple</div>

// COMPVSS
<div className="bg-compvss-cyan-500">Cyan</div>
<div className="bg-compvss-teal-500">Teal</div>
<div className="bg-compvss-indigo-500">Indigo</div>
```

#### Semantic Colors
```tsx
<div className="bg-ghxst-black">Black</div>
<div className="bg-ghxst-white">White</div>
<div className="bg-ghxst-accent">Accent (Electric Blue)</div>
<div className="bg-ghxst-surface">Surface</div>
```

---

## Brand Gradients

### ✅ Use Gradient Classes

```tsx
// GVTEWAY gradient text
<h1 className="gvteway-text-gradient">
  GVTEWAY
</h1>

// ATLVS gradient text
<h1 className="atlvs-text-gradient">
  ATLVS
</h1>

// COMPVSS gradient text
<h1 className="compvss-text-gradient">
  COMPVSS
</h1>
```

---

## Text Sizing

### ✅ Use Tailwind Text Utilities

```tsx
<p className="text-xs">Extra small (12px)</p>
<p className="text-sm">Small (14px)</p>
<p className="text-base">Base (16px)</p>
<p className="text-lg">Large (18px)</p>
<p className="text-xl">Extra large (20px)</p>
<p className="text-2xl">2XL (24px)</p>
<p className="text-3xl">3XL (30px)</p>
<p className="text-4xl">4XL (36px)</p>
<p className="text-5xl">5XL (48px)</p>
<p className="text-6xl">6XL (60px)</p>
```

---

## Font Families

### ✅ Use Tailwind Font Utilities

```tsx
<h1 className="font-anton">Anton (Hero titles)</h1>
<h2 className="font-bebas">Bebas Neue (Headers)</h2>
<h3 className="font-oswald">Oswald (Subtitles)</h3>
<p className="font-share-tech">Share Tech (Body)</p>
<code className="font-share-tech-mono">Share Tech Mono (Code)</code>
```

---

## Accessibility

### ✅ Screen Reader Only

```tsx
<span className="sr-only">
  This text is only visible to screen readers
</span>
```

### ✅ Focus States

Focus states are automatically applied to interactive elements:
- 3px solid accent color outline
- 2px offset

---

## Responsive Design

### Breakpoints

```tsx
// Mobile first approach
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>

// Tailwind breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

---

## Common Patterns

### Hero Section
```tsx
<section className="section-padding bg-ghxst-black text-white">
  <div className="max-w-7xl mx-auto px-8">
    <HeroTitle className="gvteway-text-gradient mb-6">
      Welcome to GVTEWAY
    </HeroTitle>
    <Subtitle className="text-gray-300 mb-8">
      Your gateway to live entertainment
    </Subtitle>
    <Button variant="gvteway" size="lg">
      Get Started
    </Button>
  </div>
</section>
```

### Content Section
```tsx
<section className="section-padding">
  <div className="max-w-6xl mx-auto px-8">
    <SectionHeader className="mb-12">
      Featured Events
    </SectionHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map(event => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <BodyText>{event.description}</BodyText>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

---

## Migration Cheat Sheet

| ❌ Old (Don't Use) | ✅ New (Use This) |
|-------------------|------------------|
| `className="btn btn-primary"` | `<Button variant="primary">` |
| `className="card"` | `<Card>` |
| `className="grid-3"` | `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"` |
| `className="container-wide"` | `className="max-w-7xl mx-auto px-8"` |
| `className="text-xl"` (custom) | `className="text-xl"` (Tailwind) |
| `className="mono"` | `<Metadata>` or `<Caption>` |
| `<h1>` (unstyled) | `<HeroTitle>` or `<PageTitle>` |

---

## Need Help?

- **Full Migration Guide:** `docs/guides/CSS_OPTIMIZATION_MIGRATION.md`
- **Summary:** `CSS_OPTIMIZATION_SUMMARY.md`
- **Component Docs:** `/src/components/atoms/`
- **Tailwind Docs:** https://tailwindcss.com/docs
