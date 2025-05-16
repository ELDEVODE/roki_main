"use client";
import { useState } from 'react';

interface ChatHeaderProps {
  channelName: string;
  memberCount: number;
  isTokenGated?: boolean;
  onShareClick?: () => void;
  onAddMemberClick?: () => void;
  onSettingsClick?: () => void;
}

export default function ChatHeader({
  channelName,
  memberCount,
  isTokenGated = false,
  onShareClick,
  onAddMemberClick,
  onSettingsClick
}: ChatHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="h-16 min-h-[4rem] border-b border-purple-900/30 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 py-2 sticky top-0 z-10">
      {/* Left side - Channel info */}
      <div className="flex items-center">
        <div className="text-purple-400 mr-2 text-2xl neon-text">#</div>
        <div>
          <h2 className="font-medium text-white">{channelName}</h2>
          <div className="text-xs text-gray-400 flex items-center">
            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
            {isTokenGated && (
              <>
                <span className="mx-1.5">•</span>
                <div className="flex items-center text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 neon-purple-glow" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Token-gated
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative">
          {isSearching ? (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages"
                className="bg-purple-900/20 text-white text-sm rounded-md py-1.5 pl-8 pr-2 w-64 focus:outline-none focus:ring-1 focus:ring-purple-500 border border-purple-900/40"
                autoFocus
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <button 
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsSearching(true)}
              className="text-gray-400 hover:text-purple-400 p-2 rounded-full hover:bg-purple-900/20 transition"
              title="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Notifications */}
        <button 
          className="text-gray-400 hover:text-purple-400 p-2 rounded-full hover:bg-purple-900/20 transition"
          title="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
        
        {/* Add member */}
        <button 
          onClick={onAddMemberClick}
          className="text-gray-400 hover:text-purple-400 p-2 rounded-full hover:bg-purple-900/20 transition"
          title="Add member"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </button>
        
        {/* Share */}
        <button 
          onClick={onShareClick}
          className="text-gray-400 hover:text-purple-400 p-2 rounded-full hover:bg-purple-900/20 transition"
          title="Share"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
        
        {/* Settings */}
        <button 
          onClick={onSettingsClick}
          className="text-gray-400 hover:text-purple-400 p-2 rounded-full hover:bg-purple-900/20 transition"
          title="Channel settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 