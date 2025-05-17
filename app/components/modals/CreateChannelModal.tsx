"use client";
import { useState } from "react";
import Modal from "./Modal";
import { motion, AnimatePresence } from "framer-motion";

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
  const [channelName, setChannelName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💬");
  const [channelType, setChannelType] = useState("TEXT");
  const [nameError, setNameError] = useState("");
  const [step, setStep] = useState(1); // Multi-step form
  
  const resetForm = () => {
    setChannelName("");
    setSelectedIcon("💬");
    setChannelType("TEXT");
    setNameError("");
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
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the channel with its data
    await onCreateChannel({
      name: channelName,
      icon: selectedIcon,
      type: channelType
    });
    
    // Reset form
    resetForm();
  };
  
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
            <div className={`w-16 h-1 ${step > 1 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-800'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white neon-purple-glow' : 'bg-purple-900/30 text-gray-400'}`}>
              2
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
        </AnimatePresence>
        
        <div className="flex justify-between mt-6">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition flex items-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          {step === 1 ? (
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
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md text-white font-medium shadow-lg shadow-purple-900/30 transition disabled:opacity-70 disabled:cursor-not-allowed neon-purple-glow"
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