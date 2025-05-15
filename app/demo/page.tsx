"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import SolanaWalletButton from '../components/SolanaWalletButton';

function DemoContent() {
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
    if (channelId) {
      navigator.clipboard.writeText(`${window.location.origin}/demo?channel=${channelId}`);
      alert("Channel link copied to clipboard!");
    }
  }
  
  function isUserMember() {
    if (!channel || !userId) return false;
    return channel.members?.some((m: any) => m.userId === userId);
  }
  
  // Rest of your component implementation
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">ZK Token-Gated Chat Demo</h1>
            
            {/* Wallet Connection */}
            <div>
              {!authenticated ? (
                <button
                  onClick={() => login()}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Connect Wallet
                </button>
              ) : (
                <SolanaWalletButton />
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-800 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Channel Creation */}
          {authenticated && !channelId && (
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Create a New Channel</h2>
              <button
                onClick={createChannel}
                disabled={loading || !userId}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Channel"}
              </button>
            </div>
          )}
          
          {/* Channel UI */}
          {channelId && channel && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-700 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{channel.name}</h2>
                  <p className="text-sm text-gray-300">
                    {channel.isTokenGated 
                      ? "🔒 Token-gated channel" 
                      : "🔓 Public channel"}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {!channel.isTokenGated && (
                    <button
                      onClick={tokenGateChannel}
                      disabled={loading}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Enable Token Gate
                    </button>
                  )}
                  
                  <button
                    onClick={shareChannel}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Share Link
                  </button>
                </div>
              </div>
              
              {/* Token Access Warning */}
              {channel.isTokenGated && !hasTokenAccess && (
                <div className="bg-red-800 p-4">
                  <p className="font-semibold">
                    This channel requires token ownership to participate.
                  </p>
                  <p className="text-sm mt-1">
                    You need to own the required token to join and chat.
                  </p>
                </div>
              )}
              
              {/* Join Button */}
              {!isUserMember() && (
                <div className="p-4 bg-gray-700 border-t border-gray-600">
                  <button
                    onClick={joinChannel}
                    disabled={loading || (channel.isTokenGated && !hasTokenAccess)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full disabled:opacity-50"
                  >
                    {loading ? "Joining..." : "Join Channel"}
                  </button>
                </div>
              )}
              
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-4 bg-gray-850">
                {messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-3/4 rounded-lg p-3 ${
                            msg.userId === userId 
                              ? 'bg-blue-700 text-white' 
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <div className="text-xs text-gray-300 mb-1">
                            {msg.user?.name || 'Unknown user'}
                          </div>
                          <div>{msg.content}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              {isUserMember() && (
                <div className="p-4 bg-gray-700 border-t border-gray-600">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Wrap with Suspense to handle async dependencies like useSearchParams
export default function TokenGatedChatDemo() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Loading...</div>}>
      <DemoContent />
    </Suspense>
  );
} 