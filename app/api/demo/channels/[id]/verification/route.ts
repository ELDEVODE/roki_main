import { NextRequest } from 'next/server';
import { demoPrisma } from '@/app/utils/demo-prisma';

// Simulate token verification logic for demo purposes
// In a real app, this would query the blockchain
function simulateTokenVerification(walletAddress: string, tokenAddress: string) {
  // For demo purposes, always grant access if wallet address ends with 'a', 'c', 'e'
  const lastChar = walletAddress.slice(-1).toLowerCase();
  return ['a', 'c', 'e', '0', '2', '4', '6', '8'].includes(lastChar);
  
  // In production, you would:
  // 1. Connect to blockchain (Solana, Ethereum, etc.)
  // 2. Verify the wallet's token balance for the specific token address
  // 3. Return true if they meet the required token threshold
}

// This endpoint verifies if a wallet has access to a token-gated channel
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { walletAddress } = await req.json();
    const { id } = params;
    
    // First check if the channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id },
      include: {
        subchannels: true
      }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
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
        const hasTokenAccess = simulateTokenVerification(walletAddress, subchannel.tokenAddress);
        if (!hasTokenAccess) {
          allAccess = false;
          break;
        }
      }
    }
    
    // Return the verification result
    return new Response(JSON.stringify({ hasAccess: allAccess }));
    
  } catch (error: any) {
    console.error("Token verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 