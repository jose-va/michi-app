import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 5,
  },
  async redirects() {
    return [
      {
        source: "/product/favorite",
        destination: "/product",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
