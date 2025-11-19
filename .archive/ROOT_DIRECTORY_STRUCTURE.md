# Root Directory Structure

## Overview
Clean, organized root directory with all configuration files and essential documentation.

## Directory Structure

```
grasshopper26.10/
├── .archive/              # Historical reports and build logs (gitignored)
├── .github/               # GitHub Actions workflows and CI/CD
├── .husky/                # Git hooks for pre-commit checks
├── .vscode/               # VS Code workspace settings
├── contracts/             # Smart contracts (Solidity)
├── docs/                  # All project documentation
│   ├── api/              # API documentation and specs
│   ├── architecture/     # Architecture docs and design system
│   └── guides/           # Setup and user guides
├── e2e/                   # End-to-end tests (Playwright)
├── n8n/                   # n8n workflow automation
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── scripts/               # Build and utility scripts
├── src/                   # Application source code
│   ├── app/              # Next.js app directory
│   ├── components/       # React components (atomic design)
│   ├── design-system/    # Design tokens and utilities
│   └── lib/              # Shared libraries and utilities
├── supabase/              # Supabase functions and migrations
└── tests/                 # Unit and integration tests
```

## Configuration Files

### Core
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration

### Environment
- `.env.example` - Environment variables template
- `.env.staging.template` - Staging environment template
- `.env` - Local environment (gitignored)
- `.env.local` - Local overrides (gitignored)

### Testing
- `jest.config.ts` - Jest unit test configuration
- `playwright.config.ts` - Playwright E2E test configuration

### Linting & Code Quality
- `eslint.config.mjs` - ESLint configuration
- `.eslintrc.accessibility.js` - Accessibility rules
- `.eslintrc.design-system.js` - Design system enforcement

### Build Tools
- `postcss.config.mjs` - PostCSS configuration
- `hardhat.config.ts` - Hardhat (Ethereum) configuration
- `docker-compose.yml` - Docker services

### Project Specific
- `.ghxstshiprc.json` - GHXSTSHIP project configuration

## Documentation

### Root Level
- `README.md` - Project overview and quick start

### Organized in `/docs`
All detailed documentation has been moved to the `docs/` directory:
- Architecture and design system docs → `docs/architecture/`
- Setup and deployment guides → `docs/guides/`
- API documentation → `docs/api/`

## Archived Files

Historical reports, build logs, and deprecated documentation are in `.archive/`:
- Build validation logs
- Design system audit reports
- Migration and remediation summaries
- Legacy documentation

**Note:** The `.archive/` directory is gitignored and kept for local reference only.

## Cleanup Maintenance

To keep the root clean:

```bash
# Archive old reports
mv *_REPORT.md *_STATUS.md .archive/reports/

# Archive build logs
mv *.log .archive/build-logs/

# Remove build artifacts
rm -f tsconfig.tsbuildinfo
```

## Best Practices

1. **Keep root minimal** - Only essential config files
2. **Use docs/** - All documentation goes in organized subdirectories
3. **Archive, don't delete** - Move old files to `.archive/` for reference
4. **Follow .gitignore** - Don't commit logs, reports, or build artifacts
5. **Update templates** - Keep `.env.example` and templates current
