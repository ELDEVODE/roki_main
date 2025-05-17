import { PrismaClient as MainPrismaClient } from '@prisma/client';
import { PrismaClient as DemoPrismaClient } from '../prisma/generated/democlient';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const mainPrisma = new MainPrismaClient();
const demoPrisma = new DemoPrismaClient();

async function resetDatabase() {
  console.log("🗑️  Starting database reset process...");
  
  try {
    // Close any existing connections first
    console.log("Closing connections...");
    await mainPrisma.$disconnect();
    await demoPrisma.$disconnect();
    
    console.log("🧹 Dropping all existing tables...");
    // Reset the database - this will drop all tables
    await execAsync("npx prisma migrate reset --force");
    
    console.log("🔄 Regenerating prisma clients...");
    // Generate the Prisma clients
    await execAsync("npx prisma generate");
    
    console.log("📦 Running migrations...");
    // Apply migrations
    await execAsync("npx prisma migrate deploy");
    
    console.log("🌱 Seeding main database...");
    // Seed the main database
    await execAsync("npm run prisma:seed");
    
    console.log("🌱 Seeding demo database...");
    // Seed the demo database
    await execAsync("npm run prisma:seed-demo");
    
    console.log("✅ Database has been successfully reset and seeded!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  }); 