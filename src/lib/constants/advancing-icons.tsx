import { FileCheck, Building2, Package, Zap, Truck, Construction, Camera, UtensilsCrossed, Plane, PackageCheck } from 'lucide-react';

/**
 * Icon mapping for Advancing Request Categories
 * Matches AdvancingCategory enum from Prisma schema
 */
export const ADVANCING_CATEGORY_ICONS = {
  ACCESS_CREDENTIALS: FileCheck,
  SITE_INFRASTRUCTURE: Building2,
  SITE_ASSETS: Package,
  SITE_UTILITIES: Zap,
  SITE_VEHICLES: Truck,
  HEAVY_EQUIPMENT: Construction,
  TECHNICAL_PRODUCTION: Camera,
  HOSPITALITY: UtensilsCrossed,
  TRAVEL_LODGING: Plane,
  LOGISTICS: PackageCheck,
} as const;
