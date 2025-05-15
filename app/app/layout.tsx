import { Suspense } from "react";
import LoadingComponent from "../components/Loading";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-discord-dark text-discord-text">
      {/* Discord-like sidebar */}
      <div className="flex h-full">
        {/* Server sidebar */}
        <div className="w-16 h-full bg-discord-darker flex flex-col items-center py-3 space-y-3">
          {/* Home button */}
          <div className="w-12 h-12 rounded-full purple-gradient-light flex items-center justify-center text-white hover:opacity-90 transition cursor-pointer shadow-lg shadow-purple-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </div>
          <div className="w-8 h-0.5 bg-discord-divider rounded-full"></div>
          
          {/* Server icons */}
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className={`w-12 h-12 rounded-full ${index === 0 ? 'purple-gradient-dark' : 'bg-discord-channel hover:bg-discord-highlight'} transition cursor-pointer flex items-center justify-center shadow-md ${index === 0 ? 'shadow-purple-900/30' : ''}`}>
              <span className="text-lg font-bold">{String.fromCharCode(65 + index)}</span>
            </div>
          ))}
        </div>
        
        {/* Channels sidebar */}
        <div className="w-60 h-full bg-discord-dark border-r border-discord-divider flex flex-col">
          {/* Server name header */}
          <div className="h-12 px-4 border-b border-discord-divider flex items-center shadow-sm bg-discord-darker/50">
            <h2 className="font-bold text-white truncate">Roki Community</h2>
          </div>
          
          {/* Channels */}
          <div className="flex-1 overflow-y-auto py-4 px-2">
            <div className="mb-2">
              <div className="px-2 text-xs font-semibold text-discord-muted uppercase tracking-wider flex items-center justify-between">
                <span>Text Channels</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 cursor-pointer text-discord-accent">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              
              {["general", "announcements", "support", "resources"].map((channel, idx) => (
                <div key={idx} className={`mt-1 px-2 py-1 rounded flex items-center text-discord-muted hover:bg-discord-channel hover:text-discord-text cursor-pointer ${idx === 0 ? 'bg-discord-channel text-discord-text border-l-2 border-discord-accent' : ''}`}>
                  <span className="mr-1 text-lg">#</span>
                  <span className="truncate">{channel}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 mb-2">
              <div className="px-2 text-xs font-semibold text-discord-muted uppercase tracking-wider flex items-center justify-between">
                <span>Voice Channels</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 cursor-pointer text-discord-accent">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              
              {["Lounge", "Community Chat", "Meeting Room"].map((channel, idx) => (
                <div key={idx} className="mt-1 px-2 py-1 rounded flex items-center text-discord-muted hover:bg-discord-channel hover:text-discord-text cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-discord-muted">
                    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                  </svg>
                  <span className="truncate">{channel}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* User area */}
          <div className="h-14 bg-discord-user-bg px-2 flex items-center">
            <div className="w-8 h-8 rounded-full purple-gradient-light mr-2"></div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">Username</h4>
              <p className="text-xs text-discord-muted truncate">#1234</p>
            </div>
            <div className="flex space-x-1">
              <button className="w-8 h-8 rounded-full hover:bg-discord-hover flex items-center justify-center text-discord-muted">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-discord-hover flex items-center justify-center text-discord-muted">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-discord-hover flex items-center justify-center text-discord-muted">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="h-12 border-b border-discord-divider flex items-center px-4 shadow-sm bg-discord-darker/30">
          <div className="flex items-center">
            <span className="text-lg mr-1.5 text-discord-accent">#</span>
            <h3 className="font-bold">general</h3>
          </div>
          <div className="h-6 w-px bg-discord-divider mx-2"></div>
          <div className="text-sm text-discord-muted">User dashboard and profile</div>
          
          <div className="ml-auto flex items-center space-x-3">
            <button className="w-6 h-6 text-discord-muted hover:text-discord-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path fillRule="evenodd" d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-6 h-6 text-discord-muted hover:text-discord-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            </button>
            <button className="w-6 h-6 text-discord-muted hover:text-discord-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
              </svg>
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-discord-darker text-discord-text rounded-md px-2 py-1 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-discord-accent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 absolute right-2 top-1.5 text-discord-muted">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
            </div>
            <button className="w-6 h-6 text-discord-muted hover:text-discord-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<LoadingComponent />}>
            <div className="p-4">
              {children}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
