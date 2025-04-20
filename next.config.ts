import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle PDF parsing libraries
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
  // Fix issues with pdf-parse on client side
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
