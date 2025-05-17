"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import AppLayout from "@/app/components/layouts/AppLayout";
import Link from "next/link";
import { getWalletTokens, getSolBalance, requestSolAirdrop } from "@/app/utils/tokenUtils";
import { useToast } from "../context/ToastContext";

interface TokenData {
  mint: string;
  name?: string;
  symbol?: string;
  amount: string;
  decimals: number;
  createdAt?: number;
}

export default function WalletPage() {
  const { user, authenticated, ready } = usePrivy();
  const router = useRouter();
  const { showToast } = useToast();
  
  // State
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [requestingAirdrop, setRequestingAirdrop] = useState(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Fetch wallet data when user is authenticated
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchWalletData();
    } else {
      setLoading(false);
    }
  }, [authenticated, user?.wallet?.address]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    if (!user?.wallet?.address) return;
    
    setLoading(true);
    try {
      // Fetch tokens and SOL balance in parallel
      const [tokenData, solData] = await Promise.all([
        getWalletTokens(user.wallet.address),
        getSolBalance(user.wallet.address)
      ]);
      
      setTokens(tokenData);
      setSolBalance(solData);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      showToast("Failed to fetch wallet data", "error");
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
        
        // Update SOL balance
        const newBalance = await getSolBalance(user.wallet.address);
        setSolBalance(newBalance);
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

  // Copy wallet address to clipboard
  const copyWalletAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address);
      setCopySuccess(true);
      showToast("Wallet address copied to clipboard!", "success");
      
      // Reset copy success state after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };

  // Format large numbers with commas
  const formatNumber = (value: string) => {
    return parseInt(value).toLocaleString();
  };

  // Shorten address for display
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-6)}`;
  };

  return (
    <AppLayout>
      <div className="flex flex-col p-6 h-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Wallet Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            View and manage your Solana wallet and token holdings
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Wallet Card */}
          <div className="col-span-1 p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Wallet</h2>
            
            {user?.wallet?.address ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Connected Wallet</div>
                    <div className="text-white font-medium">Solana</div>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 rounded-full bg-green-900/40 border border-green-800/50 text-green-300 text-xs font-medium">
                      Connected
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Address</span>
                    <button 
                      onClick={copyWalletAddress} 
                      className={`text-xs px-2 py-1 rounded-md ${copySuccess ? 'bg-green-900/60 text-green-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors`}
                    >
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="mt-1 font-mono text-sm text-purple-300 break-all">
                    {shortenAddress(user.wallet.address)}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    href="/token" 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-lg text-white font-medium text-center text-sm shadow-md mr-2"
                  >
                    Manage Tokens
                  </Link>
                  <button 
                    onClick={() => router.push('/demo')} 
                    className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium text-center text-sm shadow-md"
                  >
                    View Channels
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="h-16 w-16 rounded-full bg-gray-800/60 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Wallet Connected</h3>
                <p className="text-gray-400 text-center mb-4">
                  You need to connect a wallet to view your balance and tokens.
                </p>
                <button 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20"
                  onClick={() => {/* Add wallet connection logic */}}
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
          
          {/* SOL Balance Card */}
          <div className="col-span-1 p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">SOL Balance</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Current Balance</div>
                      <div className="text-2xl font-semibold text-white">{solBalance.toFixed(4)} SOL</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700 mb-6">
                  <div className="text-gray-400 text-sm mb-2">Network</div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                    <span className="text-white">Solana Devnet</span>
                  </div>
                </div>
                
                <button
                  onClick={handleRequestAirdrop}
                  disabled={requestingAirdrop}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 px-4 py-3 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {requestingAirdrop ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Requesting Airdrop...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Request 1 SOL Airdrop
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          
          {/* Token Summary Card */}
          <div className="col-span-1 p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Token Summary</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-gray-400 text-sm">Total Tokens</div>
                    <div className="text-white font-semibold">{tokens.length}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm">Last Updated</div>
                    <div className="text-white text-sm">{new Date().toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="text-center py-2 px-4 rounded-lg bg-indigo-900/20 border border-indigo-800/30 text-indigo-300 text-sm mb-6">
                  All tokens are on Solana devnet and for testing purposes only
                </div>
                
                <Link 
                  href="/token" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-3 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                  Create or Buy Tokens
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1">
          <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Token Holdings</h2>
              <Link 
                href="/token" 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm"
              >
                View All Tokens
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            ) : tokens.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {tokens.map((token) => (
                      <tr key={token.mint} className="hover:bg-gray-800/30">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center mr-3">
                              <span className="text-white font-bold">
                                {token.symbol?.[0] || token.name?.[0] || "T"}
                              </span>
                            </div>
                            <span className="font-medium text-white">{token.name || "Unnamed Token"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                          {token.symbol || "???"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-white font-medium">
                          {formatNumber(token.amount)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end">
                            <span className="text-gray-400 font-mono text-sm mr-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-20 w-20 rounded-full bg-gray-800/60 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No tokens found</h3>
                <p className="text-gray-400 text-center max-w-md mb-6">
                  You don't have any tokens in your wallet yet. Visit the token page to create or buy tokens.
                </p>
                <Link
                  href="/token"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20"
                >
                  Go to Token Page
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 