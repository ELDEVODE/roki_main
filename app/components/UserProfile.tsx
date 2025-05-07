"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Show nothing if user is not authenticated or data is still loading
  if (!(ready && authenticated) || !user) {
    return null;
  }

  return (
    <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
        Your Profile
      </h2>
      <div className="space-y-4">
        <p className="text-gray-300">
          User ID: <span className="text-purple-400">{user.id}</span>
        </p>
        <p className="text-gray-300">
          Created:{" "}
          <span className="text-purple-400">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </p>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">
            Linked Accounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Apple", value: user.apple?.email },
              { name: "Discord", value: user.discord?.username },
              { name: "Email", value: user.email?.address },
              { name: "Farcaster", value: user.farcaster?.username },
              { name: "GitHub", value: user.github?.username },
              { name: "Google", value: user.google?.email },
              { name: "Instagram", value: user.instagram?.username },
              { name: "LinkedIn", value: user.linkedin?.email },
              { name: "Phone", value: user.phone?.number },
              { name: "Spotify", value: user.spotify?.email },
              { name: "Telegram", value: user.telegram?.username },
              { name: "TikTok", value: user.tiktok?.username },
              { name: "Twitter", value: user.twitter?.username },
              { name: "Wallet", value: user.wallet?.address },
            ].map(({ name, value }) => (
              <div
                key={name}
                className="flex items-center p-3 rounded-lg bg-gray-700/30"
              >
                <span className="text-gray-400 min-w-[100px]">{name}:</span>
                <span className="text-purple-300 truncate">
                  {value || "None"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">
            Account Status
          </h3>
          <div className="space-y-2">
            <p className="text-gray-300">
              Terms Accepted:
              <span
                className={`ml-2 ${
                  user.hasAcceptedTerms ? "text-green-400" : "text-red-400"
                }`}
              >
                {user.hasAcceptedTerms ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-gray-300">
              Guest Account:
              <span
                className={`ml-2 ${
                  user.isGuest ? "text-yellow-400" : "text-green-400"
                }`}
              >
                {user.isGuest ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
