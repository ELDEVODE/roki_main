"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { 
  getWalletTokens, 
  getSolBalance,
  requestSolAirdrop
} from "../utils/zkTokenService";
import Link from "next/link";
import TokenWalletHeader from "../components/TokenWalletHeader";

interface Token {
  mint: string;
  amount: string;
  decimals: number;
  name?: string;
  symbol?: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'airdrop';
  amount: string;
  symbol: string;
  address: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

export default function WalletPage() {
  const { user, login, authenticated } = usePrivy();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'assets'|'activity'|'send'>('assets');
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isAirdropRequesting, setIsAirdropRequesting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mockTransactions, setMockTransactions] = useState<Transaction[]>([]);
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    token: ''
  });
  
  const walletAddress = user?.wallet?.address || "";
  
  useEffect(() => {
    if (walletAddress) {
      fetchSolBalance();
      fetchUserTokens();
      generateMockTransactions();
    }
  }, [walletAddress]);
  
  const fetchSolBalance = async () => {
    if (!walletAddress) return;
    
    try {
      const balance = await getSolBalance(walletAddress);
      setSolBalance(balance);
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
    }
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
        
        // Add this airdrop to the mock transactions
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          type: 'airdrop',
          amount: '1',
          symbol: 'SOL',
          address: 'Solana Faucet',
          timestamp: Date.now(),
          status: 'completed'
        };
        
        setMockTransactions(prev => [newTransaction, ...prev]);
      } else {
        setErrorMessage("Airdrop request failed. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(`Error requesting airdrop: ${error.message}`);
    } finally {
      setIsAirdropRequesting(false);
    }
  };
  
  const generateMockTransactions = () => {
    // Generate some mock transactions for the wallet
    const types: ('send' | 'receive' | 'swap' | 'airdrop')[] = ['send', 'receive', 'swap', 'airdrop'];
    const symbols = ['SOL', 'USDC', 'DEMO', 'ROK'];
    const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'completed', 'completed', 'failed', 'pending'];
    
    const transactions: Transaction[] = [];
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    // Generate 10 random transactions over the past week
    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const amount = (Math.random() * (type === 'airdrop' ? 1 : 100)).toFixed(symbol === 'SOL' ? 4 : 2);
      const timestamp = now - Math.floor(Math.random() * 7 * day);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      transactions.push({
        id: `tx-${timestamp}`,
        type,
        amount,
        symbol,
        address: type === 'airdrop' ? 'Solana Faucet' : `0x${Math.random().toString(16).substring(2, 12)}`,
        timestamp,
        status
      });
    }
    
    // Sort by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);
    
    setMockTransactions(transactions);
  };
  
  const handleSendFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSendForm({
      ...sendForm,
      [name]: value,
    });
  };
  
  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd send the transaction to the blockchain here
    setSuccessMessage(`Mock transaction to ${sendForm.recipient} for ${sendForm.amount} ${sendForm.token} was submitted!`);
    
    // Add the transaction to the list
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'send',
      amount: sendForm.amount,
      symbol: sendForm.token,
      address: sendForm.recipient,
      timestamp: Date.now(),
      status: 'completed'
    };
    
    setMockTransactions(prev => [newTx, ...prev]);
    
    // Reset the form
    setSendForm({
      recipient: '',
      amount: '',
      token: ''
    });
    
    // Switch to the activity tab to see the transaction
    setActiveTab('activity');
  };
  
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Check if the user is authenticated
  if (!authenticated) {
    return (
      <>
        <div className="container mx-auto px-4 pt-8">
          <TokenWalletHeader title="Wallet" />
        </div>
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center py-20">
          <div className="bg-purple-900/20 rounded-full p-6 mb-6 neon-purple-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Please connect your wallet to view your tokens, transaction history, and manage your assets.
          </p>
          <button
            onClick={() => login()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center gap-2 neon-purple-glow transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </button>
        </div>
      </>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with navigation */}
      <TokenWalletHeader title="Wallet" />
      
      {/* Wallet Overview */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
            <p className="font-mono text-md">
              {walletAddress ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}` : 'Not connected'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg px-6 py-3 flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">SOL Balance</p>
                <p className="text-xl font-medium">
                  {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading...'}
                </p>
              </div>
              <button
                onClick={handleRequestAirdrop}
                disabled={isAirdropRequesting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed rounded transition ml-2"
              >
                {isAirdropRequesting ? 'Requesting...' : 'Airdrop'}
              </button>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg px-6 py-3">
              <p className="text-sm text-gray-400 mb-1">Token Count</p>
              <p className="text-xl font-medium">{userTokens.length} Types</p>
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
            onClick={() => setActiveTab('assets')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'assets'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'activity'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'send'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Send
          </button>
        </nav>
      </div>
      
      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
          
          {isLoadingTokens ? (
            <div className="py-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading your assets...</p>
            </div>
          ) : userTokens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTokens.map((token) => (
                <div 
                  key={token.mint} 
                  className="bg-gray-800/30 border border-gray-700 hover:border-purple-500/50 rounded-lg p-5 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{token.name || "Unknown Token"}</h3>
                      <p className="text-sm text-gray-400">{token.symbol || "???"}</p>
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
                      onClick={() => {
                        setActiveTab('send');
                        setSendForm({
                          ...sendForm,
                          token: token.symbol || ""
                        });
                      }}
                      className="text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ))}
              
              {/* SOL Card */}
              <div className="bg-gray-800/30 border border-gray-700 hover:border-blue-500/50 rounded-lg p-5 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Solana</h3>
                    <p className="text-sm text-gray-400">SOL</p>
                  </div>
                  <div className="px-2 py-1 bg-blue-900/50 rounded-full text-xs text-blue-300 border border-blue-800/50">
                    Native
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Network</div>
                  <div className="font-mono text-xs">Solana Devnet</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Balance</div>
                    <div className="font-medium">{solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading...'}</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('send');
                      setSendForm({
                        ...sendForm,
                        token: "SOL"
                      });
                    }}
                    className="text-xs px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-gray-800/20 border border-gray-700 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No tokens found</h3>
              <p className="text-gray-500 mb-6">You haven't created any tokens yet</p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/token"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition"
                >
                  Create Your First Token
                </Link>
                <button
                  onClick={handleRequestAirdrop}
                  disabled={isAirdropRequesting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed rounded transition"
                >
                  {isAirdropRequesting ? 'Requesting...' : 'Request SOL Airdrop'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          
          {mockTransactions.length > 0 ? (
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`mr-2 flex-shrink-0 h-2 w-2 rounded-full ${
                            tx.type === 'send' ? 'bg-red-500' :
                            tx.type === 'receive' ? 'bg-green-500' :
                            tx.type === 'airdrop' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}></span>
                          <span className="text-sm font-medium capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm">
                          <span className={
                            tx.type === 'send' ? 'text-red-400' :
                            tx.type === 'receive' || tx.type === 'airdrop' ? 'text-green-400' : ''
                          }>
                            {tx.type === 'send' ? '- ' : tx.type === 'receive' || tx.type === 'airdrop' ? '+ ' : ''}
                            {tx.amount} {tx.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm font-mono text-gray-400">
                          {tx.address.length > 15 ? `${tx.address.slice(0, 6)}...${tx.address.slice(-4)}` : tx.address}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-400">{formatTimestamp(tx.timestamp)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold capitalize
                          ${tx.status === 'completed' ? 'bg-green-900/30 text-green-400 border border-green-800/50' :
                            tx.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' :
                            'bg-red-900/30 text-red-400 border border-red-800/50'
                          }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center bg-gray-800/20 border border-gray-700 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No transaction history</h3>
              <p className="text-gray-500 mb-4">You haven't made any transactions yet</p>
            </div>
          )}
        </div>
      )}
      
      {/* Send Tab */}
      {activeTab === 'send' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Send Tokens</h2>
          
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <form onSubmit={handleSendSubmit}>
              <div className="mb-4">
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  value={sendForm.recipient}
                  onChange={handleSendFormChange}
                  placeholder="e.g. 0x1234..."
                  className="w-full bg-black/40 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={sendForm.amount}
                    onChange={handleSendFormChange}
                    placeholder="0.0"
                    className="w-full bg-black/40 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-1">
                    Token
                  </label>
                  <select
                    id="token"
                    name="token"
                    value={sendForm.token}
                    onChange={handleSendFormChange}
                    className="w-full bg-black/40 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    required
                  >
                    <option value="" disabled>Select token</option>
                    <option value="SOL">SOL</option>
                    {userTokens.map((token) => (
                      <option key={token.mint} value={token.symbol || "Unknown"}>
                        {token.symbol || "Unknown"} 
                        ({(parseInt(token.amount) / Math.pow(10, token.decimals)).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-900/30 rounded-md p-4 mb-6 border border-gray-700/50">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Transaction Summary</h4>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-400">Network</span>
                  <span>Solana Devnet</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-400">Estimated Fee</span>
                  <span>0.000005 SOL</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400">Total</span>
                  <span>{sendForm.amount ? `${sendForm.amount} ${sendForm.token} + fees` : '0 + fees'}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!sendForm.recipient || !sendForm.amount || !sendForm.token}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-900 disabled:to-indigo-900 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
              >
                Send Tokens
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 