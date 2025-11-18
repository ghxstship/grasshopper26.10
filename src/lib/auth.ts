import NextAuth from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";
import type { UserRole } from "@prisma/client";

// Create auth instance for server-side usage
const { auth: getServerAuth, handlers, signIn, signOut } = NextAuth(authConfig);

/**
 * Get the current authenticated user session
 * Use this in Server Components and API routes
 */
export async function getSession() {
  return await getServerAuth();
}

// Export NextAuth v5 auth function for direct use
export const auth = getServerAuth;
export { handlers, signIn, signOut };

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require authentication - throws if not authenticated
 * Use this in API routes that require authentication
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized - Authentication required");
  }
  
  return user;
}

/**
 * Require specific role(s) - throws if user doesn't have required role
 * @param roles - Single role or array of acceptable roles
 */
export async function requireRole(roles: UserRole | UserRole[]) {
  const user = await requireAuth();
  const acceptableRoles = Array.isArray(roles) ? roles : [roles];
  
  if (!acceptableRoles.includes(user.role as UserRole)) {
    throw new Error(`Forbidden - Required role: ${acceptableRoles.join(" or ")}`);
  }
  
  return user;
}

/**
 * Check if user has specific role
 * @param role - Role to check
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole("ADMIN");
}

/**
 * Get user with full profile data
 * Includes platform-specific profiles and organizations
 */
export async function getUserWithProfile(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      compvssProfile: true,
      atlvsProfile: true,
      organizations: {
        include: {
          organization: true,
        },
      },
      digitalWallets: true,
      cryptoWallets: true,
    },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      compvssProfile: true,
      atlvsProfile: true,
    },
  });
}

/**
 * Check if user has access to a specific platform
 * @param platform - Platform to check access for
 */
export async function hasPlatformAccess(
  platform: "GVTEWAY" | "COMPVSS" | "ATLVS"
): Promise<boolean> {
  const user = await getCurrentUser();
  
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  
  switch (platform) {
    case "GVTEWAY":
      return user.role === "CONSUMER";
    case "COMPVSS":
      return user.role === "EXTERNAL_TEAM";
    case "ATLVS":
      return user.role === "INTERNAL_TEAM";
    default:
      return false;
  }
}

/**
 * Verify user owns a resource
 * @param userId - User ID to check
 * @param resourceUserId - Resource owner's user ID
 */
export function verifyOwnership(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

/**
 * Create audit log entry
 * @param action - Action performed
 * @param entity - Entity type
 * @param entityId - Entity ID
 * @param metadata - Additional metadata
 */
export async function createAuditLog(
  action: string,
  entity: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  const user = await getCurrentUser();
  
  return await prisma.auditLog.create({
    data: {
      userId: user?.id,
      action,
      entity,
      entityId,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
    },
  });
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });
  
  return !!user?.emailVerified;
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { updatedAt: new Date() },
  });
}
