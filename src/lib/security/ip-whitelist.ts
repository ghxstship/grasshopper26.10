/**
 * IP Whitelisting for Admin Endpoints
 * Restricts access to sensitive endpoints based on IP address
 */

import { NextRequest } from 'next/server';

// Whitelist configuration (move to environment variables in production)
const ADMIN_IP_WHITELIST = process.env.ADMIN_IP_WHITELIST?.split(',') || [];
const LEGEND_IP_WHITELIST = process.env.LEGEND_IP_WHITELIST?.split(',') || [];

// Allow localhost in development
const LOCALHOST_IPS = ['127.0.0.1', '::1', 'localhost'];

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: NextRequest): string {
  // Try various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Standard forwarded header
  if (forwarded) {
    // Take the first IP if multiple
    return forwarded.split(',')[0].trim();
  }
  
  // Real IP header
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Check if IP is in whitelist
 */
export function isIpWhitelisted(ip: string, whitelist: string[]): boolean {
  // Allow localhost in development
  if (process.env.NODE_ENV === 'development' && LOCALHOST_IPS.includes(ip)) {
    return true;
  }
  
  // Check exact match
  if (whitelist.includes(ip)) {
    return true;
  }
  
  // Check CIDR ranges
  for (const entry of whitelist) {
    if (entry.includes('/')) {
      if (isIpInCidr(ip, entry)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if IP is in CIDR range
 * Simple implementation for IPv4
 */
function isIpInCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  
  const ipNum = ipToNumber(ip);
  const rangeNum = ipToNumber(range);
  
  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * Convert IP address to number
 */
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

/**
 * Middleware to check admin IP whitelist
 */
export function requireAdminIp(request: NextRequest): {
  allowed: boolean;
  ip: string;
  reason?: string;
} {
  const ip = getClientIp(request);
  
  if (ip === 'unknown') {
    return {
      allowed: false,
      ip,
      reason: 'Unable to determine client IP',
    };
  }
  
  // Check if IP is whitelisted
  const allowed = isIpWhitelisted(ip, ADMIN_IP_WHITELIST);
  
  return {
    allowed,
    ip,
    reason: allowed ? undefined : 'IP not whitelisted for admin access',
  };
}

/**
 * Middleware to check Legend role IP whitelist
 */
export function requireLegendIp(request: NextRequest): {
  allowed: boolean;
  ip: string;
  reason?: string;
} {
  const ip = getClientIp(request);
  
  if (ip === 'unknown') {
    return {
      allowed: false,
      ip,
      reason: 'Unable to determine client IP',
    };
  }
  
  // Check if IP is whitelisted
  const allowed = isIpWhitelisted(ip, LEGEND_IP_WHITELIST);
  
  return {
    allowed,
    ip,
    reason: allowed ? undefined : 'IP not whitelisted for Legend role access',
  };
}

/**
 * Add IP to whitelist (requires database storage in production)
 */
export async function addIpToWhitelist(
  ip: string,
  type: 'admin' | 'legend',
  addedBy: string,
  reason?: string
): Promise<void> {
  // In production, store in database
  // For now, log the action
  console.log(`IP ${ip} added to ${type} whitelist by ${addedBy}`, { reason });
  
  // TODO: Implement database storage
  // await prisma.ipWhitelist.create({
  //   data: {
  //     ip,
  //     type,
  //     addedBy,
  //     reason,
  //   },
  // });
}

/**
 * Remove IP from whitelist
 */
export async function removeIpFromWhitelist(
  ip: string,
  type: 'admin' | 'legend',
  removedBy: string,
  reason?: string
): Promise<void> {
  // In production, update database
  console.log(`IP ${ip} removed from ${type} whitelist by ${removedBy}`, { reason });
  
  // TODO: Implement database storage
  // await prisma.ipWhitelist.update({
  //   where: { ip_type: { ip, type } },
  //   data: {
  //     revokedAt: new Date(),
  //     revokedBy: removedBy,
  //     revokeReason: reason,
  //   },
  // });
}

/**
 * Check if request is from a trusted network
 */
export function isTrustedNetwork(request: NextRequest): boolean {
  const ip = getClientIp(request);
  
  // Check if from Cloudflare (if using Cloudflare)
  const cfRay = request.headers.get('cf-ray');
  if (cfRay) {
    return true;
  }
  
  // Check if from known CDN/proxy
  const via = request.headers.get('via');
  if (via?.includes('cloudflare') || via?.includes('vercel')) {
    return true;
  }
  
  // Check if from whitelisted IP
  return isIpWhitelisted(ip, [...ADMIN_IP_WHITELIST, ...LEGEND_IP_WHITELIST]);
}
