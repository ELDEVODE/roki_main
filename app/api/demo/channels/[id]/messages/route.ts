import { demoPrisma } from '@/app/utils/demo-prisma';
import { NextRequest } from 'next/server';

// Define a type for the message
interface DemoMessage {
  id: string;
  content: string;
  userId: string;
  subchannelId: string;
  createdAt: Date;
}

interface DemoSubChannel {
  id: string;
  name: string;
  channelId: string;
  isDefault: boolean;
  // other properties as needed
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { content, userId, subchannelId: providedSubchannelId } = await req.json();
  const channelId = (await params).id;
  
  // If no subchannel provided, we need to find the default one
  let subchannelId = providedSubchannelId;
  
  try {
    // Check if channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id: channelId },
      include: {
        subchannels: true
      }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // If no subchannel was provided, use the default one
    if (!subchannelId) {
      if (channel.defaultSubchannelId) {
        subchannelId = channel.defaultSubchannelId;
      } else if (channel.subchannels.length > 0) {
        // Try to find a subchannel named "general" first
        const generalSubchannel = channel.subchannels.find(
          sub => sub.name.toLowerCase() === 'general'
        );
        
        if (generalSubchannel) {
          subchannelId = generalSubchannel.id;
        } else {
          // Otherwise use the first subchannel or the one marked as default
          const defaultSubchannel = channel.subchannels.find(
            sub => sub.isDefault
          ) || channel.subchannels[0];
          
          subchannelId = defaultSubchannel.id;
        }
      } else {
        return new Response(
          JSON.stringify({ error: "No subchannels available to post messages" }), 
          { status: 400 }
        );
      }
    }
    
    // Check if user is a member
    const membership = await demoPrisma.demoMembership.findFirst({
      where: {
        userId,
        channelId
      }
    });
    
    if (!membership) {
      return new Response(
        JSON.stringify({ error: "You must be a member to send messages" }), 
        { status: 403 }
      );
    }
    
    // Verify the subchannel belongs to this channel
    if (!channel.subchannels.some((sub: DemoSubChannel) => sub.id === subchannelId)) {
      return new Response(
        JSON.stringify({ error: "Subchannel not found in this channel" }), 
        { status: 404 }
      );
    }
    
    // Create a message
    const message = await demoPrisma.demoMessage.create({
      data: {
        content,
        userId,
        subchannelId,
        readByUsers: [userId] // The sender has read their own message
      },
      include: {
        user: true
      }
    });
    
    // Update the user's last read timestamp
    await demoPrisma.demoMembership.update({
      where: {
        userId_channelId: {
          userId,
          channelId
        }
      },
      data: {
        lastReadAt: new Date()
      }
    });
    
    return new Response(JSON.stringify(message));
  } catch (error: any) {
    console.error('Message creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const channelId = (await params).id;
  const url = new URL(req.url);
  const subchannelId = url.searchParams.get('subchannelId');
  const userId = url.searchParams.get('userId'); // To track who's reading the messages
  
  try {
    // Check if channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id: channelId },
      include: {
        subchannels: true
      }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    let targetSubchannelId = subchannelId;
    
    if (!targetSubchannelId) {
      // If no subchannel specified, try to use the channel's default subchannel
      if (channel.defaultSubchannelId) {
        targetSubchannelId = channel.defaultSubchannelId;
      } else {
        // If no default subchannel set, use the first subchannel
        if (channel.subchannels.length === 0) {
          return new Response(JSON.stringify([]));
        }
        
        // Try to find a subchannel named "general" first
        const generalSubchannel = channel.subchannels.find(
          (sub: DemoSubChannel) => sub.name.toLowerCase() === 'general'
        );
        
        if (generalSubchannel) {
          targetSubchannelId = generalSubchannel.id;
        } else {
          // Otherwise use the first subchannel or the one marked as default
          const defaultSubchannel = channel.subchannels.find(
            (sub: DemoSubChannel) => sub.isDefault
          ) || channel.subchannels[0];
          
          targetSubchannelId = defaultSubchannel.id;
          
          // Update the channel's defaultSubchannelId if not already set
          if (!channel.defaultSubchannelId) {
            await demoPrisma.demoChannel.update({
              where: { id: channelId },
              data: { defaultSubchannelId: targetSubchannelId }
            });
          }
        }
      }
    }
    
    // Verify the subchannel belongs to this channel
    if (!channel.subchannels.some((sub: DemoSubChannel) => sub.id === targetSubchannelId)) {
      return new Response(
        JSON.stringify({ error: "Subchannel not found in this channel" }), 
        { status: 404 }
      );
    }
    
    // Get messages for the specified subchannel
    const messages = await demoPrisma.demoMessage.findMany({
      where: { subchannelId: targetSubchannelId },
      orderBy: { createdAt: 'asc' },
      include: { user: true }
    });
    
    // If userId is provided, update read status
    if (userId) {
      // Update message read status - add userId to readByUsers for all messages
      await Promise.all(
        messages.map(async (message) => {
          if (!message.readByUsers.includes(userId)) {
            await demoPrisma.demoMessage.update({
              where: { id: message.id },
              data: {
                readByUsers: {
                  push: userId
                }
              }
            });
          }
        })
      );
      
      // Also update the user's membership lastReadAt timestamp
      await demoPrisma.demoMembership.updateMany({
        where: {
          userId,
          channelId
        },
        data: {
          lastReadAt: new Date()
        }
      });
    }
    
    return new Response(JSON.stringify({
      messages,
      subchannelId: targetSubchannelId
    }));
  } catch (error: any) {
    console.error('Message fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 