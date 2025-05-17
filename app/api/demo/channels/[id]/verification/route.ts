import { NextRequest } from 'next/server';
import { demoPrisma } from '@/app/utils/demo-prisma';
import { verifyTokenOwnership } from '@/app/utils/tokenUtils';

// This endpoint verifies if a wallet has access to a token-gated channel
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { walletAddress } = await req.json();
    const { id } = await context.params;
    
    // First check if the channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id },
      include: {
        creator: true,
        subchannels: true
      }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Check if the user is the channel creator - creators always have access
    if (channel.creator?.walletAddress && channel.creator.walletAddress === walletAddress) {
      return new Response(JSON.stringify({ 
        hasAccess: true,
        isCreator: true
      }));
    }
    
    // Check if any subchannel is token-gated
    const tokenGatedSubchannels = channel.subchannels.filter(subchannel => 
      subchannel.isTokenGated && subchannel.tokenAddress
    );
    
    // If no subchannels are token-gated, access is granted
    if (tokenGatedSubchannels.length === 0) {
      return new Response(JSON.stringify({ hasAccess: true }));
    }
    
    // Verify each token-gated subchannel
    let allAccess = true;
    
    for (const subchannel of tokenGatedSubchannels) {
      if (subchannel.tokenAddress) {
        // Use the real token verification function that checks the user's wallet
        const hasTokenAccess = await verifyTokenOwnership(walletAddress, subchannel.tokenAddress);
        
        if (!hasTokenAccess) {
          allAccess = false;
          break;
        }
      }
    }
    
    // Return the verification result
    return new Response(JSON.stringify({ 
      hasAccess: allAccess,
      requiredTokens: tokenGatedSubchannels.map(sub => ({
        subchannelId: sub.id,
        subchannelName: sub.name,
        tokenAddress: sub.tokenAddress
      }))
    }));
    
  } catch (error: any) {
    console.error("Token verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 