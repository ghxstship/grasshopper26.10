# Getting Started with GVTEWAY + ATLVS

Welcome to the GVTEWAY + ATLVS Universal Event Ecosystem! This guide will help you get up and running quickly.

## 🎯 What You've Got

A fully functional Next.js application with:

✅ **Stunning Homepage** - Animated hero with dual-platform showcase  
✅ **GVTEWAY Platform Page** - Consumer platform overview with 9 modules  
✅ **ATLVS Platform Page** - Production platform overview with 6 core features  
✅ **Atomic Design System** - Reusable components (Button, Input, Card, Badge)  
✅ **Custom Typography** - Anton, Bebas Neue, Oswald, Share Tech fonts  
✅ **Brand Colors** - GVTEWAY (Red/Yellow/Blue) + ATLVS (Green/Orange/Purple)  
✅ **Responsive Design** - Mobile-first, fully responsive  
✅ **Smooth Animations** - Framer Motion powered  
✅ **Dark Mode Ready** - Theme system in place  

## 🚀 Quick Start

### 1. View the Application

The dev server is already running! Open your browser to:

**Local:** http://localhost:3000  
**Network:** http://192.168.0.141:3000

### 2. Explore the Pages

- **Homepage** (`/`) - Landing page with animated hero
- **GVTEWAY** (`/gvteway`) - Consumer platform overview
- **ATLVS** (`/atlvs`) - Production platform overview

### 3. Check Out the Design System

All components are in `/src/components/atoms/`:

```typescript
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

// GVTEWAY button
<Button variant="gvteway" size="lg" rounded="full">
  EXPLORE EVENTS
</Button>

// ATLVS button
<Button variant="atlvs" size="lg" rounded="full">
  START TRIAL
</Button>
```

## 🎨 Design System Usage

### Buttons

```tsx
// GVTEWAY variants
<Button variant="gvteway">Primary</Button>
<Button variant="gvteway-outline">Outline</Button>
<Button variant="gvteway-ghost">Ghost</Button>

// ATLVS variants
<Button variant="atlvs">Primary</Button>
<Button variant="atlvs-outline">Outline</Button>
<Button variant="atlvs-ghost">Ghost</Button>

// Standard variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Rounded
<Button rounded="default">Default</Button>
<Button rounded="full">Full</Button>
<Button rounded="none">None</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';

<Card variant="gvteway">
  <CardHeader>
    <CardTitle>Event Discovery</CardTitle>
    <CardDescription>Find your next adventure</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

### Badges

```tsx
<Badge variant="gvteway">GVTEWAY</Badge>
<Badge variant="atlvs">ATLVS</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
```

### Typography

```tsx
// Automatically styled with custom fonts
<h1>Title (Anton)</h1>
<h2>Heading 2 (Bebas Neue)</h2>
<h3>Heading 3 (Bebas Neue)</h3>
<p className="subtitle">Subtitle (Oswald)</p>
<p>Body text (Share Tech)</p>
<code>Code (Share Tech Mono)</code>
```

### Brand Gradients

```tsx
// GVTEWAY gradient background
<div className="gvteway-gradient">
  Content
</div>

// GVTEWAY gradient text
<span className="gvteway-text-gradient">
  GVTEWAY
</span>

// ATLVS gradient background
<div className="atlvs-gradient">
  Content
</div>

// ATLVS gradient text
<span className="atlvs-text-gradient">
  ATLVS
</span>
```

## 📁 Project Structure

```
gvteway-atlvs/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Homepage
│   │   ├── gvteway/           # GVTEWAY platform
│   │   ├── atlvs/             # ATLVS platform
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   └── atoms/             # Atomic components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── Badge.tsx
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── package.json               # Dependencies
├── README.md                  # Project overview
├── ARCHITECTURE.md            # Technical docs
├── PROJECT_STATUS.md          # Current status
└── .env.example               # Environment template
```

## 🎯 Next Steps

### 1. Set Up Database (Recommended Next)

```bash
# Install Prisma CLI
npm install -D prisma

# Initialize Prisma
npx prisma init

# Create your schema in prisma/schema.prisma
# Then run migrations
npx prisma migrate dev
```

### 2. Add Authentication

```bash
# Install NextAuth
npm install next-auth@beta

# Create auth configuration
# See ARCHITECTURE.md for details
```

### 3. Build Features

Start building out the platform features:

**GVTEWAY:**
- Event discovery page
- Ticketing system
- Marketplace
- Social features

**ATLVS:**
- Project dashboard
- Task management
- Team coordination
- Budget tracking

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📚 Documentation

- **[README.md](./README.md)** - Project overview and features
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current progress
- **[.env.example](./.env.example)** - Environment variables

## 🎨 Design Inspiration

The design is inspired by:
- **browserbase.com** - Clean, modern interface
- **posh.vip** - Bold typography and gradients
- **tixr.com** - Event-focused UX

## 🔧 Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  gvteway: {
    red: { /* your colors */ },
    yellow: { /* your colors */ },
    blue: { /* your colors */ },
  },
  atlvs: {
    green: { /* your colors */ },
    orange: { /* your colors */ },
    purple: { /* your colors */ },
  },
}
```

### Change Fonts

Edit `src/app/layout.tsx`:

```typescript
import { YourFont } from "next/font/google";

const yourFont = YourFont({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-your-font",
});
```

### Add New Components

Follow atomic design principles:

1. **Atoms** - Basic building blocks (buttons, inputs)
2. **Molecules** - Combinations of atoms (form fields)
3. **Organisms** - Complex components (navigation, cards)
4. **Templates** - Page layouts
5. **Pages** - Complete pages

## 🐛 Troubleshooting

### Dev Server Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Type Errors

```bash
# Regenerate types
npx prisma generate
```

### Style Not Applying

```bash
# Restart dev server
# Tailwind watches for changes automatically
```

## 💡 Tips

1. **Use the design system** - Don't create custom styles, use the components
2. **Follow atomic design** - Build small, reusable components
3. **Mobile first** - Design for mobile, enhance for desktop
4. **Accessibility** - Use semantic HTML and ARIA labels
5. **Performance** - Use Next.js Image, lazy loading, code splitting

## 🚀 Ready to Build?

You have a solid foundation! The design system is ready, the pages look great, and you're set up for success.

**Next recommended steps:**
1. Set up Supabase database
2. Implement authentication
3. Build event discovery (GVTEWAY)
4. Build project management (ATLVS)
5. Add Production Advancing system
6. Integrate N8N automation

## 📞 Need Help?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Review [PROJECT_STATUS.md](./PROJECT_STATUS.md) for progress
- See the master prompt documents for full specifications

---

**Built with GHXSTSHIP precision ⚓️**

**Happy coding! 🎉**
