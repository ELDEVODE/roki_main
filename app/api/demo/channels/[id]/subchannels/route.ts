import { demoPrisma } from '@/app/utils/demo-prisma';
import { NextRequest } from 'next/server';

// Get all subchannels for a channel
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const channelId = (await params).id;
  
  try {
    const subchannels = await demoPrisma.demoSubChannel.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' }
    });
    
    return new Response(JSON.stringify(subchannels));
  } catch (error: any) {
    console.error('Subchannel fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Create a new subchannel
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { name, type, isTokenGated = false, tokenAddress = null } = await req.json();
  const channelId = (await params).id;
  
  try {
    // Check if channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id: channelId },
      include: { subchannels: true }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Check if this is the first subchannel (should be default)
    const isFirst = channel.subchannels.length === 0;
    
    // Create the subchannel
    const subchannel = await demoPrisma.demoSubChannel.create({
      data: {
        name,
        type,
        isTokenGated,
        tokenAddress,
        isDefault: isFirst, // First subchannel is default
        channel: {
          connect: { id: channelId }
        }
      }
    });
    
    // If this is the first subchannel, update the channel with the default subchannel ID
    if (isFirst) {
      await demoPrisma.demoChannel.update({
        where: { id: channelId },
        data: { defaultSubchannelId: subchannel.id }
      });
    }
    
    return new Response(JSON.stringify(subchannel));
  } catch (error: any) {
    console.error('Subchannel creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 