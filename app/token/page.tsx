"use client";

import { usePrivy } from "@privy-io/react-auth";
import TokenDashboard from "../Pages/CreateToken";
import TokenWalletHeader from "../components/TokenWalletHeader";

export default function TokenPage() {
  const { authenticated, login } = usePrivy();
  
  // Show a login prompt if not authenticated
  if (!authenticated) {
    return (
      <>
        <div className="container mx-auto px-4 pt-8">
          <TokenWalletHeader title="Tokens" />
        </div>
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center py-20">
          <div className="bg-purple-900/20 rounded-full p-6 mb-6 neon-purple-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Please connect your wallet to create, manage, and view your ZK-compressed tokens.
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
    <>
      <div className="container mx-auto px-4 pt-8">
        <TokenWalletHeader title="Tokens" />
      </div>
      <TokenDashboard />
    </>
  );
} 