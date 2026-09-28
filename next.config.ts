import type { NextConfig } from "next";

/** Public R2 bucket URL. When set, /images/* and /videos/* are served from it instead of /public. */
const mediaBase = (process.env.NEXT_PUBLIC_MEDIA_URL || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Avoid auto-writing AGENTS.md / CLAUDE.md on every `next dev`
  agentRules: false,
  images: {
    ...(mediaBase ? { loader: "custom" as const, loaderFile: "./lib/image-loader.ts" } : {}),
    remotePatterns: [
      { protocol: "https", hostname: "www.intervalworld.com" },
      { protocol: "https", hostname: "www.rci.com" },
      { protocol: "https", hostname: "f1.media.brightcove.com" },
      { protocol: "http", hostname: "f1.media.brightcove.com" },
      { protocol: "https", hostname: "cf-images.us-east-1.prod.boltdns.net" },
    ],
  },
  async redirects() {
    if (!mediaBase) return [];
    // Catches media paths in CSS, CMS HTML, and plain <img>/<video> tags
    return ["images", "videos"].map((dir) => ({
      source: `/${dir}/:path*`,
      destination: `${mediaBase}/${dir}/:path*`,
      permanent: false,
    }));
  },
};

export default nextConfig;
