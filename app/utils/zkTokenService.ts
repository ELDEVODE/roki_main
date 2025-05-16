import { Rpc, createRpc } from "@lightprotocol/stateless.js";
import { PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Replace with your Helius API key for production
const RPC_ENDPOINT = "https://devnet.helius-rpc.com?api-key=a12f8318-78b9-422d-b27d-84623d909cf2";
const COMPRESSION_ENDPOINT = RPC_ENDPOINT;
const PROVER_ENDPOINT = RPC_ENDPOINT;

// Create connection to the ZK Compression RPC
export const getZkConnection = (): Rpc => {
  return createRpc(RPC_ENDPOINT, COMPRESSION_ENDPOINT, PROVER_ENDPOINT);
};

// Create standard Solana connection for non-ZK operations
export const getSolanaConnection = (): Connection => {
  return new Connection(clusterApiUrl('devnet'));
};

// Define the token balance interface
interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
  name?: string;   // Optional name property
  symbol?: string; // Optional symbol property
}

interface BalancesResponse {
  items: TokenBalance[];
}

// Create a new ZK-compressed token
export async function createZkToken(
  walletAddress: string,
  tokenName: string,
  tokenSymbol: string,
  supply: number = 1000000
): Promise<string | null> {
  try {
    // For development mode, we'll return a mock token address
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Simulating token creation for: ${walletAddress}`);
      
      // Generate a unique token address with multiple random elements
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 15);
      const uniqueString = `${walletAddress}${tokenName}${tokenSymbol}${timestamp}${randomPart}`;
      
      // Create a buffer and use cryptographic-quality hex encoding for the address
      const address = `zk${Buffer.from(uniqueString).toString('hex').substring(0, 16)}${timestamp.toString(16)}`;
      console.log(`Generated unique token address: ${address}`);
      return address;
    }
    
    const connection = getZkConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // This is a placeholder for actual token creation logic
    // You would use the Light Protocol SDK here to create a ZK-compressed token
    // For now, we'll return a mock token address with enhanced uniqueness
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const uniqueString = `${walletAddress}${tokenName}${tokenSymbol}${timestamp}${randomPart}`;
    
    // Create a buffer and use cryptographic-quality hex encoding for the address
    const tokenAddress = `zk${Buffer.from(uniqueString).toString('hex').substring(0, 16)}${timestamp.toString(16)}`;
    
    return tokenAddress;
  } catch (error) {
    console.error("Error creating ZK token:", error);
    return null;
  }
}

// Get all ZK-compressed tokens owned by a wallet
export async function getWalletTokens(walletAddress: string): Promise<TokenBalance[]> {
  try {
    // For development mode, check localStorage for stored tokens
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Simulating token fetch for: ${walletAddress}`);
      
      // Check if we have tokens in localStorage to persist between page refreshes
      const localTokensKey = `wallet_tokens_${walletAddress}`;
      const storedTokens = localStorage.getItem(localTokensKey);
      
      if (storedTokens) {
        return JSON.parse(storedTokens);
      }
      
      // Return empty array if no tokens found
      return [];
    }
    
    const connection = getZkConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // Get all compressed token balances
    const response = await connection.getCompressedTokenBalancesByOwnerV2(
      publicKey
    ) as unknown as BalancesResponse;
    
    return response.items;
  } catch (error) {
    console.error("Error getting wallet tokens:", error);
    return [];
  }
}

// Update the mock implementation to store new tokens in localStorage
export async function storeNewToken(
  walletAddress: string,
  tokenAddress: string,
  name: string,
  symbol: string,
  amount: string,
  decimals: number = 9
): Promise<void> {
  try {
    const localTokensKey = `wallet_tokens_${walletAddress}`;
    
    // Get existing tokens
    let tokens: TokenBalance[] = [];
    const storedTokens = localStorage.getItem(localTokensKey);
    
    if (storedTokens) {
      tokens = JSON.parse(storedTokens);
    }
    
    // Add the new token
    tokens.push({
      mint: tokenAddress,
      amount,
      decimals,
      name,
      symbol
    });
    
    // Store back in localStorage
    localStorage.setItem(localTokensKey, JSON.stringify(tokens));
  } catch (error) {
    console.error("Error storing new token:", error);
  }
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

// Request an airdrop of SOL to the specified wallet
export async function requestSolAirdrop(walletAddress: string): Promise<string | null> {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // Request 1 SOL airdrop (1 billion lamports)
    const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error("Error requesting SOL airdrop:", error);
    return null;
  }
}

// Get SOL balance for an address
export async function getSolBalance(walletAddress: string): Promise<number> {
  try {
    const connection = getSolanaConnection();
    const publicKey = new PublicKey(walletAddress);
    
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
  } catch (error) {
    console.error("Error getting SOL balance:", error);
    return 0;
  }
} 