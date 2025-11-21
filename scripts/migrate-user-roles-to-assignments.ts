/**
 * Migration Script: Backfill User Roles to RoleAssignment Table
 * 
 * This script migrates existing User.role values to the new RoleAssignment table.
 * It maps the broad UserRole enum values to more specific Role enum values.
 */

import { PrismaClient, UserRole } from '@prisma/client';
import { Role } from '../src/lib/rbac/roles';

const prisma = new PrismaClient();

// Mapping from UserRole to Role
const userRoleToRoleMap: Record<UserRole, Role> = {
  // Legend Roles
  LEGEND_SUPER_ADMIN: Role.LEGEND_SUPER_ADMIN,
  LEGEND_ADMIN: Role.LEGEND_ADMIN,
  LEGEND_DEVELOPER: Role.LEGEND_DEVELOPER,
  LEGEND_COLLABORATOR: Role.LEGEND_COLLABORATOR,
  LEGEND_SUPPORT: Role.LEGEND_SUPPORT,
  LEGEND_INCOGNITO: Role.LEGEND_INCOGNITO,
  
  // Map broad roles to platform-specific defaults
  CONSUMER: Role.GVTEWAY_CUSTOMER,      // GVTEWAY user
  EXTERNAL_TEAM: Role.COMPVSS_TEAM_MEMBER, // COMPVSS user
  INTERNAL_TEAM: Role.ATLVS_TEAM_MEMBER,    // ATLVS user
  ADMIN: Role.SUPER_ADMIN,                  // System admin
};

async function migrateUserRoles() {
  console.log('🚀 Starting user role migration...\n');

  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    console.log(`📊 Found ${users.length} users to migrate\n`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if user already has role assignments
      const existingAssignments = await prisma.roleAssignment.count({
        where: { userId: user.id },
      });

      if (existingAssignments > 0) {
        console.log(`⏭️  Skipping ${user.email} - already has role assignments`);
        skippedCount++;
        continue;
      }

      // Map UserRole to Role
      const mappedRole = userRoleToRoleMap[user.role];

      if (!mappedRole) {
        console.warn(`⚠️  No mapping found for role ${user.role} for user ${user.email}`);
        continue;
      }

      // Determine platform based on role
      let platform = 'system';
      if (mappedRole.startsWith('gvteway:')) {
        platform = 'gvteway';
      } else if (mappedRole.startsWith('compvss:')) {
        platform = 'compvss';
      } else if (mappedRole.startsWith('atlvs:')) {
        platform = 'atlvs';
      } else if (mappedRole.startsWith('legend:')) {
        platform = 'legend';
      }

      // Create role assignment
      await prisma.roleAssignment.create({
        data: {
          userId: user.id,
          role: mappedRole,
          platform,
          grantedBy: null, // System migration
          context: null,
        },
      });

      console.log(`✅ Migrated ${user.email}: ${user.role} -> ${mappedRole}`);
      migratedCount++;
    }

    console.log(`\n✨ Migration complete!`);
    console.log(`   Migrated: ${migratedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Total: ${users.length}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateUserRoles()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration error:', error);
    process.exit(1);
  });
