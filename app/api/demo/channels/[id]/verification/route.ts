import { prisma } from '@/app/utils/prisma';
import { verifyTokenOwnership } from '@/app/utils/zkTokenService';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { walletAddress } = await req.json();
  const channelId = params.id;

  try {
    // Get channel
    const channel = await prisma.demoChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }

    // If channel isn't token gated, always allow access
    if (!channel.isTokenGated || !channel.tokenAddress) {
      return new Response(JSON.stringify({ hasAccess: true }));
    }

    // Verify token ownership
    const hasAccess = await verifyTokenOwnership(walletAddress, channel.tokenAddress);

    return new Response(JSON.stringify({ hasAccess }));
  } catch (error: any) {
    console.error('Token verification error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 