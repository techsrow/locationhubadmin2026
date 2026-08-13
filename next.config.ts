import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.pagedaddy.in",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
