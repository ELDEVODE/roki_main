"use client";
import { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "../../context/ToastContext";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  channelId,
  channelName,
}: InviteModalProps) {
  // ========== State Management ==========
  const [inviteLink, setInviteLink] = useState("");
  const [expiryOption, setExpiryOption] = useState("never");
  const [customExpiry, setCustomExpiry] = useState(7); // days
  const [maxUses, setMaxUses] = useState("unlimited");
  const [customUses, setCustomUses] = useState(10);
  const [copyStatus, setCopyStatus] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [channel, setChannel] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = usePrivy();
  const { showToast } = useToast();

  // ========== User ID Extraction ==========
  useEffect(() => {
    if (!user) return;
    
    try {
      // Extract user ID using multiple potential paths
      let id = null;
      
      if (user.id) {
        id = user.id;
      } else if ((user as any).id) {
        id = (user as any).id;
      } else if (user.wallet?.address) {
        id = user.wallet.address;
      } else if ((user as any).wallet?.address) {
        id = (user as any).wallet.address;
      }
      
      if (id) {
        const idString = String(id).toLowerCase(); // Normalize to lowercase string
        setUserId(idString);
        console.log("InviteModal - User ID extracted:", { 
          original: id, 
          normalized: idString,
          type: typeof id 
        });
      } else {
        console.error("InviteModal - Failed to extract user ID from:", user);
        setErrorMessage("Unable to identify your user account. Please try again later.");
      }
    } catch (err) {
      console.error("InviteModal - Error extracting user ID:", err);
      setErrorMessage("Error identifying user. Please refresh and try again.");
    }
  }, [user]);

  // ========== Data Fetching ==========
  const fetchChannelData = useCallback(async () => {
    if (!channelId || !userId) return;
    
    try {
      setIsLoading(true);
      console.log(`InviteModal - Fetching channel data: channelId=${channelId}, userId=${userId}`);
      
      const res = await fetch(`/api/demo/channels?id=${channelId}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("InviteModal - Failed to fetch channel:", errorText);
        setErrorMessage("Failed to load channel data. Please try again.");
        return;
      }
      
      const data = await res.json();
      console.log("InviteModal - Channel data received:", data);
      setChannel(data);
      
      // Generate invite link immediately - backend no longer requires membership check
      await generateInviteLink();
      
    } catch (err) {
      console.error("InviteModal - Error fetching channel data:", err);
      setErrorMessage("Error loading channel data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [channelId, userId]);

  useEffect(() => {
    if (isOpen && channelId && userId) {
      fetchChannelData();
    } else {
      // Reset state when modal closes
      if (!isOpen) {
        setInviteLink("");
        setErrorMessage("");
      }
    }
  }, [isOpen, channelId, userId, fetchChannelData]);

  // ========== Invite Generation ==========
  const generateInviteLink = async () => {
    if (!channelId) {
      showToast("Channel ID is missing", "error");
      return;
    }
    
    if (!userId) {
      showToast("Unable to identify user. Please try again.", "error");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Create invite options
      const inviteOptions = {
        userId: userId,
        expiryOption,
        maxUses: maxUses === 'unlimited' 
          ? null 
          : maxUses === 'once' 
            ? 1
            : { count: customUses, days: customExpiry }
      };
      
      console.log("InviteModal - Generating invite with options:", inviteOptions);
      
      const res = await fetch(`/api/demo/channels/${channelId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteOptions)
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("InviteModal - Invite created successfully:", data);
        
        const baseUrl = window.location.origin;
        setInviteLink(`${baseUrl}/invite/${data.inviteCode}`);
        showToast("Invite link created successfully", "success");
      } else {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: `HTTP Error: ${res.status}` };
        }
        
        console.error("InviteModal - Failed to create invite:", errorData);
        
        if (errorData.debug) {
          console.log("InviteModal - Debug info:", errorData.debug);
        }
        
        setErrorMessage(errorData.error || "Failed to create invite");
        showToast(errorData.error || "Failed to create invite", "error");
      }
    } catch (err: any) {
      console.error("InviteModal - Error generating invite:", err);
      setErrorMessage(err.message || "Error generating invite link");
      showToast("Error generating invite link", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  // ========== Copy Link Handling ==========
  const handleCopyLink = async () => {
    if (!inviteLink) {
      showToast("No invite link to copy", "error");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyStatus("Copied!");
      setIsCopied(true);
      showToast("Invite link copied to clipboard!", "success");
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setCopyStatus("");
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("InviteModal - Copy failed:", err);
      setCopyStatus("Failed to copy");
      showToast("Failed to copy invite link", "error");
    }
  };
  
  // ========== Render Component ==========
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite to Channel"
      size="md"
    >
      <div className="mb-5 p-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg border border-purple-500/20">
        <div className="flex items-start">
          <div className="text-xl mr-3 mt-0.5">🔗</div>
          <div>
            <h3 className="text-white font-medium">Share this channel</h3>
            <p className="text-gray-300 text-sm mt-1">
              Send an invite link to people you want to join 
              <span className="text-purple-400 font-medium mx-1">#{channelName}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Error Message Display */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
          <p className="text-red-400 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        </div>
      )}
      
      {/* Invite Link Section */}
      <div className="mb-5">
        <label htmlFor="inviteLink" className="block text-sm font-medium text-gray-300 mb-2">
          Invite Link
        </label>
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              id="inviteLink"
              readOnly
              value={inviteLink}
              className="w-full bg-black/40 border border-purple-900/30 rounded-l-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            {copyStatus && (
              <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${isCopied ? 'text-green-400' : 'text-red-400'}`}>
                {copyStatus}
              </span>
            )}
          </div>
          <button
            onClick={handleCopyLink}
            disabled={isLoading || !inviteLink}
            className={`px-4 py-3 ${
              isCopied 
                ? 'bg-green-600' 
                : isLoading 
                  ? 'bg-gray-700' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600'
            } text-white rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isCopied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Link Settings */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expiration
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setExpiryOption('never')}
              className={`p-2 rounded text-sm text-center transition ${
                expiryOption === 'never' 
                  ? 'bg-purple-900/50 border border-purple-500/40 text-white' 
                  : 'bg-gray-900/40 border border-gray-700/50 text-gray-400 hover:border-gray-600/80'
              }`}
            >
              Never expire
            </button>
            <button
              onClick={() => setExpiryOption('24h')}
              className={`p-2 rounded text-sm text-center transition ${
                expiryOption === '24h' 
                  ? 'bg-purple-900/50 border border-purple-500/40 text-white' 
                  : 'bg-gray-900/40 border border-gray-700/50 text-gray-400 hover:border-gray-600/80'
              }`}
            >
              24 hours
            </button>
            <button
              onClick={() => setExpiryOption('custom')}
              className={`p-2 rounded text-sm text-center transition ${
                expiryOption === 'custom' 
                  ? 'bg-purple-900/50 border border-purple-500/40 text-white' 
                  : 'bg-gray-900/40 border border-gray-700/50 text-gray-400 hover:border-gray-600/80'
              }`}
            >
              Custom
            </button>
          </div>
          
          {expiryOption === 'custom' && (
            <div className="mt-2 flex items-center">
              <input
                type="number"
                min="1"
                max="30"
                value={customExpiry}
                onChange={(e) => setCustomExpiry(parseInt(e.target.value) || 7)}
                className="w-16 bg-black/40 border border-purple-900/30 rounded-md py-1.5 px-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <span className="ml-2 text-gray-400 text-sm">days</span>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Max Number of Uses
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMaxUses('unlimited')}
              className={`p-2 rounded text-sm text-center transition ${
                maxUses === 'unlimited' 
                  ? 'bg-purple-900/50 border border-purple-500/40 text-white' 
                  : 'bg-gray-900/40 border border-gray-700/50 text-gray-400 hover:border-gray-600/80'
              }`}
            >
              Unlimited
            </button>
            <button
              onClick={() => setMaxUses('once')}
              className={`p-2 rounded text-sm text-center transition ${
                maxUses === 'once' 
                  ? 'bg-purple-900/50 border border-purple-500/40 text-white' 
                  : 'bg-gray-900/40 border border-gray-700/50 text-gray-400 hover:border-gray-600/80'
              }`}
            >
              One-time use
            </button>
            <button
              onClick={() => setMaxUses('custom')}
              className={`p-2 rounded text-sm text-center transition ${
                maxUses === 'custom' 
                  ? 'bg-purple-900/50 border border-purple-500/40 text-white' 
                  : 'bg-gray-900/40 border border-gray-700/50 text-gray-400 hover:border-gray-600/80'
              }`}
            >
              Custom
            </button>
          </div>
          
          {maxUses === 'custom' && (
            <div className="mt-2 flex items-center">
              <input
                type="number"
                min="1"
                max="100"
                value={customUses}
                onChange={(e) => setCustomUses(parseInt(e.target.value) || 10)}
                className="w-16 bg-black/40 border border-purple-900/30 rounded-md py-1.5 px-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <span className="ml-2 text-gray-400 text-sm">uses</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer buttons */}
      <div className="flex justify-between mt-6 pt-5 border-t border-purple-900/30">
        <button
          onClick={generateInviteLink}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-sm font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          )}
          New Link
        </button>
        <div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white rounded-md text-sm font-medium transition-colors mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCopyLink}
            disabled={isLoading || !inviteLink}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-md text-sm font-medium shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy Link
          </button>
        </div>
      </div>
    </Modal>
  );
} 