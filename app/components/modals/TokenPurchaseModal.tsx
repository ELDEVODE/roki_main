"use client";

import { useState, useEffect } from "react";
import { getWalletTokens, getSolBalance } from "@/app/utils/zkTokenService";

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
  tokenSymbol?: string;
  tokenName?: string;
  onPurchaseComplete: (success: boolean, errorMessage?: string) => void;
  walletAddress: string;
}

export default function TokenPurchaseModal({
  isOpen,
  onClose,
  tokenAddress,
  tokenSymbol = "TOKEN",
  tokenName = "Channel Token",
  onPurchaseComplete,
  walletAddress
}: TokenPurchaseModalProps) {
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  
  // Mock token price in SOL
  const tokenPrice = 0.01;
  
  // Fetch SOL balance when modal opens
  useEffect(() => {
    if (isOpen && walletAddress) {
      fetchSolBalance();
    }
  }, [isOpen, walletAddress]);
  
  const fetchSolBalance = async () => {
    try {
      const balance = await getSolBalance(walletAddress);
      setSolBalance(balance);
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      setSolBalance(null);
    }
  };
  
  const handlePurchaseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setPurchaseAmount(value);
    }
  };
  
  const handlePurchase = async () => {
    if (!walletAddress) {
      setError("No wallet connected");
      return;
    }
    
    // Check if user has enough SOL
    const totalCost = tokenPrice * purchaseAmount;
    if (solBalance !== null && solBalance < totalCost) {
      setError(`Insufficient SOL balance. You need ${totalCost.toFixed(4)} SOL but have ${solBalance.toFixed(4)} SOL`);
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // In a real app, this would call a blockchain transaction
      // For our demo, we'll simulate the purchase by updating localStorage
      const existingTokens = await getWalletTokens(walletAddress);
      
      // Check if user already has this token
      const tokenIndex = existingTokens.findIndex(t => t.mint === tokenAddress);
      
      if (tokenIndex >= 0) {
        // Update existing token balance
        existingTokens[tokenIndex].amount = (
          parseInt(existingTokens[tokenIndex].amount) + (purchaseAmount * 10**9)
        ).toString();
      } else {
        // Add new token to wallet
        existingTokens.push({
          mint: tokenAddress,
          amount: (purchaseAmount * 10**9).toString(), // Using 9 decimals
          decimals: 9,
          name: tokenName,
          symbol: tokenSymbol
        });
      }
      
      // Simulate SOL balance reduction (in a real app this happens on chain)
      if (solBalance !== null) {
        // Update local SOL balance state
        setSolBalance(solBalance - totalCost);
      }
      
      // Store updated tokens
      localStorage.setItem(`wallet_tokens_${walletAddress}`, JSON.stringify(existingTokens));
      
      // Show success message
      setSuccess(true);
      
      // Wait a second then call onPurchaseComplete
      setTimeout(() => {
        onPurchaseComplete(true);
      }, 1500);
    } catch (error: any) {
      console.error("Error purchasing tokens:", error);
      setError("Failed to purchase tokens");
      setTimeout(() => {
        onPurchaseComplete(false, error.message || "Failed to purchase tokens");
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-gray-900 border border-purple-900 rounded-xl shadow-xl w-full max-w-md z-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Purchase Access Token</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Purchase Successful</h4>
              <p className="text-gray-400 mb-4">
                {purchaseAmount} {tokenSymbol} tokens have been added to your wallet
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 rounded-lg bg-purple-900/20 border border-purple-800">
                <h4 className="font-bold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Token-Gated Channel
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  This channel requires the <span className="text-white font-medium">{tokenName}</span> token to join.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>Token Address:</span>
                  <span className="font-mono">{tokenAddress.slice(0, 12)}...{tokenAddress.slice(-4)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">Purchase Amount</label>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    value={purchaseAmount}
                    onChange={handlePurchaseAmountChange}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="bg-gray-700 border border-gray-600 border-l-0 rounded-r-lg px-4 py-2 flex items-center font-medium">
                    {tokenSymbol}
                  </span>
                </div>
              </div>
              
              <div className="mb-6 bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Price per token:</span>
                  <span>{tokenPrice} SOL</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Quantity:</span>
                  <span>{purchaseAmount}</span>
                </div>
                <hr className="border-gray-700 mb-3" />
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>{(tokenPrice * purchaseAmount).toFixed(4)} SOL</span>
                </div>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-800 disabled:to-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg transition font-medium flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Purchase for ${(tokenPrice * purchaseAmount).toFixed(2)} SOL`
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 