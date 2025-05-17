"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { getWalletTokens } from "@/app/utils/tokenUtils";
import Modal from "./Modal";

interface CreateSubchannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  onCreateSuccess?: (newSubchannel: any) => void;
}

interface TokenData {
  mint: string;
  name?: string;
  symbol?: string;
  amount: string;
  decimals: number;
  createdAt?: number;
}

export default function CreateSubchannelModal({
  isOpen,
  onClose,
  channelId,
  onCreateSuccess
}: CreateSubchannelModalProps) {
  const { user } = usePrivy();
  const router = useRouter();
  const [newSubchannelName, setNewSubchannelName] = useState("");
  const [newSubchannelType, setNewSubchannelType] = useState("TEXT");
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Log isTokenGated changes for debugging
  useEffect(() => {
    console.log("Token gating enabled:", isTokenGated);
  }, [isTokenGated]);

  // Always fetch user tokens when modal is opened
  useEffect(() => {
    if (isOpen && user?.wallet?.address) {
      fetchUserTokens();
    }
  }, [isOpen, user?.wallet?.address]);

  const fetchUserTokens = async () => {
    if (!user?.wallet?.address) return;
    
    console.log("Fetching tokens for wallet:", user.wallet.address);
    setLoadingTokens(true);
    try {
      const tokens = await getWalletTokens(user.wallet.address);
      console.log("Tokens fetched:", tokens);
      setUserTokens(tokens);
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      setError("Failed to load your tokens");
    } finally {
      setLoadingTokens(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setNewSubchannelName("");
    setNewSubchannelType("TEXT");
    setIsTokenGated(false);
    setTokenAddress("");
    setError("");
    onClose();
  };

  const handleTokenGatingToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    console.log("Token gating checkbox toggled:", isChecked);
    setIsTokenGated(isChecked);
    
    // Reset token selection when disabling
    if (!isChecked) {
      setTokenAddress("");
    }
  };

  const selectToken = (mint: string) => {
    console.log("Token selected:", mint);
    setTokenAddress(mint);
  };

  const createSubchannel = async () => {
    if (!newSubchannelName.trim()) {
      setError("Subchannel name is required");
      return;
    }
    
    // Validate that if token gating is enabled, a token must be selected
    if (isTokenGated && !tokenAddress) {
      setError("Please select a token for token gating");
      return;
    }
    
    setCreating(true);
    setError("");
    
    try {
      console.log("Creating subchannel with data:", {
        name: newSubchannelName,
        type: newSubchannelType,
        isTokenGated,
        tokenAddress: isTokenGated ? tokenAddress : null
      });
      
      const res = await fetch(`/api/demo/channels/${channelId}/subchannels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubchannelName,
          type: newSubchannelType,
          isTokenGated,
          tokenAddress: isTokenGated ? tokenAddress : null
        }),
      });
      
      if (res.ok) {
        const newSubchannel = await res.json();
        if (onCreateSuccess) {
          onCreateSuccess(newSubchannel);
        }
        handleClose();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create subchannel");
      }
    } catch (err) {
      console.error("Failed to create subchannel", err);
      setError("An error occurred while creating the subchannel");
    } finally {
      setCreating(false);
    }
  };

  const redirectToTokenPage = () => {
    // Close modal and redirect to token page
    handleClose();
    router.push('/token');
  };

  // Check if the create button should be disabled
  const isCreateDisabled = !newSubchannelName.trim() || 
                          creating || 
                          (isTokenGated && !tokenAddress);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Subchannel">
      <div className="p-1">
        <p className="text-gray-400 text-sm mb-6">
          Create a new subchannel for your members to communicate in
        </p>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800/50 rounded-md p-3 mb-4 text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            <span className="flex items-center">
              <span className="mr-2">#</span> Channel Name
            </span>
          </label>
          <input
            type="text"
            value={newSubchannelName}
            onChange={(e) => setNewSubchannelName(e.target.value)}
            className="w-full bg-black/40 border border-purple-900/30 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. announcements"
            autoFocus
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Channel Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div
              onClick={() => setNewSubchannelType("TEXT")}
              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col items-center ${
                newSubchannelType === "TEXT"
                  ? "bg-purple-900/30 border-purple-500/50 neon-purple-glow"
                  : "bg-gray-900/40 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-xl mb-1">💬</div>
              <div className="text-xs font-medium">Text</div>
            </div>
            
            <div
              onClick={() => setNewSubchannelType("VOICE")}
              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col items-center ${
                newSubchannelType === "VOICE"
                  ? "bg-purple-900/30 border-purple-500/50 neon-purple-glow"
                  : "bg-gray-900/40 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-xl mb-1">🎤</div>
              <div className="text-xs font-medium">Voice</div>
            </div>
            
            <div
              onClick={() => setNewSubchannelType("VIDEO")}
              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col items-center ${
                newSubchannelType === "VIDEO"
                  ? "bg-purple-900/30 border-purple-500/50 neon-purple-glow"
                  : "bg-gray-900/40 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-xl mb-1">📹</div>
              <div className="text-xs font-medium">Video</div>
            </div>
          </div>
        </div>
        
        {/* Token Gating Section - Reimplemented with better visibility */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tokenGated"
                  checked={isTokenGated}
                  onChange={handleTokenGatingToggle}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                />
                <label htmlFor="tokenGated" className="ml-2 text-white font-medium">
                  Enable Token Gating
                </label>
              </div>
              
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={redirectToTokenPage}
                  className="py-1.5 px-3 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 text-sm transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Manage Tokens
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mt-2 mb-1">
              Token gating restricts access to only users who own the specified token.
            </p>
            
            {isTokenGated && (
              <div className="mt-4 border-t border-purple-500/20 pt-4">
                <h3 className="font-medium text-white mb-2">
                  {tokenAddress ? "Token Selected" : "Select a Token for Access"}
                </h3>
                
                {loadingTokens ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mr-2"></div>
                    <span className="text-purple-300">Loading your tokens...</span>
                  </div>
                ) : userTokens.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-3 mt-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {userTokens.map((token) => (
                        <div 
                          key={token.mint}
                          onClick={() => selectToken(token.mint)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            tokenAddress === token.mint
                              ? "bg-gradient-to-r from-purple-800/50 to-indigo-800/50 border-purple-400 shadow-lg shadow-purple-500/10 transform scale-[1.02]"
                              : "bg-gray-900/70 border-gray-700 hover:border-gray-500 hover:bg-gray-800/70"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center mr-3">
                              <span className="text-white font-bold">
                                {token.symbol?.[0] || token.name?.[0] || "T"}
                              </span>
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-white font-medium">
                                {token.name || "Unnamed Token"}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {token.symbol || "???"} • Balance: {parseInt(token.amount).toLocaleString()}
                              </p>
                            </div>
                            {tokenAddress === token.mint && (
                              <div className="bg-purple-600 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {!tokenAddress && (
                      <div className="mt-3 text-yellow-400 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        You must select a token to enable token gating
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 px-4 border border-dashed border-purple-600/30 rounded-lg bg-purple-900/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-purple-400 mb-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white mb-2">No tokens found</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      You need to create tokens first before you can use them for token gating.
                    </p>
                    <button
                      type="button"
                      onClick={redirectToTokenPage}
                      className="py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 text-sm"
                    >
                      Create Tokens
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createSubchannel}
            disabled={isCreateDisabled}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              isCreateDisabled
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20"
            }`}
          >
            {creating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Subchannel
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
} 