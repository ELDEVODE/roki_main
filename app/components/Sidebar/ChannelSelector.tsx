"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ChannelSelectorProps {
  activeChannelId: string;
  userChannels: any[];
  createdChannels: any[];
  onChannelSelect: (channelId: string) => void;
}

export default function ChannelSelector({
  activeChannelId,
  userChannels,
  createdChannels,
  onChannelSelect
}: ChannelSelectorProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get current active channel
  const allChannels = [...createdChannels, ...userChannels];
  const activeChannel = allChannels.find(channel => channel.id === activeChannelId) || null;
  
  // Get the first letter of the channel name for the icon
  const getChannelInitial = (channel: any) => {
    return channel?.name?.[0]?.toUpperCase() || '#';
  };
  
  // Toggle expansion
  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
    console.log("Toggling expansion, new state:", !isExpanded); // Debug logging
  };
  
  // Handle channel selection
  const handleChannelSelect = (channelId: string) => {
    onChannelSelect(channelId);
    setIsExpanded(false);
  };
  
  // Handle explore click
  const handleExploreClick = () => {
    router.push("/demo/explore");
    setIsExpanded(false);
  };
  
  return (
    <>
      {/* Overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Channel selector button */}
      <div className="fixed left-[55px] md:left-[240px] top-24 z-50">
        <div className="relative">
          <button
            onClick={handleToggleExpansion}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg border-2 border-black shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all hover:scale-105 active:scale-95"
          >
            {activeChannel ? getChannelInitial(activeChannel) : '#'}
          </button>
          
          {/* Pulsing effect for notification */}
          <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Expanded view */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed left-20 md:left-60 top-24 bg-gray-900/90 backdrop-blur-lg z-50 rounded-2xl border border-purple-900/30 shadow-xl shadow-purple-900/20 w-[280px] overflow-hidden"
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              x: -20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              x: -20
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
          >
            <div className="p-4 border-b border-purple-900/30">
              <h3 className="font-semibold text-white">Your Channels</h3>
            </div>
            
            <div className="max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
              {/* Created channels section */}
              {createdChannels.length > 0 && (
                <div className="p-3">
                  <div className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-2 px-2">
                    Created by you
                  </div>
                  {createdChannels.map(channel => (
                    <div
                      key={channel.id}
                      onClick={() => handleChannelSelect(channel.id)}
                      className={`flex items-center px-3 py-2 rounded-lg mb-1 cursor-pointer ${
                        activeChannelId === channel.id 
                          ? 'bg-purple-900/40 text-white' 
                          : 'hover:bg-purple-900/20 text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                        {getChannelInitial(channel)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">
                          {channel.name}
                        </div>
                      </div>
                      {channel.isTokenGated && (
                        <span className="ml-2 flex items-center justify-center text-purple-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Joined channels section */}
              {userChannels.length > 0 && (
                <div className="p-3">
                  <div className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-2 px-2">
                    Joined channels
                  </div>
                  {userChannels.map(channel => (
                    <div
                      key={channel.id}
                      onClick={() => handleChannelSelect(channel.id)}
                      className={`flex items-center px-3 py-2 rounded-lg mb-1 cursor-pointer ${
                        activeChannelId === channel.id 
                          ? 'bg-purple-900/40 text-white' 
                          : 'hover:bg-purple-900/20 text-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
                        {getChannelInitial(channel)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">
                          {channel.name}
                        </div>
                      </div>
                      {channel.isTokenGated && (
                        <span className="ml-2 flex items-center justify-center text-purple-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Explore option */}
              <div className="p-3 border-t border-purple-900/30">
                <div
                  onClick={handleExploreClick}
                  className="flex items-center px-3 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-purple-900/20 to-indigo-900/20 hover:from-purple-900/30 hover:to-indigo-900/30 text-gray-300 border border-purple-900/30"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">
                      Explore Channels
                    </div>
                    <div className="text-xs text-gray-400">
                      Discover new channels
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS for neon effects */}
      <style jsx global>{`
        .neon-purple-glow {
          filter: drop-shadow(0 0 3px rgba(168, 85, 247, 0.4));
        }
      `}</style>
    </>
  );
} 