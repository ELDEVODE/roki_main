import { PrismaClient as DemoPrismaClient } from '../prisma/generated/democlient';

const demoPrisma = new DemoPrismaClient();

async function cleanDatabase() {
  console.log("🧹 Starting database cleanup process...");
  
  try {
    // Delete all invites
    console.log("Deleting invites...");
    await demoPrisma.demoInvite.deleteMany({});
    
    // Delete all messages
    console.log("Deleting messages...");
    await demoPrisma.demoMessage.deleteMany({});
    
    // Delete all memberships
    console.log("Deleting channel memberships...");
    await demoPrisma.demoMembership.deleteMany({});
    
    // Delete all subchannels
    console.log("Deleting subchannels...");
    await demoPrisma.demoSubChannel.deleteMany({});
    
    // Delete all channels
    console.log("Deleting channels...");
    await demoPrisma.demoChannel.deleteMany({});
    
    // Delete all users
    console.log("Deleting users...");
    await demoPrisma.demoUser.deleteMany({});
    
    console.log("✅ All test data has been removed from the database!");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
    process.exit(1);
  } finally {
    await demoPrisma.$disconnect();
  }
}

cleanDatabase()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  }); 