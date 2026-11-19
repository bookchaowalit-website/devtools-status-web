import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The old project list moved to the portfolio hub.
  async redirects() {
    return [{ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true }];
  },
};

export default nextConfig;
