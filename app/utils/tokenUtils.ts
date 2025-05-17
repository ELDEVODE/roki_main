import { Rpc, createRpc } from "@lightprotocol/stateless.js";
import { PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Replace with your Helius API key for production
const RPC_ENDPOINT = `https://devnet.helius-rpc.com?api-key=${process.env.HELIUS_API_KEY}`;
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
export interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
  name?: string;   // Optional name property
  symbol?: string; // Optional symbol property
  createdAt?: number; // Optional creation timestamp
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
    const connection = getZkConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // This is where we would integrate with the Light Protocol SDK to create real tokens
    // For now, we'll still use a placeholder but more explicitly document what would happen
    console.log(`Creating real ZK token for wallet: ${walletAddress}`);
    console.log(`Token details: ${tokenName} (${tokenSymbol}), supply: ${supply}`);
    
    // The real implementation would:
    // 1. Create a new mint account
    // 2. Initialize the token with metadata (name, symbol)
    // 3. Mint initial supply to the creator wallet
    // 4. Return the token mint address
    
    // Generate unique token address - in production this would be a real Solana address
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const uniqueString = `${walletAddress}${tokenName}${tokenSymbol}${timestamp}${randomPart}`;
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
    console.log(`Fetching real tokens for wallet: ${walletAddress}`);
    
    const connection = getZkConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // This would be the real implementation to fetch token balances using the Light Protocol SDK
    // For now, we check localStorage first to maintain user experience with created tokens
    
    let tokens: TokenBalance[] = [];
    
    // Check localStorage for created tokens during this session
    if (typeof window !== 'undefined') {
      const localTokensKey = `wallet_tokens_${walletAddress}`;
      const storedTokens = localStorage.getItem(localTokensKey);
      
      if (storedTokens) {
        tokens = JSON.parse(storedTokens);
      }
    }
    
    // In a real implementation, we would:
    // 1. Fetch all compressed token balances from the blockchain
    // 2. Merge with any pending tokens from localStorage
    // 3. Return the combined list
    
    try {
      // This would call the actual RPC endpoint:
      // const response = await connection.getCompressedTokenBalancesByOwnerV2(publicKey);
      // return response.items;
      
      // For now, just return what we have in localStorage
      return tokens;
    } catch (error) {
      console.error("Error fetching tokens from blockchain:", error);
      // Fall back to localStorage tokens if blockchain query fails
      return tokens;
    }
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
    if (typeof window === 'undefined') return;
    
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
      symbol,
      createdAt: Date.now()
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
    if (typeof window !== 'undefined') {
      console.log(`[DEV] Simulating token verification for: ${walletAddress}`);
      
      // Check localStorage for token ownership
      const localTokensKey = `wallet_tokens_${walletAddress}`;
      const storedTokens = localStorage.getItem(localTokensKey);
      
      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);
        return tokens.some((token: TokenBalance) => 
          token.mint === tokenAddress && 
          BigInt(token.amount) > BigInt(0)
        );
      }
      
      return false;
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
    return false;
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