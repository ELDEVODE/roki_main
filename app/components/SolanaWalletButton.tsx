"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { PublicKey, Transaction, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// Extend the Wallet type to include signTransaction
interface PrivyWallet {
  address: string;
  walletClientType: string;
  chainType: string;
  signTransaction?: (transaction: Transaction) => Promise<Transaction>;
}

export default function SolanaWalletButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [txResult, setTxResult] = useState<string | null>(null);
  const { user } = usePrivy();
  const wallet = user?.wallet as PrivyWallet | undefined;
  
  // Format wallet address for display
  const formatAddress = (address: string | undefined): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Send a simple SOL transaction using connected wallet
  const sendTestTransaction = async () => {
    if (!wallet) {
      console.error("No Solana wallet connected");
      return;
    }

    setIsLoading(true);
    setTxResult(null);
    
    try {
      // Configure your connection to point to the correct Solana network
      let connection = new Connection(clusterApiUrl('devnet'));

      // Build a simple transaction (this just sends a very small amount of SOL to yourself)
      // This is only for demonstration purposes
      let transaction = new Transaction();
      
      // Add a simple instruction (sending a tiny amount of SOL back to yourself)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.address),
          toPubkey: new PublicKey(wallet.address),
          lamports: 100, // 100 lamports = 0.0000001 SOL
        })
      );
      
      // Send transaction using Privy's embedded wallet
      if (wallet.walletClientType === 'privy') {
        // For Privy embedded wallets, we need to use the user object
        console.log("Using Privy embedded wallet for transaction");
        
        if (wallet.signTransaction) {
          const signedTx = await wallet.signTransaction(transaction);
          const signature = await connection.sendRawTransaction(signedTx.serialize());
          console.log("Transaction sent:", signature);
          
          // Wait for confirmation
          const confirmation = await connection.confirmTransaction(signature);
          console.log("Transaction confirmed:", confirmation);
          
          setTxResult(`✅ Transaction confirmed: ${signature.substring(0, 8)}...`);
        } else {
          setTxResult(`❌ Error: signTransaction not available on this wallet`);
        }
      } else {
        console.error("Only Privy embedded wallets are supported in this demo");
        setTxResult(`❌ Error: Only Privy embedded wallets are supported`);
      }
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setTxResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {wallet ? (
        <>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-300 mb-1">Connected Wallet:</div>
            <div className="text-md font-medium">{formatAddress(wallet.address)}</div>
            <div className="text-xs text-gray-400 mt-1">{wallet.walletClientType} ({wallet.chainType})</div>
          </div>
          
          <button
            onClick={sendTestTransaction}
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                     disabled:from-blue-900 disabled:to-blue-900 disabled:cursor-not-allowed
                     rounded-lg text-sm font-medium transition-all"
          >
            {isLoading ? "Sending..." : "Send Test Transaction"}
          </button>
          
          {txResult && (
            <div className={`p-3 rounded-lg text-sm ${txResult.startsWith('✅') ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
              {txResult}
            </div>
          )}
        </>
      ) : (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-300 mb-2">No Solana wallet connected</p>
          <p className="text-xs text-gray-500">Connect a wallet in the header to test Solana transactions</p>
        </div>
      )}
    </div>
  );
} 