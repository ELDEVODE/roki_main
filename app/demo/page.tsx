"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import SolanaWalletButton from '../components/SolanaWalletButton';
import Link from "next/link";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Header />
      
      <main className="flex-grow container mx-auto pt-24 pb-10 px-4">
        {!authenticated ? (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
                Token-Gated Chat Demo
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Connect your wallet to experience token-gated messaging with zero-knowledge proofs.
              </p>
            </div>
            <button
              onClick={() => login()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
              </svg>
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar for actions */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-xl p-6">
                <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
                  Channel Controls
                </h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  {!channelId ? (
                    <button
                      onClick={createChannel}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                               px-4 py-3 rounded-lg text-white font-medium shadow-lg 
                               flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Create Channel
                    </button>
                  ) : (
                    <>
                      <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-lg">{channel?.name || 'Chat Channel'}</h3>
                          {channel?.isTokenGated && (
                            <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-700 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              Token Gated
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                          Created by {channel?.creator?.name || 'Unknown'}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <button
                            onClick={shareChannel}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium 
                                    text-gray-300 flex items-center justify-center gap-1 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            Share
                          </button>
                          
                          <Link href="/demo/channels" className="flex-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium 
                                     text-gray-300 flex items-center justify-center gap-1 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            Channels
                          </Link>
                        </div>
                      </div>
                      
                      {!channel?.isTokenGated && (
                        <button
                          onClick={tokenGateChannel}
                          className="w-full bg-indigo-800 hover:bg-indigo-700 px-4 py-3 rounded-lg text-white font-medium 
                                   flex items-center justify-center gap-2 transition-colors border border-indigo-600"
                          disabled={loading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Token-Gate Channel
                        </button>
                      )}
                      
                      {!isUserMember() && channel && (
                        <button
                          onClick={joinChannel}
                          className="w-full bg-blue-800 hover:bg-blue-700 px-4 py-3 rounded-lg text-white font-medium 
                                   flex items-center justify-center gap-2 transition-colors border border-blue-600"
                          disabled={loading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                          Join Channel
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                
                {channel?.isTokenGated && (
                  <div className={`mt-6 p-4 rounded-lg border ${hasTokenAccess ? 'bg-green-900/30 border-green-700 text-green-200' : 'bg-yellow-900/30 border-yellow-700 text-yellow-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {hasTokenAccess ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{hasTokenAccess ? 'Access Granted' : 'Access Required'}</h4>
                        <p className="text-xs">
                          {hasTokenAccess 
                            ? 'You have the required token to access this channel.' 
                            : 'This channel requires token ownership for access. For the demo, access is automatically granted.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Main chat area */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-xl flex flex-col h-[75vh]">
                {channelId ? (
                  <>
                    {/* Chat header */}
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">{channel?.name || 'Chat Channel'}</h2>
                        <p className="text-xs text-gray-400">
                          {channel?.members?.length || 0} member{channel?.members?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      {channel?.isTokenGated && (
                        <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-700 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Token Gated
                        </span>
                      )}
                    </div>
                    
                    {/* Messages area */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="bg-gray-800/60 rounded-full p-4 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-300 mb-2">No messages yet</h3>
                          <p className="text-sm text-gray-400 max-w-md">
                            Start the conversation by sending the first message in this channel.
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-xl p-3 ${
                                msg.userId === userId 
                                  ? 'bg-blue-800/50 border border-blue-700 rounded-tr-none' 
                                  : 'bg-gray-700/40 border border-gray-600 rounded-tl-none'
                              }`}
                            >
                              <div className="text-xs text-gray-300 mb-1 flex items-center gap-1">
                                {msg.userId === userId ? (
                                  <>
                                    <span>You</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-400 text-[10px]">
                                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="mr-1">{msg.user?.name || user?.email?.address || 'Unknown user'}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-400 text-[10px]">
                                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="break-words">{msg.content}</div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef}></div>
                    </div>
                    
                    {/* Message input */}
                    {isUserMember() && hasTokenAccess ? (
                      <div className="p-4 border-t border-gray-700">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                          }}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-grow bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            disabled={!message.trim()}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 p-2.5 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="p-4 border-t border-gray-700">
                        <div className="bg-gray-800/80 rounded-lg p-3 text-center">
                          {!isUserMember() ? (
                            <div className="text-sm text-gray-300">Join this channel to start sending messages</div>
                          ) : (
                            <div className="text-sm text-gray-300">You need the required token to send messages</div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="bg-gray-800/60 rounded-full p-5 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-3">No Channel Selected</h3>
                    <p className="text-gray-400 max-w-md mb-6">
                      Create a new channel or go to "My Channels" to select an existing one.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={createChannel}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                                  px-4 py-2.5 rounded-lg text-white font-medium shadow-lg 
                                  flex items-center gap-2"
                        disabled={loading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Create Channel
                      </button>
                      
                      <Link href="/demo/channels" className="bg-gray-700 hover:bg-gray-600 
                                 px-4 py-2.5 rounded-lg text-white font-medium
                                 flex items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        My Channels
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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