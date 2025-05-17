"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import Header from '@/app/components/Header';
import { useToast } from '@/app/context/ToastContext';

interface ChannelInfo {
  id: string;
  name: string;
  memberCount: number;
}

interface InviteDetails {
  channel: ChannelInfo;
  expiresAt: string | null;
  maxUses: number | null;
  useCount: number;
}

interface DebugInfo {
  userData?: any;
  userApiError?: any;
  userFetchError?: string;
  inviteDetails?: InviteDetails;
  inviteError?: any;
  inviteFetchError?: string;
  userCreateError?: any;
  joinPayload?: any;
  joinResponse?: any;
  joinError?: string;
}

// Helper function to generate a unique ID
function generateUniqueId() {
  return `u_${Math.random().toString(36).substring(2, 15)}`;
}

export function InvitePageClient({ code }: { code: string }) {
  const router = useRouter();
  const { login, authenticated, user } = usePrivy();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  
  // Get or create user ID
  useEffect(() => {
    if (authenticated && user) {
      // Try to find user by their wallet address or email
      const fetchOrCreateUser = async () => {
        try {
          // Access wallet address safely
          const address = user?.wallet?.address || (user as any)?.wallet?.address;
          if (!address) {
            console.error("No wallet address found in user object:", user);
            return;
          }
          
          // Create a local userId if none exists
          const localUserId = generateUniqueId();
          console.log("Generated localUserId:", localUserId);
          
          console.log("Fetching/creating user with wallet address:", address);
          
          // Use the regular /users endpoint since it can also create users
          const res = await fetch('/api/demo/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletAddress: address,
              name: user.email?.address?.split('@')[0] || `User-${address.slice(0, 6)}`
            })
          });
          
          if (res.ok) {
            const userData = await res.json();
            console.log("User data retrieved:", userData);
            setUserId(userData.id);
            setDebugInfo(prev => ({ ...prev, userData }));
          } else {
            const errorData = await res.json();
            console.error("Error response from users API:", errorData);
            setDebugInfo(prev => ({ ...prev, userApiError: errorData }));
          }
        } catch (err) {
          console.error('Error fetching or creating user', err);
          setDebugInfo(prev => ({ ...prev, userFetchError: String(err) }));
        }
      };
      
      fetchOrCreateUser();
    }
  }, [authenticated, user]);
  
  // Fetch invite details
  useEffect(() => {
    async function fetchInviteDetails() {
      try {
        setLoading(true);
        console.log("Fetching invite details for code:", code);
        const res = await fetch(`/api/demo/channels/invite?code=${code}`);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Invite details retrieved:", data);
          setInviteDetails(data);
          setDebugInfo(prev => ({ ...prev, inviteDetails: data }));
        } else {
          const errorData = await res.json();
          console.error("Error fetching invite details:", errorData);
          setError(errorData.error || 'Failed to fetch invite details');
          setDebugInfo(prev => ({ ...prev, inviteError: errorData }));
        }
      } catch (err) {
        console.error('Error fetching invite details:', err);
        setError('An error occurred while fetching invite details');
        setDebugInfo(prev => ({ ...prev, inviteFetchError: String(err) }));
      } finally {
        setLoading(false);
      }
    }
    
    fetchInviteDetails();
  }, [code]);
  
  // Format expiry date
  const formatExpiryDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never expires';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Join the channel using the invite code
  const joinChannel = async () => {
    if (!authenticated) {
      login();
      return;
    }
    
    // Get wallet address safely
    const walletAddress = user?.wallet?.address || (user as any)?.wallet?.address;
    if (!walletAddress) {
      console.error("No wallet address available for join request");
      showToast('Wallet address not available', 'error');
      return;
    }
    
    // Always generate a local user ID if we don't have one
    const currentUserId = userId || generateUniqueId();
    console.log("Using userId for join:", currentUserId);
    
    if (!currentUserId) {
      showToast('Unable to create user profile', 'error');
      return;
    }
    
    if (!inviteDetails?.channel?.id) {
      console.error("No channel information in invite details:", inviteDetails);
      showToast('Invalid invite information', 'error');
      return;
    }
    
    try {
      setJoining(true);
      
      // Prompt for username
      const username = prompt("Enter your display name:", user?.email?.address?.split('@')[0] || `User-${walletAddress?.slice(0, 6) || 'new'}`);
      if (!username) {
        setJoining(false);
        return; // User canceled
      }
      
      // First ensure the user exists in the database
      console.log("Creating/updating user before joining channel");
      const userCreateRes = await fetch('/api/demo/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          name: username
        })
      });
      
      let userDataForJoin = { id: currentUserId };
      
      if (userCreateRes.ok) {
        const userData = await userCreateRes.json();
        console.log("User created/updated:", userData);
        userDataForJoin = userData;
        setUserId(userData.id);
      } else {
        const userError = await userCreateRes.json();
        console.error("Error creating/updating user:", userError);
        setDebugInfo(prev => ({ ...prev, userCreateError: userError }));
      }
      
      const joinPayload = { 
        userId: userDataForJoin.id,
        walletAddress,
        inviteCode: code
      };
      
      console.log("Starting join process with data:", joinPayload);
      setDebugInfo(prev => ({ ...prev, joinPayload }));
      
      // Join the channel using the invite code
      const res = await fetch(`/api/demo/channels/${inviteDetails.channel.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinPayload)
      });
      
      const responseData = await res.json();
      console.log("Join response:", responseData);
      setDebugInfo(prev => ({ ...prev, joinResponse: responseData }));
      
      if (res.ok) {
        showToast(`You have joined #${inviteDetails.channel.name}`, 'success');
        router.push(`/demo?channel=${inviteDetails.channel.id}`);
      } else {
        console.error("Error joining channel. Response status:", res.status, "Data:", responseData);
        showToast(responseData.error || 'Failed to join channel', 'error');
      }
    } catch (err) {
      console.error('Error joining channel:', err);
      showToast('An error occurred while joining the channel', 'error');
      setDebugInfo(prev => ({ ...prev, joinError: String(err) }));
    } finally {
      setJoining(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="relative z-10">
          {/* Background gradient elements */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl -z-10"></div>
          
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-purple-900/30 shadow-xl shadow-purple-900/20 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64 p-8">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-10 w-10 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-300">Loading invite details...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-red-400">Invalid Invite</h2>
                  <p className="text-gray-300 mb-6">{error}</p>
                  <button
                    onClick={() => router.push('/demo')}
                    className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    Go to Channels
                  </button>
                </div>
              </div>
            ) : inviteDetails ? (
              <>
                <div className="p-8 border-b border-purple-900/30 bg-gradient-to-br from-purple-900/30 to-indigo-900/30">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                    <div className="w-16 h-16 bg-purple-800/50 rounded-full flex items-center justify-center text-2xl mr-0 sm:mr-4 mb-4 sm:mb-0">
                      #
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1 text-white">{inviteDetails.channel.name}</h1>
                      <div className="text-gray-300 mb-2">{inviteDetails.channel.memberCount} {inviteDetails.channel.memberCount === 1 ? 'member' : 'members'}</div>
                      <div className="text-sm text-gray-400">
                        <span className="inline-block mr-2">
                          <span className="font-medium text-purple-400">Expires:</span> {formatExpiryDate(inviteDetails.expiresAt)}
                        </span>
                        {inviteDetails.maxUses && (
                          <span className="inline-block">
                            <span className="font-medium text-purple-400">Uses:</span> {inviteDetails.useCount}/{inviteDetails.maxUses}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col items-center">
                  {!authenticated ? (
                    <>
                      <p className="text-gray-300 mb-6 text-center">Connect your wallet to join this channel</p>
                      <button
                        onClick={login}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center gap-2 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
                        </svg>
                        Connect Wallet
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-300 mb-6 text-center">
                        You've been invited to join <span className="text-purple-400 font-medium">#{inviteDetails.channel.name}</span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={joinChannel}
                          disabled={joining}
                          className={`${
                            joining
                              ? 'bg-purple-700/50'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
                          } px-6 py-3 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 flex items-center gap-2 transition disabled:cursor-not-allowed`}
                        >
                          {joining ? (
                            <>
                              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Joining...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              </svg>
                              Accept Invite
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => router.push('/demo')}
                          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                        >
                          Decline
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Debug Information */}
                <div className="p-4 text-xs border-t border-purple-900/30 bg-gray-900">
                  <details>
                    <summary className="cursor-pointer text-gray-400 hover:text-white">Debug Information</summary>
                    <div className="mt-2 p-2 bg-gray-800 rounded text-gray-300 font-mono overflow-auto max-h-48">
                      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                    </div>
                  </details>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
} 