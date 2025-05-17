"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { motion, AnimatePresence } from "framer-motion";
import ChannelItem from './ChannelItem';
import { getWalletTokens } from "@/app/utils/tokenUtils";

// Add TokenData interface
interface TokenData {
  mint: string;
  name?: string;
  symbol?: string;
  amount: string;
  decimals: number;
  createdAt?: number;
}

type SectionType = 'subchannels' | null;

export default function ChatSidebar({ 
  userChannels, 
  createdChannels, 
  activeChannelId,
  onChannelSelect,
  onCreateChannel,
  isAdmin = false
}: { 
  userChannels: any[], 
  createdChannels: any[],
  activeChannelId: string,
  onChannelSelect: (channelId: string) => void,
  onCreateChannel?: () => void,
  isAdmin?: boolean
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subchannelId = searchParams?.get('subchannel') || '';
  const { user } = usePrivy();
  
  const [expandedSection, setExpandedSection] = useState<SectionType>('subchannels');
  const [hoverChannel, setHoverChannel] = useState<string | null>(null);
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isExploring, setIsExploring] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const [subchannels, setSubchannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubchannelName, setNewSubchannelName] = useState("");
  const [newSubchannelType, setNewSubchannelType] = useState("TEXT");
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [suggestedChannels, setSuggestedChannels] = useState<any[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    username: "",
    profileImage: "",
    description: ""
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  
  // Add token-related state
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  
  // Get current active channel
  const allChannels = [...createdChannels, ...userChannels];
  const activeChannel = allChannels.find(channel => channel.id === activeChannelId) || null;
  
  // Add function to fetch user tokens
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
    } finally {
      setLoadingTokens(false);
    }
  };
  
  // Add function to select a token
  const selectToken = (mint: string) => {
    console.log("Token selected:", mint);
    setTokenAddress(mint);
  };
  
  // Add function to redirect to token page
  const redirectToTokenPage = () => {
    router.push('/token');
  };
  
  // Fetch user tokens when component mounts or user changes
  useEffect(() => {
    if (user?.wallet?.address) {
      fetchUserTokens();
    }
  }, [user?.wallet?.address]);
  
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
  
  // Fetch subchannels when active channel changes
  useEffect(() => {
    if (activeChannelId) {
      fetchChannelDetails(activeChannelId);
    } else {
      setSubchannels([]);
      setChannel(null);
    }
  }, [activeChannelId]);
  
  // Set suggested channels based on current channels
  useEffect(() => {
    // For now, just show channels the user is part of
    // In a real app, this would be more sophisticated
    setSuggestedChannels([...userChannels, ...createdChannels].slice(0, 3));
  }, [userChannels, createdChannels]);
  
  // Fetch channel details and subchannels
  async function fetchChannelDetails(channelId: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/demo/channels?id=${channelId}`);
      
      if (res.ok) {
        const data = await res.json();
        setChannel(data);
        setSubchannels(data.subchannels || []);
      }
    } catch (err) {
      console.error("Failed to fetch channel details", err);
    } finally {
      setLoading(false);
    }
  }
  
  // Handle subchannel selection
  const handleSubchannelSelect = (subId: string) => {
    router.push(`/demo?channel=${activeChannelId}&subchannel=${subId}`);
  };
  
  // Create a new subchannel
  const createSubchannel = async () => {
    if (!newSubchannelName.trim() || !activeChannelId) return;
    
    // Validate that token address is provided when token gating is enabled
    if (isTokenGated && !tokenAddress) {
      console.log("Token gating enabled but no token selected");
      return;
    }
    
    try {
      console.log("Creating subchannel with data:", {
        name: newSubchannelName,
        type: newSubchannelType,
        isTokenGated,
        tokenAddress: isTokenGated ? tokenAddress : null
      });
      
      const res = await fetch(`/api/demo/channels/${activeChannelId}/subchannels`, {
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
        setSubchannels([...subchannels, newSubchannel]);
        setShowCreateModal(false);
        setNewSubchannelName("");
        setNewSubchannelType("TEXT");
        setIsTokenGated(false);
        setTokenAddress("");
      }
    } catch (err) {
      console.error("Failed to create subchannel", err);
    }
  };
  
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

  // Get subchannel icon based on type
  const getSubchannelIcon = (subchannel: any) => {
    if (subchannel.type === "VOICE") {
      return (
        <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    );
  };
  
  // Fetch user profile when needed
  useEffect(() => {
    if (showProfileModal && user?.wallet?.address) {
      fetchUserProfile(user.wallet.address);
    }
  }, [showProfileModal, user?.wallet?.address]);

  // Fetch user profile data
  async function fetchUserProfile(walletAddress: string) {
    try {
      setIsUpdatingProfile(true);
      const res = await fetch(`/api/demo/users?walletAddress=${walletAddress}`);
      
      if (res.ok) {
        const data = await res.json();
        setUserProfile({
          name: data.name || "",
          username: data.username || "",
          profileImage: data.profileImage || "",
          description: data.description || ""
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  // Update user profile
  async function updateUserProfile() {
    if (!user?.wallet?.address) return;
    
    try {
      setIsUpdatingProfile(true);
      const res = await fetch('/api/demo/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: user.wallet.address,
          ...userProfile
        }),
      });
      
      if (res.ok) {
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error("Failed to update user profile", err);
    } finally {
      setIsUpdatingProfile(false);
    }
  }
  
  // Handle image error for channel icons
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className="flex h-full w-full">
      {/* Vertical channel sidebar */}
      <motion.div 
        className="bg-transparent flex flex-col items-center pt-4 pb-3 border-r border-purple-900/30 hidden md:flex overflow-hidden h-full"
        animate={sidebarExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        initial="expanded"
      >
        {/* Channel icons */}
        <div className="space-y-3 w-full px-2 pt-3 overflow-y-auto custom-scrollbar flex-grow">
          {/* Created channels */}
          {createdChannels.map(channel => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isActive={activeChannelId === channel.id}
              onClick={() => onChannelSelect(channel.id)}
            />
          ))}
          
          {/* Divider if both created and joined channels exist */}
          {createdChannels.length > 0 && userChannels.length > 0 && (
            <div className="border-t border-purple-900/30 w-8 mx-auto my-3"></div>
          )}
          
          {/* Joined channels */}
          {userChannels.map(channel => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isActive={activeChannelId === channel.id}
              onClick={() => onChannelSelect(channel.id)}
            />
          ))}

          {/* Divider before utility buttons if we have any channels */}
          {(createdChannels.length > 0 || userChannels.length > 0) && (
            <div className="border-t border-purple-900/30 w-8 mx-auto my-3"></div>
          )}
        </div>

        {/* Bottom buttons */}
        <div className="px-2 mt-auto space-y-3">
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
          <div className="flex items-center flex-1">
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
                <motion.div 
                  className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg shadow-purple-900/30 flex-shrink-0 mr-3"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 15 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 2,
                    ease: "easeInOut",
                    repeatDelay: 2
                  }}
                >
                  {activeChannel.icon && !imageError ? (
                    <img 
                      src={activeChannel.icon} 
                      alt={activeChannel.name} 
                      className="w-full h-full object-cover z-10"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium`}>
                      {getChannelInitial(activeChannel)}
                    </div>
                  )}
                  <motion.div 
                    className="absolute inset-0 opacity-30 z-20"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.1) 100%)',
                      borderRadius: '50%'
                    }}
                  />
                  <motion.div 
                    className="absolute -inset-0.5 rounded-full z-0"
                    animate={{ 
                      boxShadow: ['0 0 5px 2px rgba(147, 51, 234, 0.3)', '0 0 12px 4px rgba(147, 51, 234, 0.6)', '0 0 5px 2px rgba(147, 51, 234, 0.3)']
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      repeatType: "mirror" 
                    }}
                  />
                </motion.div>
                <motion.span 
                  className="font-medium text-white truncate"
                  animate={{
                    textShadow: ['0 0 0px rgba(178, 132, 255, 0)', '0 0 8px rgba(178, 132, 255, 0.6)', '0 0 0px rgba(178, 132, 255, 0)']
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    repeatType: "mirror" 
                  }}
                >
                  {activeChannel.name}
                </motion.span>
              </div>
            ) : (
              <span className="font-medium text-gray-400">Select a channel</span>
            )}
          </div>
          
          {/* Settings button for admins */}
          {isAdmin && activeChannel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/demo/channel/${activeChannelId}/settings`);
              }}
              className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ml-2"
              title="Channel Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </button>
          )}

          {/* Tooltip */}
          <div className="absolute left-0 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 backdrop-blur-sm text-xs text-white px-2 py-1 rounded pointer-events-none">
            {sidebarExpanded ? 'Hide channel list' : 'Show channel list'}
          </div>
        </div>
        
        {/* Main content section - flex grows to take available space */}
        <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
          {/* Channel Information Link */}
          <div className="p-3 border-b border-purple-900/30">
            <button
              onClick={() => router.push(`/demo?channel=${activeChannelId}&view=info`)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                searchParams?.get('view') === 'info'
                  ? "bg-purple-700/30 text-purple-100"
                  : "text-gray-300 hover:bg-gray-800/70"
              }`}
            >
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate font-medium">Channel Info</span>
            </button>
          </div>

          {/* Subchannels section - dedicated majority of space */}
          <div className="p-3 flex-grow">
            <div 
              className="flex items-center justify-between px-2 py-1 mb-2 text-gray-400 hover:text-purple-400 transition"
            >
              <div className="flex items-center">
                <motion.div 
                  initial={false}
                  animate={{ rotate: expandedSection === 'subchannels' ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => toggleSection('subchannels')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <span className="ml-1 text-sm font-semibold tracking-wide uppercase">Subchannels</span>
                <span className="ml-2 text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-full">
                  {subchannels.length}
                </span>
              </div>
              
              {/* Add subchannel button */}
              {activeChannelId && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-colors"
                  title="Add Subchannel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            <AnimatePresence initial={false}>
              {expandedSection === 'subchannels' && (
                <motion.div
                  key="subchannels"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-1 pl-2 overflow-hidden"
                >
                  {loading ? (
                    <div className="space-y-2 mt-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-800/50 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : !activeChannelId ? (
                    <motion.div 
                      variants={itemVariants}
                      className="px-3 py-2 text-gray-400 text-sm italic bg-gray-900/20 rounded-md border border-gray-800/30"
                    >
                      Select a channel to see subchannels
                    </motion.div>
                  ) : subchannels.length === 0 ? (
                    <motion.div 
                      variants={itemVariants}
                      className="px-3 py-2 text-gray-400 text-sm italic bg-gray-900/20 rounded-md border border-gray-800/30"
                    >
                      <p>No subchannels available</p>
                      <p className="text-xs mt-1 text-gray-500">Click the + button above to create one</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-0.5">
                      {subchannels.map((subchannel) => (
                        <motion.div 
                          key={subchannel.id}
                          variants={itemVariants}
                          onMouseEnter={() => setHoverChannel(subchannel.id)}
                          onMouseLeave={() => setHoverChannel(null)}
                          onClick={() => handleSubchannelSelect(subchannel.id)}
                          className={`px-2 py-2 rounded-md flex items-center cursor-pointer transition group ${
                            subchannelId === subchannel.id 
                              ? 'bg-purple-900/30 text-white neon-text shadow-sm shadow-purple-900/50' 
                              : 'text-gray-400 hover:bg-gray-900/40 hover:text-purple-300'
                          }`}
                        >
                          <span className={`w-5 text-center ${subchannelId === subchannel.id ? 'text-purple-400' : 'text-gray-400'} group-hover:text-purple-400 mr-2 transition`}>
                            {getSubchannelIcon(subchannel)}
                          </span>
                          <span className="truncate flex-1">{subchannel.name}</span>
                          
                          {(hoverChannel === subchannel.id || subchannelId === subchannel.id) && (
                            <div className="flex space-x-1">
                              {subchannel.isTokenGated && (
                                <span className="flex items-center justify-center text-purple-400 neon-purple-glow">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Suggested Channels Section - smaller section */}
          <div className="p-3 border-t border-purple-900/30">
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Suggested Channels
              </div>
            </div>
            
            <div className="space-y-0.5">
              {suggestedChannels.length === 0 ? (
                <div className="text-gray-500 text-xs italic px-2">No suggestions available</div>
              ) : (
                suggestedChannels.map(channel => (
                  <div 
                    key={`suggested-${channel.id}`}
                    onClick={() => onChannelSelect(channel.id)}
                    className="flex items-center px-2 py-1.5 rounded-md text-gray-400 hover:bg-gray-900/40 hover:text-purple-300 cursor-pointer transition"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-900/40 to-indigo-900/40 flex items-center justify-center text-white mr-2 text-xs">
                      {getChannelInitial(channel)}
                    </div>
                    <span className="truncate text-xs">{channel.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User Profile Section - Discord style */}
          <div className="mt-auto border-t border-purple-900/30">
            <div 
              className="p-3 flex items-center cursor-pointer hover:bg-gray-900/40 rounded-md transition-colors group relative"
              onClick={(e) => {
                // Store the click position for the modal positioning
                const rect = e.currentTarget.getBoundingClientRect();
                
                // Position directly above the profile component
                const posX = rect.left;
                const posY = rect.top - 10; // Position just slightly above the profile section
                
                setModalPosition({
                  x: posX,
                  y: posY
                });
                setShowProfileModal(true);
              }}
            >
              <div className="relative">
                {user?.wallet?.address ? (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium group-hover:shadow-md group-hover:shadow-purple-600/20 transition-shadow">
                    {user.email?.address?.[0]?.toUpperCase() || user.wallet.address.slice(2, 4).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-800 animate-pulse"></div>
                )}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              
              <div className="ml-2 flex-1 min-w-0">
                <div className="truncate font-medium text-white text-sm">
                  {user?.email?.address || user?.wallet?.address?.slice(0, 6) + '...' + user?.wallet?.address?.slice(-4) || 'Loading...'}
                </div>
                <div className="text-xs text-green-400">Online</div>
              </div>
              
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Subchannel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 350 
            }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900/90 via-gray-900 to-black/90 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-900/30 overflow-hidden"
          >
            {/* Animated background gradient effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-[500px] opacity-30">
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen blur-[100px] animate-pulse" 
                  style={{ animationDuration: '7s' }}></div>
                <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen blur-[100px] animate-pulse" 
                  style={{ animationDuration: '8s' }}></div>
              </div>
            </div>
            
            {/* Header with animated gradient */}
            <div className="relative p-6 border-b border-purple-900/50">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                  Create Subchannel
                </h3>
              </div>
              
              <p className="text-gray-400 text-sm">
                Create a new subchannel for your members to communicate in
              </p>
              
              {/* Close button */}
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content area */}
            <div className="relative p-6 space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="text-purple-400 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Channel Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newSubchannelName}
                    onChange={(e) => setNewSubchannelName(e.target.value)}
                    className="w-full bg-black/40 border border-purple-900/30 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pl-9"
                    placeholder="e.g. announcements"
                    autoFocus
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">
                    #
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span className="text-purple-400 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </span>
                  Channel Type
                </label>
                
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    onClick={() => setNewSubchannelType("TEXT")}
                    className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                      newSubchannelType === "TEXT" 
                        ? "bg-purple-900/30 border-purple-500/50 shadow-md shadow-purple-900/20" 
                        : "bg-black/30 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 ${newSubchannelType === "TEXT" ? "text-purple-400" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-xs font-medium ${newSubchannelType === "TEXT" ? "text-purple-300" : "text-gray-400"}`}>Text</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => {
                      setNewSubchannelType("VOICE");
                      // Disable token gating for voice channels
                      if (isTokenGated) setIsTokenGated(false);
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                      newSubchannelType === "VOICE" 
                        ? "bg-purple-900/30 border-purple-500/50 shadow-md shadow-purple-900/20" 
                        : "bg-black/30 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 ${newSubchannelType === "VOICE" ? "text-purple-400" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-xs font-medium ${newSubchannelType === "VOICE" ? "text-purple-300" : "text-gray-400"}`}>Voice</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => {
                      setNewSubchannelType("VIDEO");
                      // Disable token gating for video channels
                      if (isTokenGated) setIsTokenGated(false);
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                      newSubchannelType === "VIDEO" 
                        ? "bg-purple-900/30 border-purple-500/50 shadow-md shadow-purple-900/20" 
                        : "bg-black/30 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-1 ${newSubchannelType === "VIDEO" ? "text-purple-400" : "text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      <span className={`text-xs font-medium ${newSubchannelType === "VIDEO" ? "text-purple-300" : "text-gray-400"}`}>Video</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 bg-gradient-to-br rounded-lg border ${
                newSubchannelType === "TEXT"
                  ? "from-purple-900/20 to-indigo-900/20 border-purple-900/30" 
                  : "from-gray-800/30 to-gray-900/30 border-gray-800/50"
              }`}>
                <label className="flex items-center">
                  <div className="relative inline-block w-10 mr-3 align-middle">
                    <input 
                      type="checkbox"
                      checked={isTokenGated}
                      onChange={(e) => {
                        if (newSubchannelType !== "TEXT") return;
                        setIsTokenGated(e.target.checked);
                      }}
                      disabled={newSubchannelType !== "TEXT"}
                      className="peer sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                      newSubchannelType === "TEXT"
                        ? "bg-gray-800 after:bg-gray-400 after:border-gray-300 peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-indigo-600 peer-checked:after:bg-white cursor-pointer"
                        : "bg-gray-800/50 after:bg-gray-600 after:border-gray-700 cursor-not-allowed opacity-60"
                    }`}></div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${newSubchannelType === "TEXT" ? "text-white" : "text-gray-400"}`}>
                      Token Gated
                      {newSubchannelType !== "TEXT" && <span className="ml-2 px-1.5 py-0.5 bg-gray-800/80 text-gray-400 text-xs rounded-md">Not Available</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {newSubchannelType === "TEXT" 
                        ? "Requires NFT ownership to access" 
                        : "Only available for text channels"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Token Selection Section - Enhanced UI */}
            {isTokenGated && (
              <div className="relative px-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                    SELECT TOKEN FOR ACCESS
                  </h3>
                  <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                    Required
                  </span>
                </div>

                {loadingTokens ? (
                  <div className="flex flex-col items-center justify-center py-6 px-3">
                    <div className="relative w-10 h-10 mb-2">
                      <div className="absolute inset-0 rounded-full border-3 border-purple-800/30"></div>
                      <div className="absolute inset-0 rounded-full border-3 border-purple-500 border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-indigo-400 animate-ping opacity-20"></div>
                    </div>
                    <span className="text-purple-300 font-medium text-sm">Loading your tokens...</span>
                    <p className="text-gray-400 text-xs mt-1">This will only take a moment</p>
                  </div>
                ) : userTokens.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1.5 custom-scrollbar">
                      {userTokens.map((token) => (
                        <div 
                          key={token.mint}
                          onClick={() => selectToken(token.mint)}
                          className={`relative rounded-lg border cursor-pointer transition-all duration-300 overflow-hidden ${
                            tokenAddress === token.mint
                              ? "bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-400 shadow-lg shadow-purple-500/20 transform scale-[1.02]"
                              : "bg-gray-900/70 border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/70 hover:shadow-md hover:shadow-purple-600/10"
                          }`}
                        >
                          {/* Background glow effect for selected token */}
                          {tokenAddress === token.mint && (
                            <div className="absolute inset-0 overflow-hidden">
                              <div className="absolute -inset-[10px] opacity-20">
                                <div className="absolute top-0 right-1/4 w-16 h-16 bg-purple-500 rounded-full mix-blend-screen blur-[20px] animate-pulse"></div>
                                <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-indigo-500 rounded-full mix-blend-screen blur-[20px] animate-pulse"></div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center p-2.5 relative z-10">
                            {/* Token icon with glow */}
                            <div className={`relative h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                              tokenAddress === token.mint
                                ? "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-600/30"
                                : "bg-gradient-to-br from-purple-700 to-indigo-800"
                            }`}>
                              <span className="text-white font-bold text-base">
                                {token.symbol?.[0] || token.name?.[0] || "T"}
                              </span>
                              {tokenAddress === token.mint && (
                                <div className="absolute -inset-0.5 rounded-full animate-pulse opacity-70" 
                                  style={{background: "linear-gradient(45deg, rgba(168, 85, 247, 0.4), rgba(80, 70, 230, 0.4))"}}></div>
                              )}
                            </div>
                            
                            {/* Token details */}
                            <div className="flex-grow min-w-0">
                              <h4 className={`font-medium text-sm truncate ${tokenAddress === token.mint ? "text-purple-200" : "text-white"}`}>
                                {token.name || "Unnamed Token"}
                              </h4>
                              <div className="flex items-center mt-0.5">
                                <span className={`text-xs truncate ${tokenAddress === token.mint ? "text-purple-300" : "text-gray-400"}`}>
                                  {token.symbol || "???"}
                                </span>
                                <span className="mx-1 text-gray-500">•</span>
                                <span className={`text-xs truncate ${tokenAddress === token.mint ? "text-purple-300 font-medium" : "text-gray-400"}`}>
                                  Balance: {parseInt(token.amount).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            
                            {/* Selection indicator */}
                            {tokenAddress === token.mint ? (
                              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-1 shadow-lg shadow-purple-600/30 ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="rounded-full p-1 border-2 border-gray-600 opacity-50 hover:opacity-100 hover:border-purple-500 transition-opacity ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Warning when no token is selected */}
                    {!tokenAddress && (
                      <div className="mt-3 p-2 bg-amber-900/30 border border-amber-700/30 rounded-lg text-amber-300 font-medium flex items-center text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Please select a token to enable token gating</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-lg border border-purple-600/30 p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full animate-ping opacity-30"></div>
                      <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200 mb-1">No Tokens Found</h3>
                    <p className="text-gray-300 text-xs mb-3 max-w-xs mx-auto">
                      You'll need to create tokens before you can use them for gating access to your channel.
                    </p>
                    <button
                      type="button"
                      onClick={redirectToTokenPage}
                      className="py-1.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 text-sm"
                    >
                      Create Tokens
                    </button>
                  </div>
                )}
              </div>
            )}
            
            
            {/* Footer with buttons */}
            <div className="relative p-6 border-t border-purple-900/50 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createSubchannel}
                  disabled={!newSubchannelName.trim() || (isTokenGated && !tokenAddress)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    !newSubchannelName.trim() || (isTokenGated && !tokenAddress)
                      ? "bg-gray-700/70 text-gray-400 cursor-not-allowed shadow-none border border-gray-700"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Subchannel
              </button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      )}
      
      {/* User Profile Modal - Contextual Popup */}
      <AnimatePresence>
        {showProfileModal && (
          <>
            {/* Clickable overlay to close the modal */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileModal(false)}
            />
            
            {/* Floating profile card - simplified version */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed z-50 w-64 bg-gray-900 rounded-lg border border-purple-900/50 shadow-lg shadow-black/20 overflow-hidden transform -translate-y-full"
              style={{
                left: `${modalPosition.x}px`,
                top: `${modalPosition.y}px`,
                backdropFilter: 'blur(8px)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with purple gradient */}
              <div className="h-16 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 relative">
                {/* Close button */}
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/20 text-white/80 hover:text-white hover:bg-black/40 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* User Avatar - positioned to overflow the header */}
                <div className="absolute -bottom-6 left-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold border-2 border-gray-900">
                    {userProfile.name?.[0]?.toUpperCase() || user?.email?.address?.[0]?.toUpperCase() || 
                     user?.wallet?.address?.slice(2, 4).toUpperCase()}
                  </div>
                </div>
              </div>
              
              {/* Content area */}
              <div className="p-3 pt-8">
                {/* User info */}
                <div className="mb-2">
                  <div className="text-white font-medium">
                    {userProfile.name || user?.email?.address || 'Anonymous User'}
                  </div>
                  <div className="text-gray-400 text-xs flex items-center">
                    <span className="bg-green-500 w-2 h-2 rounded-full mr-1"></span>
                    Online
                  </div>
                </div>
                
                {/* Wallet Address */}
                <div className="bg-gray-800/50 rounded-md px-2 py-1.5 mb-3 border border-gray-700/50 flex items-center justify-between">
                  <div className="text-xs text-white font-mono overflow-hidden text-ellipsis">
                    {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                  </div>
                  <button 
                    className="text-gray-400 hover:text-white transition p-1"
                    title="Copy address"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user?.wallet?.address) {
                        navigator.clipboard.writeText(user.wallet.address);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                  </button>
                </div>
                
                {/* Link to full profile/edit page */}
                <Link
                  href="/profile"
                  className="block w-full py-1.5 px-3 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-200 rounded-md text-xs text-center transition-colors border border-gray-700/50"
                  onClick={() => setShowProfileModal(false)}
                >
                  View Full Profile
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 