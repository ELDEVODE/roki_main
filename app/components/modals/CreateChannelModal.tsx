"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { usePrivy } from "@privy-io/react-auth";
import { getWalletTokens } from "@/app/utils/zkTokenService";
import { useRouter } from "next/navigation";

interface Token {
  mint: string;
  amount: string;
  decimals: number;
}

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (name: string, isTokenGated: boolean, tokenAddress?: string) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateChannelModal({
  isOpen,
  onClose,
  onCreateChannel,
  isLoading = false
}: CreateChannelModalProps) {
  const { user } = usePrivy();
  const router = useRouter();
  const [channelName, setChannelName] = useState("");
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [nameError, setNameError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  const walletAddress = user?.wallet?.address || "";

  useEffect(() => {
    if (isOpen && walletAddress && isTokenGated) {
      fetchUserTokens();
    }
  }, [isOpen, walletAddress, isTokenGated]);

  const fetchUserTokens = async () => {
    if (!walletAddress) return;
    
    setIsLoadingTokens(true);
    try {
      const tokens = await getWalletTokens(walletAddress);
      setUserTokens(tokens);
      
      // Auto-select the first token if available
      if (tokens.length > 0 && !selectedToken) {
        setSelectedToken(tokens[0].mint);
      }
    } catch (error) {
      console.error("Error fetching user tokens:", error);
    } finally {
      setIsLoadingTokens(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!channelName.trim()) {
      setNameError("Channel name is required");
      return;
    }
    
    if (channelName.length < 3) {
      setNameError("Channel name must be at least 3 characters");
      return;
    }
    
    if (channelName.length > 30) {
      setNameError("Channel name must be less than 30 characters");
      return;
    }
    
    // Token gated validation
    if (isTokenGated) {
      if (userTokens.length === 0) {
        setTokenError("You don't have any tokens to gate with");
        return;
      }
      
      if (!selectedToken) {
        setTokenError("Please select a token for gating");
        return;
      }
      
      await onCreateChannel(channelName, isTokenGated, selectedToken);
    } else {
      await onCreateChannel(channelName, isTokenGated);
    }
    
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setChannelName("");
    setIsTokenGated(false);
    setSelectedToken("");
    setNameError("");
    setTokenError("");
  };
  
  const handleTokenGateToggle = (checked: boolean) => {
    setIsTokenGated(checked);
    
    if (checked && userTokens.length === 0 && walletAddress) {
      fetchUserTokens();
    }
  };
  
  const handleCreateToken = () => {
    onClose(); // Close this modal
    router.push('/token'); // Redirect to token creation page
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Create New Channel"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="channelName" className="block text-sm font-medium text-gray-300 mb-1">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => {
              setChannelName(e.target.value);
              setNameError("");
            }}
            placeholder="e.g. general-chat"
            className="w-full bg-black/40 border border-purple-900/30 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            autoFocus
          />
          {nameError && (
            <p className="mt-1 text-sm text-red-400">{nameError}</p>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isTokenGated"
              checked={isTokenGated}
              onChange={(e) => handleTokenGateToggle(e.target.checked)}
              className="h-4 w-4 rounded bg-black border-purple-900/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-black"
            />
            <label htmlFor="isTokenGated" className="ml-2 block text-sm font-medium text-gray-300">
              Token-Gated Channel
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Restrict access to users who hold specific tokens
          </p>
        </div>
        
        {isTokenGated && (
          <div className="mb-6 p-4 bg-gray-800/40 rounded-md">
            {userTokens.length > 0 ? (
              <div>
                <label htmlFor="tokenSelector" className="block text-sm font-medium text-gray-300 mb-2">
                  Select a token for gating
                </label>
                <select
                  id="tokenSelector"
                  value={selectedToken}
                  onChange={(e) => {
                    setSelectedToken(e.target.value);
                    setTokenError("");
                  }}
                  className="w-full bg-black/40 border border-purple-900/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                >
                  <option value="" disabled>Select a token</option>
                  {userTokens.map((token) => (
                    <option key={token.mint} value={token.mint}>
                      {token.mint.substring(0, 8)}... ({parseInt(token.amount) / Math.pow(10, token.decimals)})
                    </option>
                  ))}
                </select>
                {tokenError && (
                  <p className="mt-1 text-sm text-red-400">{tokenError}</p>
                )}
              </div>
            ) : isLoadingTokens ? (
              <div className="text-center py-3">
                <p className="text-sm text-gray-400">Loading your tokens...</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-3">You don't have any tokens to gate with</p>
                <button
                  type="button"
                  onClick={handleCreateToken}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm transition"
                >
                  Create a Token
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || (isTokenGated && userTokens.length === 0)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed rounded-md text-sm transition"
          >
            {isLoading ? "Creating..." : "Create Channel"}
          </button>
        </div>
      </form>
    </Modal>
  );
} 