import { NextRequest } from 'next/server';
import { getWalletTokens } from '@/app/utils/zkTokenService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get('address');
  
  if (!walletAddress) {
    return new Response(
      JSON.stringify({ error: "Wallet address is required" }), 
      { status: 400 }
    );
  }
  
  try {
    const tokens = await getWalletTokens(walletAddress);
    
    return new Response(JSON.stringify({
      success: true,
      tokens
    }));
  } catch (error: any) {
    console.error('Get wallet tokens error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    );
  }
} 