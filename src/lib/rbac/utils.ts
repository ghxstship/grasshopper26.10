/**
 * RBAC Utility Functions
 * Helper functions for role and permission management
 */

import { prisma } from '@/lib/prisma';
import { Permission, getPermissionsForRole } from './permissions';
import { Role, getAllInheritedRoles } from './roles';

/**
 * Get user roles from database
 */
export async function getUserRoles(userId: string): Promise<Role[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return [];
  }

  // User has a single role, not an array of roles
  return [user.role as Role];
}

/**
 * Get user permissions based on their roles
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const roles = await getUserRoles(userId);
  const allPermissions = new Set<Permission>();

  for (const role of roles) {
    // Get direct permissions for the role
    const rolePermissions = getPermissionsForRole(role);
    rolePermissions.forEach((permission) => allPermissions.add(permission));

    // Get permissions from inherited roles
    const inheritedRoles = getAllInheritedRoles(role);
    for (const inheritedRole of inheritedRoles) {
      const inheritedPermissions = getPermissionsForRole(inheritedRole);
      inheritedPermissions.forEach((permission) => allPermissions.add(permission));
    }
  }

  return Array.from(allPermissions);
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(userId: string, role: Role): Promise<void> {
  // User has a single role field, not a many-to-many relation
  // Note: Role enum doesn't match UserRole enum - this needs architectural fix
  await prisma.user.update({
    where: { id: userId },
    data: {
      role: role as any,
    },
  });
}

/**
 * Remove role from user (sets to default CONSUMER role)
 */
export async function removeRoleFromUser(userId: string, _role: Role): Promise<void> {
  // Reset to default role
  await prisma.user.update({
    where: { id: userId },
    data: {
      role: 'CONSUMER',
    },
  });
}

/**
 * Check if user has permission
 */
export async function userHasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
}

/**
 * Check if user has role
 */
export async function userHasRole(userId: string, role: Role): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes(role);
}

/**
 * Get all users with a specific role
 */
export async function getUsersWithRole(role: Role) {
  const users = await prisma.user.findMany({
    where: { role: role as any },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return users;
}

/**
 * Get all users with a specific permission
 */
export async function getUsersWithPermission(permission: Permission) {
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const usersWithPermission = [];

  for (const user of allUsers) {
    const userPermissions = await getUserPermissions(user.id);
    if (userPermissions.includes(permission)) {
      usersWithPermission.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
  }

  return usersWithPermission;
}

/**
 * Initialize default roles in database (no-op since roles are enums)
 */
export async function initializeRoles() {
  // Roles are defined as enums in the schema, not in a separate table
  // This function is kept for backwards compatibility but does nothing
  return;
}

/**
 * Get organization members with their roles
 */
export async function getOrganizationMembers(organizationId: string) {
  const members = await prisma.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return members;
}

/**
 * Check if user is organization member
 */
export async function isOrganizationMember(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const member = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  return !!member;
}

/**
 * Check if user is organization admin
 */
export async function isOrganizationAdmin(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const member = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (!member) {
    return false;
  }

  // Check if member has OWNER or ADMIN role
  return member.role === 'OWNER' || member.role === 'ADMIN';
}
