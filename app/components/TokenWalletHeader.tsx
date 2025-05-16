"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

interface TokenWalletHeaderProps {
  title: string;
}

export default function TokenWalletHeader({ title }: TokenWalletHeaderProps) {
  const pathname = usePathname();
  const { user, login, authenticated } = usePrivy();
  
  const walletAddress = user?.wallet?.address || "";
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
        {authenticated && walletAddress && (
          <p className="text-gray-400 font-mono text-sm">
            {`${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`}
          </p>
        )}
        {!authenticated && (
          <p className="text-gray-400 text-sm">
            Connect wallet to manage your tokens and assets
          </p>
        )}
      </div>
      
      <div className="flex space-x-4">
        <Link 
          href="/demo" 
          className={`px-4 py-2 rounded-md ${pathname === '/demo' ? 'bg-purple-900/40 text-white' : 'text-gray-400 hover:bg-gray-800/30 hover:text-white'} transition-all`}
        >
          Demo
        </Link>
        <Link 
          href="/token" 
          className={`px-4 py-2 rounded-md ${pathname === '/token' ? 'bg-purple-900/40 text-white' : 'text-gray-400 hover:bg-gray-800/30 hover:text-white'} transition-all`}
        >
          Tokens
        </Link>
        <Link 
          href="/wallet" 
          className={`px-4 py-2 rounded-md ${pathname === '/wallet' ? 'bg-purple-900/40 text-white' : 'text-gray-400 hover:bg-gray-800/30 hover:text-white'} transition-all`}
        >
          Wallet
        </Link>
      </div>
      
      {!authenticated && (
        <button
          onClick={() => login()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
        >
          Connect
        </button>
      )}
    </div>
  );
} 