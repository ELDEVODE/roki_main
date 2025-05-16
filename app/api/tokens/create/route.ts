import { NextRequest } from 'next/server';
import { createZkToken } from '@/app/utils/zkTokenService';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, name, symbol, supply } = await req.json();
    
    if (!walletAddress || !name || !symbol) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { status: 400 }
      );
    }
    
    const tokenAddress = await createZkToken(walletAddress, name, symbol, supply);
    
    if (!tokenAddress) {
      return new Response(
        JSON.stringify({ error: "Failed to create token" }), 
        { status: 500 }
      );
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      tokenAddress,
      name,
      symbol,
      supply
    }));
  } catch (error: any) {
    console.error('Token creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    );
  }
} 