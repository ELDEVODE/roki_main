import { prisma } from '@/app/utils/prisma';
import { NextRequest } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isTokenGated, tokenAddress } = await req.json();
  const { id: channelId } = await params;
  
  try {
    // Check if channel exists
    const existingChannel = await prisma.demoChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!existingChannel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Update token gating settings
    const channel = await prisma.demoChannel.update({
      where: { id: channelId },
      data: {
        isTokenGated,
        tokenAddress: isTokenGated ? (tokenAddress || "cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn") : null
      }
    });
    
    return new Response(JSON.stringify(channel));
  } catch (error: any) {
    console.error('Channel update error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 