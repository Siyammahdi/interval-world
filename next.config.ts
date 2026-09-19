import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid auto-writing AGENTS.md / CLAUDE.md on every `next dev`
  agentRules: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.intervalworld.com" },
      { protocol: "https", hostname: "www.rci.com" },
      { protocol: "https", hostname: "f1.media.brightcove.com" },
      { protocol: "http", hostname: "f1.media.brightcove.com" },
      { protocol: "https", hostname: "cf-images.us-east-1.prod.boltdns.net" },
    ],
  },
};

export default nextConfig;
