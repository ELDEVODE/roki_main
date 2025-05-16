import { NextRequest } from 'next/server';
import { requestSolAirdrop } from '@/app/utils/zkTokenService';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address is required" }), 
        { status: 400 }
      );
    }
    
    const signature = await requestSolAirdrop(walletAddress);
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Airdrop request failed" }), 
        { status: 500 }
      );
    }
    
    return new Response(JSON.stringify({
      success: true,
      signature
    }));
  } catch (error: any) {
    console.error('SOL airdrop error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    );
  }
} 