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
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '0';
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight > 120 ? '120px' : `${scrollHeight}px`;
    }
  }, [message]);
  
  // Handle typing indicator
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onTypingStart?.();
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTypingStop?.();
      }
    }, 2000);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTypingStart, onTypingStop]);
  
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      setIsTyping(false);
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
    
    // Show quick replies with Tab
    if (e.key === 'Tab' && !showQuickReplies) {
      e.preventDefault();
      setShowQuickReplies(true);
    }
  };
  
  // Quick replies - common responses
  const quickReplies = [
    "Thanks for sharing!",
    "I agree with that.",
    "Could you explain more?",
    "Great idea!",
    "I'll look into it.",
    "Let's discuss this further."
  ];
  
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
  
  const useQuickReply = (reply: string) => {
    setMessage(reply);
    setShowQuickReplies(false);
    inputRef.current?.focus();
  };
  
  return (
    <div className="relative">
      {/* Quick replies */}
      <AnimatePresence>
        {showQuickReplies && (
          <motion.div 
            className="absolute bottom-full left-4 right-4 mb-2 bg-black/80 backdrop-blur-md border border-purple-900/70 rounded-lg shadow-md p-3 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-300">Quick Replies</h4>
              <button 
                onClick={() => setShowQuickReplies(false)}
                className="p-1 rounded-full hover:bg-purple-900/30 text-gray-400 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => useQuickReply(reply)}
                  className="p-2 text-sm text-left bg-purple-900/40 hover:bg-purple-900/60 rounded transition text-gray-200 hover:text-white truncate"
                >
                  {reply}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat input area */}
      <div className={`bg-black/60 backdrop-blur-md rounded-lg mb-4 mx-4 border border-purple-900 shadow-md ${disabled ? 'opacity-60' : ''}`}>
        {/* Input header with attachment options */}
        <div className="flex items-center justify-between p-2 border-b border-purple-900/70">
          <div className="flex items-center space-x-1">
            <button 
              className="p-2 rounded-full hover:bg-purple-900/30 text-gray-400 hover:text-purple-400 transition"
              disabled={disabled}
              title="Add attachment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              className="p-2 rounded-full hover:bg-purple-900/30 text-gray-400 hover:text-purple-400 transition"
              disabled={disabled}
              title="Add GIF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4a.5.5 0 01-.5-.5v-7h13v7a.5.5 0 01-.5.5zM8 8.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 018 8.25zm0 3a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM5.5 6.5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <button 
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className="p-2 rounded-full hover:bg-purple-900/30 text-gray-400 hover:text-purple-400 transition flex items-center"
            disabled={disabled}
            title="Quick replies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
            <span className="text-xs hidden sm:inline">Quick Replies</span>
          </button>
        </div>
        
        {/* Main input area */}
        <div className="flex items-end p-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`}
            className="flex-grow bg-transparent outline-none resize-none text-gray-200 min-h-[40px] max-h-[120px] pt-1 placeholder-gray-500 focus:placeholder-gray-400 transition-colors"
            disabled={disabled}
            rows={1}
          />
          
          <div className="flex items-center space-x-2 pl-2">
            {/* Emoji button */}
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded-full hover:bg-purple-900/30 text-gray-400 hover:text-purple-400 transition"
                disabled={disabled}
                title="Add emoji"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Enhanced emoji picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div 
                    className="absolute bottom-full right-0 mb-2 bg-black/80 border border-purple-900/70 rounded-lg shadow-md w-64 z-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="p-2 border-b border-purple-900/70">
                      <div className="flex">
                        {emojiCategories.map(category => (
                          <button
                            key={category.name}
                            className={`p-2 text-xs rounded transition flex-1 ${activeEmojiCategory === category.name ? 'bg-purple-900/50 text-purple-300' : 'text-gray-400 hover:text-gray-300'}`}
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
                            className="p-2 text-xl hover:bg-purple-900/30 rounded transition"
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
            
            {/* Quick reactions for empty state */}
            {!message.trim() && (
              <div className="flex space-x-1 px-1 py-1 bg-purple-900/40 rounded-full">
                {['👍', '❤️', '🔥', '👀'].map((emoji, index) => (
                  <button
                    key={index}
                    className="w-7 h-7 flex items-center justify-center text-lg hover:bg-purple-900/60 rounded-full transition"
                    onClick={() => onSendMessage(emoji)}
                    disabled={disabled}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            {/* Send button - only show when there's a message */}
            {message.trim() && (
              <motion.button
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white disabled:bg-gray-700 disabled:text-gray-500 shadow-md transition"
                title="Send message"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Typing status indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              className="px-3 py-1 text-xs text-purple-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center space-x-1">
                <span>Typing</span>
                <span className="flex space-x-1">
                  <motion.span 
                    className="w-1 h-1 bg-purple-400 rounded-full inline-block"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.span 
                    className="w-1 h-1 bg-purple-400 rounded-full inline-block"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span 
                    className="w-1 h-1 bg-purple-400 rounded-full inline-block"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Add restrictions notice if disabled */}
      {disabled && (
        <div className="text-center text-sm text-gray-400 mb-4">
          You need to join this channel to send messages
        </div>
      )}
    </div>
  );
} 