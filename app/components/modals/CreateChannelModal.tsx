"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { motion, AnimatePresence } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import { getWalletTokens } from "@/app/utils/tokenUtils";
import { useRouter } from "next/navigation";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channelData: ChannelFormData) => Promise<void>;
  isLoading?: boolean;
}

interface ChannelFormData {
  name: string;
  icon?: string;
  type?: string;
  isTokenGated?: boolean;
  tokenAddress?: string;
}

// Add a type for the token data
interface TokenData {
  mint: string;
  name?: string;
  symbol?: string;
  amount: string;
  decimals: number;
  createdAt?: number;
}

// Predefined channel icons
const channelIcons = [
  "🌐", "💬", "🔊", "🎮", "🎵", "📚", "🎨", "💼", "🏆", "🔧", "🚀", "💡"
];

export default function CreateChannelModal({
  isOpen,
  onClose,
  onCreateChannel,
  isLoading = false
}: CreateChannelModalProps) {
  const { user } = usePrivy();
  const router = useRouter();
  const [channelName, setChannelName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💬");
  const [channelType, setChannelType] = useState("TEXT");
  const [nameError, setNameError] = useState("");
  const [step, setStep] = useState(1); // Multi-step form
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokenSelectionError, setTokenSelectionError] = useState(""); // New state for token selection errors
  
  // Fetch user tokens from their wallet
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!user?.wallet?.address) return;
      
      setLoadingTokens(true);
      try {
        const tokens = await getWalletTokens(user.wallet.address);
        setUserTokens(tokens);
      } catch (error) {
        console.error("Error fetching user tokens:", error);
      } finally {
        setLoadingTokens(false);
      }
    };
    
    if (isOpen) {
      fetchUserTokens();
    }
  }, [isOpen, user?.wallet?.address]);

  const resetForm = () => {
    setChannelName("");
    setSelectedIcon("💬");
    setChannelType("TEXT");
    setNameError("");
    setIsTokenGated(false);
    setTokenAddress("");
    setTokenSelectionError(""); // Clear token selection error
    setStep(1);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleNextStep = () => {
    // Validation for step 1
    if (step === 1) {
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
      
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Clear token selection error when token is selected
  useEffect(() => {
    if (tokenAddress) {
      setTokenSelectionError("");
    }
  }, [tokenAddress]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that a token is selected if token gating is enabled
    if (isTokenGated && !tokenAddress) {
      setTokenSelectionError("Please select a token for gating this channel");
      return;
    }
    
    // Create the channel with its data
    await onCreateChannel({
      name: channelName,
      icon: selectedIcon,
      type: channelType,
      isTokenGated,
      tokenAddress: isTokenGated ? tokenAddress : undefined
    });
    
    // Reset form
    resetForm();
  };
  
  const redirectToTokenPage = () => {
    // Close modal and redirect to token page
    handleClose();
    router.push('/token');
  };
  
  // Check if we should disable the submit button
  const isSubmitDisabled = isLoading || (isTokenGated && !tokenAddress);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Channel"
      size="lg"
    >
      <div className="mb-4 p-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg border border-purple-500/20">
        <div className="flex items-start">
          <div className="text-2xl mr-3 mt-0.5">✨</div>
          <div>
            <h3 className="text-white font-medium">New Channel Experience</h3>
            <p className="text-gray-300 text-sm mt-1">
              Create a channel to organize conversations. A <span className="text-purple-400 font-medium">#general</span> subchannel will be automatically created.
              You can add more subchannels later.
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative mt-6">
        {/* Steps indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white neon-purple-glow' : 'bg-purple-900/30 text-gray-400'}`}>
              1
            </div>
            <div className={`w-12 h-1 ${step > 1 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-800'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white neon-purple-glow' : 'bg-purple-900/30 text-gray-400'}`}>
              2
            </div>
            <div className={`w-12 h-1 ${step > 2 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-800'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white neon-purple-glow' : 'bg-purple-900/30 text-gray-400'}`}>
              3
            </div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-5">
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
                  placeholder="e.g. cryptopunks-club"
                  className="w-full bg-black/40 border border-purple-900/30 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  autoFocus
                />
                {nameError && (
                  <p className="mt-1 text-sm text-red-400">{nameError}</p>
                )}
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Channel Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {channelIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`h-11 w-11 flex items-center justify-center text-xl rounded-md transition ${
                        selectedIcon === icon
                          ? "bg-gradient-to-br from-purple-700 to-indigo-700 border-2 border-purple-400 neon-purple-glow"
                          : "bg-gray-900 border border-gray-800 hover:bg-gray-800"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Channel Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <div
                    onClick={() => setChannelType("TEXT")}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      channelType === "TEXT"
                        ? "bg-purple-900/30 border-purple-500/50 neon-purple-glow"
                        : "bg-gray-900/40 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-white font-medium">Text Channel</h3>
                        <p className="text-gray-400 text-sm">Send messages, share files, and have conversations</p>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setChannelType("COMMUNITY")}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      channelType === "COMMUNITY"
                        ? "bg-purple-900/30 border-purple-500/50 neon-purple-glow"
                        : "bg-gray-900/40 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-white font-medium">Community Channel</h3>
                        <p className="text-gray-400 text-sm">Organize members with roles and permissions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20 mb-5">
                <div className="flex items-start">
                  <div className="text-indigo-400 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white text-sm font-medium">Default Subchannel</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      A <span className="text-indigo-400 font-medium">#general</span> subchannel will be automatically created. You'll be able to add more subchannels and control token-gating at the subchannel level.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Token Gating Options
                </label>
                <div className="bg-black/40 border border-purple-900/30 rounded-md p-4 mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tokenGated"
                      checked={isTokenGated}
                      onChange={(e) => {
                        setIsTokenGated(e.target.checked);
                        // Reset token selection when disabling
                        if (!e.target.checked) {
                          setTokenAddress("");
                          setTokenSelectionError("");
                        }
                      }}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                    />
                    <label htmlFor="tokenGated" className="ml-2 text-white font-medium">
                      Enable Token Gating
                    </label>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Token gating restricts access to only users who own the specified token.
                  </p>
                </div>
                
                {isTokenGated && (
                  <div className="animate-fadeIn">
                    {loadingTokens ? (
                      <div className="text-center py-8 px-4 border border-dashed border-gray-700 rounded-lg">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                          <span className="text-purple-300">Loading your tokens...</span>
                        </div>
                      </div>
                    ) : userTokens.length > 0 ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Select Token for Channel Access
                        </label>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {userTokens.map((token) => (
                            <div 
                              key={token.mint}
                              onClick={() => setTokenAddress(token.mint)}
                              className={`p-3 rounded-lg border cursor-pointer transition flex items-center ${
                                tokenAddress === token.mint
                                  ? "bg-purple-900/30 border-purple-500/50 neon-purple-glow"
                                  : "bg-gray-900/40 border-gray-700 hover:border-gray-600"
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center mr-3">
                                <span className="text-white font-bold">
                                  {token.symbol?.[0] || token.name?.[0] || "T"}
                                </span>
                              </div>
                              <div className="flex-grow">
                                <h3 className="text-white font-medium">
                                  {token.name || "Unnamed Token"}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {token.symbol || "???"} • Balance: {parseInt(token.amount).toLocaleString()}
                                </p>
                              </div>
                              {tokenAddress === token.mint && (
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Show token selection error message if any */}
                        {tokenSelectionError && (
                          <div className="mt-2 text-red-400 text-sm font-medium">
                            {tokenSelectionError}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm">
                            {tokenAddress ? (
                              <p className="text-green-400">Selected token will be required to access this channel</p>
                            ) : (
                              <p className={`${isTokenGated ? "text-yellow-400 font-medium" : "text-gray-400"}`}>
                                {isTokenGated ? "⚠️ Select a token to continue" : "Select a token to continue"}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={redirectToTokenPage}
                            className="py-1.5 px-3 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 text-sm transition flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Create New Token
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4 border border-dashed border-gray-700 rounded-lg">
                        <div className="mx-auto h-16 w-16 rounded-full bg-gray-800/60 flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No tokens found</h3>
                        <p className="text-gray-400 text-sm mb-4">
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
              
              <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20 mb-5">
                <div className="flex items-start">
                  <div className="text-indigo-400 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white text-sm font-medium">About Token Gating</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      When a channel is token gated, only users who own the specified token will be able to join and view its content. They'll be directed to the marketplace to acquire tokens if they don't have them.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between mt-6">
          {step === 1 ? (
            <div></div> // Empty div for spacing
          ) : (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition flex items-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          
          {step === 1 || step === 2 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md text-white font-medium shadow-lg shadow-purple-900/30 transition flex items-center neon-purple-glow"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md text-white font-medium shadow-lg shadow-purple-900/30 transition flex items-center ${
                isSubmitDisabled 
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-purple-500 hover:to-indigo-500 neon-purple-glow"
              }`}
              disabled={isSubmitDisabled}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Channel
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
} 