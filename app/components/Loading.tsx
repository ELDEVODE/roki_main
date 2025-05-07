"use client";
import { useEffect, useState } from "react";

export default function LoadingComponent() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    setLoaded(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 8;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex overflow-hidden">
      {/* Background elements - similar to login page */}
      <div className="fixed inset-0">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="stars-container">
              <div className="stars"></div>
              <div className="stars2"></div>
              <div className="stars3"></div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="particle-1"></div>
          <div className="particle-2"></div>
          <div className="particle-3"></div>
          <div className="particle-4"></div>
        </div>

        {/* Animated glowing orbs */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-600/40 blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-600/30 blur-xl animate-float"></div>
          <div className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-blue-600/20 blur-lg animate-pulse-slower"></div>
        </div>
      </div>

      {/* Logo + Loading animation container */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10">
        {/* Logo with glow effect */}
        <div
          className={`mb-12 transition-all duration-1000 transform ${
            loaded ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <div className="w-32 h-20 rounded-lg flex items-center justify-center logo-glow">
            <img
              src="/roki-gradient.png"
              alt="Roki Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Loading Text */}
        <div
          className={`text-center mb-8 transition-all duration-700 delay-200 transform ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-2">
            Loading Experience
          </h2>
          <p className="text-gray-400 text-sm">
            Please wait while we prepare your journey
          </p>
        </div>

        {/* Animated progress bar */}
        <div
          className={`w-64 transition-all duration-700 delay-400 transform ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 pulse-glow"
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease-out",
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Connecting</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Animated loading spinner */}
        <div
          className={`mt-10 transition-all duration-700 delay-600 transform ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="loader-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* Status messages that change */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-800 transform ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="status-message">
            <span className="text-sm text-gray-400">
              Connecting to blockchain
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-6 px-6 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 Roki. All rights reserved.
        </p>
      </footer>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.08);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 8s infinite;
        }

        .animate-float {
          animation: float 10s infinite;
        }

        .logo-glow {
          //   box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
        }

        .pulse-glow {
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
          }
          50% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
          }
        }

        /* Stars background */
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .stars,
        .stars2,
        .stars3 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
          background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOTYgMjk2Ij48ZyBmaWxsPSIjZmZmIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxIi8+PC9nPjwvc3ZnPg==")
            repeat;
          background-size: 100px 100px;
          animation: stars-move 100s linear infinite;
          opacity: 0.3;
        }

        .stars2 {
          background-size: 150px 150px;
          animation-duration: 125s;
          opacity: 0.2;
        }

        .stars3 {
          background-size: 200px 200px;
          animation-duration: 150s;
          opacity: 0.1;
        }

        @keyframes stars-move {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 10000px 5000px;
          }
        }

        /* Floating particles */
        .particle-1,
        .particle-2,
        .particle-3,
        .particle-4 {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0)
          );
        }

        .particle-1 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 20%;
          animation: particle-float 20s ease-in-out infinite;
        }

        .particle-2 {
          width: 60px;
          height: 60px;
          top: 35%;
          left: 70%;
          animation: particle-float 15s ease-in-out infinite 2s;
        }

        .particle-3 {
          width: 120px;
          height: 120px;
          top: 70%;
          left: 30%;
          animation: particle-float 25s ease-in-out infinite 1s;
        }

        .particle-4 {
          width: 80px;
          height: 80px;
          top: 85%;
          left: 60%;
          animation: particle-float 18s ease-in-out infinite 3s;
        }

        @keyframes particle-float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(15px, 15px);
          }
          50% {
            transform: translate(0, 30px);
          }
          75% {
            transform: translate(-15px, 15px);
          }
        }

        /* Loading spinner */
        .loader-ring {
          display: inline-block;
          position: relative;
          width: 40px;
          height: 40px;
        }

        .loader-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 32px;
          height: 32px;
          margin: 4px;
          border: 2px solid transparent;
          border-radius: 50%;
          animation: loader-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: transparent;
          border-top-color: #a855f7;
        }

        .loader-ring div:nth-child(1) {
          animation-delay: -0.45s;
          border-top-color: #a855f7;
        }

        .loader-ring div:nth-child(2) {
          animation-delay: -0.3s;
          border-top-color: #8b5cf6;
        }

        .loader-ring div:nth-child(3) {
          animation-delay: -0.15s;
          border-top-color: #6366f1;
        }

        .loader-ring div:nth-child(4) {
          border-top-color: #4f46e5;
        }

        @keyframes loader-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Status message animation */
        .status-message {
          position: relative;
          height: 20px;
          overflow: hidden;
        }

        .status-message span {
          display: block;
          animation: status-change 5s infinite;
        }

        @keyframes status-change {
          0%,
          25% {
            opacity: 1;
            transform: translateY(0);
          }
          33%,
          35% {
            opacity: 0;
            transform: translateY(-20px);
          }
          36%,
          38% {
            opacity: 0;
            transform: translateY(20px);
          }
          39%,
          65% {
            opacity: 1;
            transform: translateY(0);
            content: "Connecting to blockchain";
          }
          73%,
          75% {
            opacity: 0;
            transform: translateY(-20px);
          }
          76%,
          78% {
            opacity: 0;
            transform: translateY(20px);
          }
          79%,
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .status-message span::after {
          content: "Connecting to blockchain";
          animation: text-change 5s infinite;
        }

        @keyframes text-change {
          0%,
          33% {
            content: "Connecting to blockchain";
          }
          34%,
          67% {
            content: "Verifying identity";
          }
          68%,
          100% {
            content: "Preparing your experience";
          }
        }
      `}</style>
    </div>
  );
}
