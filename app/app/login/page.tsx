"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  // disable login when privy is not ready and the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div>
      <EnhancedLoginComponent />
    </div>
  );
}

function EnhancedLoginComponent() {
  const { login, ready, authenticated } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("email");

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex overflow-hidden">
      {/* Left side with animated elements */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
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

        {/* 3D-like wireframe globe */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="globe"></div>
        </div>

        {/* Logo with glow effect */}
        <div
          className={`absolute top-6 left-8 z-20 transition-all duration-1000 transform ${
            loaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-20 h-14 rounded-lg flex items-center justify-center logo-glow">
              <Image
                src="/roki-gradient.png"
                alt="Roki Logo"
                width={80}
                height={56}
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Text overlay with staggered animation */}
        <div className="absolute bottom-16 left-16 z-20 max-w-sm">
          <h2
            className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 transition-all duration-700 delay-300 transform ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Welcome Back
          </h2>
          <p
            className={`text-gray-300 text-sm mb-8 leading-relaxed transition-all duration-700 delay-500 transform ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Log in to access your communities, manage your tokens, and continue
            your digital journey in the world of Web3.
          </p>
          <div
            className={`flex items-center space-x-4 transition-all duration-700 delay-700 transform ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner flex items-center justify-center overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-indigo-600/30 blur-sm"></div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-300">
              Join <span className="text-purple-400 font-semibold">500+</span>{" "}
              communities
            </p>
          </div>
        </div>
      </div>

      {/* Login form side with animations */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden py-8 px-6 flex justify-center">
          <div className="w-20 h-14 rounded-lg flex items-center justify-center logo-glow">
            <img
              src="http://localhost:3000/roki-gradient.png"
              alt="Roki Logo"
              width={80}
              height={56}
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </header>

        {/* Form container with beautiful entrance animation */}
        <div className="flex-grow flex items-center justify-center p-6">
          <div
            className={`w-full max-w-md transition-all duration-1000 transform ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Welcome Back
              </h1>
              <p className="text-gray-400">Sign in to continue your journey</p>
            </div>

            {/* Login button with hover effects */}
            <button
              onClick={login}
              disabled={disableLogin}
              className="w-full group relative flex items-center justify-center px-6 py-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Button glow effect */}
              <span className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></span>

              {/* Button shine effect */}
              <span className="absolute inset-0 w-2/3 h-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[200%] transition-all duration-1000"></span>

              <span className="text-lg font-semibold relative z-10">Login</span>
            </button>

            {/* Social proof */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-4">Trusted by industry leaders</p>
              <div className="flex justify-center space-x-8 opacity-70">
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Roki. All rights reserved.
          </p>
        </footer>
      </div>

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
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
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

        /* 3D Globe */
        .globe {
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: transparent;
          box-shadow: inset 0 0 50px rgba(168, 85, 247, 0.2);
          position: relative;
          transform-style: preserve-3d;
          animation: globe-rotate 20s linear infinite;
        }

        .globe:before,
        .globe:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          top: 0;
          left: 0;
          border: 1px solid rgba(138, 75, 175, 0.2);
        }

        .globe:before {
          transform: rotateX(70deg);
        }

        .globe:after {
          transform: rotateY(70deg);
        }

        @keyframes globe-rotate {
          0% {
            transform: rotate3d(1, 1, 1, 0deg);
          }
          100% {
            transform: rotate3d(1, 1, 1, 360deg);
          }
        }
      `}</style>
    </div>
  );
}
