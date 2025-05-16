import { prisma } from '@/app/utils/prisma';
import { NextRequest } from 'next/server';
import { getWalletTokens } from '@/app/utils/zkTokenService';

// Verify access to token-gated channel
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { walletAddress } = await req.json();
    const channelId = params.id;
    
    if (!walletAddress) {
      return new Response(JSON.stringify({ error: "Missing wallet address" }), {
        status: 400
      });
    }
    
    // Get channel
    const channel = await prisma.demoChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404
      });
    }
    
    // If channel is not token-gated, access is granted
    if (!channel.isTokenGated || !channel.tokenAddress) {
      return new Response(JSON.stringify({ hasAccess: true }));
    }
    
    // Check if the user has the token
    const tokenAddress = channel.tokenAddress;
    const userTokens = await getWalletTokens(walletAddress);
    const hasToken = userTokens.some(token => token.mint === tokenAddress);
    
    return new Response(JSON.stringify({ hasAccess: hasToken }));
  } catch (error: any) {
    console.error('Verify channel access error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
} 