"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { createZkToken, getSolBalance, requestSolAirdrop, getWalletTokens, storeNewToken } from "../utils/zkTokenService";

interface TokenForm {
  name: string;
  symbol: string;
  supply: number;
}

interface Token {
  mint: string;
  amount: string;
  decimals: number;
  name?: string;
  symbol?: string;
}

export default function TokenDashboard() {
  const { user, login, authenticated } = usePrivy();
  const [activeTab, setActiveTab] = useState<'tokens'|'create'|'analytics'>('tokens');
  const [isLoading, setIsLoading] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isAirdropRequesting, setIsAirdropRequesting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [formData, setFormData] = useState<TokenForm>({
    name: "",
    symbol: "",
    supply: 1000000,
  });

  const walletAddress = user?.wallet?.address || "";

  useEffect(() => {
    // Clear any existing tokens with duplicate addresses
    if (walletAddress) {
      const localTokensKey = `wallet_tokens_${walletAddress}`;
      localStorage.removeItem(localTokensKey);
      
      fetchSolBalance();
      fetchUserTokens();
    }
  }, [walletAddress]);

  const fetchSolBalance = async () => {
    if (!walletAddress) return;
    
    const balance = await getSolBalance(walletAddress);
    setSolBalance(balance);
  };

  const fetchUserTokens = async () => {
    if (!walletAddress) return;
    
    setIsLoadingTokens(true);
    try {
      const tokens = await getWalletTokens(walletAddress);
      setUserTokens(tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setIsLoadingTokens(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "supply" ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      setErrorMessage("Please connect your wallet first");
      return;
    }
    
    if (!formData.name || !formData.symbol) {
      setErrorMessage("Please fill in all required fields");
      return;
    }
    
    if (solBalance !== null && solBalance < 0.01) {
      setErrorMessage("You need at least 0.01 SOL to create a token. Please request an airdrop.");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const tokenAddress = await createZkToken(
        walletAddress,
        formData.name,
        formData.symbol,
        formData.supply
      );
      
      if (tokenAddress) {
        // Store the new token in localStorage
        await storeNewToken(
          walletAddress,
          tokenAddress,
          formData.name,
          formData.symbol,
          formData.supply.toString(),
          9
        );
        
        setSuccessMessage(`Token created successfully! Token address: ${tokenAddress}`);
        
        // Refresh the token list
        await fetchUserTokens();
        
        // Reset form after successful token creation
        setFormData({
          name: "",
          symbol: "",
          supply: 1000000,
        });
        
        // Switch to tokens tab
        setActiveTab('tokens');
      } else {
        setErrorMessage("Failed to create token. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(`Error creating token: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAirdrop = async () => {
    if (!walletAddress) {
      setErrorMessage("Please connect your wallet first");
      return;
    }
    
    setIsAirdropRequesting(true);
    setErrorMessage(null);
    
    try {
      const signature = await requestSolAirdrop(walletAddress);
      
      if (signature) {
        await fetchSolBalance();
        setSuccessMessage("SOL airdrop successful! Your balance has been updated.");
      } else {
        setErrorMessage("Airdrop request failed. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(`Error requesting airdrop: ${error.message}`);
    } finally {
      setIsAirdropRequesting(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Connect your wallet to manage tokens</h2>
          <button 
            onClick={login}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">ZK-Compressed Tokens</h1>
          <p className="text-gray-400">
            Create and manage your ZK-compressed tokens on Solana devnet
          </p>
        </div>
        
        {/* Wallet Info & SOL Balance */}
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Wallet</p>
            <p className="font-mono text-sm break-all">{walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}</p>
          </div>
          <div className="h-10 w-px bg-gray-700 hidden md:block mx-2"></div>
          <div>
            <p className="text-xs text-gray-400 mb-1">SOL Balance</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading...'}
              </p>
              <button
                onClick={handleRequestAirdrop}
                disabled={isAirdropRequesting}
                className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed rounded transition"
              >
                {isAirdropRequesting ? 'Requesting...' : 'Airdrop'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg">
          <p className="text-green-300">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-300">{errorMessage}</p>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'tokens'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Tokens
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'create'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Token
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>
      
      {/* Tokens List Tab */}
      {activeTab === 'tokens' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Tokens</h2>
            <button
              onClick={() => setActiveTab('create')}
              className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition"
            >
              Create New Token
            </button>
          </div>
          
          {isLoadingTokens ? (
            <div className="py-20 text-center">
              <div className="inline-block w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading your tokens...</p>
            </div>
          ) : userTokens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {userTokens.map((token) => (
                <div 
                  key={token.mint} 
                  className="bg-gray-800/30 border border-gray-700 hover:border-purple-500/50 rounded-lg p-5 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{token.name}</h3>
                      <p className="text-sm text-gray-400">{token.symbol}</p>
                    </div>
                    <div className="px-2 py-1 bg-purple-900/50 rounded-full text-xs text-purple-300 border border-purple-800/50">
                      ZK-Compressed
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Token Address</div>
                    <div className="font-mono text-xs break-all">{token.mint}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Balance</div>
                      <div className="font-medium">{(parseInt(token.amount) / Math.pow(10, token.decimals)).toLocaleString()} {token.symbol}</div>
                    </div>
                    <button
                      onClick={() => {}}
                      className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-800/20 border border-gray-700 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No tokens found</h3>
              <p className="text-gray-500 mb-4">You haven't created any ZK-compressed tokens yet</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition"
              >
                Create Your First Token
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Create Token Tab */}
      {activeTab === 'create' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Token</h2>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Token Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. My Awesome Token"
                  className="w-full bg-black/40 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-1">
                  Token Symbol *
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="e.g. AWSM"
                  className="w-full bg-black/40 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="supply" className="block text-sm font-medium text-gray-300 mb-1">
                  Initial Supply
                </label>
                <input
                  type="number"
                  id="supply"
                  name="supply"
                  value={formData.supply}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full bg-black/40 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !formData.name || !formData.symbol}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-900 disabled:to-indigo-900 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
              >
                {isLoading ? "Creating Token..." : "Create Token"}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Token Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5">
              <h3 className="text-sm text-gray-400 mb-1">Total Tokens</h3>
              <p className="text-2xl font-bold">{userTokens.length}</p>
              <div className="mt-2 text-xs text-green-400">
                {userTokens.length > 0 ? '+1 in the last 24h' : 'Create your first token!'}
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5">
              <h3 className="text-sm text-gray-400 mb-1">Total Value (estimate)</h3>
              <p className="text-2xl font-bold">{userTokens.length > 0 ? '∞' : '0'} SOL</p>
              <div className="mt-2 text-xs text-purple-400">
                ZK-compressed tokens
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-5">
              <h3 className="text-sm text-gray-400 mb-1">Network</h3>
              <p className="text-2xl font-bold">Solana Devnet</p>
              <div className="mt-2 text-xs text-blue-400">
                Blockchain Status: Online
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Token Distribution</h3>
            {userTokens.length > 0 ? (
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-purple-900/20 border-8 border-purple-600/40 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{userTokens.length}</div>
                      <div className="text-sm text-gray-400">Tokens</div>
                    </div>
                  </div>
                  {userTokens.map((token, index) => {
                    const angle = (index * (360 / userTokens.length)) * (Math.PI / 180);
                    const x = 120 * Math.cos(angle);
                    const y = 120 * Math.sin(angle);
                    return (
                      <div 
                        key={token.mint}
                        className="absolute w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs font-bold">{token.symbol}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">No tokens to display analytics for</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">About ZK-Compressed Tokens</h3>
            <div className="prose prose-sm prose-invert max-w-none">
              <p>
                ZK-compressed tokens on Solana offer several advantages over traditional SPL tokens:
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-300">
                <li>Lower cost - significantly reduced transaction fees</li>
                <li>Scalability - more efficient storage on-chain</li>
                <li>Privacy - enhanced privacy features through zero-knowledge proofs</li>
                <li>Programmability - same smart contract capabilities as regular tokens</li>
              </ul>
              <p className="mt-4">
                This implementation is on Solana Devnet for demonstration purposes. For production use, 
                you would want to deploy to Solana Mainnet with proper security reviews.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 