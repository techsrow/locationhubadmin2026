import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http://localhost:5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
