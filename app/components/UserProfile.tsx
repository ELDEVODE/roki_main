"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Show nothing if user is not authenticated or data is still loading
  if (!(ready && authenticated) || !user) {
    return null;
  }

  return (
    <div className="bg-discord-message rounded-lg overflow-hidden shadow-xl shadow-purple-900/10">
      {/* Profile header with banner */}
      <div className="h-24 purple-gradient-dark relative">
        <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full bg-discord-message p-1 shadow-lg shadow-purple-900/30">
          <div className="w-full h-full rounded-full purple-gradient-light flex items-center justify-center text-2xl font-bold text-white">
            {user.email?.address ? user.email.address[0].toUpperCase() : "U"}
          </div>
        </div>
      </div>
      
      {/* Profile body */}
      <div className="pt-14 px-4 pb-4">
        {/* Username and badges */}
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {user.email?.address ? user.email.address.split('@')[0] : "User"}
            <span className="text-sm font-normal text-discord-muted ml-0.5">#1234</span>
          </h2>
          
          <div className="ml-2 flex space-x-1">
            <div className="w-5 h-5 bg-discord-accent rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* About me section */}
        <div className="bg-discord-darker rounded-md p-4 mb-4 border-l-2 border-discord-accent">
          <h3 className="text-white font-semibold mb-2">About me</h3>
          <p className="text-discord-muted text-sm">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Connected accounts section */}
        <div className="mb-4">
          <h3 className="font-semibold text-white mb-2 px-1 flex items-center">
            <span className="w-1 h-4 bg-discord-accent rounded-r-full mr-2"></span>
            Linked Accounts
          </h3>
          <div className="space-y-2">
            {[
              { name: "Discord", icon: "👾", value: user.discord?.username },
              { name: "Email", icon: "✉️", value: user.email?.address },
              { name: "Twitter", icon: "🐦", value: user.twitter?.username },
              { name: "Github", icon: "🐙", value: user.github?.username },
            ].filter(account => account.value).map((account) => (
              <div
                key={account.name}
                className="flex items-center p-3 rounded bg-discord-darker hover:bg-discord-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-discord-channel flex items-center justify-center mr-3">
                  <span>{account.icon}</span>
                </div>
                <div>
                  <div className="font-medium text-white">{account.name}</div>
                  <div className="text-xs text-discord-muted">{account.value}</div>
                </div>
                <div className="ml-auto text-discord-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
            
            <button className="w-full mt-3 flex items-center justify-center py-2.5 purple-gradient-light hover:opacity-90 text-white font-medium rounded-md transition shadow-md shadow-purple-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Connect Account
            </button>
          </div>
        </div>
        
        {/* Account status section */}
        <div className="bg-discord-darker rounded-md p-4 border-l-2 border-purple-500">
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <span className="w-1 h-4 bg-purple-500 rounded-r-full mr-2"></span>
            Account Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-discord-muted">Terms Accepted</span>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${user.hasAcceptedTerms ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {user.hasAcceptedTerms ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-discord-muted">Guest Account</span>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${user.isGuest ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                {user.isGuest ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-discord-muted">User ID</span>
              <span className="text-xs bg-discord-darker-hover px-2 py-1 rounded font-mono text-discord-muted border border-purple-500/20">{user.id.substring(0, 10)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
