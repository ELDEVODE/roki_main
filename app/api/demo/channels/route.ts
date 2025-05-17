import { demoPrisma } from '@/app/utils/demo-prisma';
import { NextRequest } from 'next/server';

// Define variables without exporting them
const demoChannels = new Map();
const demoMessages = new Map();
const demoMemberships = new Map();

/**
 * Get channels for a user
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const userId = url.searchParams.get('userId');
  
  try {
    // Get a specific channel
    if (id) {
      const channel = await demoPrisma.demoChannel.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              user: true
            }
          },
          subchannels: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });
      
      if (!channel) {
        return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
      }
      
      // Standardize user IDs in members to ensure string format
      const standardizedMembers = channel.members.map(member => ({
        ...member,
        userId: String(member.userId),
        user: member.user ? {
          ...member.user,
          id: String(member.user.id)
        } : null
      }));
      
      // Create a standardized channel object
      const standardizedChannel = {
        ...channel,
        creatorId: String(channel.creatorId),
        members: standardizedMembers
      };
      
      // Get the active subchannel
      let targetSubchannelId = channel.defaultSubchannelId;
      
      // If no default set but there are subchannels, find one
      if (!targetSubchannelId && channel.subchannels.length > 0) {
        // Try to find "general" first
        const generalSubchannel = channel.subchannels.find(
          sub => sub.name.toLowerCase() === 'general'
        );
        
        if (generalSubchannel) {
          targetSubchannelId = generalSubchannel.id;
        } else {
          // Find one marked as default, or use the first
          const defaultSubchannel = channel.subchannels.find(
            sub => sub.isDefault
          ) || channel.subchannels[0];
          
          targetSubchannelId = defaultSubchannel.id;
          
          // Update the channel setting
          await demoPrisma.demoChannel.update({
            where: { id },
            data: { defaultSubchannelId: targetSubchannelId }
          });
        }
      }
      
      // Only fetch messages if there's a subchannel
      let messages: any[] = [];
      if (targetSubchannelId) {
        const rawMessages = await demoPrisma.demoMessage.findMany({
          where: { subchannelId: targetSubchannelId },
          orderBy: { createdAt: 'asc' },
          include: { user: true }
        });
        
        // Standardize user IDs in messages
        messages = rawMessages.map(msg => ({
          ...msg,
          userId: String(msg.userId),
          user: msg.user ? {
            ...msg.user,
            id: String(msg.user.id)
          } : null
        }));
      }
      
      console.log(`Channel ${id} fetched with ${standardizedMembers.length} members and ${messages.length} messages`);
      
      return new Response(JSON.stringify({
        ...standardizedChannel,
        messages,
        activeSubchannelId: targetSubchannelId
      }));
    }
    
    // Get all channels for a user
    if (userId) {
      // Get channels the user is a member of
      const memberships = await demoPrisma.demoMembership.findMany({
        where: { userId },
        include: {
          channel: {
            include: {
              subchannels: true
            }
          }
        }
      });
      
      const channels = memberships.map(membership => membership.channel);
      
      return new Response(JSON.stringify(channels));
    }
    
    // Get all channels
    const channels = await demoPrisma.demoChannel.findMany({
      include: {
        subchannels: true
      }
    });
    
    return new Response(JSON.stringify(channels));
  } catch (error: any) {
    console.error('Channel fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

/**
 * Create a new channel
 */
export async function POST(req: NextRequest) {
  const { name, userId, initialSubchannelName = "general" } = await req.json();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
  }
  
  try {
    // Create the channel with a transaction to ensure we create both channel and subchannel
    const result = await demoPrisma.$transaction(async (prisma) => {
      // Create the channel first
      const channel = await prisma.demoChannel.create({
        data: {
          name,
          creator: {
            connect: { id: userId }
          },
          // Add the creator as a member with admin role
          members: {
            create: {
              userId,
              role: 'ADMIN'
            }
          }
        }
      });
      
      // Create the initial "general" subchannel
      const subchannel = await prisma.demoSubChannel.create({
        data: {
          name: initialSubchannelName,
          channelId: channel.id,
          isDefault: true
        }
      });
      
      // Update the channel with the default subchannel ID
      await prisma.demoChannel.update({
        where: { id: channel.id },
        data: { defaultSubchannelId: subchannel.id }
      });
      
      return {
        channel,
        subchannel
      };
    });
    
    return new Response(JSON.stringify(result.channel));
  } catch (error: any) {
    console.error('Channel creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 