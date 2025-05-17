"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface ChatMessageProps {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    name: string;
    id: string;
  };
  currentUserId: string;
  isBot?: boolean;
  isRead?: boolean;
  isPending?: boolean;
  hasError?: boolean;
}

export default function ChatMessage({ 
  content, 
  createdAt, 
  user, 
  currentUserId,
  isBot = false,
  isRead = false,
  isPending = false,
  hasError = false
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [wasEverPending, setWasEverPending] = useState(isPending);
  const isCurrentUser = user.id === currentUserId;
  
  // Mark the message as "wasEverPending" if it starts pending
  useEffect(() => {
    if (isPending) {
      setWasEverPending(true);
    }
  }, [isPending]);
  
  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };
  
  // Get a color based on user name (consistently)
  const getUserColor = (name: string) => {
    const colors = [
      'text-purple-400', 'text-indigo-400', 'text-blue-400', 
      'text-pink-400', 'text-fuchsia-400', 'text-violet-400', 
      'text-rose-400', 'text-cyan-400'
    ];
    
    const bgColors = [
      'bg-purple-800/40', 'bg-indigo-800/40', 'bg-blue-800/40',
      'bg-pink-800/40', 'bg-fuchsia-800/40', 'bg-violet-800/40',
      'bg-rose-800/40', 'bg-cyan-800/40'
    ];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Ensure it's positive
    hash = Math.abs(hash);
    
    // Get index
    const index = hash % colors.length;
    return { text: colors[index], bg: bgColors[index] };
  };
  
  const userColors = getUserColor(user.name);
  
  return (
    <div 
      className={`px-4 py-2 hover:bg-purple-900/5 relative group ${isCurrentUser ? 'ml-8' : 'mr-8'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex items-start ${isCurrentUser ? 'justify-end' : ''}`}>
        {/* User avatar - show only if not current user */}
        {!isCurrentUser && (
          <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-white font-medium mr-3 mt-0.5">
            {isBot ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
              </svg>
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
        )}
        
        <div className={`max-w-[80%] ${isCurrentUser ? 'order-first mr-3' : ''}`}>
          <div className="flex items-baseline mb-1">
            <span className={`font-medium ${userColors.text} mr-2`}>
              {isCurrentUser ? 'You' : user.name}
              {isBot && <span className="ml-1 text-xs bg-purple-900 text-purple-200 px-1 py-0.5 rounded-sm">BOT</span>}
            </span>
            <span className="text-xs text-gray-400">
              {formatTimestamp(createdAt)}
            </span>
          </div>
          
          <div 
            className={`rounded-2xl px-4 py-3 text-gray-100 shadow-md ${
              isCurrentUser 
                ? `bg-purple-800/50 rounded-br-none ${isPending ? 'border border-purple-500/30 bg-opacity-30' : ''} ${hasError ? 'border border-red-500/40 bg-red-900/20' : ''}` 
                : `${userColors.bg} rounded-bl-none`
            }`}
          >
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {content}
            </div>
          </div>
          
          {/* Message status indicators */}
          {isCurrentUser && (
            <div className="text-right mt-1">
              {isPending ? (
                <span className="flex items-center justify-end text-xs text-purple-300">
                  <span className="flex h-2 w-2 relative mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  Sending...
                </span>
              ) : hasError ? (
                <span className="flex items-center justify-end text-xs text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Failed to send
                </span>
              ) : (
                <span className={`text-xs ${isRead ? 'text-purple-400' : 'text-gray-500'}`}>
                  {isRead ? (
                    <span className="flex items-center justify-end">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Read
                    </span>
                  ) : 'Sent'}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* User avatar - show only if current user */}
        {isCurrentUser && (
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium ml-3 mt-0.5">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Message actions - hide for pending messages */}
        {showActions && !isPending && !hasError && (
          <div className={`absolute ${isCurrentUser ? 'right-16' : 'right-4'} top-2 flex items-center space-x-1 bg-black/80 border border-purple-900 shadow-md rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
            <button className="p-1 rounded hover:bg-purple-900 text-gray-400 hover:text-purple-400 transition" title="React">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-purple-900 text-gray-400 hover:text-purple-400 transition" title="Reply">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {isCurrentUser && (
              <>
                <button className="p-1 rounded hover:bg-purple-900 text-gray-400 hover:text-purple-400 transition" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-purple-900 text-gray-400 hover:text-red-400 transition" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Retry button for failed messages */}
        {hasError && isCurrentUser && (
          <div className="absolute right-16 top-2 flex items-center space-x-1 bg-black/80 border border-red-500/40 shadow-md rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button className="p-1 rounded hover:bg-purple-900 text-gray-400 hover:text-purple-400 transition" title="Retry">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 