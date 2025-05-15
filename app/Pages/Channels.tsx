"use client";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function ChannelsPage() {
  const { user, authenticated } = usePrivy();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChannels, setUserChannels] = useState<any[]>([]);
  const [createdChannels, setCreatedChannels] = useState<any[]>([]);

  // Register user and fetch channels when authenticated
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      registerUser().then(() => {
        fetchUserChannels();
      });
    }
  }, [authenticated, user?.wallet?.address]);

  async function registerUser() {
    try {
      const res = await fetch('/api/demo/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: user?.wallet?.address,
          name: user?.email?.address || user?.displayName || `User-${user?.wallet?.address?.slice(0, 6)}`
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        setError(`Failed to register user: ${res.status} ${errorText}`);
        return;
      }
      
      const userData = await res.json();
      setUserId(userData.id);
      return userData.id;
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async function fetchUserChannels() {
    setLoading(true);
    try {
      // Fetch all channels the user is a member of
      const res = await fetch(`/api/demo/users/channels?walletAddress=${user?.wallet?.address}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch channels: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Separate channels into created vs joined
      setCreatedChannels(data.filter((channel: any) => channel.creatorId === userId));
      setUserChannels(data.filter((channel: any) => channel.creatorId !== userId));
      
    } catch (err) {
      console.error("Failed to fetch user channels", err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  function navigateToChannel(channelId: string) {
    router.push(`/demo?channel=${channelId}`);
  }

  async function createNewChannel() {
    if (!userId) {
      setError("Please connect your wallet first");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const channelName = prompt("Enter channel name:");
      if (!channelName) {
        setLoading(false);
        return;
      }
      
      const res = await fetch('/api/demo/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: channelName,
          creatorId: userId 
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        setError(`Failed to create channel: ${res.status} ${errorText}`);
        return;
      }
      
      const data = await res.json();
      await fetchUserChannels();
      navigateToChannel(data.id);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <main className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
              Your Channels
            </h1>
            <button 
              onClick={createNewChannel}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                        px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
              disabled={loading}
            >
              Create Channel
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channels you created */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
                <h2 className="text-lg font-semibold text-blue-400 mb-4">Channels You Created</h2>
                {createdChannels.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4">No channels created yet</p>
                ) : (
                  <div className="space-y-3">
                    {createdChannels.map((channel) => (
                      <div 
                        key={channel.id} 
                        onClick={() => navigateToChannel(channel.id)}
                        className="bg-gray-800/70 hover:bg-gray-700/70 cursor-pointer rounded-lg p-4 transition-all border border-gray-700 hover:border-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{channel.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {channel.members?.length || 0} member{channel.members?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          {channel.isTokenGated && (
                            <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-700">
                              Token Gated
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Channels you joined */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
                <h2 className="text-lg font-semibold text-indigo-400 mb-4">Channels You Joined</h2>
                {userChannels.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4">You haven't joined any channels yet</p>
                ) : (
                  <div className="space-y-3">
                    {userChannels.map((channel) => (
                      <div 
                        key={channel.id} 
                        onClick={() => navigateToChannel(channel.id)}
                        className="bg-gray-800/70 hover:bg-gray-700/70 cursor-pointer rounded-lg p-4 transition-all border border-gray-700 hover:border-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{channel.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                              Created by {channel.creator?.name || 'Unknown'}
                            </p>
                          </div>
                          {channel.isTokenGated && (
                            <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-700">
                              Token Gated
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 