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
import UsernameModal from "@/app/components/modals/UsernameModal";
import ChannelInfoContent from "@/app/components/ChannelInfoContent";
import { motion } from "framer-motion";
import InviteModal from '../components/modals/InviteModal';
import { useToast } from '../context/ToastContext';

// Define ChannelFormData interface to match what CreateChannelModal sends
interface ChannelFormData {
  name: string;
  icon?: string;
  type?: string;
}

// Cache utilities
const CACHE_PREFIX = 'channel_messages_';
const FIRST_VISIT_PREFIX = 'first_visit_';
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getMessageCache(channelId: string) {
  try {
    const cacheKey = `${CACHE_PREFIX}${channelId}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { messages, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // Check if cache is still valid (within TTL)
      if (now - timestamp < CACHE_TTL) {
        return messages;
      }
    }
  } catch (err) {
    console.error("Error reading from cache", err);
  }
  
  return null;
}

function setMessageCache(channelId: string, messages: any[]) {
  try {
    const cacheKey = `${CACHE_PREFIX}${channelId}`;
    const cacheData = {
      messages,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (err) {
    console.error("Error writing to cache", err);
  }
}

function DemoContent() {
  const { login, authenticated, user, ready } = usePrivy();
  // Use wallet directly from the Privy user object
  const wallet = user?.wallet;
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Debug logs for authentication
  useEffect(() => {
    console.log("🔍 Demo Auth Debug:", { 
      ready,
      authenticated, 
      user: !!user,
      wallet: !!wallet,
      walletAddress: wallet?.address || 'none',
      channelParam: searchParams.get('channel') || 'none'
    });
  }, [ready, authenticated, user, wallet, searchParams]);
  
  // Check for channel in URL params
  const channelParam = searchParams.get('channel');
  const subchannelParam = searchParams.get('subchannel');
  
  // New effect to handle authentication redirect
  useEffect(() => {
    // If user is not authenticated and there's a channel param, show login prompt
    if (!authenticated && channelParam) {
      // We could also redirect to the invite page if we have an invite code
      console.log("User not authenticated but trying to access a channel");
    }
  }, [authenticated, channelParam]);
  
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
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for tracking refresh status
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasViewedBottom, setHasViewedBottom] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null); // To track newest message
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const viewParam = searchParams?.get('view');
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Typing state
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [readReceipts, setReadReceipts] = useState<{[messageId: string]: boolean}>({});
  
  // Add this state to track the collapsed state of the members panel
  const [isMembersPanelCollapsed, setIsMembersPanelCollapsed] = useState(false);
  
  // Use a ref to track if we've initialized from cache
  const initializedFromCacheRef = useRef(false);
  
  // Add the state variable for the invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Add state for the username modal
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [joiningChannelId, setJoiningChannelId] = useState<string | null>(null);
  
  // Add useToast hook
  const { showToast } = useToast();
  
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
      // Only register if userId is not already set
      if (!userId) {
        registerUser();
      } else {
        console.log("User already registered with ID:", userId);
      }
    }
  }, [authenticated, wallet?.address]);
  
  // Check for channel in URL
  useEffect(() => {
    const id = searchParams.get('channel');
    if (id) {
      setChannelId(id);
      // Reset states on channel change
      setIsInitialLoad(true);
      setMessagesLoading(true);
      setInitialLoadComplete(false);
      setLastMessageId(null);
      
      if (userId) {
        // Try to load from cache first
        const cachedMessages = typeof window !== 'undefined' ? getMessageCache(id) : null;
        if (cachedMessages && cachedMessages.length > 0) {
          console.log("Using cached messages for channel:", id);
          setMessages(cachedMessages);
          setMessagesLoading(false);
          setInitialLoadComplete(true);
          setIsInitialLoad(false);
          
          // Get the newest message ID for incremental updates
          const newestMessage = [...cachedMessages].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          if (newestMessage) {
            setLastMessageId(newestMessage.id);
          }
          
          // Still fetch fresh data but don't show the loading animation
          fetchChannel(id, false);
        } else {
          // No cache, do a regular fetch with loading animation
          fetchChannel(id, true);
        }
      }
    } else {
      // Only set not loading if no channel selected
      setMessagesLoading(false);
      setInitialLoadComplete(true);
      setIsInitialLoad(false);
    }
  }, [searchParams, userId]);
  
  // Fetch user channels when userId is available
  useEffect(() => {
    if (userId && wallet?.address) {
      fetchUserChannels();
    }
  }, [userId, wallet?.address]);
  
  // Refresh channel data every 3 seconds for faster updates - without showing loading
  useEffect(() => {
    if (channelId && userId && initialLoadComplete) {
      const interval = setInterval(() => {
        // Use a different function for polling that doesn't trigger loading state
        refreshChannel(channelId);
      }, 3000); // Increased to 3 seconds to reduce server load
      
      return () => clearInterval(interval);
    }
  }, [channelId, userId, initialLoadComplete]);
  
  // Handle scroll position detection more precisely
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // Consider "at bottom" when within 50px of the bottom
        const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
        setIsAtBottom(atBottom);
        
        // Mark as having viewed bottom when we're at the bottom
        if (atBottom && !hasViewedBottom) {
          setHasViewedBottom(true);
        }
      }
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Check position immediately
      
      // For mobile browser resize issues
      window.addEventListener('resize', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [hasViewedBottom, messagesLoading]);
  
  // Only scroll to bottom automatically in specific conditions
  useEffect(() => {
    // When the user sends a message, scroll to bottom
    if (messages.length && isAtBottom) {
      scrollToBottom();
    }
    
    if (!messagesLoading && messages.length > 0 && !initialLoadComplete) {
      // First successful load with messages
      setInitialLoadComplete(true);
      setIsInitialLoad(false);
      // First time we load messages, scroll to bottom
      setTimeout(scrollToBottom, 100);
      setHasViewedBottom(true);
    } else if (!messagesLoading && messages.length === 0 && !initialLoadComplete) {
      // First load complete but no messages
      setInitialLoadComplete(true);
      setIsInitialLoad(false);
    }
  }, [messages, messagesLoading, isAtBottom, initialLoadComplete]);
  
  // Check token access
  useEffect(() => {
    const hasTokenGatedSubchannels = channel?.subchannels?.some((sc: any) => sc.isTokenGated);
    
    if (hasTokenGatedSubchannels && wallet?.address) {
      checkTokenAccess();
    } else if (!hasTokenGatedSubchannels) {
      setHasTokenAccess(true);
    }
  }, [channel, wallet?.address]);
  
  // Reset typing users when changing channels
  useEffect(() => {
    if (channelId) {
      setTypingUsers(new Set());
    }
  }, [channelId]);
  
  // Check for first visit to channel
  useEffect(() => {
    if (channelId && typeof window !== 'undefined') {
      // Check if this is the user's first visit to this channel
      const firstVisitKey = `${FIRST_VISIT_PREFIX}${channelId}`;
      const hasVisited = localStorage.getItem(firstVisitKey);
      
      if (!hasVisited) {
        // Mark as first visit and redirect to info page
        setIsFirstVisit(true);
        // Only redirect if not already on info page
        if (viewParam !== 'info') {
          router.push(`/demo?channel=${channelId}&view=info`);
        }
        // Mark channel as visited for future
        localStorage.setItem(firstVisitKey, 'visited');
      } else {
        setIsFirstVisit(false);
      }
    }
  }, [channelId, viewParam, router]);
  
  // Handle typing indicator simulation
  useEffect(() => {
    if (!channelId || !isUserTyping || !userId) return;
    
    // This effect only simulates OTHER users typing after the current user types
    // It should NEVER add the current user to the typing list
    
    // For demo, simulate other users typing after a delay
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
  
  // Mark messages as read after a delay, but only for messages from others
  useEffect(() => {
    if (!messages.length || !userId) return;
    
    // For demo purposes, mark messages from others as read after 2 seconds
    const markAsRead = setTimeout(() => {
      const unreadMessages = messages.filter(msg => 
        msg.userId !== userId && // messages NOT from current user
        !readReceipts[msg.id] // not already marked as read
      );
      
      if (unreadMessages.length > 0) {
        const newReadReceipts = { ...readReceipts };
        unreadMessages.forEach(msg => {
          // In a real app, you would only update this on the server when
          // a user has actually seen the message (scroll position etc.)
          newReadReceipts[msg.id] = true;
        });
        setReadReceipts(newReadReceipts);
      }
    }, 2000);
    
    return () => clearTimeout(markAsRead);
  }, [messages, userId, readReceipts]);
  
  // Initialize from cache on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !initializedFromCacheRef.current && channelId) {
      const cachedMessages = getMessageCache(channelId);
      if (cachedMessages && cachedMessages.length > 0) {
        console.log("Initializing from cache on mount:", cachedMessages.length, "messages");
        setMessages(cachedMessages);
        initializedFromCacheRef.current = true;
      }
    }
  }, [channelId]);
  
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
        setMessagesLoading(true);
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
  
  // The original fetch function - shows loading based on parameter
  async function fetchChannel(id: string, showLoading: boolean = true) {
    // Only set loading to true if we should show loading
    if (showLoading) {
      setMessagesLoading(true);
    }
    
    try {
      const res = await fetch(`/api/demo/channels?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Channel data received:", data);
        setChannel(data);
        
        // Check if the user is a member and update token access
        const isMember = data.members?.some((m: any) => 
          String(m.userId) === String(userId)
        );
        
        // If user is a member, they should have access to send messages
        if (isMember) {
          setHasTokenAccess(true);
        } else {
          // If not a member, check token access separately
          checkTokenAccess();
        }
        
        const newMessages = data.messages || [];
        setMessages(newMessages);
        
        // Cache the messages
        if (typeof window !== 'undefined' && newMessages.length > 0) {
          setMessageCache(id, newMessages);
          
          // Update the last message ID
          const newestMessage = [...newMessages].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          if (newestMessage) {
            setLastMessageId(newestMessage.id);
          }
        }
        
        // Set loading to false after data is received
        setMessagesLoading(false);
        setIsInitialLoad(false);
        setInitialLoadComplete(true);
      } else {
        console.error("Failed to fetch channel:", await res.text());
        setMessagesLoading(false);
        setIsInitialLoad(false);
        setInitialLoadComplete(true);
      }
    } catch (err) {
      console.error("Failed to fetch channel", err);
      setMessagesLoading(false);
      setIsInitialLoad(false);
      setInitialLoadComplete(true);
    }
  }
  
  // Update the sendMessage function to ensure messages stay visible and properly cached
  async function sendMessage(content: string) {
    if (!channelId || !userId || !content) return;
    
    // Get the active subchannel ID from the channel data or URL params
    const subchannelId = searchParams.get('subchannel') || channel?.activeSubchannelId;
    
    // Clear typing indicator when sending
    setIsUserTyping(false);
    
    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // Create temporary message with pending status
    const tempMessage = {
      id: tempId,
      content,
      createdAt: timestamp,
      userId,
      user: { name: user?.email?.address || `User-${wallet?.address?.slice(0, 6)}`, id: userId },
      isPending: true
    };
    
    // Add optimistic message to the UI immediately
    const newMessages = [...messages, tempMessage];
    setMessages(newMessages);
    
    // Update cache immediately so the message stays visible
    if (typeof window !== 'undefined') {
      setMessageCache(channelId, newMessages);
    }
    
    // Force scrolling to bottom when user sends a message
    setIsAtBottom(true);
    scrollToBottom();
    
    try {
      // Send the actual message to the server
      const response = await fetch(`/api/demo/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content,
          userId,
          subchannelId // Include the active subchannel ID
        })
      });
      
      if (response.ok) {
        // Get the confirmed message ID from the server response if available
        let confirmedMessageId = null;
        try {
          const responseData = await response.json();
          confirmedMessageId = responseData.id;
        } catch (e) {
          // If we can't parse the response, that's ok, we'll just update status
        }
        
        // Immediately update the message status to sent (not pending)
        const updatedMessages = messages.map(msg => 
          msg.id === tempId 
            ? { 
                ...msg, 
                isPending: false,
                id: confirmedMessageId || msg.id // Use the server ID if available
              } 
            : msg
        );
        
        setMessages(updatedMessages);
        
        // Update cache with the confirmed message
        if (typeof window !== 'undefined') {
          setMessageCache(channelId, updatedMessages);
        }
      } else {
        // Message failed to send
        const errorMessages = messages.map(msg => 
          msg.id === tempId 
            ? { ...msg, hasError: true, isPending: false } 
            : msg
        );
        
        setMessages(errorMessages);
        
        // Update cache with the error state
        if (typeof window !== 'undefined') {
          setMessageCache(channelId, errorMessages);
        }
      }
    } catch (err) {
      console.error("Failed to send message", err);
      
      // Update the temporary message to show error state
      const errorMessages = messages.map(msg => 
        msg.id === tempId 
          ? { ...msg, hasError: true, isPending: false } 
          : msg
      );
      
      setMessages(errorMessages);
      
      // Update cache with the error state
      if (typeof window !== 'undefined') {
        setMessageCache(channelId, errorMessages);
      }
    }
  }
  
  // New function for polling updates - with minimal loading indicator only for large changes
  async function refreshChannel(id: string) {
    // Don't refresh while initial loading is happening
    if (messagesLoading || !initialLoadComplete) return;
    
    // Get the current subchannel from URL or state
    const activeSubchannel = searchParams.get('subchannel') || channel?.activeSubchannelId;
    
    try {
      // Include the active subchannel in the request if available
      const url = activeSubchannel 
        ? `/api/demo/channels?id=${id}&subchannelId=${activeSubchannel}`
        : `/api/demo/channels?id=${id}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        
        // Get new messages from server
        const serverMessages = data.messages || [];
        
        // Filter out any pending messages that don't belong to the current user to avoid duplicates
        const currentMessages = messages.filter((msg: any) => {
          if (msg.isPending) {
            return msg.userId === userId; // Only keep pending messages from the current user
          }
          return true; // Keep all other messages
        });
        
        // Get message IDs for comparing
        const currentIds = new Set(currentMessages.map((m: any) => m.id));
        const serverIds = new Set(serverMessages.map((m: any) => m.id));
        
        // Find new messages that don't exist in our current state
        const newServerMessages = serverMessages.filter((msg: any) => !currentIds.has(msg.id));
        
        // Calculate differences for determining if this is a bulk update
        const addedMessageIds = Array.from(serverIds).filter(id => !currentIds.has(id));
        const removedMessageIds = Array.from(currentIds).filter(
          id => !serverIds.has(id) && !id.toString().startsWith('temp-')
        );
        
        // Determine if there are changes worth updating
        const hasNewMessages = newServerMessages.length > 0;
        const channelDetailsChanged = 
          data.name !== channel?.name || 
          data.isTokenGated !== channel?.isTokenGated || 
          JSON.stringify(data.members) !== JSON.stringify(channel?.members);
        
        // Calculate if changes are substantial enough to show indicator
        const hasSubstantialChanges = 
          // More than 3 new messages
          addedMessageIds.length > 3 || 
          // Any message removal
          removedMessageIds.length > 0 ||
          // Channel details changed (name, token-gating, or members)
          channelDetailsChanged;
        
        // Update if we have changes
        if (hasNewMessages || channelDetailsChanged) {
          // Only show refresh indicator for substantial changes
          if (hasSubstantialChanges) {
            setIsRefreshing(true);
            
            // Hide refresh indicator after a delay
            setTimeout(() => {
              setIsRefreshing(false);
            }, 300);
          }
          
          // Update messages if there are new ones
          if (hasNewMessages) {
            // Merge current messages with new ones
            const mergedMessages = [...currentMessages, ...newServerMessages].sort(
              (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            
            // Deduplicate based on ID
            const messageLookup = new Map();
            mergedMessages.forEach((msg: any) => {
              // Always prefer non-pending version of a message
              if (!messageLookup.has(msg.id) || msg.isPending === false) {
                messageLookup.set(msg.id, msg);
              }
            });
            
            const uniqueMessages = Array.from(messageLookup.values());
            
            // Sort messages by time
            uniqueMessages.sort((a: any, b: any) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            
            setMessages(uniqueMessages);
            
            // Cache the updated messages
            if (typeof window !== 'undefined') {
              setMessageCache(id, uniqueMessages);
              
              // Update the last message ID
              const newestMessage = uniqueMessages.length > 0 ? uniqueMessages[uniqueMessages.length - 1] : null;
              if (newestMessage) {
                setLastMessageId(newestMessage.id);
              }
            }
          }
          
          // Update channel if details changed
          if (channelDetailsChanged) {
            setChannel(data);
          }
        }
      } else {
        console.error("Failed to refresh channel:", await res.text());
      }
    } catch (err) {
      console.error("Failed to refresh channel", err);
    }
  }
  
  async function checkTokenAccess() {
    try {
      if (!channelId || !wallet?.address) return;
      
      const res = await fetch(`/api/demo/channels/${channelId}/verification`, {
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
  
  async function handleCreateChannel(channelData: ChannelFormData) {
    // Debug the userId value
    console.log("Current userId when creating channel:", {userId, walletAddress: wallet?.address});
    
    if (!userId) {
      console.error("Cannot create channel: No userId available");
      setError("Please connect your wallet first");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating channel with userId:", userId);
      // Make sure userId is passed correctly
      console.log(`Creating channel with userId: ${userId}`);
      
      const res = await fetch('/api/demo/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: channelData.name,
          userId
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
      setMessagesLoading(true);
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
      
      // Get the 'general' subchannel id
      const generalSubchannel = channel?.subchannels?.find((sc: any) => sc.name === 'general');
      if (!generalSubchannel) {
        setError("Could not find general subchannel");
        return;
      }
      
      // Update the subchannel to be token gated
      await fetch(`/api/demo/channels/${channelId}/subchannels/${generalSubchannel.id}`, {
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
      console.error("Failed to token-gate subchannel", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }
  
  async function joinChannel() {
    if (!channelId || !userId) return;
    
    // Open the username modal instead of using prompt
    const defaultUsername = user?.email?.address?.split('@')[0] || `User-${wallet?.address?.slice(0, 6)}`;
    setJoiningChannelId(channelId);
    setShowUsernameModal(true);
  }
  
  // Function to complete the join process with the provided username
  async function completeJoinChannel(username: string) {
    if (!joiningChannelId || !userId) return;
    
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
      const joinResponse = await fetch(`/api/demo/channels/${joiningChannelId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          walletAddress: wallet?.address
        })
      });
      
      const joinData = await joinResponse.json();
      console.log("Channel join response:", joinData);
      
      // Debug logging for membership after join
      const membershipDebug = await fetch(`/api/demo/channels/${joiningChannelId}/debug-membership?userId=${userId}`);
      if (membershipDebug.ok) {
        const debugData = await membershipDebug.json();
        console.log("Membership debug data:", debugData);
      }
      
      fetchChannel(joiningChannelId);
      fetchUserChannels();
      showToast(`You have joined the channel successfully!`, 'success');
    } catch (err) {
      console.error("Failed to join channel", err);
      showToast("Failed to join channel", 'error');
    } finally {
      setLoading(false);
      setJoiningChannelId(null);
    }
  }
  
  function shareChannel() {
    if (channelId) {
      navigator.clipboard.writeText(`${window.location.origin}/demo?channel=${channelId}`);
      showToast("Channel link copied to clipboard!", "success");
    }
  }
  
  function isUserMember() {
    if (!channel || !userId) return false;
    
    // Add debug logging to help diagnose issues
    console.log("isUserMember check:", { 
      currentUserId: userId, 
      channelMemberIds: channel.members?.map((m: any) => m.userId),
      memberCount: channel.members?.length || 0
    });
    
    // Ensure we're comparing strings (not objects)
    return channel.members?.some((m: any) => 
      String(m.userId) === String(userId)
    );
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
    // Find the channel to check its subchannels
    const selectedChannel = [...userChannels, ...createdChannels].find(c => c.id === id);
    
    // For first-time visits, store in a variable if we want to direct users to info page
    const firstVisitToChannel = !localStorage.getItem(`${FIRST_VISIT_PREFIX}${id}`);
    
    if (firstVisitToChannel) {
      // First time users get the info page
      router.push(`/demo?channel=${id}&view=info`);
      // Mark the channel as visited for future reference
      localStorage.setItem(`${FIRST_VISIT_PREFIX}${id}`, 'visited');
    } else if (selectedChannel) {
      // Find the "general" subchannel if it exists
      const generalSubchannel = selectedChannel.subchannels?.find(
        (sub: any) => sub.name.toLowerCase() === 'general'
      );
      
      if (generalSubchannel) {
        // Route to general subchannel
        router.push(`/demo?channel=${id}&subchannel=${generalSubchannel.id}`);
      } else if (selectedChannel.subchannels?.length > 0) {
        // If no general subchannel, use the first one
        router.push(`/demo?channel=${id}&subchannel=${selectedChannel.subchannels[0].id}`);
      } else {
        // If no subchannels, just go to the channel
        router.push(`/demo?channel=${id}`);
      }
    } else {
      // If we can't find the channel in our state, just navigate to it
      router.push(`/demo?channel=${id}`);
    }
  };
  
  // Format typing indicators
  const getTypingIndicator = () => {
    // Only get typing users who are NOT the current user
    const filteredTypingUsers = Array.from(typingUsers).filter(id => id !== userId);
    
    if (filteredTypingUsers.length === 0) return null;
    
    const typingUsersList = filteredTypingUsers.map(id => {
      const member = channel?.members?.find((m: any) => m.userId === id);
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
  
  // Check if there are any other users typing (not including current user)
  const hasOtherUsersTyping = () => {
    return Array.from(typingUsers).some(id => id !== userId);
  };
  
  const handleUserTypingStart = () => {
    setIsUserTyping(true);
  };
  
  const handleUserTypingStop = () => {
    setIsUserTyping(false);
  };
  
  // In the formatMembers function or elsewhere in the component, add a toggle function
  const toggleMembersPanel = () => {
    setIsMembersPanelCollapsed(!isMembersPanelCollapsed);
  };
  
  // Check if the user is an admin of the current channel
  const isUserAdmin = () => {
    if (!channel || !userId) return false;
    return channel.creatorId === userId || channel.members?.some((m: any) => m.userId === userId && m.role === 'admin');
  };
  
  // If not authenticated, show login prompt if accessing a channel, otherwise return null
  if (!authenticated) {
    if (channelParam) {
      // User is trying to access a specific channel but isn't authenticated
      return (
        <AppLayout
          userChannels={[]}
          createdChannels={[]}
          onChannelSelect={() => {}}
          onCreateChannel={() => {}}
          activeChannelId=""
          showUserList={false}
          members={[]}
          themedHeaderBorder={false}
          isAdmin={false}
        >
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-purple-900/20 rounded-full p-6 mb-6 neon-purple-glow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 neon-text">Login Required</h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              Connect your wallet to access this channel. You've been invited to join a conversation!
            </p>
            <button
              onClick={login}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center gap-2 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
              </svg>
              Connect Wallet
            </button>
          </div>
        </AppLayout>
      );
    }
    return null;
  }
  
  return (
    <AppLayout 
      showUserList={!!channelId && !!channel && !isMembersPanelCollapsed}
      userChannels={userChannels}
      createdChannels={createdChannels}
      activeChannelId={channelId}
      onChannelSelect={handleChannelSelect}
      onCreateChannel={() => {
        if (userId) {
          setIsCreateModalOpen(true);
        } else {
          showToast("Please wait, still registering your account...", "warning");
        }
      }}
      members={formatMembers()}
      currentUserId={userId}
      themedHeaderBorder={true}
      isAdmin={isUserAdmin()}
    >
      {/* Main content area with channel content */}
      {channelId ? (
        <>
          {/* Channel header */}
          <ChatHeader 
            channelName={channel?.name || (messagesLoading ? 'Loading...' : 'Unknown Channel')}
            memberCount={channel?.members?.length || 0}
            isTokenGated={channel?.subchannels?.some((sc: any) => sc.isTokenGated) || false}
            onShareClick={shareChannel}
            onAddMemberClick={() => {
              setShowInviteModal(true);
            }}
            onSettingsClick={channel?.creatorId === userId ? tokenGateChannel : undefined}
            onToggleCollapse={toggleMembersPanel}
            isCollapsed={isMembersPanelCollapsed}
            isLoading={messagesLoading}
          />
          
          {/* Info Content or Messages */}
          {viewParam === 'info' ? (
            <ChannelInfoContent channel={channel} />
          ) : (
            <>
              {/* Messages area */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto custom-scrollbar bg-black/60 px-2 relative"
              >
                {/* Small refreshing indicator - shown when fetching new messages only */}
                {isRefreshing && !messagesLoading && (
                  <div className="sticky top-0 left-0 right-0 z-10 flex justify-center">
                    <div className="bg-purple-900/90 backdrop-blur-sm px-3 py-1.5 rounded-b-lg shadow-lg flex items-center space-x-2 text-xs text-purple-100">
                      <div className="w-3 h-3 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-t-purple-300 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                      </div>
                      <span>Updating...</span>
                    </div>
                  </div>
                )}
                
                {messagesLoading ? (
                  // Enhanced Loading Animation (standalone, not an overlay) - only shown on initial load
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                      <div className="absolute inset-2 rounded-full border-4 border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{animationDuration: '0.75s'}}></div>
                    </div>
                    <p className="text-purple-300 font-medium text-lg mb-2">Loading messages...</p>
                    <p className="text-purple-400/60 text-sm">Getting the latest conversations</p>
                  </div>
                ) : !messagesLoading && initialLoadComplete && messages.length === 0 ? (
                  // No messages state - only shown after loading is complete and there are no messages
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
                ) : !messagesLoading && messages.length > 0 ? (
                  // Has messages state - only shown when not loading and there are messages
                  <div className="py-4">
                    {/* Welcome message - only show on first visit to a channel */}
                    {channel && initialLoadComplete && (
                      <div className="mb-6 pb-6 border-b border-purple-900/30">
                        <div className="text-center">
                          <div className="bg-purple-900/20 rounded-full inline-flex p-4 mb-3 mx-auto neon-purple-glow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Welcome to #{channel?.name}</h3>
                          <p className="text-gray-400 max-w-lg mx-auto mb-3">
                            This is the start of the channel. {channel?.subchannels?.some((sc: any) => sc.isTokenGated) ? 'This channel has token-gated subchannels, meaning only users with the right tokens can access certain content.' : ''}
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
                    )}
                    
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
                        isRead={msg.userId === userId ? false : readReceipts[msg.id]}
                        isPending={msg.isPending}
                        hasError={msg.hasError}
                      />
                    ))}
                    <div ref={messagesEndRef}></div>
                    
                    {/* Typing indicator - only shown if others are typing */}
                    {hasOtherUsersTyping() && (
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
                ) : null}
                
                {/* Scroll to bottom button - positioned inside the messages container */}
                {!isAtBottom && messages.length > 0 && !messagesLoading && (
                  <div className="sticky bottom-6 mr-4 flex justify-end pointer-events-none">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={scrollToBottom}
                      className="bg-purple-600 text-white p-2.5 rounded-full shadow-lg shadow-purple-900/40 hover:bg-purple-500 transition-colors z-30 pointer-events-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" transform="rotate(180, 10, 10)" />
                      </svg>
                    </motion.button>
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <ChatInput 
                onSendMessage={sendMessage}
                disabled={!hasTokenAccess}
                channelName={channel?.name || ''}
                onTypingStart={handleUserTypingStart}
                onTypingStop={handleUserTypingStop}
              />
            </>
          )}
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
              disabled={loading || !userId}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2h-1a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
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
      
      {/* Invite Modal */}
      {channel && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          channelId={channel.id}
          channelName={channel.name}
        />
      )}
      
      {/* Username Modal */}
      <UsernameModal 
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSubmit={completeJoinChannel}
        defaultUsername={user?.email?.address?.split('@')[0] || `User-${wallet?.address?.slice(0, 6) || 'new'}`}
      />
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