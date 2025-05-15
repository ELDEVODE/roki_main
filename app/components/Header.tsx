"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { PublicKey, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';
import { useSolanaWallets } from "@privy-io/react-auth";

export function SolanaWalletConnector() {
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const { connectWallet, user } = usePrivy();
  const wallet = user?.wallet;
  
  // Format wallet address for display
  const formatAddress = (address: string | undefined): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle connecting a Solana wallet
  const handleConnectSolanaWallet = async () => {
    try {
      // Just call the regular connectWallet without arguments
      // The wallet selection will be handled by Privy's UI
      await connectWallet();
      setWalletMenuOpen(false);
    } catch (err) {
      console.error('Failed to connect Solana wallet:', err);
    }
  };

  // Example function to send a transaction
  const sendExampleTransaction = async () => {
    if (!wallet) return;
    
    try {
      // Configure connection to Solana devnet
      let connection = new Connection(clusterApiUrl('devnet'));
      
      // Create a simple transaction (this is just a placeholder)
      let transaction = new Transaction();
      
      // Only attempt if we have a valid wallet
      if (wallet.walletClientType === 'privy') {
        // For Privy embedded wallets, we need special handling
        console.log("Would send transaction with Privy wallet here");
      }
    } catch (err) {
      console.error('Failed to send transaction:', err);
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setWalletMenuOpen(!walletMenuOpen)}
        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 
                  text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg transition-all flex items-center gap-1 sm:gap-2"
      >
        {wallet ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span className="hidden xs:inline">{formatAddress(wallet.address)}</span>
            <span className="xs:hidden">Wallet</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span className="hidden xs:inline">Connect Wallet</span>
            <span className="xs:hidden">Wallet</span>
          </>
        )}
        <svg 
          className="w-4 h-4 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d={walletMenuOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>

      {/* Wallet dropdown menu */}
      {walletMenuOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-black/90 backdrop-blur-md border border-gray-700 z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-xs text-gray-400 font-medium">
              Solana Wallet
            </div>
            
            {wallet ? (
              <div className="max-h-48 overflow-y-auto">
                <div className="px-4 py-2 hover:bg-gray-800 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-white">{wallet.walletClientType}</div>
                    <div className="text-xs text-gray-400">{formatAddress(wallet.address)}</div>
                  </div>
                  <span className="text-green-400 text-xs px-2 py-0.5 rounded-full bg-green-900/30">
                    Active
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                No Solana wallet connected
              </div>
            )}
            
            <hr className="my-1 border-gray-700" />
            
            <button
              onClick={handleConnectSolanaWallet}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              Connect Solana Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { ready, authenticated, user, logout, connectWallet } = usePrivy();

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`py-4 px-6 fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/demo">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden flex items-center justify-center ">
              <img
                src="/roki-gradient.png"
                alt="Roki Logo"
                title="Roki Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
          </Link>
          {/* <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
            Roki
          </span> */}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMenuOpen}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile navigation dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-lg border-t border-b border-gray-800 md:hidden z-50 shadow-xl transition-all duration-300 ease-in-out">
            <div className="py-4 px-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <Link href="/demo" className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  <span className="font-medium">Chat Demo</span>
                </div>
              </Link>
              <Link href="/demo/channels" className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span className="font-medium">My Channels</span>
                </div>
              </Link>
              <Link href="#" className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Features</span>
                </div>
              </Link>
              {authenticated && (
                <button 
                  onClick={() => logout()} 
                  className="w-full block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1zm1 8a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Sign Out</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/demo" className="text-sm font-medium text-gray-300 hover:text-white transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Chat Demo
          </Link>
          <Link href="/demo/channels" className="text-sm font-medium text-gray-300 hover:text-white transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            My Channels
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Features
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {authenticated ? (
            <>
              {/* Add the Solana Wallet Connector */}
              <SolanaWalletConnector />

              {/* User profile button */}
              <div className="relative group">
                <button className="inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 border-2 border-transparent group-hover:border-white/30 transition-all duration-200">
                  {user?.email?.address ? (
                    <span className="font-medium text-white">
                      {user.email.address[0].toUpperCase()}
                    </span>
                  ) : (
                    <span className="font-medium text-white">U</span>
                  )}
                </button>
                <div className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-gray-900/95 backdrop-blur-xl shadow-xl border border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-3 px-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                        <span className="font-medium text-white">
                          {user?.email?.address ? user.email.address[0].toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user?.email?.address || "User"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 'No wallet connected'}
                        </div>
                      </div>
                    </div>
                    <hr className="my-2 border-gray-700/50" />
                    <Link href="/demo/channels" className="block w-full px-3 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        My Channels
                      </div>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors mt-1 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm6 6V5.414l3.293 3.293a1 1 0 000 1.414 1 1 0 001.414 0l3-3a1 1 0 000-1.414l-3-3a1 1 0 00-1.414 1.414L15.586 7H10.414l-3-3a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414-1.414L7.414 4 11 7.586V9h2v2h-2v2h2v2h-2v-2H9v-2h2V9H9z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
                </svg>
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
