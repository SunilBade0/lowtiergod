import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow connections from the phone on the local network!
  allowedDevOrigins: ['192.168.29.176', '192.168.29.176:3000'],
};

export default nextConfig;
