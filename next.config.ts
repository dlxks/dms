import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  eslint: {
    // ⚠️ WARNING: This disables ESLint during builds entirely.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
