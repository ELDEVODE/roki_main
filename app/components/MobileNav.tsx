"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface MobileNavProps {
  userChannels: any[];
  createdChannels: any[];
  activeChannelId: string;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel: () => void;
}

export default function MobileNav({ 
  userChannels, 
  createdChannels, 
  activeChannelId,
  onChannelSelect,
  onCreateChannel
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);
  const [channelIconsOpen, setChannelIconsOpen] = useState(false);
  
  // Get current active channel
  const allChannels = [...createdChannels, ...userChannels];
  const activeChannel = allChannels.find(channel => channel.id === activeChannelId) || null;
  
  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (channelMenuOpen) {
      setChannelMenuOpen(false);
    }
    if (channelIconsOpen) {
      setChannelIconsOpen(false);
    }
  };

  // Toggle channel dropdown
  const toggleChannelMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setChannelMenuOpen(!channelMenuOpen);
    if (channelIconsOpen) {
      setChannelIconsOpen(false);
    }
  };

  // Toggle channel icons
  const toggleChannelIcons = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setChannelIconsOpen(!channelIconsOpen);
    if (channelMenuOpen) {
      setChannelMenuOpen(false);
    }
  };
  
  // Get the first letter of the channel name for the icon
  const getChannelInitial = (channel: any) => {
    return channel?.name?.[0]?.toUpperCase() || '#';
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-purple-900/30 p-2 md:hidden z-40 w-screen">
        <div className="flex items-center justify-between">
          {/* Channel button that toggles icons panel */}
          <button 
            className="flex items-center rounded-md bg-black/60 px-3 py-2 text-white relative"
            onClick={toggleChannelIcons}
          >
            <motion.div
              animate={{ rotate: channelIconsOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="mr-1.5 text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
            {activeChannel ? (
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium mr-1.5">
                  {getChannelInitial(activeChannel)}
                </div>
                <span className="font-medium truncate max-w-[120px]">
                  {activeChannel.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center text-gray-300 mr-1.5">
                  #
                </div>
                <span className="text-gray-300">Channels</span>
              </div>
            )}
          </button>
          
          {/* Create channel and menu buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={onCreateChannel}
              className="p-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              className={`p-2 rounded-md ${isOpen ? 'bg-purple-800/80 text-white' : 'bg-black/60 text-gray-200'}`}
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Vertical channel icons panel for mobile - slides up from bottom */}
      <AnimatePresence>
        {channelIconsOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setChannelIconsOpen(false)}
            />
            <motion.div
              className="fixed bottom-[60px] inset-x-0 bg-black/90 backdrop-blur-lg border-t border-purple-900/30 z-50 rounded-t-xl overflow-hidden w-screen max-h-[70vh]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex flex-col p-4 overflow-y-auto max-h-[calc(70vh-2rem)]">
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-4"></div>
                
                <h3 className="text-sm font-medium text-white mb-3">Your Channels</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {createdChannels.length > 0 ? (
                    createdChannels.map(channel => (
                      <div 
                        key={`mobile-created-${channel.id}`}
                        onClick={() => {
                          onChannelSelect(channel.id);
                          setChannelIconsOpen(false);
                        }}
                        className={`w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all relative ${
                          activeChannelId === channel.id 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/40' 
                            : 'bg-black/60 backdrop-blur-sm hover:bg-purple-900/30'
                        }`}
                      >
                        <span className="text-lg font-medium text-white">
                          {getChannelInitial(channel)}
                        </span>
                        {channel.isTokenGated && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-purple-500 border-2 border-black rounded-full"></span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No created channels</div>
                  )}
                </div>
                
                {userChannels.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-white mb-3">Joined Channels</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {userChannels.map(channel => (
                        <div 
                          key={`mobile-joined-${channel.id}`}
                          onClick={() => {
                            onChannelSelect(channel.id);
                            setChannelIconsOpen(false);
                          }}
                          className={`w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all relative ${
                            activeChannelId === channel.id 
                              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-600/40' 
                              : 'bg-black/60 backdrop-blur-sm hover:bg-purple-900/30'
                          }`}
                        >
                          <span className="text-lg font-medium text-white">
                            {getChannelInitial(channel)}
                          </span>
                          {channel.isTokenGated && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-purple-500 border-2 border-black rounded-full"></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-purple-900/30">
                  <Link 
                    href="/demo/explore" 
                    className="p-2 rounded-md bg-purple-900/20 text-purple-300 flex items-center"
                    onClick={() => setChannelIconsOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                    Explore
                  </Link>
                  <button 
                    onClick={onCreateChannel}
                    className="p-2 rounded-md bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-600/50 text-purple-300"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      New Channel
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main menu drawer for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          >
            <motion.div 
              className="absolute right-0 top-16 bottom-0 w-64 bg-black/95 backdrop-blur-md border-l border-purple-900/40 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-purple-900/40 flex items-center justify-between">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                  Roki
                </h3>
                <button onClick={toggleMenu} className="p-2 rounded-full bg-black/60 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <nav className="space-y-4">
                  <Link href="/demo" className="block px-3 py-2 rounded-md bg-purple-900/20 text-white hover:bg-purple-900/40 transition">
                    Home
                  </Link>
                  <Link href="/demo/explore" className="block px-3 py-2 rounded-md hover:bg-gray-800/60 text-gray-300 transition">
                    Explore Channels
                  </Link>
                  <button 
                    onClick={() => {
                      onCreateChannel && onCreateChannel();
                      toggleMenu();
                    }} 
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800/60 text-gray-300 transition"
                  >
                    Create Channel
                  </button>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 