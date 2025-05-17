"use client";
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface Member {
  userId: string;
  user: {
    id: string;
    name: string;
    walletAddress?: string;
  };
  role?: 'admin' | 'moderator' | 'member';
  isOnline?: boolean;
}

export default function UserList({ members = [], currentUserId }: { members: Member[], currentUserId: string }) {
  // Group members by role
  const admins = members.filter(m => m.role === 'admin' || (m.user.id === currentUserId));
  const moderators = members.filter(m => m.role === 'moderator' && m.user.id !== currentUserId);
  const regularMembers = members.filter(m => (!m.role || m.role === 'member') && m.user.id !== currentUserId);

  return (
    <div className="h-full bg-black border-l border-purple-900/30 flex flex-col animated-gradient-bg w-full">
      <div className="p-4 border-b border-purple-900/30">
        <h2 className="font-medium text-gray-300">Members — {members.length}</h2>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        {/* Online status line */}
        <div className="flex items-center text-xs text-gray-500 font-semibold mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 neon-purple-glow"></div>
          <span>ONLINE — {members.filter(m => m.isOnline !== false).length}</span>
        </div>
        
        {/* Admins */}
        {admins.length > 0 && (
          <div className="mb-6">
            <div className="text-xs text-gray-500 font-semibold mb-2 px-2">ADMINS — {admins.length}</div>
            {admins.map(member => (
              <UserListItem 
                key={member.userId} 
                name={member.user.name}
                isCurrentUser={member.user.id === currentUserId}
                role="admin"
                walletAddress={member.user.walletAddress}
                status={member.isOnline === false ? 'offline' : 'online'}
              />
            ))}
          </div>
        )}
        
        {/* Moderators */}
        {moderators.length > 0 && (
          <div className="mb-6">
            <div className="text-xs text-gray-500 font-semibold mb-2 px-2">MODERATORS — {moderators.length}</div>
            {moderators.map(member => (
              <UserListItem 
                key={member.userId} 
                name={member.user.name}
                role="moderator"
                walletAddress={member.user.walletAddress}
                status={member.isOnline === false ? 'offline' : 'online'}
              />
            ))}
          </div>
        )}
        
        {/* Regular Members */}
        {regularMembers.length > 0 && (
          <div className="mb-6">
            <div className="text-xs text-gray-500 font-semibold mb-2 px-2">MEMBERS — {regularMembers.length}</div>
            {regularMembers.map(member => (
              <UserListItem 
                key={member.userId} 
                name={member.user.name}
                walletAddress={member.user.walletAddress}
                status={member.isOnline === false ? 'offline' : 'online'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface UserListItemProps {
  name: string;
  isCurrentUser?: boolean;
  role?: 'admin' | 'moderator' | 'member';
  walletAddress?: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
}

function UserListItem({ name, isCurrentUser = false, role, walletAddress, status = 'offline' }: UserListItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Mount check for client-side rendering
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Calculate tooltip position on show
  useEffect(() => {
    if (showTooltip && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.left - 220 // Position to the left with some gap
      });
    }
  }, [showTooltip]);
  
  // Format wallet address
  const formatWallet = (address?: string) => {
    if (!address) return 'No wallet connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Handle role display
  const getRoleBadge = () => {
    if (role === 'admin') {
      return (
        <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-900/50 border border-purple-700/50 text-purple-300 ml-2">
          ADMIN
        </span>
      );
    } else if (role === 'moderator') {
      return (
        <span className="px-1.5 py-0.5 text-[10px] rounded bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 ml-2">
          MOD
        </span>
      );
    }
    return null;
  };
  
  // Handle status indicator color
  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Portal-based tooltip that won't get clipped
  const TooltipPortal = () => {
    if (!isMounted) return null;
    
    return createPortal(
      <div 
        className="fixed z-[9999] bg-black/95 border border-purple-900/40 shadow-lg shadow-purple-900/20 rounded-md p-3 w-52"
        style={{ 
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="flex mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-800 to-indigo-800 flex items-center justify-center text-white font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 overflow-hidden">
            <div className="text-gray-300 font-semibold truncate">{name}</div>
            <div className="text-xs text-gray-500 truncate">{formatWallet(walletAddress)}</div>
          </div>
        </div>
        
        {role && (
          <div className="pt-3 border-t border-purple-900/30">
            <div className="text-xs text-gray-500 mb-2">ROLES</div>
            <div className="flex flex-wrap gap-1">
              {role === 'admin' && (
                <span className="px-2 py-1 text-xs rounded bg-purple-900/50 border border-purple-700/50 text-purple-300">
                  Admin
                </span>
              )}
              {role === 'moderator' && (
                <span className="px-2 py-1 text-xs rounded bg-indigo-900/50 border border-indigo-700/50 text-indigo-300">
                  Moderator
                </span>
              )}
              {role === 'member' && (
                <span className="px-2 py-1 text-xs rounded bg-gray-800 border border-gray-700 text-gray-300">
                  Member
                </span>
              )}
            </div>
          </div>
        )}
      </div>,
      document.body
    );
  };
  
  return (
    <div 
      ref={itemRef}
      className="flex items-center px-2 py-1.5 rounded hover:bg-purple-900/10 group relative transition"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="relative mr-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-800 to-indigo-800 flex items-center justify-center text-white font-medium">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className={`w-3 h-3 rounded-full border-2 border-black ${getStatusColor()} absolute -bottom-0.5 -right-0.5`}></div>
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="text-sm font-medium text-gray-300 truncate flex items-center">
          <span className="truncate">{name}</span>
          {isCurrentUser && <span className="text-xs text-gray-500 ml-2 flex-shrink-0">(you)</span>}
          <span className="flex-shrink-0">{getRoleBadge()}</span>
        </div>
        <div className="text-xs text-gray-500 truncate">{status !== 'offline' ? status : 'offline'}</div>
      </div>
      
      {/* Render tooltip through portal to avoid clipping */}
      {showTooltip && <TooltipPortal />}
    </div>
  );
} 