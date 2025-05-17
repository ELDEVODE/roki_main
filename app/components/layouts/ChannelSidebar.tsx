import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Icon components
const HashtagIcon = () => (
  <svg className="w-5 h-5 text-current opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const VoiceIcon = () => (
  <svg className="w-5 h-5 text-current opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

type ChannelSidebarProps = {
  channelId: string;
  subchannelId?: string;
  isAdmin?: boolean;
};

export default function ChannelSidebar({ channelId, subchannelId, isAdmin = false }: ChannelSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [channel, setChannel] = useState<any>(null);
  const [subchannels, setSubchannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSubchannelName, setNewSubchannelName] = useState("");
  const [newSubchannelType, setNewSubchannelType] = useState("TEXT");
  const [isTokenGated, setIsTokenGated] = useState(false);
  
  // Get view parameter for highlighting
  const viewParam = searchParams?.get('view') || '';

  useEffect(() => {
    if (channelId) {
      fetchChannelDetails();
    }
  }, [channelId]);

  async function fetchChannelDetails() {
    try {
      setLoading(true);
      const res = await fetch(`/api/demo/channels?id=${channelId}`);
      
      if (res.ok) {
        const data = await res.json();
        setChannel(data);
        setSubchannels(data.subchannels || []);
      }
    } catch (err) {
      console.error("Failed to fetch channel details", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubchannelSelect = (subId: string) => {
    router.push(`/demo?channel=${channelId}&subchannel=${subId}`);
  };

  const getSubchannelIcon = (subchannel: any) => {
    if (subchannel.type === "VOICE") {
      return <VoiceIcon />;
    }
    return <HashtagIcon />;
  };

  // Generate a background color based on subchannel name
  const getSubchannelColor = (subchannel: any) => {
    if (!subchannel?.name) return 'bg-gray-700';
    
    // Simple hash function for consistent colors
    let hash = 0;
    for (let i = 0; i < subchannel.name.length; i++) {
      hash = ((hash << 5) - hash) + subchannel.name.charCodeAt(i);
      hash = hash & hash;
    }
    
    // Array of colors that work well with dark UI
    const colors = [
      'bg-purple-700/30',
      'bg-blue-700/30',
      'bg-cyan-700/30',
      'bg-emerald-700/30',
      'bg-amber-700/30',
      'bg-pink-700/30',
      'bg-red-700/30',
      'bg-indigo-700/30',
      'bg-violet-700/30',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const createSubchannel = async () => {
    if (!newSubchannelName.trim()) return;
    
    try {
      const res = await fetch(`/api/demo/channels/${channelId}/subchannels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubchannelName,
          type: newSubchannelType,
          isTokenGated
        }),
      });
      
      if (res.ok) {
        const newSubchannel = await res.json();
        setSubchannels([...subchannels, newSubchannel]);
        setShowModal(false);
        setNewSubchannelName("");
        setNewSubchannelType("TEXT");
        setIsTokenGated(false);
      }
    } catch (err) {
      console.error("Failed to create subchannel", err);
    }
  };

  const handleOpenSettings = () => {
    router.push(`/demo/channel/${channelId}/settings`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 border-r border-gray-800">
      {/* Channel Header */}
      <div className="p-4 border-b border-gray-800">
        {loading ? (
          <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
        ) : (
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">
              {channel?.name || "Channel"}
            </h2>
            {isAdmin && (
              <button 
                onClick={handleOpenSettings} 
                className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                title="Channel Settings"
              >
                <SettingsIcon />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Channel Info */}
      {!loading && channel && (
        <div className="px-4 py-2 border-b border-gray-800 text-sm text-gray-400">
          <p>
            {channel.members?.length || 0} members
            • Created by {channel.creator?.name || "Unknown"}
          </p>
        </div>
      )}

      {/* Navigation Options */}
      <div className="px-3 py-2 border-b border-gray-800">
        <button
          onClick={() => router.push(`/demo?channel=${channelId}&view=info`)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
            viewParam === 'info'
              ? "bg-purple-700/30 text-purple-100"
              : "text-gray-300 hover:bg-gray-800/70"
          }`}
        >
          <InfoIcon />
          <span className="truncate font-medium">Channel Info</span>
        </button>
      </div>

      {/* Subchannels List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="flex justify-between items-center px-2 py-2 text-xs font-semibold text-gray-400 uppercase">
          <span>Subchannels</span>
          <button 
            onClick={() => setShowModal(true)} 
            className="px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/40 transition-colors flex items-center gap-1.5 shadow-sm shadow-purple-500/20"
            title="Create Subchannel"
          >
            <PlusIcon />
            <span className="text-xs font-medium">Add Channel</span>
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-2 mt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-800/50 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-1 mt-2">
            {subchannels.length === 0 ? (
              <div className="text-sm text-gray-500 px-2">
                No subchannels available
              </div>
            ) : (
              subchannels.map((subchannel) => (
                <button
                  key={subchannel.id}
                  onClick={() => handleSubchannelSelect(subchannel.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-all ${
                    subchannelId === subchannel.id
                      ? `${getSubchannelColor(subchannel)} text-white shadow-md`
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                  }`}
                >
                  <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${
                    subchannelId === subchannel.id ? 'text-white' : 'text-gray-400'
                  }`}>
                    {getSubchannelIcon(subchannel)}
                  </div>
                  <span className="truncate font-medium">{subchannel.name}</span>
                  {subchannel.isTokenGated && (
                    <div className="ml-auto">
                      <LockIcon />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Subchannel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Create New Subchannel</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={newSubchannelName}
                onChange={(e) => setNewSubchannelName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. announcements"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <select
                value={newSubchannelType}
                onChange={(e) => setNewSubchannelType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="TEXT">Text Channel</option>
                <option value="VOICE">Voice Channel</option>
                <option value="VIDEO">Video Channel</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isTokenGated}
                  onChange={(e) => setIsTokenGated(e.target.checked)}
                  className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-400">Token Gated (requires NFT to access)</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={createSubchannel}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 