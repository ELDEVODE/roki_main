"use client";
import { useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import SolanaWalletButton from '../components/SolanaWalletButton';

export default function TokenGatedChatDemo() {
  const { login, authenticated, user } = usePrivy();
  // Use wallet directly from the Privy user object
  const wallet = user?.wallet;
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [userId, setUserId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channel, setChannel] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasTokenAccess, setHasTokenAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Refresh channel data every 3 seconds for demo purposes
  // In production, you would use Supabase realtime
  useEffect(() => {
    if (channelId && userId) {
      const interval = setInterval(() => {
        fetchChannel(channelId);
      }, 3000);
      
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
  
  async function fetchChannel(id: string) {
    try {
      const res = await fetch(`/api/demo/channels?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setChannel(data);
        setMessages(data.messages || []);
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
  
  async function createChannel() {
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
          name: "ZK Token-Gated Channel",
          creatorId: userId 
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
      setChannelId(data.id);
      fetchChannel(data.id);
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
    } catch (err) {
      console.error("Failed to token-gate channel", err);
    } finally {
      setLoading(false);
    }
  }
  
  async function joinChannel() {
    if (!channelId || !userId) return;
    
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
    } catch (err) {
      console.error("Failed to join channel", err);
    } finally {
      setLoading(false);
    }
  }
  
  async function sendMessage() {
    if (!channelId || !userId || !message) return;
    
    try {
      await fetch(`/api/demo/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: message,
          userId
        })
      });
      
      setMessage("");
      fetchChannel(channelId);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }
  
  function shareChannel() {
    const shareUrl = `${window.location.origin}/demo?channel=${channelId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Channel link copied! Share with others to join.");
  }
  
  function isUserMember() {
    if (!channel || !userId) return false;
    return channel.members?.some((m: any) => m.userId === userId);
  }
  
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 max-w-md mx-auto px-6">
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
            <h1 className="text-2xl font-bold mb-4 text-white">ZK Token Channel Demo</h1>
            <p className="text-gray-400 mb-6">Connect your wallet to start</p>
            <button 
              onClick={login}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded text-white"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-24 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">ZK Token Channel Demo</h1>
        <p className="text-gray-400 mb-8">Proof-of-concept for investors</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Panel */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Channel Controls</h2>
            
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-400">Connection Status:</span>
              <p className="font-mono text-xs mt-1">
                Wallet: {wallet ? "Connected" : "Not Connected"}
                {wallet?.address && (
                  <span className="block mt-1 text-green-400 truncate">
                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                  </span>
                )}
              </p>
              <p className="font-mono text-xs mt-1">
                User ID: {userId ? (
                  <span className="text-green-400">{userId.slice(0, 8)}...</span>
                ) : (
                  <span className="text-amber-400">Not registered</span>
                )}
              </p>
            </div>
            
            {!channel ? (
              <button 
                onClick={createChannel}
                disabled={loading || !userId}
                className="w-full py-2 mb-4 bg-purple-600 disabled:bg-gray-700 rounded"
              >
                {loading ? "Creating..." : "Create New Channel"}
              </button>
            ) : (
              <>
                <div className="mb-4 p-3 bg-gray-800 rounded">
                  <span className="text-sm text-gray-400">Channel ID:</span>
                  <p className="font-mono text-green-400">{channelId}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {!channel.isTokenGated && (
                    <button 
                      onClick={tokenGateChannel}
                      disabled={loading}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-gray-700 disabled:to-gray-700 rounded"
                    >
                      {loading ? "Enabling..." : "Enable ZK Token Gate"}
                    </button>
                  )}
                  
                  {channel.isTokenGated && (
                    <div className="p-2 bg-purple-900/30 border border-purple-700 rounded text-center">
                      <span className="text-purple-400">ZK Token Gate Active</span>
                      <p className="text-xs mt-1 text-gray-400">
                        {channel.tokenAddress?.substring(0, 8)}...
                      </p>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={shareChannel}
                  className="w-full py-2 bg-blue-600 rounded flex items-center justify-center mb-4"
                >
                  <span>Share Channel Link</span>
                </button>
                
                <div className="p-3 bg-gray-800 rounded">
                  <h3 className="text-sm font-medium mb-2">Members ({channel.members?.length || 0})</h3>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {channel.members?.map((member: any) => (
                      <div key={member.id} className="text-xs bg-gray-700 p-1 rounded truncate">
                        {member.userId}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* Always show the Solana wallet button */}
            <div className="mt-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Solana Wallet Integration</h3>
              <SolanaWalletButton />
            </div>
          </div>
          
          {/* Channel View */}
          <div className="col-span-2 bg-gray-900/50 rounded-lg border border-gray-800">
            {!channel ? (
              channelId ? (
                <div className="p-8 flex flex-col items-center justify-center h-full">
                  <h3 className="font-medium mb-4">Join this channel?</h3>
                  <button 
                    onClick={joinChannel}
                    disabled={loading || !userId}
                    className="px-6 py-2 bg-green-600 disabled:bg-gray-700 rounded"
                  >
                    {loading ? "Joining..." : "Join Channel"}
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
                  Create or join a channel to start
                </div>
              )
            ) : !isUserMember() ? (
              <div className="p-8 flex flex-col items-center justify-center h-full">
                <h3 className="font-medium mb-4">Join this channel?</h3>
                <button 
                  onClick={joinChannel}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 disabled:bg-gray-700 rounded"
                >
                  {loading ? "Joining..." : "Join Channel"}
                </button>
              </div>
            ) : channel.isTokenGated && !hasTokenAccess ? (
              <div className="p-8 text-center bg-amber-900/20 rounded-lg border border-amber-700/30">
                <h3 className="text-xl font-medium mb-3">ZK Token Required</h3>
                <p className="mb-4">This channel requires a ZK compression token for access.</p>
                <p className="text-sm text-amber-400">Token: {channel.tokenAddress?.slice(0, 8)}...</p>
              </div>
            ) : (
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {channel.name}
                    {channel.isTokenGated && (
                      <span className="ml-2 text-xs bg-purple-600 px-2 py-0.5 rounded-full">
                        ZK TOKEN GATED
                      </span>
                    )}
                  </h2>
                </div>
                
                <div className="bg-gray-800 p-4 rounded mb-4 flex-grow overflow-y-auto min-h-[300px]">
                  {channel.messages && channel.messages.length > 0 ? (
                    <div className="space-y-3">
                      {channel.messages.map((msg: any) => (
                        <div key={msg.id} className="p-3 bg-gray-700 rounded">
                          <div className="text-sm font-medium">
                            {msg.userId === userId ? 'You' : msg.userId.substring(0, 6)}
                          </div>
                          <p>{msg.content}</p>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No messages yet
                    </div>
                  )}
                </div>
                
                <div className="flex">
                  <input 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    type="text" 
                    placeholder="Type message..." 
                    className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-l"
                  />
                  <button 
                    onClick={sendMessage}
                    className="px-4 bg-purple-600 rounded-r"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 