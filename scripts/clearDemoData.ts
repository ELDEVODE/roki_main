

import { PrismaClient } from "../prisma/generated/democlient";

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('Clearing all demo data...');
  
  // Delete in order to respect foreign key constraints
  await prisma.demoMessage.deleteMany({});
  console.log('✅ Messages cleared');
  
  await prisma.demoMembership.deleteMany({});
  console.log('✅ Memberships cleared');
  
  await prisma.demoChannel.deleteMany({});
  console.log('✅ Channels cleared');
  
  await prisma.demoUser.deleteMany({});
  console.log('✅ Users cleared');
  
  console.log('✨ All demo data cleared successfully.');
}

clearAllData()
  .catch(e => {
    console.error('Error clearing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });