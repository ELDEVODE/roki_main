import { demoPrisma } from '@/app/utils/demo-prisma';
import { NextRequest } from 'next/server';

// Get a specific subchannel
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, subchannelId: string }> }
) {
  const channelId = (await params).id;
  const subchannelId = (await params).subchannelId;
  
  try {
    // Check if subchannel exists and belongs to the channel
    const subchannel = await demoPrisma.demoSubChannel.findFirst({
      where: {
        id: subchannelId,
        channelId: channelId
      },
      include: {
        messages: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    
    if (!subchannel) {
      return new Response(JSON.stringify({ error: "Subchannel not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify(subchannel));
  } catch (error: any) {
    console.error('Subchannel fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Update a subchannel
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, subchannelId: string }> }
) {
  const { name, type } = await req.json();
  const channelId = (await params).id;
  const subchannelId = (await params).subchannelId;
  
  try {
    // Check if subchannel exists and belongs to the channel
    const existingSubchannel = await demoPrisma.demoSubChannel.findFirst({
      where: {
        id: subchannelId,
        channelId: channelId
      }
    });
    
    if (!existingSubchannel) {
      return new Response(JSON.stringify({ error: "Subchannel not found" }), { status: 404 });
    }
    
    // Update subchannel
    const subchannel = await demoPrisma.demoSubChannel.update({
      where: {
        id: subchannelId
      },
      data: {
        name: name,
        type: type
      }
    });
    
    return new Response(JSON.stringify(subchannel));
  } catch (error: any) {
    console.error('Subchannel update error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Delete a subchannel
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, subchannelId: string }> }
) {
  const channelId = (await params).id;
  const subchannelId = (await params).subchannelId;
  
  try {
    // Check if subchannel exists and belongs to the channel
    const existingSubchannel = await demoPrisma.demoSubChannel.findFirst({
      where: {
        id: subchannelId,
        channelId: channelId
      }
    });
    
    if (!existingSubchannel) {
      return new Response(JSON.stringify({ error: "Subchannel not found" }), { status: 404 });
    }
    
    // Don't allow deleting the last subchannel
    const subchannelCount = await demoPrisma.demoSubChannel.count({
      where: {
        channelId: channelId
      }
    });
    
    if (subchannelCount <= 1) {
      return new Response(
        JSON.stringify({ error: "Cannot delete the last subchannel" }), 
        { status: 400 }
      );
    }
    
    // Delete subchannel
    await demoPrisma.demoSubChannel.delete({
      where: {
        id: subchannelId
      }
    });
    
    return new Response(
      JSON.stringify({ message: "Subchannel deleted successfully" })
    );
  } catch (error: any) {
    console.error('Subchannel delete error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 