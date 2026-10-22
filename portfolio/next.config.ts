import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.PORTFOLIO_DEMO === "1" ? ".next-demo" : ".next",
};

export default nextConfig;
