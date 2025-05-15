import { Rpc, createRpc } from "@lightprotocol/stateless.js";
import { PublicKey } from "@solana/web3.js";

// Replace with your Helius API key for production
const RPC_ENDPOINT = "https://devnet.helius-rpc.com?api-key=a12f8318-78b9-422d-b27d-84623d909cf2";
const COMPRESSION_ENDPOINT = RPC_ENDPOINT;
const PROVER_ENDPOINT = RPC_ENDPOINT;

// Create connection to the ZK Compression RPC
export const getZkConnection = (): Rpc => {
  return createRpc(RPC_ENDPOINT, COMPRESSION_ENDPOINT, PROVER_ENDPOINT);
};

// Define the token balance interface
interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
}

interface BalancesResponse {
  items: TokenBalance[];
}

// Check if wallet has the required token
export async function verifyTokenOwnership(
  walletAddress: string, 
  tokenAddress: string
): Promise<boolean> {
  try {
    // For demo purposes, you might want to simulate this for testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Simulating token verification for: ${walletAddress}`);
      return true;
    }
    
    const connection = getZkConnection();
    const publicKey = new PublicKey(walletAddress);
    const mintKey = new PublicKey(tokenAddress);

    // Get compressed token balances
    const response = await connection.getCompressedTokenBalancesByOwnerV2(
      publicKey, 
      { mint: mintKey }
    ) as unknown as BalancesResponse;

    // Check if user has any balance of the token
    return response.items.length > 0 && 
           response.items.some((item) => 
             item.mint === tokenAddress && 
             BigInt(item.amount) > BigInt(0)
           );
  } catch (error) {
    console.error("ZK token verification error:", error);
    // For demo purposes, we'll allow access even if verification fails
    return true;
  }
} 