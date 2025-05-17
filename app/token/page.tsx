"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import AppLayout from "@/app/components/layouts/AppLayout";
import Link from "next/link";
import { createZkToken, getWalletTokens, storeNewToken, requestSolAirdrop } from "@/app/utils/tokenUtils";
import { useToast } from "../context/ToastContext";

interface TokenFormData {
  name: string;
  symbol: string;
  supply: number;
}

interface TokenData {
  mint: string;
  name?: string;
  symbol?: string;
  amount: string;
  decimals: number;
  createdAt?: number;
}

export default function TokenPage() {
  const { user, authenticated, ready } = usePrivy();
  const router = useRouter();
  const { showToast } = useToast();
  
  // State
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState<TokenFormData>({
    name: "",
    symbol: "",
    supply: 1000000
  });
  const [requestingAirdrop, setRequestingAirdrop] = useState(false);
  const [highlightedToken, setHighlightedToken] = useState<string | null>(null);

  // Initialize from URL parameters on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Use URLSearchParams in client-side code only
        const url = new URL(window.location.href);
        const tabParam = url.searchParams.get('tab');
        const tokenParam = url.searchParams.get('token');
        
        if (tabParam && ['create', 'tokens', 'marketplace'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
        
        if (tokenParam) {
          setHighlightedToken(tokenParam);
          // If a token is specified, always show the marketplace tab
          setActiveTab('marketplace');
        }
      } catch (error) {
        console.error("Error parsing URL parameters:", error);
      }
    }
  }, []);

  // Fetch user tokens when user is authenticated
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchUserTokens();
    }
  }, [authenticated, user?.wallet?.address]);

  // Fetch tokens created by user
  const fetchUserTokens = async () => {
    if (!user?.wallet?.address) return;
    
    try {
      const tokens = await getWalletTokens(user.wallet.address);
      setTokens(tokens);
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      showToast("Failed to fetch tokens", "error");
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "supply" ? parseInt(value) || 0 : value,
    });
  };

  // Create new token
  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.wallet?.address) {
      showToast("Wallet not connected", "error");
      return;
    }
    
    setLoading(true);
    try {
      const tokenAddress = await createZkToken(
        user.wallet.address,
        formData.name,
        formData.symbol,
        formData.supply
      );
      
      if (tokenAddress) {
        // Store token in local storage for demo purposes
        await storeNewToken(
          user.wallet.address,
          tokenAddress,
          formData.name,
          formData.symbol,
          formData.supply.toString()
        );
        
        showToast("Token created successfully!", "success");
        
        // Reset form
        setFormData({
          name: "",
          symbol: "",
          supply: 1000000
        });
        
        // Refresh tokens
        await fetchUserTokens();
        
        // Switch to tokens tab
        setActiveTab("tokens");
      } else {
        showToast("Failed to create token", "error");
      }
    } catch (error) {
      console.error("Error creating token:", error);
      showToast("Error creating token", "error");
    } finally {
      setLoading(false);
    }
  };

  // Request SOL airdrop
  const handleRequestAirdrop = async () => {
    if (!user?.wallet?.address) {
      showToast("Wallet not connected", "error");
      return;
    }
    
    setRequestingAirdrop(true);
    try {
      const signature = await requestSolAirdrop(user.wallet.address);
      if (signature) {
        showToast("1 SOL airdropped to your wallet!", "success");
      } else {
        showToast("Failed to request airdrop", "error");
      }
    } catch (error) {
      console.error("Error requesting airdrop:", error);
      showToast("Error requesting airdrop", "error");
    } finally {
      setRequestingAirdrop(false);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp).toLocaleDateString();
  };

  // Format large numbers with commas
  const formatNumber = (value: string) => {
    return parseInt(value).toLocaleString();
  };

  // Update URL when tab changes without using Next.js router to avoid server components
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        
        // Only include token param if there's a highlighted token
        if (highlightedToken && tab === 'marketplace') {
          url.searchParams.set('token', highlightedToken);
        } else {
          url.searchParams.delete('token');
        }
        
        // Update URL without triggering navigation
        window.history.pushState({}, '', url.toString());
      } catch (error) {
        console.error("Error updating URL:", error);
      }
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col p-6 h-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Token Manager
          </h1>
          <p className="text-gray-400 mt-2">
            Create and manage your ZK-compressed tokens on Solana devnet
          </p>
        </div>

        {/* Request Airdrop Button */}
        <div className="mb-6">
          <button
            onClick={handleRequestAirdrop}
            disabled={requestingAirdrop}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 px-4 py-2 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {requestingAirdrop ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Requesting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Request Devnet SOL
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-800">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "create"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => handleTabChange("create")}
          >
            Create Token
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "tokens"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => handleTabChange("tokens")}
          >
            My Tokens
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "marketplace"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => handleTabChange("marketplace")}
          >
            Marketplace
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {/* Create Token Form */}
          {activeTab === "create" && (
            <div className="max-w-2xl mx-auto">
              <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Create a New Token</h2>
                <form onSubmit={handleCreateToken}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Token Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. My Awesome Token"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-1">
                      Token Symbol
                    </label>
                    <input
                      type="text"
                      id="symbol"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleChange}
                      required
                      placeholder="e.g. MAT"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500"
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
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="e.g. 1000000"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                          Creating...
                        </>
                      ) : (
                        <>Create Token</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* My Tokens */}
          {activeTab === "tokens" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokens.length > 0 ? (
                  tokens.map((token) => (
                    <div key={token.mint} className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {token.symbol?.[0] || token.name?.[0] || "T"}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {token.name || "Unnamed Token"}
                            </h3>
                            <p className="text-sm text-gray-400">{token.symbol || "???"}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-800/50 text-purple-300 text-xs font-medium">
                          ZK-compressed
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Balance:</span>
                          <span className="text-white font-medium">{formatNumber(token.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Decimals:</span>
                          <span className="text-white font-medium">{token.decimals}</span>
                        </div>
                        {token.createdAt && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Created:</span>
                            <span className="text-white font-medium">{formatDate(token.createdAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 font-mono truncate max-w-[150px]" title={token.mint}>
                            {token.mint.slice(0, 6)}...{token.mint.slice(-4)}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(token.mint);
                              showToast("Token address copied!", "success");
                            }}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <div className="h-20 w-20 rounded-full bg-gray-800/60 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No tokens found</h3>
                    <p className="text-gray-400 text-center max-w-md mb-6">
                      You haven't created any tokens yet. Create your first token to see it here.
                    </p>
                    <button
                      onClick={() => handleTabChange("create")}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20"
                    >
                      Create Token
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Marketplace */}
          {activeTab === "marketplace" && (
            <div className="max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Token Marketplace</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tokens..."
                      className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Real tokens from the localStorage registry */}
                  {tokens.map((token) => {
                    // If a token is highlighted, check if this is the one
                    const isHighlighted = highlightedToken && token.mint === highlightedToken;
                    
                    return (
                      <div 
                        key={token.mint} 
                        className={`p-4 rounded-lg ${isHighlighted ? 'bg-indigo-900/60 border-2 border-indigo-500' : 'bg-gray-800/60 border border-gray-700'} flex flex-wrap items-center justify-between gap-4 transition-all ${isHighlighted ? 'animate-pulse' : ''}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`h-12 w-12 rounded-full ${isHighlighted ? 'bg-gradient-to-br from-indigo-600 to-purple-800' : 'bg-gradient-to-br from-blue-600 to-indigo-800'} flex items-center justify-center`}>
                            <span className="text-white font-bold">{token.symbol?.[0] || token.name?.[0] || "T"}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white flex items-center">
                              {token.name || "Unnamed Token"}
                              {isHighlighted && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-600 text-white rounded-full">Required Token</span>
                              )}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-400">{token.symbol || "???"}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400">Supply: {formatNumber(token.amount)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Price</div>
                            <div className="font-medium text-white">0.1 SOL</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Available</div>
                            <div className="font-medium text-white">{parseInt(token.amount) * 0.1} tokens</div>
                          </div>
                          <button 
                            onClick={() => {
                              if (!user?.wallet?.address) {
                                showToast("Please connect your wallet first", "error");
                                return;
                              }
                              setLoading(true);
                              // Simulate token purchase
                              setTimeout(() => {
                                // Update token in localStorage with new amount
                                const userTokens = JSON.parse(localStorage.getItem(`wallet_tokens_${user?.wallet?.address}`) || "[]");
                                const existingToken = userTokens.find((t: TokenData) => t.mint === token.mint);
                                
                                if (existingToken) {
                                  // Update existing token amount
                                  existingToken.amount = (parseInt(existingToken.amount) + 100).toString();
                                } else {
                                  // Add new token to user's wallet
                                  userTokens.push({
                                    ...token,
                                    amount: "100" // Purchase amount
                                  });
                                }
                                
                                // Save back to localStorage
                                localStorage.setItem(`wallet_tokens_${user?.wallet?.address}`, JSON.stringify(userTokens));
                                
                                // Refresh tokens display
                                fetchUserTokens();
                                setLoading(false);
                                
                                const message = isHighlighted 
                                  ? "Required token purchased! You can now access the gated channel."
                                  : "Token purchased successfully!";
                                showToast(message, "success");
                                
                                // Clear highlight after purchase
                                if (isHighlighted) {
                                  setHighlightedToken(null);
                                }
                              }, 1500);
                            }}
                            disabled={loading}
                            className={`px-4 py-2 ${isHighlighted ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500'} rounded-lg text-white font-medium text-sm shadow-md disabled:opacity-50`}
                          >
                            {loading ? "Processing..." : (isHighlighted ? "Buy Required Token" : "Buy Now")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Fallback if no tokens are available */}
                  {tokens.length === 0 && (
                    <div className="text-center py-10">
                      <div className="h-16 w-16 mx-auto bg-gray-800/60 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No tokens available</h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-6">
                        There are no tokens available for purchase. Create a token first to list it in the marketplace.
                      </p>
                      <button
                        onClick={() => handleTabChange("create")}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20"
                      >
                        Create Token
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">
                  <p>This marketplace shows real tokens created in the system. Purchases are simulated but will update your wallet balance.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 