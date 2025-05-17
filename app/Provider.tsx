"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ToastProvider } from "./context/ToastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm9ye2c96022xlb0me4pdh3j6"
      clientId="client-WY5ixmnzNamEk6HFuQYxBjRsfhHq3FSYyQXJ5goQTqvnB"
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        // Set the cookie domain to your app's domain
      }}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </PrivyProvider>
  );
}
