"use client";
import { useState, useEffect, Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import AppLayout from "@/app/components/layouts/AppLayout";
import { motion } from "framer-motion";

function ExploreContent() {
  const { authenticated, user } = usePrivy();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [exploreChannels, setExploreChannels] = useState<any[]>([]);
  const [userChannels, setUserChannels] = useState<any[]>([]);
  const [createdChannels, setCreatedChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState([
    "Gaming", "NFT", "DeFi", "Social", "Art", "Music", "Education"
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Register user when authenticated
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      registerUser();
    }
  }, [authenticated, user?.wallet?.address]);

  // Fetch channels when userId is available
  useEffect(() => {
    if (userId) {
      fetchUserChannels();
      fetchExploreChannels();
    }
  }, [userId]);

  async function registerUser() {
    try {
      const wallet = user?.wallet;
      
      const res = await fetch('/api/demo/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: wallet?.address,
          name: user?.email?.address || `User-${wallet?.address?.slice(0, 6)}`
        })
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUserId(userData.id);
      }
    } catch (err) {
      console.error("Failed to register user", err);
    }
  }

  async function fetchUserChannels() {
    try {
      if (!user?.wallet?.address) {
        return;
      }
      
      // Fetch all channels the user is a member of
      const res = await fetch(`/api/demo/users/channels?walletAddress=${user.wallet.address}`);
      
      if (res.ok) {
        const data = await res.json();
        
        // Separate channels into created vs joined
        const created = data.filter((channel: any) => 
          channel.creatorId && String(channel.creatorId) === String(userId)
        );
        
        const joined = data.filter((channel: any) => {
          // A channel is joined if user is not the creator but is a member
          const isCreator = channel.creatorId && String(channel.creatorId) === String(userId);
          const isMember = channel.members?.some((m: any) => 
            m.userId && String(m.userId) === String(userId)
          );
          
          return !isCreator && isMember;
        });
        
        setCreatedChannels(created);
        setUserChannels(joined);
      }
    } catch (err) {
      console.error("Failed to fetch user channels", err);
    }
  }

  async function fetchExploreChannels() {
    try {
      setLoading(true);
      // In a real app, this would include pagination and filtering options
      const res = await fetch('/api/demo/channels/explore');
      
      if (res.ok) {
        const data = await res.json();
        // Filter out channels the user has already joined
        const joinedIds = [...userChannels, ...createdChannels].map(c => c.id);
        const filteredChannels = data.filter((c: any) => !joinedIds.includes(c.id));
        setExploreChannels(filteredChannels);
      }
    } catch (err) {
      console.error("Failed to fetch explore channels", err);
    } finally {
      setLoading(false);
    }
  }

  function handleChannelSelect(channelId: string) {
    router.push(`/demo?channel=${channelId}`);
  }

  function getChannelInitial(channel: any) {
    return channel?.name?.[0]?.toUpperCase() || '#';
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <AppLayout
      userChannels={userChannels}
      createdChannels={createdChannels}
      onChannelSelect={handleChannelSelect}
    >
      <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Explore Channels
          </h1>
          <p className="text-gray-400 max-w-3xl">
            Discover new communities and join conversations across different topics
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white neon-purple-glow"
                  : "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
              }`}
            >
              All Channels
            </button>
            {featuredCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white neon-purple-glow"
                    : "bg-gray-900/50 text-gray-300 hover:bg-gray-900/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured channels */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-white">Featured Channels</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-900/40 rounded-xl h-[180px] animate-pulse"></div>
              ))}
            </div>
          ) : exploreChannels.length === 0 ? (
            <div className="bg-gray-900/30 rounded-xl p-6 text-center border border-purple-900/30">
              <p className="text-gray-400">No channels found. Check back later for more communities!</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {exploreChannels.slice(0, 8).map(channel => (
                <motion.div
                  key={channel.id}
                  className="bg-gray-900/40 backdrop-blur-sm border border-purple-900/30 rounded-xl overflow-hidden hover:border-purple-600/50 transition-all hover:shadow-lg hover:shadow-purple-900/20 cursor-pointer"
                  onClick={() => handleChannelSelect(channel.id)}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3 neon-purple-glow">
                        {getChannelInitial(channel)}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{channel.name}</h3>
                        <p className="text-xs text-gray-400">
                          {channel.members?.length || 0} members
                        </p>
                      </div>
                      {channel.isTokenGated && (
                        <div className="ml-auto text-purple-400 neon-purple-glow flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {channel.description || "Join this channel to start chatting"}
                    </p>
                    <div className="flex justify-end">
                      <button className="px-3 py-1 bg-purple-900/30 hover:bg-purple-900/50 rounded-md text-purple-300 text-sm transition">
                        Join
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Trending channels */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-white">Trending Now</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-900/40 rounded-xl h-16 animate-pulse"></div>
              ))}
            </div>
          ) : exploreChannels.length === 0 ? (
            <div className="bg-gray-900/30 rounded-xl p-6 text-center border border-purple-900/30">
              <p className="text-gray-400">No trending channels available</p>
            </div>
          ) : (
            <motion.div 
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible" 
            >
              {exploreChannels.slice(0, 5).map((channel, index) => (
                <motion.div
                  key={channel.id}
                  className="bg-gray-900/40 backdrop-blur-sm border border-purple-900/30 rounded-lg overflow-hidden hover:border-purple-600/50 transition-all hover:shadow-lg hover:shadow-purple-900/20 cursor-pointer"
                  onClick={() => handleChannelSelect(channel.id)}
                  variants={itemVariants}
                >
                  <div className="p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3 neon-purple-glow">
                      {getChannelInitial(channel)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white flex items-center">
                        {channel.name}
                        {channel.isTokenGated && (
                          <span className="ml-2 text-purple-400 neon-purple-glow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {channel.members?.length || 0} members • {channel.messages?.length || 0} messages
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-900/50 text-white text-xs font-bold">
                        #{index + 1}
                      </div>
                      <button className="ml-4 px-3 py-1 bg-purple-900/30 hover:bg-purple-900/50 rounded-md text-purple-300 text-sm transition">
                        Join
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Wrap with Suspense to handle async dependencies
export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-black text-white">Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
} 