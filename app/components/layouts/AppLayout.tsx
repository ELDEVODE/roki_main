"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Header from "../Header";
import ChatSidebar from "../Sidebar/ChatSidebar";
import UserList from "../UserList";
import MobileNav from "../MobileNav";

interface AppLayoutProps {
  children: ReactNode;
  showUserList?: boolean;
  userChannels?: any[];
  createdChannels?: any[];
  activeChannelId?: string;
  onChannelSelect?: (channelId: string) => void;
  onCreateChannel?: () => void;
  members?: any[];
  currentUserId?: string;
  themedHeaderBorder?: boolean;
}

export default function AppLayout({
  children, 
  showUserList = false,
  userChannels = [],
  createdChannels = [],
  activeChannelId = "",
  onChannelSelect = () => {},
  onCreateChannel = () => {},
  members = [],
  currentUserId = "",
  themedHeaderBorder = false
}: AppLayoutProps) {
  const { login, authenticated, user } = usePrivy();
  const router = useRouter();
  
  // State for resizable panels
  const [sidebarWidth, setSidebarWidth] = useState(256); // 16rem/256px
  const [userListWidth, setUserListWidth] = useState(240); // 15rem/240px
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingUserList, setIsResizingUserList] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  
  // Min/max constraints
  // CHANNEL_SIDEBAR_WIDTH in ChatSidebar.tsx is 72px
  // Ensuring MIN_SIDEBAR_WIDTH is sufficient to accommodate the main content plus the expanded channel sidebar
  const MIN_SIDEBAR_WIDTH = 256; // Increased from 220px to ensure enough space for channel selector
  const MAX_SIDEBAR_WIDTH = 400;
  const MIN_USERLIST_WIDTH = 200;
  const MAX_USERLIST_WIDTH = 380;
  
  // Refs for resizing
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle sidebar resize
  const startSidebarResize = (e: React.MouseEvent) => {
    setIsResizingSidebar(true);
    setStartX(e.clientX);
    setStartWidth(sidebarWidth);
    e.preventDefault();
  };
  
  // Handle user list resize
  const startUserListResize = (e: React.MouseEvent) => {
    setIsResizingUserList(true);
    setStartX(e.clientX);
    setStartWidth(userListWidth);
    e.preventDefault();
  };
  
  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizingSidebar) {
      const newWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(MAX_SIDEBAR_WIDTH, startWidth + (e.clientX - startX))
      );
      setSidebarWidth(newWidth);
    } else if (isResizingUserList) {
      const newWidth = Math.max(
        MIN_USERLIST_WIDTH,
        Math.min(MAX_USERLIST_WIDTH, startWidth - (e.clientX - startX))
      );
      setUserListWidth(newWidth);
    }
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    setIsResizingSidebar(false);
    setIsResizingUserList(false);
  };
  
  // Add and remove event listeners
  useEffect(() => {
    if (isResizingSidebar || isResizingUserList) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingSidebar, isResizingUserList, startX, startWidth]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authenticated && typeof window !== 'undefined') {
      // Add a small delay to avoid immediate redirects during hydration
      const timer = setTimeout(() => {
        router.push('/');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [authenticated, router]);
  
  if (!authenticated) {
    return (
      <div className="flex flex-col min-h-screen h-screen w-screen bg-black">
        <Header />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center relative">
          {/* Background gradient elements */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl"></div>
          
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
              Sign In Required
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Please connect your wallet to access this page.
            </p>
          </div>
          <button
            onClick={() => login()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center gap-2 neon-purple-glow transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen h-screen w-screen overflow-hidden bg-black">
      {/* Top header - fixed height of 4rem (64px) */}
      <div className={`h-16 ${themedHeaderBorder ? 'border-b border-purple-900/30' : ''}`}>
        <Header />
      </div>
      
      {/* Main content area - fills remaining height */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)] w-full">
        {/* Left sidebar with chat channels */}
        <div className="hidden md:block" style={{ width: `${sidebarWidth}px` }}>
          <ChatSidebar 
            userChannels={userChannels}
            createdChannels={createdChannels}
            activeChannelId={activeChannelId}
            onChannelSelect={onChannelSelect}
            onCreateChannel={onCreateChannel}
          />
        </div>
        
        {/* Resize handle for sidebar */}
        <div
          className="hidden md:flex w-1 bg-transparent hover:bg-purple-600/40 cursor-col-resize transition-colors group relative z-10"
          onMouseDown={startSidebarResize}
          title="Drag to resize sidebar"
        >
          <div className="absolute inset-y-0 -left-2 right-0 group-hover:bg-purple-600/20"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1 h-16 rounded bg-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        {/* Mobile navigation */}
        <MobileNav 
          userChannels={userChannels}
          createdChannels={createdChannels}
          activeChannelId={activeChannelId}
          onChannelSelect={onChannelSelect}
          onCreateChannel={onCreateChannel}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full w-full bg-black relative animated-gradient-bg overflow-auto">
          {/* Background gradient elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-purple-800/10 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-indigo-800/10 blur-3xl"></div>
          </div>
          
          {children}
        </div>
        
        {/* Resize handle for user list */}
        {showUserList && (
          <div
            className="hidden md:flex w-1 bg-transparent hover:bg-purple-600/40 cursor-col-resize transition-colors group relative z-10"
            onMouseDown={startUserListResize}
            title="Drag to resize member list"
          >
            <div className="absolute inset-y-0 -right-2 left-0 group-hover:bg-purple-600/20"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1 h-16 rounded bg-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        )}
        
        {/* Right sidebar - members list (optional) */}
        {showUserList && (
          <div className="hidden md:block" style={{ width: `${userListWidth}px` }}>
            <UserList 
              members={members}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </div>
    </div>
  );
} 