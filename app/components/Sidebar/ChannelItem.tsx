import { useState } from 'react';
import { motion } from 'framer-motion';

interface ChannelItemProps {
  channel: any;
  isActive: boolean;
  onClick: () => void;
}

export default function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get channel initial for fallback
  const getChannelInitial = () => {
    return channel?.name?.[0]?.toUpperCase() || '#';
  };
  
  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Determine channel background gradient based on name for unique colors
  const getChannelGradient = () => {
    if (!channel?.name) return 'from-purple-600 to-indigo-700';
    
    // Create a simple hash from channel name to get consistent colors
    let hash = 0;
    for (let i = 0; i < channel.name.length; i++) {
      hash = ((hash << 5) - hash) + channel.name.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Array of beautiful gradient pairs
    const gradients = [
      'from-purple-600 to-indigo-700',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-700',
      'from-amber-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-red-500 to-pink-600',
      'from-violet-500 to-purple-600',
      'from-cyan-400 to-blue-600',
      'from-green-400 to-emerald-600',
    ];
    
    return gradients[Math.abs(hash) % gradients.length];
  };
  
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
        isActive
          ? "bg-purple-900/40 text-white shadow-lg shadow-purple-900/20"
          : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
      }`}
      title={channel.name}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className={`relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ${
          isActive || isHovered ? 'shadow-xl shadow-purple-900/40' : 'shadow-md'
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotateY: isActive || isHovered ? 15 : 0,
          rotateX: isActive || isHovered ? -10 : 0
        }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        {/* Glowing effect for active channel */}
        {isActive && (
          <div 
            className="absolute inset-0 z-0 rounded-full" 
            style={{
              boxShadow: `0 0 15px 2px rgba(147, 51, 234, 0.5)`,
              zIndex: -1
            }}
          />
        )}

        {channel.icon && !imageError ? (
          <img 
            src={channel.icon} 
            alt={channel.name} 
            className="w-full h-full object-cover z-10"
            onError={handleImageError}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br 
            ${isActive ? getChannelGradient() : 'from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'}`}
          >
            <motion.span 
              className="text-base font-medium text-white"
              animate={{ 
                scale: isActive || isHovered ? 1.1 : 1,
                textShadow: isActive || isHovered ? "0 0 5px rgba(255,255,255,0.7)" : "none"
              }}
              transition={{ duration: 0.2 }}
            >
              {getChannelInitial()}
            </motion.span>
          </div>
        )}
        
        {/* 3D border effect */}
        {(isActive || isHovered) && (
          <motion.div 
            className="absolute inset-0 border-2 border-white rounded-full z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 0.4 : 0.2 }}
            transition={{ duration: 0.3 }}
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.05) 100%)'
            }}
          />
        )}
      </motion.div>
      
      <motion.span 
        className="truncate font-medium"
        animate={{
          textShadow: isActive ? "0 0 8px rgba(178, 132, 255, 0.6)" : "none"
        }}
      >
        {channel.name}
      </motion.span>
      
      {channel.unreadCount > 0 && (
        <motion.span 
          className="ml-auto flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: 1,
            boxShadow: isActive ? "0 0 8px rgba(147, 51, 234, 0.7)" : "none"
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {channel.unreadCount > 9 ? '9+' : channel.unreadCount}
        </motion.span>
      )}

      {/* Activity indicator dot for active channel */}
      {isActive && (
        <motion.div 
          className="absolute w-2 h-2 bg-purple-400 rounded-full left-0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
} 