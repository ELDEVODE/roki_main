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
                  text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center"
      >
        {wallet ? (
          <span>
            {formatAddress(wallet.address)}
          </span>
        ) : (
          <span>Connect Solana</span>
        )}
        <svg 
          className="w-4 h-4 ml-2" 
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
            <div className="w-20 h-14 rounded-lg flex items-center justify-center">
              <img
                src="/roki-gradient.png"
                alt="Roki Logo"
                title="Roki Logo"
                className="rounded-lg"
              />
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/demo" className="text-sm font-medium text-gray-300 hover:text-white transition">
            Demo
          </Link>
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Features
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Solutions
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {authenticated ? (
            <>
              {/* Add the Solana Wallet Connector */}
              <SolanaWalletConnector />

              {/* User profile button */}
              <div className="relative group">
                <button className="inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                  {user?.email?.address ? (
                    <span className="font-medium text-white">
                      {user.email.address[0].toUpperCase()}
                    </span>
                  ) : (
                    <span className="font-medium text-white">U</span>
                  )}
                </button>
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black/80 backdrop-blur-md shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-400 font-medium">
                      {user?.email?.address || "User"}
                    </div>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={() => logout()}
                      className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-700/50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-purple-500/20 transition-all">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
