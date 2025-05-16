"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/app/components/layouts/AppLayout";
import ChatHeader from "@/app/components/ChatHeader";
import ChatMessage from "@/app/components/ChatMessage";
import ChatInput from "@/app/components/ChatInput";
import CreateChannelModal from "@/app/components/modals/CreateChannelModal";

function DemoContent() {
  const { login, authenticated, user } = usePrivy();
  // Use wallet directly from the Privy user object
  const wallet = user?.wallet;
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State
  const [userId, setUserId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channel, setChannel] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasTokenAccess, setHasTokenAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userChannels, setUserChannels] = useState<any[]>([]);
  const [createdChannels, setCreatedChannels] = useState<any[]>([]);
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Typing state
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [readReceipts, setReadReceipts] = useState<{[messageId: string]: boolean}>({});
  
  // Log connection state for debugging
  useEffect(() => {
    console.log("Auth state:", { 
      authenticated, 
      hasWallet: !!wallet,
      walletAddress: wallet?.address,
      userId 
    });
  }, [authenticated, wallet, userId]);
  
  // Register user when authenticated
  useEffect(() => {
    if (authenticated && wallet?.address) {
      console.log("Attempting to register user with wallet:", wallet.address);
      registerUser();
    }
  }, [authenticated, wallet?.address]);
  
  // Check for channel in URL
  useEffect(() => {
    const id = searchParams.get('channel');
    if (id) {
      setChannelId(id);
      if (userId) {
        fetchChannel(id);
      }
    }
  }, [searchParams, userId]);
  
  // Fetch user channels when userId is available
  useEffect(() => {
    if (userId && wallet?.address) {
      fetchUserChannels();
    }
  }, [userId, wallet?.address]);
  
  // Refresh channel data every 1 second for faster updates
  // In production, you would use Supabase realtime
  useEffect(() => {
    if (channelId && userId) {
      const interval = setInterval(() => {
        fetchChannel(channelId);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [channelId, userId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Check token access
  useEffect(() => {
    if (channel?.isTokenGated && wallet?.address) {
      checkTokenAccess();
    } else if (!channel?.isTokenGated) {
      setHasTokenAccess(true);
    }
  }, [channel, wallet?.address]);
  
  // Add typing indicator simulation
  useEffect(() => {
    if (!channelId || !isUserTyping) return;
    
    // In a real app, you'd emit this via WebSockets/Supabase Realtime
    console.log(`User ${userId} is typing in channel ${channelId}`);
    
    // For demo, we'll simulate other users typing after a delay
    const simulateOtherUserTyping = setTimeout(() => {
      if (channel?.members && channel.members.length > 1) {
        // Find a random member who is not the current user
        const otherMembers = channel.members.filter((m: any) => m.userId !== userId);
        if (otherMembers.length > 0) {
          const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.add(randomMember.userId);
            return newSet;
          });
          
          // Clear typing indicator after 3 seconds
          setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(randomMember.userId);
              return newSet;
            });
          }, 3000);
        }
      }
    }, 1000);
    
    return () => clearTimeout(simulateOtherUserTyping);
  }, [isUserTyping, channelId, userId, channel?.members]);
  
  // Mark messages as read after a delay
  useEffect(() => {
    if (!messages.length) return;
    
    // For demo purposes, mark messages from others as read after 2 seconds
    const markAsRead = setTimeout(() => {
      const unreadMessages = messages.filter(msg => 
        msg.userId !== userId && // not from current user
        !readReceipts[msg.id] // not already marked as read
      );
      
      if (unreadMessages.length > 0) {
        const newReadReceipts = { ...readReceipts };
        unreadMessages.forEach(msg => {
          newReadReceipts[msg.id] = true;
        });
        setReadReceipts(newReadReceipts);
      }
    }, 2000);
    
    return () => clearTimeout(markAsRead);
  }, [messages, userId, readReceipts]);
  
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  
  async function registerUser() {
    setError(null);
    try {
      console.log("Registering user with data:", {
        walletAddress: wallet?.address,
        name: user?.email?.address || `User-${wallet?.address?.slice(0, 6)}`
      });
      
      const res = await fetch('/api/demo/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: wallet?.address,
          name: user?.email?.address || `User-${wallet?.address?.slice(0, 6)}`
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error registering user:", errorText);
        setError(`Failed to register user: ${res.status} ${errorText}`);
        return;
      }
      
      const userData = await res.json();
      console.log("User registered successfully:", userData);
      setUserId(userData.id);
      
      if (channelId) {
        fetchChannel(channelId);
      }
    } catch (err) {
      console.error("Failed to register user", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  
  async function fetchUserChannels() {
    try {
      if (!wallet?.address) {
        throw new Error("No wallet address available");
      }
      
      if (!userId) {
        console.log("No userId available yet, skipping channel filtering");
        return;
      }
      
      console.log("Fetching channels with userId:", userId);
      
      // Fetch all channels the user is a member of
      const res = await fetch(`/api/demo/users/channels?walletAddress=${wallet?.address}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Failed to fetch channels: ${res.status}${errorData.details ? ` - ${errorData.details}` : ''}`);
      }
      
      const data = await res.json();
      console.log("Fetched channels data:", data);
      console.log("Current userId:", userId);
      
      // Reset these first in case they were empty before
      setCreatedChannels([]);
      setUserChannels([]);
      
      if (data && data.length > 0) {
        // Separate channels into created vs joined
        // Make sure we're comparing strings not objects
        const created = data.filter((channel: any) => 
          channel.creatorId && userId && String(channel.creatorId) === String(userId)
        );
        
        const joined = data.filter((channel: any) => {
          // A channel is joined if user is not the creator but is a member
          const isCreator = channel.creatorId && userId && String(channel.creatorId) === String(userId);
          const isMember = channel.members?.some((m: any) => 
            m.userId && userId && String(m.userId) === String(userId)
          );
          
          return !isCreator && isMember;
        });
        
        console.log("Filtered created channels:", created);
        console.log("Filtered joined channels:", joined);
        
        setCreatedChannels(created);
        setUserChannels(joined);
      }
      
    } catch (err) {
      console.error("Failed to fetch user channels", err);
    }
  }
  
  async function fetchChannel(id: string) {
    try {
      const res = await fetch(`/api/demo/channels?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Channel data received:", data);
        setChannel(data);
        setMessages(data.messages || []);
      } else {
        console.error("Failed to fetch channel:", await res.text());
      }
    } catch (err) {
      console.error("Failed to fetch channel", err);
    }
  }
  
  async function checkTokenAccess() {
    try {
      if (!channel?.tokenAddress || !wallet?.address) return;
      
      const res = await fetch(`/api/demo/channels/${channel.id}/verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet.address })
      });
      
      if (res.ok) {
        const { hasAccess } = await res.json();
        setHasTokenAccess(hasAccess);
      }
    } catch (err) {
      console.error("Failed to check token access", err);
      // For demo, default to access
      setHasTokenAccess(true);
    }
  }
  
  async function handleCreateChannel(name: string, isTokenGated: boolean, tokenAddress?: string) {
    if (!userId) {
      console.error("Cannot create channel: No userId available");
      setError("Please connect your wallet first");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating channel with userId:", userId);
      const res = await fetch('/api/demo/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name,
          creatorId: userId,
          isTokenGated,
          tokenAddress
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        setError(`Failed to create channel: ${res.status} ${errorText}`);
        console.error("Error creating channel:", errorText);
        return;
      }
      
      const data = await res.json();
      console.log("Channel created:", data);
      
      // Close modal
      setIsCreateModalOpen(false);
      
      // Refresh channels and navigate to the new one
      await fetchUserChannels();
      setChannelId(data.id);
      fetchChannel(data.id);
      
      // Update URL without full page refresh
      router.push(`/demo?channel=${data.id}`);
      
    } catch (err) {
      console.error("Failed to create channel", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }
  
  async function tokenGateChannel() {
    if (!channelId) return;
    
    setLoading(true);
    try {
      // Example devnet token address
      const tokenAddress = "cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn";
      
      await fetch(`/api/demo/channels/${channelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isTokenGated: true,
          tokenAddress
        })
      });
      
      fetchChannel(channelId);
      fetchUserChannels();
    } catch (err) {
      console.error("Failed to token-gate channel", err);
    } finally {
      setLoading(false);
    }
  }
  
  async function joinChannel() {
    if (!channelId || !userId) return;
    
    // Prompt for username
    const username = prompt("Enter your display name:", user?.email?.address || `User-${wallet?.address?.slice(0, 6)}`);
    if (!username) {
      return; // User canceled
    }
    
    // Update user's name
    try {
      await fetch('/api/demo/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          name: username 
        })
      });
    } catch (error) {
      console.error("Failed to update username", error);
      // Continue anyway since this is not critical
    }
    
    setLoading(true);
    try {
      await fetch(`/api/demo/channels/${channelId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          walletAddress: wallet?.address
        })
      });
      
      fetchChannel(channelId);
      fetchUserChannels();
    } catch (err) {
      console.error("Failed to join channel", err);
    } finally {
      setLoading(false);
    }
  }
  
  async function sendMessage(content: string) {
    if (!channelId || !userId || !content) return;
    
    // Clear typing indicator when sending
    setIsUserTyping(false);
    
    try {
      await fetch(`/api/demo/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content,
          userId
        })
      });
      
      // In production, you'd use Supabase realtime and not need to fetch
      // But we keep this for the demo
      fetchChannel(channelId);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }
  
  function shareChannel() {
    if (channelId) {
      navigator.clipboard.writeText(`${window.location.origin}/demo?channel=${channelId}`);
      alert("Channel link copied to clipboard!");
    }
  }
  
  function isUserMember() {
    if (!channel || !userId) return false;
    return channel.members?.some((m: any) => m.userId === userId);
  }
  
  // Format members for UserList component
  const formatMembers = () => {
    if (!channel?.members) return [];
    
    return channel.members.map((member: any) => ({
      userId: member.userId,
      user: {
        id: member.userId,
        name: member.user?.name || 'Unknown User',
        walletAddress: member.user?.walletAddress
      },
      role: member.userId === channel.creatorId ? 'admin' : 'member',
      isOnline: true // For demo purposes
    }));
  };
  
  const handleChannelSelect = (id: string) => {
    router.push(`/demo?channel=${id}`);
  };
  
  // Format typing indicators
  const getTypingIndicator = () => {
    if (!typingUsers.size) return null;
    
    const typingUsersList = Array.from(typingUsers).map(userId => {
      const member = channel?.members?.find((m: any) => m.userId === userId);
      return member?.user?.name || 'Someone';
    });
    
    if (typingUsersList.length === 1) {
      return `${typingUsersList[0]} is typing...`;
    } else if (typingUsersList.length === 2) {
      return `${typingUsersList[0]} and ${typingUsersList[1]} are typing...`;
    } else {
      return 'Several people are typing...';
    }
  };
  
  const handleUserTypingStart = () => {
    setIsUserTyping(true);
  };
  
  const handleUserTypingStop = () => {
    setIsUserTyping(false);
  };
  
  // If not authenticated, we let the AppLayout handle it
  if (!authenticated) {
    return null;
  }
  
  return (
    <AppLayout 
      showUserList={!!channelId && !!channel}
      userChannels={userChannels}
      createdChannels={createdChannels}
      activeChannelId={channelId}
      onChannelSelect={handleChannelSelect}
      onCreateChannel={() => setIsCreateModalOpen(true)}
      members={formatMembers()}
      currentUserId={userId}
    >
      {/* Main content area with channel content */}
      {channelId ? (
        <>
          {/* Channel header */}
          <ChatHeader 
            channelName={channel?.name || 'Loading...'}
            memberCount={channel?.members?.length || 0}
            isTokenGated={channel?.isTokenGated}
            onShareClick={shareChannel}
            onAddMemberClick={() => {
              alert("Invite feature would open here");
            }}
            onSettingsClick={channel?.creatorId === userId ? tokenGateChannel : undefined}
          />
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/60 px-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="bg-purple-900/20 rounded-full p-6 mb-4 neon-purple-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 neon-text">No messages yet</h3>
                <p className="text-gray-400 max-w-md mb-6">
                  Start the conversation by sending the first message in this channel.
                </p>
                
                {!isUserMember() && (
                  <button
                    onClick={joinChannel}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center gap-2 transition neon-purple-glow"
                          disabled={loading}
                  >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                          Join Channel
                  </button>
                )}
              </div>
            ) : (
              <div className="py-4">
                {/* Welcome message */}
                <div className="mb-6 pb-6 border-b border-purple-900/30">
                  <div className="text-center">
                    <div className="bg-purple-900/20 rounded-full inline-flex p-4 mb-3 mx-auto neon-purple-glow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome to #{channel?.name}</h3>
                    <p className="text-gray-400 max-w-lg mx-auto mb-3">
                      This is the start of the channel. {channel?.isTokenGated ? 'This channel is token-gated, meaning only users with the right tokens can access it.' : ''}
                    </p>
                    {!isUserMember() && (
                      <button
                        onClick={joinChannel}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md text-sm font-medium text-white inline-flex items-center shadow-lg shadow-purple-500/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        Join Channel
                      </button>
                                )}
                              </div>
                            </div>
                
                {/* Regular messages */}
                {messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id}
                    id={msg.id}
                    content={msg.content}
                    createdAt={msg.createdAt}
                    userId={msg.userId}
                    user={msg.user || { name: 'Unknown User', id: msg.userId }}
                    currentUserId={userId}
                    isRead={readReceipts[msg.id] || msg.userId === userId}
                  />
                ))}
                      <div ref={messagesEndRef}></div>
                
                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                  <div className="px-4 py-2 text-sm text-purple-300">
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                      </span>
                      <span>{getTypingIndicator()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
                    </div>
                    
                    {/* Message input */}
          <ChatInput 
            onSendMessage={sendMessage}
            disabled={!isUserMember() || !hasTokenAccess}
            channelName={channel?.name || ''}
            onTypingStart={handleUserTypingStart}
            onTypingStop={handleUserTypingStop}
          />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="bg-purple-900/20 rounded-full p-6 mb-6 neon-purple-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
          <h3 className="text-2xl font-bold text-white mb-3 neon-text">No Channel Selected</h3>
          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            Create a new channel or select an existing one to start chatting with your community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
                      <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center gap-2 transition neon-purple-glow"
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Create Channel
                      </button>
                      
            <Link href="/demo/explore">
              <div className="px-6 py-3 bg-purple-900/20 hover:bg-purple-900/30 rounded-lg text-white font-medium flex items-center gap-2 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                Browse Channels
              </div>
                      </Link>
                    </div>
                  </div>
                )}
      
      {/* Modals */}
      <CreateChannelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateChannel={handleCreateChannel}
        isLoading={loading}
      />
      
      {/* Error display */}
      {error && (
        <div className="fixed bottom-4 right-4 p-4 bg-purple-900/80 border border-purple-700 rounded-lg text-white shadow-lg shadow-purple-900/20 max-w-md">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium mb-1">Error</p>
              <p className="text-sm">{error}</p>
              </div>
            <button 
              className="ml-auto text-white/80 hover:text-white transition" 
              onClick={() => setError(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
                  </div>
                </div>
              )}
    </AppLayout>
  );
}

// Wrap with Suspense to handle async dependencies like useSearchParams
export default function TokenGatedChatDemo() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-black text-white">Loading...</div>}>
      <DemoContent />
    </Suspense>
  );
} 