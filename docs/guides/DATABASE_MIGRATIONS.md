# Database Migrations Guide

## Overview

This guide covers database migration management using Prisma in the GVTEWAY platform.

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Prisma CLI installed
- Database connection configured in `.env`

## Running Migrations

### Development

```bash
# Create and apply a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Staging/Production

```bash
# Apply migrations (safe for production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

## Rollback Process

### Using the Rollback Script

```bash
# Rollback last migration
./prisma/rollback.sh

# Rollback multiple migrations
./prisma/rollback.sh 3
```

### Manual Rollback

1. Create database backup:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

2. Mark migration as rolled back:
```bash
npx prisma migrate resolve --rolled-back MIGRATION_NAME
```

3. Manually revert database changes using SQL

## CI/CD Integration

Migrations run automatically via GitHub Actions:

- **Development**: Auto-deploy on push to `development` branch
- **Staging**: Auto-deploy on push to `staging` branch  
- **Production**: Manual approval required on `main` branch

See `.github/workflows/migrations.yml` for configuration.

## Best Practices

### Creating Migrations

1. **Always test locally first**
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```

2. **Review generated SQL**
   - Check `prisma/migrations/*/migration.sql`
   - Verify no data loss
   - Check for breaking changes

3. **Use descriptive names**
   - Good: `add_user_preferences_table`
   - Bad: `update1`, `fix`

### Migration Safety

1. **Backup before production migrations**
2. **Test rollback procedure**
3. **Avoid destructive changes**
   - Don't drop columns with data
   - Use multi-step migrations for renames
4. **Monitor migration duration**
   - Large tables may lock during migration
   - Consider maintenance windows

### Schema Changes

#### Adding a Column
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  newField  String?  // Make optional initially
}
```

#### Renaming a Column (Safe)
```prisma
// Step 1: Add new column
model User {
  oldName String?
  newName String?
}

// Step 2: Migrate data (custom SQL)
// Step 3: Remove old column
```

#### Adding an Index
```prisma
model Event {
  name String
  
  @@index([name])
}
```

## Troubleshooting

### Migration Failed

1. Check error message in console
2. Review migration SQL file
3. Check database logs
4. Rollback if necessary

### Schema Drift Detected

```bash
# Compare schema with database
npx prisma migrate status

# Reset to match schema
npx prisma migrate reset  # DEV ONLY
```

### Connection Issues

1. Verify `DATABASE_URL` in `.env`
2. Check database is running
3. Verify network access
4. Check credentials

## Emergency Procedures

### Production Migration Failed

1. **Don't panic**
2. **Check application status**
3. **Review error logs**
4. **Execute rollback**:
   ```bash
   ./prisma/rollback.sh
   ```
5. **Restore from backup if needed**:
   ```bash
   psql $DATABASE_URL < backup_file.sql
   ```
6. **Notify team**

### Data Loss Prevention

- Automated backups run before each production migration
- Backups stored in `prisma/backups/`
- Retention: 30 days
- Test restores monthly

## Monitoring

### Check Migration Status

```bash
# View applied migrations
npx prisma migrate status

# View pending migrations
npx prisma migrate status | grep "pending"
```

### Performance Monitoring

- Track migration duration
- Monitor database locks
- Check application downtime
- Review query performance post-migration

## Additional Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Database Schema](../architecture/DATABASE_SCHEMA.md)
- [CI/CD Pipeline](../.github/workflows/migrations.yml)
