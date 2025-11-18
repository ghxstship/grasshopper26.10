/**
 * Event Categories Configuration
 * Centralized category definitions for GVTEWAY platform
 */

export const EVENT_CATEGORIES = [
  'All',
  'Music',
  'Sports',
  'Comedy',
  'Theater',
  'Festivals',
  'Conferences',
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];

/**
 * Advancing Request Categories
 * Must match AdvancingCategory enum in Prisma schema
 */
export const ADVANCING_CATEGORIES = [
  {
    id: 'ACCESS_CREDENTIALS' as const,
    name: 'Access & Credentials',
    description: 'Passes, badges, parking permits',
    examples: 'All-access passes, crew badges, vehicle permits',
  },
  {
    id: 'SITE_INFRASTRUCTURE' as const,
    name: 'Site Infrastructure',
    description: 'Stages, barriers, signage',
    examples: 'Main stage setup, crowd barriers, directional signs',
  },
  {
    id: 'SITE_ASSETS' as const,
    name: 'Site Assets',
    description: 'Tables, chairs, tents, equipment',
    examples: 'Folding tables, chairs, pop-up tents',
  },
  {
    id: 'SITE_UTILITIES' as const,
    name: 'Site Utilities',
    description: 'Power, water, internet',
    examples: 'Generator hookups, water supply, WiFi access',
  },
  {
    id: 'SITE_VEHICLES' as const,
    name: 'Site Vehicles',
    description: 'Carts, forklifts, trucks',
    examples: 'Golf carts, utility vehicles, cargo trucks',
  },
  {
    id: 'HEAVY_EQUIPMENT' as const,
    name: 'Heavy Equipment',
    description: 'Cranes, lifts, generators',
    examples: 'Scissor lifts, boom lifts, mobile cranes',
  },
  {
    id: 'TECHNICAL_PRODUCTION' as const,
    name: 'Technical Production',
    description: 'Audio, video, lighting',
    examples: 'Sound systems, LED screens, stage lighting',
  },
  {
    id: 'HOSPITALITY' as const,
    name: 'Hospitality',
    description: 'Catering, green rooms, amenities',
    examples: 'Catering services, artist dressing rooms',
  },
  {
    id: 'TRAVEL_LODGING' as const,
    name: 'Travel & Lodging',
    description: 'People transportation, accommodation, hotels',
    examples: 'Flights, ground transport, hotel bookings, crew travel',
  },
  {
    id: 'LOGISTICS' as const,
    name: 'Logistics',
    description: 'Freight, shipping, cargo transport',
    examples: 'Equipment shipping, freight forwarding, cargo transport',
  },
] as const;

export type AdvancingCategoryId = typeof ADVANCING_CATEGORIES[number]['id'];
