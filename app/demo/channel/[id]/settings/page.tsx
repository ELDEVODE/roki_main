"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import AppLayout from "@/app/components/layouts/AppLayout";
import { motion } from "framer-motion";

export default function ChannelSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const channelId = params.id as string;
  
  // State
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    icon: ""
  });
  const [userChannels, setUserChannels] = useState<any[]>([]);
  const [createdChannels, setCreatedChannels] = useState<any[]>([]);
  
  // Get user ID when authenticated
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      getUserId(user.wallet.address);
    }
  }, [authenticated, user?.wallet?.address]);
  
  // Fetch channel data when channel ID is available
  useEffect(() => {
    if (channelId && userId) {
      fetchChannel();
      fetchUserChannels();
    }
  }, [channelId, userId]);
  
  // Check if user is an admin
  useEffect(() => {
    if (channel && userId) {
      const isCreator = channel.creatorId === userId;
      const isChannelAdmin = channel.members?.some((m: any) => m.userId === userId && m.role === 'admin');
      setIsAdmin(isCreator || isChannelAdmin);
      
      // Redirect if not an admin
      if (!isCreator && !isChannelAdmin) {
        router.push(`/demo?channel=${channelId}`);
      }
      
      // Set form values
      setFormValues({
        name: channel.name || "",
        description: channel.description || "",
        icon: channel.icon || ""
      });
    }
  }, [channel, userId]);
  
  async function getUserId(walletAddress: string) {
    try {
      const res = await fetch(`/api/demo/users?walletAddress=${walletAddress}`);
      
      if (res.ok) {
        const user = await res.json();
        setUserId(user.id);
      }
    } catch (err) {
      console.error("Failed to fetch user ID", err);
    }
  }
  
  async function fetchChannel() {
    try {
      setLoading(true);
      const res = await fetch(`/api/demo/channels?id=${channelId}`);
      
      if (res.ok) {
        const data = await res.json();
        setChannel(data);
      }
    } catch (err) {
      console.error("Failed to fetch channel", err);
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchUserChannels() {
    try {
      if (!user?.wallet?.address) return;
      
      const res = await fetch(`/api/demo/users/channels?walletAddress=${user.wallet.address}`);
      
      if (res.ok) {
        const data = await res.json();
        
        if (data && data.length > 0) {
          const created = data.filter((ch: any) => ch.creatorId === userId);
          const joined = data.filter((ch: any) => {
            const isCreator = ch.creatorId === userId;
            const isMember = ch.members?.some((m: any) => m.userId === userId);
            return !isCreator && isMember;
          });
          
          setCreatedChannels(created);
          setUserChannels(joined);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user channels", err);
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      alert("You do not have permission to update this channel");
      return;
    }
    
    setUpdating(true);
    
    try {
      const res = await fetch(`/api/demo/channels/${channelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });
      
      if (res.ok) {
        alert("Channel updated successfully");
        fetchChannel();
      } else {
        alert("Failed to update channel");
      }
    } catch (err) {
      console.error("Failed to update channel", err);
      alert("An error occurred while updating the channel");
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <AppLayout
      showUserList={false}
      userChannels={userChannels}
      createdChannels={createdChannels}
      activeChannelId={channelId}
      onChannelSelect={(id) => router.push(`/demo?channel=${id}`)}
      isAdmin={isAdmin}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/60 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading channel settings...</p>
            </div>
          ) : !isAdmin ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-gray-400 mb-6">You don't have permission to edit this channel.</p>
              <Link href={`/demo?channel=${channelId}`}>
                <div className="px-6 py-2 bg-purple-600 rounded-md text-white font-medium inline-block">
                  Return to Channel
                </div>
              </Link>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Channel Settings</h1>
                  <p className="text-gray-400">Manage your channel settings and properties</p>
                </div>
                <Link href={`/demo?channel=${channelId}`}>
                  <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors">
                    Back to Channel
                  </div>
                </Link>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium text-white mb-4">General Settings</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Channel Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter channel name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                      placeholder="Enter channel description"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Channel Icon URL
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={formValues.icon}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter icon URL"
                    />
                    {formValues.icon && (
                      <div className="mt-2 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden mr-2">
                          <img 
                            src={formValues.icon} 
                            alt="Channel icon preview"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + formValues.name[0]?.toUpperCase()}
                          />
                        </div>
                        <span className="text-xs text-gray-400">Icon preview</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-medium text-white mb-4">Danger Zone</h2>
                
                <div className="p-4 border border-red-900/30 rounded-md bg-red-900/10">
                  <h3 className="text-red-400 font-medium">Delete Channel</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Once you delete a channel, there is no going back. Please be certain.
                  </p>
                  <button
                    className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 text-red-300 rounded-md text-sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
                        // Add delete channel functionality
                        alert("Delete channel functionality would go here");
                      }
                    }}
                  >
                    Delete Channel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 