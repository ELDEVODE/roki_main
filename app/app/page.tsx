"use client";
import { UserProfile } from "../components/UserProfile";

export default function AppPage() {
  return (
    <div>
      {/* Welcome message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <span className="w-1.5 h-6 bg-discord-accent rounded-full mr-2.5"></span>
          Welcome back!
        </h1>
        <p className="text-discord-muted">
          This is the beginning of your direct message history
        </p>
      </div>
      
      {/* Recent activity section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 purple-gradient-light rounded-r-full mr-2"></div>
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        
        <div className="bg-discord-message p-4 rounded-md mb-4 border-l-2 border-purple-500/30 shadow-md shadow-purple-900/5">
          <div className="flex items-start mb-3">
            <div className="w-10 h-10 rounded-full purple-gradient-dark flex-shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="font-medium text-white">System</span>
                <span className="text-xs text-discord-muted ml-2">Today at 10:30 AM</span>
              </div>
              <p className="text-discord-text">Welcome to Roki! Your community ownership dashboard is now ready.</p>
            </div>
          </div>
          
          <div className="pl-13 ml-10 border-l-2 border-discord-divider">
            <div className="bg-discord-hover p-3 rounded-md">
              <h3 className="text-white font-medium mb-1">🎉 Your profile is now active</h3>
              <p className="text-discord-muted text-sm">Explore the platform and connect with other community members.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-discord-message p-4 rounded-md border-l-2 border-purple-500/30 shadow-md shadow-purple-900/5">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full purple-gradient-light flex-shrink-0 flex items-center justify-center shadow-md shadow-purple-900/20">
              <span className="text-white font-bold">R</span>
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="font-medium text-white">Roki Bot</span>
                <span className="text-xs bg-discord-accent text-white px-1.5 py-0.5 rounded text-[10px] ml-2">BOT</span>
                <span className="text-xs text-discord-muted ml-2">Today at 10:32 AM</span>
              </div>
              <p className="text-discord-text">Here's a quick overview of your profile information:</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* User profile section */}
      <UserProfile />
    </div>
  );
}
