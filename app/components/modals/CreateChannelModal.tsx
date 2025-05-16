"use client";
import { useState } from "react";
import Modal from "./Modal";

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
  const [channelName, setChannelName] = useState("");
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [nameError, setNameError] = useState("");
  
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
    if (isTokenGated && !tokenAddress.trim()) {
      // For demo, we'll use a default token address
      const defaultTokenAddress = "cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn";
      await onCreateChannel(channelName, isTokenGated, defaultTokenAddress);
    } else {
      await onCreateChannel(channelName, isTokenGated, tokenAddress);
    }
    
    // Reset form
    setChannelName("");
    setIsTokenGated(false);
    setTokenAddress("");
    setNameError("");
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
              onChange={(e) => setIsTokenGated(e.target.checked)}
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
          <div className="mb-4 p-3 bg-purple-900/20 rounded-md border border-purple-900/30">
            <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-300 mb-1">
              Token Address (Optional)
            </label>
            <input
              type="text"
              id="tokenAddress"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="e.g. 0x123...abc"
              className="w-full bg-black/40 border border-purple-900/30 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave blank to use a demo token address
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md text-white font-medium shadow-lg shadow-purple-900/30 transition disabled:opacity-70 disabled:cursor-not-allowed neon-purple-glow"
            disabled={isLoading}
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
              "Create Channel"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
} 