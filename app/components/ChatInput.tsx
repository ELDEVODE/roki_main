"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  channelName?: string;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export default function ChatInput({ 
  onSendMessage,
  placeholder = "Message",
  disabled = false,
  channelName = "general",
  onTypingStart,
  onTypingStop
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '0';
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight > 80 ? '80px' : `${scrollHeight}px`;
    }
  }, [message]);
  
  // Handle typing indicator
  useEffect(() => {
    if (message.trim()) {
      // Notify others that this user is typing
      onTypingStart?.();
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop?.();
    }, 2000);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, onTypingStart, onTypingStop]);
  
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      onTypingStop?.();
      
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Emoji panel
  const emojiCategories = [
    { name: 'Recent', emojis: ['😀', '😂', '👍', '❤️', '🎉', '🔥', '🤔', '👀', '✅', '👋'] },
    { name: 'Smileys', emojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘'] },
    { name: 'Reactions', emojis: ['👍', '👎', '👌', '✌️', '🤞', '👏', '🙌', '🤝', '❤️', '🔥', '⭐', '✨', '💯', '💪', '🙏'] }
  ];
  
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(emojiCategories[0].name);
  
  const addEmoji = (emoji: string) => {
    setMessage(message + emoji);
    inputRef.current?.focus();
  };
  
  return (
    <div className="relative px-4 pb-4">
      {/* Modern, transparent chat input */}
      <div 
        className={`
          bg-transparent
          backdrop-blur-sm rounded-2xl 
          border border-purple-500/30
          shadow-lg shadow-purple-500/5
          overflow-hidden
          transition-all duration-200
          ${disabled ? 'opacity-60' : 'hover:border-purple-500/40'}
        `}
      >
        {/* Textarea container */}
        <div className="flex items-end relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            className="
              w-full px-4 pt-4 pb-2 
              bg-transparent outline-none resize-none 
              text-gray-200 text-sm
              min-h-[56px] max-h-[120px]
              placeholder-gray-500/70
              focus:outline-none focus:ring-0
              transition-colors
            "
            disabled={disabled}
            rows={1}
          />
          
          {/* Floating send button for non-empty messages */}
          {message.trim() && (
            <div className="absolute bottom-2 right-2">
              <motion.button
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                className="
                  p-2 rounded-full 
                  bg-gradient-to-r from-purple-600/90 to-indigo-600/90
                  hover:from-purple-500/90 hover:to-indigo-500/90
                  text-white 
                  shadow-md shadow-purple-600/10
                  disabled:bg-gray-700/50 disabled:text-gray-500
                  transition
                "
                title="Send message"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </motion.button>
            </div>
          )}
        </div>
        
        {/* Action bar - bottom part of input */}
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left side - formatting actions */}
          <div className="flex items-center gap-1">
            <button 
              className="p-2 rounded-full hover:bg-black/20 text-purple-300 hover:text-purple-200 transition"
              disabled={disabled}
              title="Add attachment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Emoji button */}
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`
                  p-2 rounded-full 
                  hover:bg-black/20 
                  transition
                  ${showEmojiPicker ? 'text-purple-200 bg-black/20' : 'text-purple-300 hover:text-purple-200'}
                `}
                disabled={disabled}
                title="Add emoji"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Enhanced emoji picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div 
                    className="absolute bottom-full right-0 mb-2 bg-black/90 border border-purple-500/40 rounded-xl shadow-lg shadow-purple-500/20 w-64 z-20 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 border-b border-purple-500/20">
                      <div className="flex gap-1">
                        {emojiCategories.map(category => (
                          <button
                            key={category.name}
                            className={`
                              p-1.5 text-xs rounded-lg transition flex-1
                              ${activeEmojiCategory === category.name 
                                ? 'bg-purple-600/60 text-white' 
                                : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'}
                            `}
                            onClick={() => setActiveEmojiCategory(category.name)}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-2 max-h-48 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-6 gap-1">
                        {emojiCategories.find(c => c.name === activeEmojiCategory)?.emojis.map((emoji, index) => (
                          <button
                            key={index}
                            className="p-1.5 text-xl hover:bg-white/10 rounded-lg transition"
                            onClick={() => {
                              addEmoji(emoji);
                              // Keep emoji picker open
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right side - quick reactions */}
          {!message.trim() && (
            <div className="flex -space-x-1 ml-auto">
              {['👍', '❤️', '🔥', '👀'].map((emoji, index) => (
                <button
                  key={index}
                  className="
                    w-8 h-8 
                    flex items-center justify-center 
                    text-base bg-black/20 hover:bg-black/30 
                    rounded-full transition 
                    hover:scale-110
                    border border-purple-500/30
                    shadow-sm
                  "
                  onClick={() => onSendMessage(emoji)}
                  disabled={disabled}
                  style={{ zIndex: 4 - index }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Add restrictions notice if disabled */}
      {disabled && (
        <div className="mt-2 text-center text-xs text-purple-300/70">
          <span className="bg-purple-900/30 px-3 py-1 rounded-full">
            You need to join this channel to send messages
          </span>
        </div>
      )}
    </div>
  );
} 