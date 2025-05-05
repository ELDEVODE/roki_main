import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "app.localhost:3001",
            },
          ],
          destination: "/app/:path*",
        },
      ],
    };
  },
  turbopack: {
    rules: {
      // Turbopack configuration here if needed
    },
  },
};

export default nextConfig;
