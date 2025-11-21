/**
 * Shared Metadata Configuration
 * Centralized metadata for consistent SEO across the app
 */

import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Grasshopper',
  description: 'GVTEWAY, ATLVS, and COMPVSS - Comprehensive event management ecosystem',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://grasshopper.app',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/grasshopper',
    github: 'https://github.com/grasshopper',
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'events',
    'tickets',
    'event management',
    'project management',
    'compensation',
    'vendor settlement',
  ],
  authors: [
    {
      name: 'Grasshopper',
      url: siteConfig.url,
    },
  ],
  creator: 'Grasshopper',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@grasshopper',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Platform-specific metadata
export const atlvsMetadata: Metadata = {
  title: {
    default: 'ATLVS - Project Management',
    template: '%s | ATLVS',
  },
  description: 'Advanced project management and advancing platform for events',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'ATLVS - Project Management',
    description: 'Advanced project management and advancing platform for events',
  },
};

export const compvssMetadata: Metadata = {
  title: {
    default: 'COMPVSS - Compensation Management',
    template: '%s | COMPVSS',
  },
  description: 'Comprehensive compensation and vendor settlement system',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'COMPVSS - Compensation Management',
    description: 'Comprehensive compensation and vendor settlement system',
  },
};

export const gvtewayMetadata: Metadata = {
  title: {
    default: 'GVTEWAY - Events & Experiences',
    template: '%s | GVTEWAY',
  },
  description: 'Discover and book unforgettable events and experiences',
  openGraph: {
    ...defaultMetadata.openGraph,
    title: 'GVTEWAY - Events & Experiences',
    description: 'Discover and book unforgettable events and experiences',
  },
};
