# Database Management

This document provides instructions for managing the database in the Roki application.

## Available Commands

The following commands are available for database management:

| Command | Description |
|---------|-------------|
| `bun run db:status` | Check the current status of the database (record counts) |
| `bun run db:clean` | Remove all test data from the database without dropping schemas |
| `bun run db:reset` | Reset the entire database (drop all tables and recreate from schema) |
| `bun run db:generate` | Generate Prisma clients from schema |
| `bun run db:migrate` | Run pending migrations |
| `bun run prisma:seed` | Seed the main database with role definitions |
| `bun run prisma:seed-demo` | Seed the database with demo data for testing |

## Common Workflows

### Checking Database Status

To check the current status of the database and see how many records exist in each table:

```bash
bun run db:status
```

### Cleaning Test Data

If you want to remove all test data from the database without affecting the schema:

```bash
bun run db:clean
```

This is useful when you want to start with a clean database but don't want to drop and recreate all tables.

### Full Database Reset

To completely reset the database (drop all tables and recreate them):

```bash
bun run db:reset
```

This command will:
1. Drop all existing tables
2. Regenerate the Prisma clients
3. Run all migrations
4. Seed the main database
5. Seed the demo database with test data

### Working with a Clean Database

If you want to work with a completely clean database (no demo data):

```bash
# First reset the database
bun run db:reset

# Then clean out the demo data
bun run db:clean
```

### Adding Demo Data

If you need demo data for testing:

```bash
bun run prisma:seed-demo
```

## Schema Management

The project uses two schema files:

1. `prisma/schema.prisma` - Main application schema
2. `prisma/demo.schema.prisma` - Demo/testing schema

When you make changes to the schema files, you should:

1. Create a migration:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

2. Regenerate the Prisma clients:
   ```bash
   bun run db:generate
   ```

3. Apply the migrations:
   ```bash
   bun run db:migrate
   ```

## Troubleshooting

If you encounter database-related issues:

1. Check the database status:
   ```bash
   bun run db:status
   ```

2. Try cleaning the database:
   ```bash
   bun run db:clean
   ```

3. As a last resort, reset the database:
   ```bash
   bun run db:reset
   ```

If you're still having issues, check the database connection settings in your `.env` file. 