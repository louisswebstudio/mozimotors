import type { NextConfig } from "next";

const wpHost = process.env.WP_API_URL ? new URL(process.env.WP_API_URL).hostname : undefined;

// A WordPress on localhost / a LAN IP (dev) resolves to a private address, which the image optimizer blocks by default.
const wpIsLocal = wpHost ? /^(localhost|127\.|192\.168\.|10\.|.*\.(local|test|localhost)$)/.test(wpHost) : false;

const nextConfig: NextConfig = {
  // The financing page was removed at the client's request; keep old links working.
  async redirects() {
    return [{ source: "/financement", destination: "/acheter", permanent: true }];
  },
  images: {
    ...(wpIsLocal ? { dangerouslyAllowLocalIP: true } : {}),
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(wpHost ? [{ protocol: "https" as const, hostname: wpHost }, { protocol: "http" as const, hostname: wpHost }] : []),
    ],
  },
};

export default nextConfig;
