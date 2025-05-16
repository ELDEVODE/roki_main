"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { PublicKey, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';
import { useSolanaWallets } from "@privy-io/react-auth";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-menu-container')) {
          setIsProfileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Format wallet address for display
  const formatAddress = (address: string | undefined): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle connecting a Solana wallet
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setIsProfileMenuOpen(false);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

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
              {authenticated && (
                <>
                  <Link href="/demo">
                    <div className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        <span className="font-medium">Dashboard</span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/token">
                    <div className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Tokens</span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/wallet">
                    <div className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all">
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Wallet</span>
                      </div>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={() => logout()} 
                    className="w-full block py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1zm1 8a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Sign Out</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Menu items removed */}
        </nav>

        <div className="flex items-center space-x-4">
          {authenticated ? (
            <div className="relative profile-menu-container">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 border-2 border-transparent hover:border-purple-400/30 shadow-lg shadow-purple-900/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20"
                aria-label="Open user menu"
              >
                {user?.email?.address ? (
                  <span className="font-medium text-white text-base">
                    {user.email.address[0].toUpperCase()}
                  </span>
                ) : (
                  <span className="font-medium text-white text-base">U</span>
                )}
                {user?.wallet?.address && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-purple-500 rounded-full border border-black shadow-inner shadow-purple-700/50 z-10">
                    <span className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-75" style={{ animationDuration: '3s' }}></span>
                  </div>
                )}
              </button>
              <div 
                className={`absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-gray-900/95 backdrop-blur-xl shadow-xl border border-gray-700/50 transition-all duration-200 ${
                  isProfileMenuOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                }`}
              >
                <div className="py-3 px-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-inner shadow-purple-900/50">
                      <span className="font-medium text-white text-lg">
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
                  
                  {/* Wallet connection option */}
                  {!user?.wallet?.address && (
                    <button
                      onClick={handleConnectWallet}
                      className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                      Connect Wallet
                    </button>
                  )}
                  
                  {/* Wallet info if connected */}
                  {user?.wallet?.address && (
                    <div className="px-3 py-2 text-sm text-gray-300 rounded-lg mb-2 bg-purple-900/20 border border-purple-900/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Wallet</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30">
                          Connected
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-purple-300 pl-6 font-mono">
                        {formatAddress(user.wallet.address)}
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Links */}
                  {authenticated && (
                    <>
                      <Link href="/demo" 
                        className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-2 mb-1"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        Dashboard
                      </Link>
                      
                      <Link href="/token" 
                        className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-2 mb-1"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        Tokens
                      </Link>
                      
                      <Link href="/wallet" 
                        className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-2 mb-1"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        Wallet
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={() => logout()}
                    className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm6 6V5.414l3.293 3.293a1 1 0 000 1.414 1 1 0 001.414 0l3-3a1 1 0 000-1.414l-3-3a1 1 0 00-1.414 1.414L15.586 7H10.414l-3-3a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414-1.414L7.414 4 11 7.586V9h2v2h-2v2h2v2h-2v-2H9v-2h2V9H9z" clipRule="evenodd" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
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
