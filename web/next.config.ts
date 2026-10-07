import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The financing page was removed at the client's request; keep old links working.
  async redirects() {
    return [{ source: "/financement", destination: "/acheter", permanent: true }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Photos uploaded in Sanity Studio.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
