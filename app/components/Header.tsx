import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`py-4 px-6 fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-20 h-14 rounded-lg  flex items-center justify-center">
            <img
              src="./roki-gradient.png"
              title="Roki-Logo"
              className="rounded-lg"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Features
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Solutions
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Resources
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {/* <Link href="/login">
            <button className="hidden md:block text-sm font-medium px-4 py-2 text-gray-300 hover:text-white transition">
              Login
            </button>
          </Link> */}

          {/* <UserButton className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-purple-500/20 transition-all" /> */}
          <Link href="/login">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-purple-500/20 transition-all">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
