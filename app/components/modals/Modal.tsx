"use client";
import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = "md:max-w-md",
  size = "md"
}: ModalProps) {
  // Calculate actual maxWidth based on size prop
  const getMaxWidth = () => {
    switch(size) {
      case "sm": return "md:max-w-sm";
      case "md": return "md:max-w-md";
      case "lg": return "md:max-w-lg";
      case "xl": return "md:max-w-xl";
      default: return maxWidth; // Use provided maxWidth as fallback
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Re-enable scrolling when modal closes
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 350 
              }}
              className={`w-full ${getMaxWidth()} bg-gray-900/90 backdrop-blur-md rounded-xl border border-purple-900/30 shadow-xl shadow-purple-900/20 overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-purple-900/30 flex items-center justify-between">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-purple-400 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="p-5">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 