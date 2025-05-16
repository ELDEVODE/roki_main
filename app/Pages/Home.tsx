import { useState, useEffect } from "react";

// shadcn button
import Header from "@/app/components/Header";
import Image from "next/image";

export default function HomePage() {
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

  // civic user state
  //   const { user } = useUser();

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-900/20 via-black to-black opacity-80"></div>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl"></div>
      </div>

      {/* Header - Modern Sticky */}
      <Header />

      {/* Hero Section - Modern with 3D elements */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-center md:text-left md:pr-6 lg:pr-12">
              <div className="inline-flex items-center px-3 py-1 mb-4 md:mb-6 rounded-full bg-purple-900/30 border border-purple-700/30 text-purple-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Now in Public Beta
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Reimagine
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  {" "}
                  Community
                </span>{" "}
                Ownership
              </h1>

              <p className="text-base sm:text-lg text-gray-400 max-w-lg mx-auto md:mx-0 mb-6 md:mb-8">
                The next-generation platform where tokens unlock experiences,
                and communities thrive without intermediaries.
              </p>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg font-medium transition shadow-lg shadow-purple-500/20 flex items-center justify-center">
                  <span>Start Building</span>
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-purple-500 rounded-lg font-medium transition flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center justify-center md:justify-start space-x-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-black bg-gray-800"
                    ></div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-purple-400 font-medium">Join the </span>{" "}
                  communities already building
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 mt-12 md:mt-0 relative">
              {/* Container for image with strobe neon effect */}
              <div className="relative flex items-center justify-center">
                
                {/* Image with intense neon glow that follows PNG outline with rounded bottom */}
                <div className="relative z-10 rounded-t-none rounded-b-full overflow-hidden bg-black/20 p-2 max-w-[90%] mx-auto">
                  <Image 
                    src="/output-onlinepngtools.png" 
                    alt="Community members" 
                    width={700}
                    height={420}
                    className="w-full h-auto object-contain neon-glow"
                    priority
                  />
                </div>
              </div>

              {/* Style for neon strobe effect */}
              <style jsx global>{`
                .neon-glow {
                  position: relative;
                  filter: drop-shadow(0 0 2px rgba(255, 0, 255, 0.8))
                         drop-shadow(0 0 4px rgba(123, 31, 162, 0.9))
                         drop-shadow(0 0 6px rgba(103, 232, 249, 0.7));
                  will-change: filter;
                  animation: neon-strobe 1.5s infinite alternate;
                }
                
                @keyframes neon-strobe {
                  0%, 18%, 22%, 25%, 53%, 57%, 100% {
                    filter: drop-shadow(0 0 2px rgba(255, 0, 255, 0.8))
                           drop-shadow(0 0 4px rgba(123, 31, 162, 0.9))
                           drop-shadow(0 0 6px rgba(103, 232, 249, 0.7));
                  }
                  
                  20%, 24%, 55% {
                    filter: drop-shadow(0 0 2px rgba(255, 0, 255, 0.9))
                           drop-shadow(0 0 4px rgba(123, 31, 162, 1))
                           drop-shadow(0 0 8px rgba(103, 232, 249, 0.8));
                  }
                }
              `}</style>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-600/10 blur-2xl rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-600/10 blur-2xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by logos */}
      {/* <section className="py-12 px-6 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-medium text-gray-500 mb-8">
            TRUSTED BY INDUSTRY LEADERS
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-800/50 rounded-md mx-auto w-full"
              ></div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-purple-900/30 border border-purple-700/30 text-purple-400 text-xs font-medium">
              FEATURES
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Designed for{" "}
              <span className="text-purple-400">Web3 Communities</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Everything you need to grow, engage, and monetize your community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "🔐",
                title: "Token-Gated Access",
                desc: "Exclusive spaces for token holders with customizable requirements",
                color: "from-purple-600 to-indigo-600",
              },
              {
                icon: "💎",
                title: "Premium Memberships",
                desc: "Recurring revenue through token subscriptions",
                color: "from-blue-600 to-cyan-600",
              },
              {
                icon: "🤝",
                title: "Collaboration Tools",
                desc: "Built-in task management and document sharing",
                color: "from-emerald-600 to-teal-600",
              },
              {
                icon: "📊",
                title: "Real-time Analytics",
                desc: "Track engagement and token holder activity",
                color: "from-amber-600 to-orange-600",
              },
              {
                icon: "🔄",
                title: "Automated Rewards",
                desc: "Distribute tokens for participation and contributions",
                color: "from-rose-600 to-pink-600",
              },
              {
                icon: "🔗",
                title: "Multi-chain Ready",
                desc: "Coming soon: Ethereum, Polygon, and more",
                color: "from-indigo-600 to-blue-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all hover:translate-y-[-5px] group"
              >
                <div
                  className={`w-12 h-12 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}
                >
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-purple-900/10 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-purple-900/30 border border-purple-700/30 text-purple-400 text-xs font-medium">
                WHY CHOOSE US
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for creators{" "}
                <span className="text-purple-400">by creators</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                We understand the challenges of building engaged communities in
                Web3. Our platform empowers you with all the tools needed to
                succeed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { number: "100%", label: "Revenue to Creators" },
                  { number: "0%", label: "Platform Fees" },
                  { number: "24/7", label: "Community Support" },
                  { number: "10x", label: "Higher Engagement" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
                  >
                    <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                      {stat.number}
                    </div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute inset-[10%] bg-gray-900 rounded-full flex items-center justify-center p-6 border border-gray-800">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-[1px]">
                    <div className="absolute inset-[1px] rounded-full bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">Join Today</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Start with a free account
                        </p>
                        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2 rounded-lg text-sm font-medium shadow-lg shadow-purple-600/20">
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-6 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-purple-900/30 border border-purple-700/30 text-purple-400 text-xs font-medium">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-purple-400">Users Say</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Communities thriving with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 mb-6">
                  "Roki has transformed how we engage with our community.
                  Token-gated access and automated rewards have increased
                  participation by over 200%."
                </p>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-800 mr-3"></div>
                  <div>
                    <h4 className="font-medium">Community Leader</h4>
                    <p className="text-sm text-gray-500">Web3 Project</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black"></div>
        </div>

        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-black border border-purple-900/20 rounded-3xl p-1 shadow-2xl shadow-purple-900/20">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to{" "}
              <span className="text-purple-400">Own Your Community</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join the future of decentralized collaboration today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8 py-4 rounded-lg font-medium transition shadow-lg shadow-purple-600/20">
                Get Started - It's Free
              </button>
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-purple-500 px-8 py-4 rounded-lg font-medium transition">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-800/50 bg-black/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">R</span>
                </div>
                <span className="text-xl font-bold">Roki</span>
              </div>

              <p className="text-gray-400 mb-6 max-w-sm">
                The next-generation platform for Web3 communities to grow,
                engage, and monetize.
              </p>

              <div className="flex space-x-4">
                {["twitter", "discord", "github", "telegram"].map(
                  (social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition"
                    >
                      <div className="w-5 h-5 bg-gray-600 rounded-sm"></div>
                    </a>
                  )
                )}
              </div>
            </div>

            {[
              {
                title: "Product",
                items: ["Features", "Pricing", "Integrations", "Roadmap"],
              },
              {
                title: "Resources",
                items: ["Documentation", "Blog", "Community", "Guides"],
              },
              {
                title: "Company",
                items: ["About", "Careers", "Contact", "Press"],
              },
            ].map((column, i) => (
              <div key={i}>
                <h4 className="text-gray-200 font-semibold mb-6">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.items.map((item, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-purple-400 transition text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Roki Labs. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-purple-400 transition text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-purple-400 transition text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-purple-400 transition text-sm"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// export default Home;
