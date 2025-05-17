import { motion } from "framer-motion";
import React from "react";

type ChannelInfoContentProps = {
  channel: any;
};

export default function ChannelInfoContent({ channel }: ChannelInfoContentProps) {
  if (!channel) return null;

  // Simple animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  // Extract creator and admins from channel members
  const creator = channel.members?.find((m: any) => m.userId === channel.creatorId);
  const admins = channel.members?.filter((m: any) => 
    m.role === 'admin' || m.userId === channel.creatorId
  ) || [];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/60 px-4 py-6 md:px-8">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Channel header with gradient */}
        <motion.div 
          className="mb-8 pb-6 border-b border-purple-900/30"
          variants={itemVariants}
        >
          <div className="h-36 md:h-48 rounded-lg overflow-hidden relative mb-6 bg-gradient-to-br from-purple-900/80 to-indigo-900/80">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight neon-text">
                #{channel.name}
              </h1>
              <p className="text-purple-200 text-lg max-w-lg">
                Welcome to the official information page for this channel
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">About This Channel</h2>
          <p className="text-gray-300 leading-relaxed">
            This channel was created to build a community around {channel.name}. 
            Here you can discuss topics related to {channel.name}, share resources,
            and connect with others who share your interests.
          </p>
        </motion.div>
        
        {/* Community Guidelines */}
        <motion.div 
          className="mb-8 pb-6 border-b border-purple-900/30"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-700/30 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Community Guidelines</h2>
          </div>
          
          <div className="pl-11 space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-purple-600">
              <h3 className="font-semibold text-purple-300 mb-2">1. Be Respectful</h3>
              <p className="text-gray-300">Treat all members with respect. Harassment, hate speech, and personal attacks will not be tolerated.</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-indigo-600">
              <h3 className="font-semibold text-indigo-300 mb-2">2. Stay On Topic</h3>
              <p className="text-gray-300">Keep conversations relevant to the channel and subchannel topics. Use the appropriate subchannels for different discussions.</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-blue-600">
              <h3 className="font-semibold text-blue-300 mb-2">3. No Spam</h3>
              <p className="text-gray-300">Don't spam messages, links, or promotional content. Repeated violations may result in temporary or permanent removal.</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-teal-600">
              <h3 className="font-semibold text-teal-300 mb-2">4. Protect Privacy</h3>
              <p className="text-gray-300">Don't share personal information of yourself or others. Respect everyone's privacy and digital security.</p>
            </div>
          </div>
        </motion.div>
        
        {/* Admins & Moderators */}
        <motion.div 
          className="mb-8 pb-6 border-b border-purple-900/30"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-700/30 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Admins & Moderators</h2>
          </div>
          
          <div className="pl-11">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creator && (
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 flex items-center border border-purple-800/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold mr-3">
                    {creator.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{creator.user?.name || 'Channel Creator'}</div>
                    <div className="text-xs text-purple-300 flex items-center mt-1">
                      <span className="bg-purple-700/80 rounded-full px-2 py-0.5 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Owner
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {admins.filter((a: any) => a.userId !== channel.creatorId).map((admin: any) => (
                <div key={admin.userId} className="bg-gray-900/30 rounded-lg p-4 flex items-center border border-gray-800/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white text-lg font-bold mr-3">
                    {admin.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{admin.user?.name || 'Admin'}</div>
                    <div className="text-xs text-indigo-300 flex items-center mt-1">
                      <span className="bg-indigo-700/80 rounded-full px-2 py-0.5 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Admin
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {admins.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                No admins or moderators have been assigned yet.
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Subchannels */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-700/30 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Available Subchannels</h2>
          </div>
          
          <div className="pl-11">
            {channel.subchannels && channel.subchannels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {channel.subchannels.map((subchannel: any) => (
                  <div key={subchannel.id} className="bg-gray-900/40 hover:bg-gray-900/60 transition-colors rounded-lg p-3 flex items-center border border-gray-800/30">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mr-3">
                      {subchannel.type === "VOICE" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white flex items-center">
                        {subchannel.name}
                        {subchannel.isTokenGated && (
                          <span className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {subchannel.type === "VOICE" ? "Voice Channel" : 
                         subchannel.type === "VIDEO" ? "Video Channel" : "Text Channel"}
                        {subchannel.isTokenGated && <span className="ml-2 text-purple-300">· Token Gated</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                No subchannels have been created yet.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 