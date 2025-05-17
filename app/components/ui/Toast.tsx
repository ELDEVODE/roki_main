"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose
}: ToastProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Get appropriate icon and colors based on type
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-900/80',
          border: 'border-green-700',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          shadow: 'shadow-green-900/20'
        };
      case 'error':
        return {
          bg: 'bg-red-900/80',
          border: 'border-red-700',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          shadow: 'shadow-red-900/20'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900/80',
          border: 'border-yellow-700',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          shadow: 'shadow-yellow-900/20'
        };
      case 'info':
      default:
        return {
          bg: 'bg-purple-900/80',
          border: 'border-purple-700',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          ),
          shadow: 'shadow-purple-900/20'
        };
    }
  };

  const styles = getToastStyles();

  // If not mounted (SSR), don't render
  if (!isMounted) return null;

  // Render via portal to avoid layout issues
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-4 right-4 p-4 ${styles.bg} border ${styles.border} rounded-lg text-white shadow-lg ${styles.shadow} max-w-md z-50`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-2 mt-0.5">
            {styles.icon}
          </div>
          <div className="flex-1 mr-2">
            <p className="text-sm">{message}</p>
          </div>
          {onClose && (
            <button 
              className="flex-shrink-0 text-white/80 hover:text-white transition" 
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
} 