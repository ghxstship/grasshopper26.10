#!/usr/bin/env ts-node
/**
 * Database Schema Validation Script
 * Validates Prisma schema against actual database
 * Checks for missing indexes, constraints, and RLS policies
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ValidationResult {
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: string;
}

const results: ValidationResult[] = [];

async function validateTables() {
  console.log('\n🔍 Validating Tables...\n');
  
  try {
    // Check if all expected tables exist
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    
    const expectedTables = [
      'users', 'accounts', 'sessions', 'events', 'tickets', 'orders',
      'products', 'advancing_requests', 'projects', 'tasks', 'equipment'
    ];
    
    const tableNames = tables.map(t => t.tablename);
    
    for (const expected of expectedTables) {
      if (tableNames.includes(expected)) {
        results.push({
          category: 'Tables',
          status: 'PASS',
          message: `Table "${expected}" exists`
        });
      } else {
        results.push({
          category: 'Tables',
          status: 'FAIL',
          message: `Table "${expected}" is missing`
        });
      }
    }
  } catch (error) {
    results.push({
      category: 'Tables',
      status: 'FAIL',
      message: 'Failed to validate tables',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

async function validateIndexes() {
  console.log('\n🔍 Validating Indexes...\n');
  
  try {
    const indexes = await prisma.$queryRaw<Array<{ 
      tablename: string;
      indexname: string;
    }>>`
      SELECT tablename, indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;
    
    // Critical indexes that must exist
    const criticalIndexes = [
      { table: 'users', index: 'users_email_key' },
      { table: 'tickets', index: 'tickets_qrCode_key' },
      { table: 'orders', index: 'orders_orderNumber_key' },
      { table: 'events', index: 'events_slug_key' }
    ];
    
    for (const { table, index } of criticalIndexes) {
      const exists = indexes.some(i => 
        i.tablename === table && i.indexname === index
      );
      
      if (exists) {
        results.push({
          category: 'Indexes',
          status: 'PASS',
          message: `Critical index "${index}" exists on "${table}"`
        });
      } else {
        results.push({
          category: 'Indexes',
          status: 'FAIL',
          message: `Critical index "${index}" missing on "${table}"`
        });
      }
    }
    
    results.push({
      category: 'Indexes',
      status: 'PASS',
      message: `Total indexes found: ${indexes.length}`
    });
  } catch (error) {
    results.push({
      category: 'Indexes',
      status: 'FAIL',
      message: 'Failed to validate indexes',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

async function validateConstraints() {
  console.log('\n🔍 Validating Constraints...\n');
  
  try {
    const constraints = await prisma.$queryRaw<Array<{
      table_name: string;
      constraint_name: string;
      constraint_type: string;
    }>>`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_type;
    `;
    
    const foreignKeys = constraints.filter(c => c.constraint_type === 'FOREIGN KEY');
    const uniqueConstraints = constraints.filter(c => c.constraint_type === 'UNIQUE');
    const primaryKeys = constraints.filter(c => c.constraint_type === 'PRIMARY KEY');
    
    results.push({
      category: 'Constraints',
      status: 'PASS',
      message: `Foreign Keys: ${foreignKeys.length}, Unique: ${uniqueConstraints.length}, Primary Keys: ${primaryKeys.length}`
    });
  } catch (error) {
    results.push({
      category: 'Constraints',
      status: 'FAIL',
      message: 'Failed to validate constraints',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

async function validateRLS() {
  console.log('\n🔍 Validating Row Level Security...\n');
  
  try {
    const rlsTables = await prisma.$queryRaw<Array<{
      tablename: string;
      rowsecurity: boolean;
    }>>`
      SELECT 
        tablename,
        rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    
    const tablesWithRLS = rlsTables.filter(t => t.rowsecurity);
    const tablesWithoutRLS = rlsTables.filter(t => !t.rowsecurity);
    
    results.push({
      category: 'RLS',
      status: 'PASS',
      message: `Tables with RLS: ${tablesWithRLS.length}, Without RLS: ${tablesWithoutRLS.length}`
    });
    
    if (tablesWithoutRLS.length > 0) {
      results.push({
        category: 'RLS',
        status: 'WARNING',
        message: 'Some tables do not have RLS enabled',
        details: tablesWithoutRLS.map(t => t.tablename).join(', ')
      });
    }
  } catch (error) {
    results.push({
      category: 'RLS',
      status: 'FAIL',
      message: 'Failed to validate RLS',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

async function validateEnums() {
  console.log('\n🔍 Validating Enums...\n');
  
  try {
    const enums = await prisma.$queryRaw<Array<{
      typname: string;
    }>>`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e'
      ORDER BY typname;
    `;
    
    const expectedEnums = [
      'UserRole', 'EventStatus', 'TicketStatus', 'OrderStatus',
      'AdvancingStatus', 'Priority', 'TaskStatus', 'EquipmentStatus',
      'ScheduleType', 'DocumentType', 'MaintenanceType'
    ];
    
    const enumNames = enums.map(e => e.typname);
    
    for (const expected of expectedEnums) {
      if (enumNames.includes(expected)) {
        results.push({
          category: 'Enums',
          status: 'PASS',
          message: `Enum "${expected}" exists`
        });
      } else {
        results.push({
          category: 'Enums',
          status: 'WARNING',
          message: `Enum "${expected}" is missing`
        });
      }
    }
  } catch (error) {
    results.push({
      category: 'Enums',
      status: 'FAIL',
      message: 'Failed to validate enums',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

async function validateRelations() {
  console.log('\n🔍 Validating Relations...\n');
  
  try {
    // Test critical relations
    const userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();
    
    results.push({
      category: 'Relations',
      status: 'PASS',
      message: `Database accessible: ${userCount} users, ${eventCount} events`
    });
  } catch (error) {
    results.push({
      category: 'Relations',
      status: 'FAIL',
      message: 'Failed to validate relations',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

function printResults() {
  console.log('\n' + '='.repeat(80));
  console.log('DATABASE VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');
  
  const categories = [...new Set(results.map(r => r.category))];
  
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category);
    const passed = categoryResults.filter(r => r.status === 'PASS').length;
    const failed = categoryResults.filter(r => r.status === 'FAIL').length;
    const warnings = categoryResults.filter(r => r.status === 'WARNING').length;
    
    console.log(`\n📊 ${category}:`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);
    
    // Show failures and warnings
    const issues = categoryResults.filter(r => r.status !== 'PASS');
    if (issues.length > 0) {
      console.log('\n   Issues:');
      for (const issue of issues) {
        const icon = issue.status === 'FAIL' ? '❌' : '⚠️';
        console.log(`   ${icon} ${issue.message}`);
        if (issue.details) {
          console.log(`      Details: ${issue.details}`);
        }
      }
    }
  }
  
  const totalPassed = results.filter(r => r.status === 'PASS').length;
  const totalFailed = results.filter(r => r.status === 'FAIL').length;
  const totalWarnings = results.filter(r => r.status === 'WARNING').length;
  
  console.log('\n' + '='.repeat(80));
  console.log(`SUMMARY: ${totalPassed} passed, ${totalFailed} failed, ${totalWarnings} warnings`);
  console.log('='.repeat(80) + '\n');
  
  if (totalFailed > 0) {
    console.log('❌ Validation FAILED - Critical issues found');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('⚠️  Validation PASSED with warnings');
    process.exit(0);
  } else {
    console.log('✅ Validation PASSED - All checks successful');
    process.exit(0);
  }
}

async function main() {
  console.log('🚀 Starting Database Validation...\n');
  
  try {
    await validateTables();
    await validateIndexes();
    await validateConstraints();
    await validateRLS();
    await validateEnums();
    await validateRelations();
    
    printResults();
  } catch (error) {
    console.error('❌ Validation failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
