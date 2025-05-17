import { PrismaClient as DemoPrismaClient } from './generated/democlient';

const demoPrisma = new DemoPrismaClient();

async function seedDemoData() {
  console.log("🌱 Seeding demo data...");
  
  try {
    // Create demo users
    console.log("Creating demo users...");
    const users = await createDemoUsers();
    
    // Create a main demo channel
    console.log("Creating demo channel...");
    const channel = await createDemoChannel(users.admin);
    
    // Create sub-channels
    console.log("Creating demo subchannels...");
    const subchannels = await createDemoSubchannels(channel.id);
    
    // Add members to the channel
    console.log("Adding members to demo channel...");
    await addMembersToChannel(channel.id, users);
    
    // Create demo invite
    console.log("Creating demo invite...");
    await createDemoInvite(channel.id, users.admin.id);
    
    // Add some messages
    console.log("Adding demo messages...");
    await addDemoMessages(subchannels[0].id, users);
    
    console.log("✅ Demo data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding demo data:", error);
    throw error;
  } finally {
    await demoPrisma.$disconnect();
  }
}

// Create demo users
async function createDemoUsers() {
  // Create an admin user
  const admin = await demoPrisma.demoUser.upsert({
    where: { walletAddress: '0xadmin1234567890000000000000000000000000' },
    update: {},
    create: {
      walletAddress: '0xadmin1234567890000000000000000000000000',
      name: 'Admin User',
      username: 'admin',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      description: 'Demo admin user',
      online: true
    }
  });
  
  // Create a regular user
  const user1 = await demoPrisma.demoUser.upsert({
    where: { walletAddress: '0xuser11234567890000000000000000000000000' },
    update: {},
    create: {
      walletAddress: '0xuser11234567890000000000000000000000000',
      name: 'Demo User 1',
      username: 'user1',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      description: 'Regular demo user',
      online: true
    }
  });
  
  // Create another user
  const user2 = await demoPrisma.demoUser.upsert({
    where: { walletAddress: '0xuser21234567890000000000000000000000000' },
    update: {},
    create: {
      walletAddress: '0xuser21234567890000000000000000000000000',
      name: 'Demo User 2',
      username: 'user2',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      description: 'Another demo user',
      online: false,
      lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  });
  
  return { admin, user1, user2 };
}

// Create a demo channel
async function createDemoChannel(creator: any) {
  // Check if the description field is supported
  const hasDescriptionField = await checkHasDescriptionField();
  
  // Create channel data object with or without description
  const channelData = {
    name: 'Demo Channel',
    type: 'TEXT',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=demochannel',
    creatorId: creator.id,
    ...(hasDescriptionField ? { description: 'A demo channel for testing' } : {})
  };
  
  return demoPrisma.demoChannel.create({
    data: channelData
  });
}

// Helper function to check if the description field exists in the schema
async function checkHasDescriptionField() {
  try {
    const dmmf = (demoPrisma as any)._baseDmmf;
    if (dmmf) {
      const demoChannelModel = dmmf.modelMap.DemoChannel;
      return demoChannelModel.fields.some((field: any) => field.name === 'description');
    }
    return false;
  } catch (error) {
    console.warn("Could not check schema for description field, assuming it doesn't exist");
    return false;
  }
}

// Create demo subchannels
async function createDemoSubchannels(channelId: string) {
  // Create a general subchannel
  const general = await demoPrisma.demoSubChannel.create({
    data: {
      name: 'general',
      type: 'TEXT',
      channelId,
      isDefault: true,
      isTokenGated: false
    }
  });
  
  // Create a token-gated subchannel
  const exclusive = await demoPrisma.demoSubChannel.create({
    data: {
      name: 'token-exclusive',
      type: 'TEXT',
      channelId,
      isTokenGated: true,
      tokenAddress: '0xtoken1234567890000000000000000000000000'
    }
  });
  
  // Create a voice subchannel
  const voice = await demoPrisma.demoSubChannel.create({
    data: {
      name: 'voice-chat',
      type: 'VOICE',
      channelId
    }
  });
  
  // Update the channel to set the default subchannel
  await demoPrisma.demoChannel.update({
    where: { id: channelId },
    data: { defaultSubchannelId: general.id }
  });
  
  return [general, exclusive, voice];
}

// Add members to the channel
async function addMembersToChannel(channelId: string, users: any) {
  // Add the admin (already a member as creator)
  await demoPrisma.demoMembership.upsert({
    where: {
      userId_channelId: {
        userId: users.admin.id,
        channelId
      }
    },
    update: { role: 'ADMIN' },
    create: {
      userId: users.admin.id,
      channelId,
      role: 'ADMIN'
    }
  });
  
  // Add user1 as a regular member
  await demoPrisma.demoMembership.create({
    data: {
      userId: users.user1.id,
      channelId,
      role: 'MEMBER'
    }
  });
  
  // Add user2 as a moderator
  await demoPrisma.demoMembership.create({
    data: {
      userId: users.user2.id,
      channelId,
      role: 'MODERATOR'
    }
  });
}

// Create a demo invite
async function createDemoInvite(channelId: string, creatorId: string) {
  // Create a permanent invite
  await demoPrisma.demoInvite.create({
    data: {
      inviteCode: 'demo123',
      channelId,
      createdBy: creatorId
    }
  });
  
  // Create an invite with expiry and max uses
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  await demoPrisma.demoInvite.create({
    data: {
      inviteCode: 'demo456',
      channelId,
      createdBy: creatorId,
      expiresAt: tomorrow,
      maxUses: 5
    }
  });
}

// Add some demo messages
async function addDemoMessages(subchannelId: string, users: any) {
  const now = new Date();
  
  // Welcome message from admin
  await demoPrisma.demoMessage.create({
    data: {
      content: 'Welcome to the demo channel! Feel free to explore and test features.',
      userId: users.admin.id,
      subchannelId,
      createdAt: new Date(now.getTime() - 3600000), // 1 hour ago
      readByUsers: [users.admin.id, users.user1.id]
    }
  });
  
  // Message from user1
  await demoPrisma.demoMessage.create({
    data: {
      content: 'Thanks for the invite! This looks great.',
      userId: users.user1.id,
      subchannelId,
      createdAt: new Date(now.getTime() - 1800000), // 30 mins ago
      readByUsers: [users.admin.id, users.user1.id]
    }
  });
  
  // Message from user2
  await demoPrisma.demoMessage.create({
    data: {
      content: 'Hello everyone! Looking forward to collaborating here.',
      userId: users.user2.id,
      subchannelId,
      createdAt: new Date(now.getTime() - 600000), // 10 mins ago
      readByUsers: [users.admin.id, users.user1.id, users.user2.id]
    }
  });
  
  // Another message from admin
  await demoPrisma.demoMessage.create({
    data: {
      content: 'Let me know if you need help with anything! I\'ve created a token-gated channel for special content.',
      userId: users.admin.id,
      subchannelId,
      createdAt: new Date(now.getTime() - 300000), // 5 mins ago
      readByUsers: [users.admin.id]
    }
  });
}

// Run the seed function
seedDemoData()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  }); 