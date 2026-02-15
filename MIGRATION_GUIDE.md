# Migration Guide: SQLite to PostgreSQL

## Overview
The Prisma schema has been updated from SQLite to PostgreSQL with enhanced features for authentication, versioning, and collaboration.

## Changes

### Database Provider
```prisma
// Old
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// New
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### New Models Added
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification
- `ProjectVersion` - Version snapshots
- `ProjectCollaborator` - Shared projects

### Enhanced Models

#### User Model
- Added `emailVerified`, `role`, `createdAt`, `updatedAt`
- New relations: `accounts`, `sessions`, `sharedProjects`, `projectVersions`
- Proper field mapping with `@map`

#### Project Model
- Added `isPublic`, `lastSavedAt`
- New relations: `versions`, `collaborators`
- Better indexing for performance

#### Order Model
- Added `orderNumber`, `shippingAddress`, `trackingNumber`, `notes`
- Enhanced status tracking
- Better indexing

## Migration Steps

### 1. Backup Current Data (SQLite)
```bash
# Export current data
npx prisma db pull
npx prisma generate

# Create backup
sqlite3 ./prisma/dev.db .dump > backup.sql
```

### 2. Set Up PostgreSQL

#### Using Docker (Recommended)
```bash
docker run --name frametale-postgres \
  -e POSTGRES_USER=frametale \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=frametale \
  -p 5432:5432 \
  -d postgres:16-alpine
```

#### Using Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb frametale
```

### 3. Update Environment Variables
```bash
# Old SQLite
DATABASE_URL="file:./dev.db"

# New PostgreSQL
DATABASE_URL="postgresql://frametale:your_password@localhost:5432/frametale?schema=public"
```

### 4. Apply New Schema
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Or create and apply migration
npx prisma migrate dev --name init
```

### 5. Migrate Data (if needed)

If you have existing data in SQLite, you'll need to migrate it:

```typescript
// scripts/migrate-data.ts
import { PrismaClient as SQLiteClient } from '@prisma/client-sqlite';
import { PrismaClient as PostgresClient } from '@prisma/client';

const sqlite = new SQLiteClient();
const postgres = new PostgresClient();

async function migrate() {
  // Migrate Users
  const users = await sqlite.user.findMany();
  for (const user of users) {
    await postgres.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  // Migrate Projects
  const projects = await sqlite.project.findMany({
    include: { pages: true, photos: true },
  });
  
  for (const project of projects) {
    await postgres.project.create({
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        coverImage: project.coverImage,
        status: project.status,
        theme: project.theme,
        colorPalette: project.colorPalette,
        userId: project.userId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        pages: {
          create: project.pages.map(page => ({
            id: page.id,
            type: page.type,
            order: page.order,
            content: page.content,
          })),
        },
        photos: {
          create: project.photos.map(photo => ({
            id: photo.id,
            url: photo.url,
            filename: photo.filename,
            width: photo.width,
            height: photo.height,
            theme: photo.theme,
            emotion: photo.emotion,
            colors: photo.colors,
            createdAt: photo.createdAt,
          })),
        },
      },
    });
  }

  // Migrate Orders
  const orders = await sqlite.order.findMany();
  for (const order of orders) {
    await postgres.order.create({
      data: {
        id: order.id,
        orderNumber: `FT-${order.createdAt.getTime()}-${order.id.slice(-8).toUpperCase()}`,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        plan: order.plan,
        projectId: order.projectId,
        userId: order.userId,
        createdAt: order.createdAt,
      },
    });
  }

  console.log('Migration complete!');
}

migrate()
  .catch(console.error)
  .finally(() => {
    sqlite.$disconnect();
    postgres.$disconnect();
  });
```

### 6. Verify Migration
```bash
# Check tables
npx prisma studio

# Or using psql
psql frametale -c "\dt"
```

## Breaking Changes

### Field Mappings
Many fields now use snake_case in the database but camelCase in your code:
- `userId` → `user_id`
- `projectId` → `project_id`
- `coverImage` → `cover_image`
- etc.

Prisma handles this automatically with `@map` directives.

### New Required Fields
Some models have new required fields with defaults:
- `User.role` defaults to "user"
- `Project.isPublic` defaults to false
- `Project.lastSavedAt` defaults to now()
- `Order.orderNumber` must be unique

### Cascade Deletes
Related records are now deleted automatically:
- Deleting a User deletes their Projects, Orders, Sessions
- Deleting a Project deletes Pages, Photos, Versions, Collaborators

## Production Migration

For production, use migrations instead of `db push`:

```bash
# Create migration
npx prisma migrate dev --name add_auth_and_collaboration

# Review migration SQL
cat prisma/migrations/*/migration.sql

# Apply to production
npx prisma migrate deploy
```

## Rollback Plan

If you need to rollback:

1. Keep SQLite database backup
2. Use previous schema
3. Restore from backup:
```bash
sqlite3 ./prisma/dev.db < backup.sql
```

## Testing Checklist

After migration:
- [ ] All users can log in
- [ ] Projects load correctly
- [ ] New projects can be created
- [ ] Autosave works
- [ ] Collaboration features work
- [ ] Orders are preserved
- [ ] All relationships intact
- [ ] No data loss

## Performance Considerations

PostgreSQL offers better performance for:
- Concurrent writes
- Complex queries
- Full-text search
- JSON operations
- Indexing

Monitor query performance:
```bash
# Enable query logging
npx prisma studio
```

## Support

If you encounter issues:
1. Check Prisma logs
2. Verify database connection
3. Review migration SQL
4. Check for constraint violations
5. Verify all environment variables

For help: Check AUTH_SETUP.md for configuration details.
