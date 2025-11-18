# Remediation Scripts

## 🚀 remediate-all.mjs

Comprehensive remediation script that performs all fixes in one run.

### What it does:

1. **Adds dynamic exports** to all client pages with hooks
   - Finds pages using `useEffect`, `useState`, etc.
   - Adds `export const dynamic = 'force-dynamic';` after `'use client'`
   - Skips pages that already have it

2. **Removes unused imports and variables**
   - Runs ESLint auto-fix for `no-unused-vars`
   - Cleans up TypeScript unused variable warnings

3. **Fixes all ESLint issues automatically**
   - Runs comprehensive ESLint `--fix`
   - Auto-formats code
   - Fixes common linting issues

4. **Generates final report**
   - Shows summary of changes made
   - Reports remaining errors/warnings
   - Provides next steps if manual review needed

### Usage:

```bash
# Run the complete remediation
node scripts/remediate-all.mjs

# Or make it executable and run directly
chmod +x scripts/remediate-all.mjs
./scripts/remediate-all.mjs
```

### Output:

```
🚀 Starting comprehensive remediation...

📝 STEP 1: Adding dynamic exports to client pages with hooks...
Found 45 pages with hooks
✅ Added dynamic export: src/app/atlvs/tasks/time/page.tsx
...

📊 Dynamic Export Summary:
   Modified: 23
   Skipped: 22
   Total: 45

🧹 STEP 2: Removing unused imports and variables...
✅ Removed unused imports and variables

🔧 STEP 3: Running comprehensive ESLint auto-fix...
✅ ESLint auto-fix completed successfully!

📊 STEP 4: Generating final report...

═══════════════════════════════════════════════════════════
                    REMEDIATION COMPLETE                   
═══════════════════════════════════════════════════════════

📝 Dynamic Exports:
   ✅ Added: 23
   ⏭️  Skipped: 22

🔍 ESLint Status:
   ❌ Errors: 0
   ⚠️  Warnings: 0

🎉 PERFECT! Zero ESLint issues remaining!
═══════════════════════════════════════════════════════════
```

## Individual Scripts

### add-dynamic-exports.mjs
Adds `export const dynamic = 'force-dynamic';` to client pages with hooks.

```bash
node scripts/add-dynamic-exports.mjs
```

### fix-eslint-issues.mjs
Runs ESLint auto-fix and reports remaining issues.

```bash
node scripts/fix-eslint-issues.mjs
```

### fix-all-warnings.mjs
Advanced script that fixes ESLint warnings by:
- Prefixing unused variables with underscore
- Running comprehensive auto-fix
- Generating detailed report

```bash
node scripts/fix-all-warnings.mjs
```

### fix-unused-vars.mjs
Specifically targets unused variable warnings and prefixes them with underscore.

```bash
node scripts/fix-unused-vars.mjs
```

## Tips

- Run `remediate-all.mjs` before builds to catch issues early
- Review the final report to see if manual fixes are needed
- Safe to run multiple times - skips already-fixed files
- All scripts are idempotent and non-destructive
