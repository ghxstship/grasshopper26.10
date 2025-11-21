#!/usr/bin/env node
/**
 * Full Stack Production Audit & Remediation
 * Comprehensive validation of production readiness across all application layers
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m',
  yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', bold: '\x1b[1m',
};

const results = { passed: 0, failed: 0, warnings: 0, sections: {} };
let currentSection = '';

const log = {
  section: (name) => {
    currentSection = name;
    results.sections[name] = { passed: 0, failed: 0, warnings: 0 };
    console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(80)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${name}${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);
  },
  pass: (msg) => {
    console.log(`${colors.green}✓${colors.reset} ${msg}`);
    results.passed++;
    results.sections[currentSection].passed++;
  },
  fail: (msg, detail = '') => {
    console.log(`${colors.red}✗${colors.reset} ${msg}`);
    if (detail) console.log(`  ${colors.red}${detail}${colors.reset}`);
    results.failed++;
    results.sections[currentSection].failed++;
  },
  warn: (msg, detail = '') => {
    console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);
    if (detail) console.log(`  ${colors.yellow}${detail}${colors.reset}`);
    results.warnings++;
    results.sections[currentSection].warnings++;
  },
};

const exec = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: opts.silent ? 'pipe' : 'inherit', ...opts });
  } catch (e) {
    if (opts.throwOnError !== false) throw e;
    return null;
  }
};

const readFile = (p) => {
  try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return null; }
};

const findFiles = (dir, pattern, exclude = ['node_modules', '.next', 'dist']) => {
  const results = [];
  const scan = (d) => {
    try {
      const items = fs.readdirSync(path.join(ROOT, d), { withFileTypes: true });
      for (const item of items) {
        const p = path.join(d, item.name);
        if (item.isDirectory()) {
          if (!exclude.includes(item.name)) scan(p);
        } else if (item.name.match(pattern)) {
          results.push(p);
        }
      }
    } catch {}
  };
  scan(dir);
  return results;
};

// 1. BUILD & CODE QUALITY
log.section('1. BUILD & CODE QUALITY');

try {
  exec('npx tsc --noEmit', { silent: true });
  log.pass('TypeScript compilation successful');
} catch {
  log.fail('TypeScript compilation failed', 'Run: npx tsc --noEmit');
}

try {
  exec('npm run build', { silent: true });
  log.pass('Production build successful');
} catch {
  log.fail('Production build failed', 'Run: npm run build');
}

const tsFiles = findFiles('src', /\.(ts|tsx)$/);
const tsconfig = JSON.parse(readFile('tsconfig.json') || '{}');
if (tsconfig.compilerOptions?.strict) {
  log.pass('TypeScript strict mode enabled');
} else {
  log.fail('TypeScript strict mode not enabled');
}

let anyCount = 0;
for (const f of tsFiles) {
  const content = readFile(f);
  const matches = content?.match(/:\s*any\b/g);
  if (matches) anyCount += matches.length;
}
if (anyCount === 0) log.pass('No implicit any types');
else log.warn(`Found ${anyCount} 'any' type declarations`);

const hasErrorBoundary = tsFiles.some(f => readFile(f)?.includes('ErrorBoundary'));
if (hasErrorBoundary) log.pass('Error boundary implemented');
else log.fail('No error boundary found');

try {
  exec('npm run lint', { silent: true });
  log.pass('ESLint passed');
} catch {
  log.fail('ESLint errors detected', 'Run: npm run lint');
}

let todoCount = 0;
for (const f of tsFiles) {
  const matches = readFile(f)?.match(/\/\/\s*(TODO|FIXME)/gi);
  if (matches) todoCount += matches.length;
}
if (todoCount === 0) log.pass('No TODO/FIXME comments');
else log.warn(`Found ${todoCount} TODO/FIXME comments`);

// 2. DESIGN SYSTEM COMPLIANCE
log.section('2. DESIGN SYSTEM COMPLIANCE');

const componentFiles = findFiles('src/app', /\.(tsx|jsx)$/);
let hardcodedColors = 0, rawTypography = 0;

for (const f of componentFiles) {
  const content = readFile(f);
  if (!content) continue;
  const colorMatches = content.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
  if (colorMatches) hardcodedColors += colorMatches.length;
  const typographyMatches = content.match(/\b(font-bebas|font-anton|font-oswald|text-h[1-6])\b/g);
  if (typographyMatches) rawTypography += typographyMatches.length;
}

if (hardcodedColors === 0) log.pass('No hardcoded colors');
else log.fail(`Found ${hardcodedColors} hardcoded colors`, 'Use design system tokens');

if (rawTypography === 0) log.pass('All typography uses design system');
else log.fail(`Found ${rawTypography} raw typography classes`, 'Use Typography components');

if (fs.existsSync(path.join(ROOT, 'docs/architecture/ATOMIC_DESIGN_SYSTEM.md'))) {
  log.pass('Design system documentation exists');
} else {
  log.fail('Design system documentation missing');
}

let missingAlt = 0;
for (const f of componentFiles) {
  const content = readFile(f);
  const imgMatches = content?.match(/<img(?![^>]*alt=)/g);
  if (imgMatches) missingAlt += imgMatches.length;
}
if (missingAlt === 0) log.pass('All images have alt text');
else log.fail(`Found ${missingAlt} images without alt text`);

// 3. API & ROUTING
log.section('3. API & ROUTING ARCHITECTURE');

const apiRoutes = findFiles('src/app/api', /route\.(ts|js)$/);
if (apiRoutes.length > 0) log.pass(`Found ${apiRoutes.length} API endpoints`);
else log.warn('No API routes found');

const crudMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const methodCounts = {};
for (const route of apiRoutes) {
  const content = readFile(route);
  for (const method of crudMethods) {
    if (content?.includes(`export async function ${method}`)) {
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    }
  }
}
for (const method of crudMethods) {
  if (methodCounts[method]) log.pass(`${method} operations: ${methodCounts[method]} endpoints`);
}

const pageRoutes = findFiles('src/app', /page\.(tsx|jsx)$/);
if (pageRoutes.length > 0) log.pass(`Found ${pageRoutes.length} page routes`);
else log.fail('No page routes found');

if (fs.existsSync(path.join(ROOT, 'src/app/not-found.tsx'))) log.pass('404 page implemented');
else log.fail('404 page missing');

if (fs.existsSync(path.join(ROOT, 'src/app/error.tsx'))) log.pass('Error page implemented');
else log.fail('Error page missing');

const apiDocFiles = ['docs/api/openapi.yaml', 'docs/api/openapi-atlvs.yaml', 'docs/api/API_DOCUMENTATION.md'];
let foundDocs = apiDocFiles.filter(f => fs.existsSync(path.join(ROOT, f))).length;
if (foundDocs > 0) log.pass(`API documentation: ${foundDocs} files`);
else log.fail('No API documentation found');

// 4. BACKEND LOGIC
log.section('4. BACKEND LOGIC INTEGRITY');

const apiFiles = findFiles('src/app/api', /\.(ts|tsx)$/);
let validationCount = apiFiles.filter(f => {
  const content = readFile(f);
  return content?.includes('zod') || content?.includes('yup') || content?.includes('joi');
}).length;

if (validationCount > 0) log.pass(`Validation in ${validationCount} API files`);
else log.warn('No validation libraries detected');

if (fs.existsSync(path.join(ROOT, 'prisma/schema.prisma'))) {
  log.pass('Prisma schema exists');
  const schema = readFile('prisma/schema.prisma');
  const modelCount = (schema?.match(/^model\s+/gm) || []).length;
  log.pass(`Database models: ${modelCount}`);
  if (schema?.includes('@@index')) log.pass('Database indexes defined');
  else log.warn('No database indexes found');
} else {
  log.warn('No Prisma schema found');
}

if (fs.existsSync(path.join(ROOT, 'prisma/migrations'))) {
  const migrations = fs.readdirSync(path.join(ROOT, 'prisma/migrations')).filter(f => !f.startsWith('.'));
  log.pass(`Database migrations: ${migrations.length}`);
} else {
  log.warn('No database migrations found');
}

if (fs.existsSync(path.join(ROOT, '.env')) || fs.existsSync(path.join(ROOT, '.env.local'))) {
  log.pass('Environment configuration exists');
} else {
  log.fail('No environment configuration found');
}

if (fs.existsSync(path.join(ROOT, '.env.example'))) {
  log.pass('Environment example file exists');
} else {
  log.warn('No .env.example file');
}

if (fs.existsSync(path.join(ROOT, 'n8n/workflows'))) {
  const workflows = fs.readdirSync(path.join(ROOT, 'n8n/workflows'), { recursive: true })
    .filter(f => typeof f === 'string' && f.endsWith('.json'));
  if (workflows.length > 0) log.pass(`n8n workflows: ${workflows.length}`);
}

if (fs.existsSync(path.join(ROOT, 'supabase/functions'))) {
  const functions = fs.readdirSync(path.join(ROOT, 'supabase/functions'))
    .filter(f => !f.startsWith('_') && !f.startsWith('.'));
  if (functions.length > 0) log.pass(`Supabase edge functions: ${functions.length}`);
}

// 5. FRONTEND UI
log.section('5. FRONTEND UI COMPLETENESS');

let loadingStates = 0, errorStates = 0, emptyStates = 0;
for (const f of componentFiles) {
  const content = readFile(f);
  if (!content) continue;
  if (content.includes('loading') || content.includes('isLoading')) loadingStates++;
  if (content.includes('error') || content.includes('Error')) errorStates++;
  if (content.includes('empty') || content.includes('No data')) emptyStates++;
}

log.pass(`Loading states: ${loadingStates} components`);
log.pass(`Error states: ${errorStates} components`);
log.pass(`Empty states: ${emptyStates} components`);

const formFiles = componentFiles.filter(f => {
  const content = readFile(f);
  return content?.includes('<form') || content?.includes('useForm');
});

if (formFiles.length > 0) {
  log.pass(`Forms: ${formFiles.length} implementations`);
  const validatedForms = formFiles.filter(f => {
    const content = readFile(f);
    return content?.includes('required') || content?.includes('validate') || content?.includes('schema');
  }).length;
  if (validatedForms > 0) log.pass(`${validatedForms} forms have validation`);
  else log.warn('No form validation detected');
}

const layoutFiles = findFiles('src/app', /layout\.(tsx|jsx)$/);
if (layoutFiles.length > 0) log.pass(`Layout components: ${layoutFiles.length}`);
else log.fail('No layout components found');

// 6. WORKFLOWS
log.section('6. END-TO-END WORKFLOW VALIDATION');

const authFiles = findFiles('src', /auth|login|signup|register/i);
if (authFiles.length > 0) log.pass(`Authentication files: ${authFiles.length}`);
else log.warn('No authentication flows detected');

const allFiles = findFiles('src', /\.(ts|tsx)$/);
const filesWithRoles = allFiles.filter(f => {
  const content = readFile(f);
  return content?.match(/\b(role|permission|admin|user)\b/i);
});

if (filesWithRoles.length > 0) log.pass(`Role-based logic: ${filesWithRoles.length} files`);
else log.warn('No role-based access control detected');

const onboardingFiles = allFiles.filter(f => f.includes('onboard'));
if (onboardingFiles.length > 0) log.pass('Onboarding flow exists');
else log.warn('No onboarding flow detected');

const dashboardFiles = allFiles.filter(f => f.includes('dashboard'));
if (dashboardFiles.length > 0) log.pass('Dashboard implementation exists');
else log.warn('No dashboard detected');

const responsiveCount = allFiles.filter(f => {
  const content = readFile(f);
  return content?.match(/\b(sm:|md:|lg:|xl:|2xl:)/);
}).length;

if (responsiveCount > 0) log.pass(`Responsive design: ${responsiveCount} files`);
else log.warn('No responsive design classes detected');

// 7. INTEGRATION & TESTING
log.section('7. INTEGRATION & SYSTEM TESTING');

const testFiles = findFiles('src', /\.(test|spec)\.(ts|tsx|js|jsx)$/);
const e2eTests = findFiles('e2e', /\.(test|spec)\.(ts|tsx|js|jsx)$/);

if (testFiles.length > 0) log.pass(`Unit/integration tests: ${testFiles.length}`);
else log.warn('No unit/integration tests found');

if (e2eTests.length > 0) log.pass(`E2E tests: ${e2eTests.length}`);
else log.warn('No E2E tests found');

const packageJson = JSON.parse(readFile('package.json') || '{}');
const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

const integrations = {
  'stripe': 'Payment gateway',
  '@supabase/supabase-js': 'Supabase',
  'resend': 'Email service',
  'next-auth': 'Authentication',
};

for (const [pkg, name] of Object.entries(integrations)) {
  if (deps[pkg]) log.pass(`${name} integration installed`);
}

// 8. PERFORMANCE
log.section('8. PERFORMANCE & OPTIMIZATION');

const nextConfig = readFile('next.config.ts') || readFile('next.config.js');
if (nextConfig) {
  if (nextConfig.includes('images')) log.pass('Next.js Image optimization configured');
  else log.warn('Next.js Image optimization not configured');
}

const lazyLoadCount = allFiles.filter(f => {
  const content = readFile(f);
  return content?.includes('dynamic(') || content?.includes('lazy(');
}).length;

if (lazyLoadCount > 0) log.pass(`Lazy loading: ${lazyLoadCount} files`);
else log.warn('No lazy loading detected');

const cachingCount = allFiles.filter(f => {
  const content = readFile(f);
  return content?.includes('cache') || content?.includes('revalidate');
}).length;

if (cachingCount > 0) log.pass(`Caching: ${cachingCount} files`);
else log.warn('No caching strategy detected');

// 9. SECURITY
log.section('9. SECURITY VALIDATION');

const authImplementation = allFiles.filter(f => {
  const content = readFile(f);
  return content?.includes('NextAuth') || content?.includes('Clerk') || content?.includes('Supabase');
});

if (authImplementation.length > 0) log.pass('Authentication implementation found');
else log.warn('No authentication implementation detected');

const envUsage = allFiles.filter(f => readFile(f)?.includes('process.env')).length;
if (envUsage > 0) log.pass(`Environment variables: ${envUsage} files`);

const prismaUsage = allFiles.filter(f => {
  const content = readFile(f);
  return content?.includes('prisma.') && !content?.includes('${');
}).length;

if (prismaUsage > 0) log.pass('Parameterized queries (Prisma) detected');

// FINAL SUMMARY
console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(80)}${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}PRODUCTION READINESS SUMMARY${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

for (const [section, counts] of Object.entries(results.sections)) {
  const total = counts.passed + counts.failed + counts.warnings;
  const score = total > 0 ? Math.round((counts.passed / total) * 100) : 0;
  const color = score >= 90 ? colors.green : score >= 70 ? colors.yellow : colors.red;
  console.log(`${color}${section}: ${score}% (${counts.passed}✓ ${counts.failed}✗ ${counts.warnings}⚠)${colors.reset}`);
}

console.log(`\n${colors.bold}OVERALL:${colors.reset}`);
console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);

const totalChecks = results.passed + results.failed + results.warnings;
const overallScore = totalChecks > 0 ? Math.round((results.passed / totalChecks) * 100) : 0;
const scoreColor = overallScore >= 90 ? colors.green : overallScore >= 70 ? colors.yellow : colors.red;

console.log(`\n${colors.bold}${scoreColor}Production Readiness Score: ${overallScore}%${colors.reset}`);

if (overallScore >= 95) {
  console.log(`\n${colors.green}${colors.bold}✓ READY FOR PRODUCTION DEPLOYMENT${colors.reset}`);
} else if (overallScore >= 80) {
  console.log(`\n${colors.yellow}${colors.bold}⚠ NEAR PRODUCTION READY - Address critical issues${colors.reset}`);
} else {
  console.log(`\n${colors.red}${colors.bold}✗ NOT READY FOR PRODUCTION - Significant work required${colors.reset}`);
}

process.exit(results.failed > 0 ? 1 : 0);
