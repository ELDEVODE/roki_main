"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { motion, AnimatePresence } from "framer-motion";

type SectionType = 'created' | 'joined' | null;

export default function ChatSidebar({ 
  userChannels, 
  createdChannels, 
  activeChannelId,
  onChannelSelect,
  onCreateChannel
}: { 
  userChannels: any[], 
  createdChannels: any[],
  activeChannelId: string,
  onChannelSelect: (channelId: string) => void,
  onCreateChannel?: () => void
}) {
  const router = useRouter();
  const { user } = usePrivy();
  const [expandedSection, setExpandedSection] = useState<SectionType>('created');
  const [hoverChannel, setHoverChannel] = useState<string | null>(null);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  
  // Detect if we're on the explore page
  useEffect(() => {
    // Check if we're on the explore page
    setIsExploring(window.location.pathname.includes('/demo/explore'));
    
    // Add an event listener to update when navigation occurs
    const handleRouteChange = () => {
      setIsExploring(window.location.pathname.includes('/demo/explore'));
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // Get current active channel
  const allChannels = [...createdChannels, ...userChannels];
  const activeChannel = allChannels.find(channel => channel.id === activeChannelId) || null;
  
  const toggleSection = (section: SectionType) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Get the first letter of the channel name for the icon
  const getChannelInitial = (channel: any) => {
    return channel?.name?.[0]?.toUpperCase() || '#';
  };

  // Toggle channel menu
  const toggleChannelMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggling channel menu");
    setChannelMenuOpen(!channelMenuOpen);
  };

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  
  // Handle explore navigation with client-side routing
  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/demo/explore');
  };
  
  // Animation variants
  const listVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15
      }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  // Fixed width for channel sidebar to ensure consistent behavior regardless of main sidebar width
  const CHANNEL_SIDEBAR_WIDTH = 72; // pixels
  // This value must be coordinated with MIN_SIDEBAR_WIDTH in AppLayout.tsx
  // MIN_SIDEBAR_WIDTH in AppLayout.tsx should be large enough to accommodate this expanded sidebar

  const sidebarVariants = {
    expanded: {
      width: `${CHANNEL_SIDEBAR_WIDTH}px`,
      minWidth: `${CHANNEL_SIDEBAR_WIDTH}px`, // Ensures the sidebar maintains minimum width
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    collapsed: {
      width: "0px",
      minWidth: "0px",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <div className="flex h-full w-full">
      {/* Vertical channel sidebar */}
      <motion.div 
        className="bg-transparent flex flex-col items-center pt-4 pb-3 border-r border-purple-900/30 hidden md:flex overflow-hidden h-full"
        animate={sidebarExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        initial="collapsed"
      >
        {/* Channel icons */}
        <div className="space-y-3 w-full px-2 pt-3 overflow-y-auto custom-scrollbar flex-grow">
          {/* Created channels */}
          {createdChannels.map(channel => (
            <motion.div 
              key={`created-${channel.id}`}
              onClick={() => onChannelSelect(channel.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-[48px] h-[48px] mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 relative ${
                activeChannelId === channel.id 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/40 neon-purple-glow z-10' 
                  : 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-900/40 backdrop-blur-sm hover:from-purple-900/40 hover:to-indigo-900/40 hover:shadow-md hover:shadow-purple-600/20'
              }`}
            >
              <span className={`text-lg font-bold tracking-wide ${activeChannelId === channel.id ? 'text-white' : 'text-purple-200/90'}`}>
                {getChannelInitial(channel)}
              </span>
              {channel.isTokenGated && (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-purple-500 border-2 border-black rounded-full"
                />
              )}
              
              {/* Ring indicator for active channel */}
              {activeChannelId === channel.id ? (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 border-2 border-purple-400/70 rounded-full"
                />
              ) : (
                <motion.span 
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 0.6 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/5 to-indigo-500/5"
                />
              )}
            </motion.div>
          ))}
          
          {/* Divider if both created and joined channels exist */}
          {createdChannels.length > 0 && userChannels.length > 0 && (
            <div className="border-t border-purple-900/30 w-8 mx-auto my-3"></div>
          )}
          
          {/* Joined channels */}
          {userChannels.map(channel => (
            <motion.div 
              key={`joined-${channel.id}`}
              onClick={() => onChannelSelect(channel.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-[48px] h-[48px] mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 relative ${
                activeChannelId === channel.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-600/40 neon-indigo-glow z-10' 
                  : 'bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-indigo-900/40 backdrop-blur-sm hover:from-indigo-900/40 hover:to-blue-900/40 hover:shadow-md hover:shadow-indigo-600/20'
              }`}
            >
              <span className={`text-lg font-bold tracking-wide ${activeChannelId === channel.id ? 'text-white' : 'text-indigo-200/90'}`}>
                {getChannelInitial(channel)}
              </span>
              {channel.isTokenGated && (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-purple-500 border-2 border-black rounded-full"
                />
              )}
              
              {/* Ring indicator for active channel */}
              {activeChannelId === channel.id ? (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 border-2 border-indigo-400/70 rounded-full"
                />
              ) : (
                <motion.span 
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 0.6 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/5 to-blue-500/5"
                />
              )}
            </motion.div>
          ))}

          {/* Divider before utility buttons if we have any channels */}
          {(createdChannels.length > 0 || userChannels.length > 0) && (
            <div className="border-t border-purple-900/30 w-8 mx-auto my-3"></div>
          )}

          {/* Explore button */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExploreClick}
            className={`w-[48px] h-[48px] mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border relative ${
              isExploring 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/40 neon-purple-glow z-10 border-transparent' 
                : 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm hover:from-purple-700/40 hover:to-indigo-700/40 shadow-md shadow-purple-900/10 hover:shadow-lg hover:shadow-purple-900/20 border-purple-900/40'
            }`}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-purple-300" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </motion.svg>
            
            {/* Ring indicator for active explore */}
            {isExploring && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 border-2 border-purple-400/70 rounded-full"
              />
            )}
          </motion.div>
          
          {/* Add channel button */}
          <motion.button 
            onClick={onCreateChannel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[48px] h-[48px] mx-auto rounded-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/60 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md shadow-purple-900/10 hover:shadow-lg hover:shadow-purple-900/30"
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-purple-300" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </motion.svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Main sidebar content */}
      <div className="flex-1 flex flex-col h-full bg-black border-r border-purple-900/30 w-full hidden md:flex animated-gradient-bg overflow-hidden">
        {/* Server header with channel info - clickable to toggle channel sidebar */}
        <div 
          onClick={toggleSidebar}
          className="flex items-center p-4 border-b border-purple-900/30 h-16 cursor-pointer group relative"
        >
          <div className="flex items-center">
            <motion.div 
              animate={{ rotate: sidebarExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="mr-2 text-gray-400 group-hover:text-purple-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
            {activeChannel ? (
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium mr-2">
                  {getChannelInitial(activeChannel)}
                </div>
                <span className="font-medium text-white truncate">
                  {activeChannel.name}
                </span>
                {activeChannel.isTokenGated && (
                  <span className="ml-2 text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            ) : (
              <span className="font-medium text-gray-400">Select a channel</span>
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute left-0 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 backdrop-blur-sm text-xs text-white px-2 py-1 rounded pointer-events-none">
            {sidebarExpanded ? 'Hide channel list' : 'Show channel list'}
          </div>
        </div>
        
        {/* Channels section */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-3">
          {/* Created channels */}
          <div className="mb-6">
            <div 
              className="flex items-center px-2 py-1 cursor-pointer text-gray-400 hover:text-purple-400 transition"
              onClick={() => toggleSection('created')}
            >
              <motion.div 
                initial={false}
                animate={{ rotate: expandedSection === 'created' ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3.5 w-3.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <span className="ml-1 text-xs font-semibold tracking-wider uppercase">Your Channels</span>
              <span className="ml-2 text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-full">
                {createdChannels.length}
              </span>
            </div>
            
            <AnimatePresence initial={false}>
              {expandedSection === 'created' && (
                <motion.div
                  key="created-channels"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-1 pl-2 overflow-hidden"
                >
                  {createdChannels.length === 0 ? (
                    <motion.div 
                      variants={itemVariants}
                      className="px-2 py-1 text-gray-400 text-sm italic border-l-2 border-purple-900/30 ml-1"
                    >
                      No channels created
                    </motion.div>
                  ) : (
                    createdChannels.map((channel) => (
                      <motion.div 
                        key={channel.id}
                        variants={itemVariants}
                        onMouseEnter={() => setHoverChannel(channel.id)}
                        onMouseLeave={() => setHoverChannel(null)}
                        onClick={() => onChannelSelect(channel.id)}
                        className={`px-2 py-1.5 rounded flex items-center cursor-pointer transition group ${
                          activeChannelId === channel.id 
                            ? 'bg-purple-900/20 text-white neon-text' 
                            : 'text-gray-400 hover:bg-purple-900/10 hover:text-purple-400'
                        }`}
                      >
                        <span className={`w-5 text-center ${activeChannelId === channel.id ? 'text-purple-400' : 'text-gray-400'} group-hover:text-purple-400 mr-2 transition`}>
                          #
                        </span>
                        <span className="truncate flex-1">{channel.name}</span>
                        
                        {(hoverChannel === channel.id || activeChannelId === channel.id) && (
                          <div className="flex space-x-1">
                            {channel.isTokenGated && (
                              <span className="flex items-center justify-center text-purple-400 neon-purple-glow">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle settings
                              }}
                              className="text-gray-400 hover:text-purple-400 opacity-60 hover:opacity-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Joined channels */}
          <div className="mb-6">
            <div 
              className="flex items-center px-2 py-1 cursor-pointer text-gray-400 hover:text-purple-400 transition"
              onClick={() => toggleSection('joined')}
            >
              <motion.div 
                initial={false}
                animate={{ rotate: expandedSection === 'joined' ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3.5 w-3.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <span className="ml-1 text-xs font-semibold tracking-wider uppercase">Joined Channels</span>
              <span className="ml-2 text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-full">
                {userChannels.length}
              </span>
            </div>
            
            <AnimatePresence initial={false}>
              {expandedSection === 'joined' && (
                <motion.div
                  key="joined-channels"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-1 pl-2 overflow-hidden"
                >
                  {userChannels.length === 0 ? (
                    <motion.div 
                      variants={itemVariants}
                      className="px-2 py-1 text-gray-400 text-sm italic border-l-2 border-purple-900/30 ml-1"
                    >
                      No channels joined
                    </motion.div>
                  ) : (
                    userChannels.map((channel) => (
                      <motion.div 
                        key={channel.id}
                        variants={itemVariants}
                        onMouseEnter={() => setHoverChannel(channel.id)}
                        onMouseLeave={() => setHoverChannel(null)}
                        onClick={() => onChannelSelect(channel.id)}
                        className={`px-2 py-1.5 rounded flex items-center cursor-pointer transition group ${
                          activeChannelId === channel.id 
                            ? 'bg-purple-900/20 text-white neon-text' 
                            : 'text-gray-400 hover:bg-purple-900/10 hover:text-purple-400'
                        }`}
                      >
                        <span className={`w-5 text-center ${activeChannelId === channel.id ? 'text-purple-400' : 'text-gray-400'} group-hover:text-purple-400 mr-2 transition`}>
                          #
                        </span>
                        <span className="truncate flex-1">{channel.name}</span>
                        
                        {(hoverChannel === channel.id || activeChannelId === channel.id) && channel.isTokenGated && (
                          <span className="flex items-center justify-center text-purple-400 neon-purple-glow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Explore section */}
          <div className="mt-6">
            <div 
              onClick={handleExploreClick}
              className={`flex items-center px-4 py-2 rounded cursor-pointer ${
                isExploring
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white shadow-md shadow-purple-900/20'
                  : 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 hover:from-purple-900/30 hover:to-indigo-900/30 text-gray-300 hover:text-white transition-all hover:shadow-lg hover:shadow-purple-900/20'
              } group border border-purple-900/30`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Explore Channels</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* User area at bottom */}
        <div className="p-3 border-t border-purple-900/30 bg-black">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 relative group cursor-pointer">
              {user?.email?.address ? (
                <span className="text-sm font-medium text-white">
                  {user.email.address[0].toUpperCase()}
                </span>
              ) : (
                <span className="text-sm font-medium text-white">U</span>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition-colors duration-200"></div>
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-medium text-white truncate">
                {user?.email?.address || "Anonymous User"}
              </div>
              <div className="text-xs text-gray-400 truncate flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                Online
              </div>
            </div>
            <div className="flex space-x-1">
              <button className="p-2 rounded-full hover:bg-purple-900/20 text-gray-400 hover:text-purple-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 