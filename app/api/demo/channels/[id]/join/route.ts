import { prisma } from '@/app/utils/prisma';
import { verifyTokenOwnership } from '@/app/utils/zkTokenService';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId, walletAddress } = await req.json();
  const channelId = params.id;
  
  try {
    // Check if channel exists
    const channel = await prisma.demoChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Check if the channel is token gated
    if (channel.isTokenGated && walletAddress) {
      const hasAccess = await verifyTokenOwnership(walletAddress, channel.tokenAddress || '');
      
      if (!hasAccess) {
        return new Response(
          JSON.stringify({ error: "Token ownership required to join this channel" }), 
          { status: 403 }
        );
      }
    }
    
    // Check if user is already a member
    const existingMembership = await prisma.demoMembership.findFirst({
      where: {
        userId,
        channelId
      }
    });
    
    if (existingMembership) {
      return new Response(JSON.stringify(existingMembership));
    }
    
    // Add user as a member
    const membership = await prisma.demoMembership.create({
      data: {
        userId,
        channelId
      }
    });
    
    return new Response(JSON.stringify(membership));
  } catch (error: any) {
    console.error('Join channel error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 