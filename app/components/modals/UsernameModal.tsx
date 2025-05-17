"use client";
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string) => void;
  defaultUsername: string;
}

export default function UsernameModal({
  isOpen,
  onClose,
  onSubmit,
  defaultUsername
}: UsernameModalProps) {
  const [username, setUsername] = useState(defaultUsername);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 text-left align-middle shadow-xl shadow-purple-900/30 border border-purple-900/30 transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-white mb-1"
                >
                  Choose a Display Name
                </Dialog.Title>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-300 mb-4">
                    Enter a display name that will be visible to others in the channel.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Enter your display name"
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-white shadow-lg shadow-purple-600/20"
                        disabled={!username.trim()}
                      >
                        Join Channel
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 