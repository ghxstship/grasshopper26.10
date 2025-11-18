/**
 * Seed Script: Organizational Hierarchy Catalog
 * Populates the catalog system with departments, teams, and positions
 */

import { PrismaClient } from '@prisma/client';
import { ORGANIZATIONAL_HIERARCHY } from './organizational-hierarchy';

const prisma = new PrismaClient();

async function seedOrganizationalCatalog() {
  console.log('🌱 Seeding organizational hierarchy catalog...\n');

  try {
    // Create or get the "Teams & Positions" category
    const teamsCategory = await prisma.catalogCategory.upsert({
      where: { slug: 'teams-positions' },
      update: {
        name: 'Teams & Positions',
        description: 'Organizational hierarchy: departments, teams, and positions',
        icon: 'users',
        order: 1,
        active: true,
      },
      create: {
        name: 'Teams & Positions',
        slug: 'teams-positions',
        description: 'Organizational hierarchy: departments, teams, and positions',
        icon: 'users',
        order: 1,
        active: true,
      },
    });

    console.log(`✅ Created/Updated category: ${teamsCategory.name}`);

    let departmentCount = 0;
    let teamCount = 0;
    let positionCount = 0;

    // Process each department
    for (const department of ORGANIZATIONAL_HIERARCHY) {
      console.log(`\n📁 Processing Department: ${department.code} - ${department.name}`);

      // Create department as subcategory
      const departmentSubcategory = await prisma.catalogSubcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: teamsCategory.id,
            slug: department.code,
          },
        },
        update: {
          name: department.name,
          description: department.description,
          order: parseInt(department.code),
          active: true,
        },
        create: {
          categoryId: teamsCategory.id,
          name: department.name,
          slug: department.code,
          description: department.description,
          order: parseInt(department.code),
          active: true,
        },
      });

      departmentCount++;

      // Process each team within the department
      for (const team of department.teams) {
        console.log(`  👥 Team: ${team.code} - ${team.name}`);

        // Create team as catalog item
        await prisma.catalogItem.upsert({
          where: {
            categoryId_slug: {
              categoryId: teamsCategory.id,
              slug: team.code,
            },
          },
          update: {
            name: team.name,
            description: team.description,
            subcategoryId: departmentSubcategory.id,
            standardUnit: 'team',
            tags: ['team', department.name.toLowerCase()],
            searchTerms: [team.name.toLowerCase(), team.code],
            isGlobal: true,
            active: true,
            order: parseInt(team.code),
            metadata: {
              type: 'team',
              departmentCode: department.code,
              departmentName: department.name,
              teamCode: team.code,
            },
          },
          create: {
            categoryId: teamsCategory.id,
            subcategoryId: departmentSubcategory.id,
            name: team.name,
            slug: team.code,
            description: team.description,
            standardUnit: 'team',
            tags: ['team', department.name.toLowerCase()],
            searchTerms: [team.name.toLowerCase(), team.code],
            isGlobal: true,
            active: true,
            order: parseInt(team.code),
            metadata: {
              type: 'team',
              departmentCode: department.code,
              departmentName: department.name,
              teamCode: team.code,
            },
          },
        });

        teamCount++;

        // Process each position within the team
        for (const position of team.positions) {
          const alternateNames = position.alternateNames || [];
          const searchTerms = [
            position.title.toLowerCase(),
            position.code,
            ...alternateNames.map(n => n.toLowerCase()),
          ];

          await prisma.catalogItem.upsert({
            where: {
              categoryId_slug: {
                categoryId: teamsCategory.id,
                slug: position.code,
              },
            },
            update: {
              name: position.title,
              description: position.description,
              subcategoryId: departmentSubcategory.id,
              standardUnit: 'person',
              alternateNames,
              tags: [
                'position',
                position.level,
                department.name.toLowerCase(),
                team.name.toLowerCase(),
              ],
              searchTerms,
              requiresCertification: (position.requiredCertifications?.length || 0) > 0,
              isGlobal: true,
              active: true,
              order: parseInt(position.code),
              metadata: {
                type: 'position',
                departmentCode: department.code,
                departmentName: department.name,
                teamCode: team.code,
                teamName: team.name,
                positionCode: position.code,
                level: position.level,
                requiredCertifications: position.requiredCertifications || [],
                typicalResponsibilities: position.typicalResponsibilities || [],
              },
            },
            create: {
              categoryId: teamsCategory.id,
              subcategoryId: departmentSubcategory.id,
              name: position.title,
              slug: position.code,
              description: position.description,
              standardUnit: 'person',
              alternateNames,
              tags: [
                'position',
                position.level,
                department.name.toLowerCase(),
                team.name.toLowerCase(),
              ],
              searchTerms,
              requiresCertification: (position.requiredCertifications?.length || 0) > 0,
              isGlobal: true,
              active: true,
              order: parseInt(position.code),
              metadata: {
                type: 'position',
                departmentCode: department.code,
                departmentName: department.name,
                teamCode: team.code,
                teamName: team.name,
                positionCode: position.code,
                level: position.level,
                requiredCertifications: position.requiredCertifications || [],
                typicalResponsibilities: position.typicalResponsibilities || [],
              },
            },
          });

          positionCount++;
        }
      }
    }

    console.log('\n✨ Organizational hierarchy catalog seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Departments: ${departmentCount}`);
    console.log(`   Teams: ${teamCount}`);
    console.log(`   Positions: ${positionCount}`);
    console.log(`   Total Items: ${teamCount + positionCount}`);
  } catch (error) {
    console.error('❌ Error seeding organizational catalog:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedOrganizationalCatalog();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
