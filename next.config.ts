import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 1. This must stay at the top level for MilesWeb hosting */
  output: 'standalone', 

  /* 2. Move this OUT of experimental to the top level */
  allowedDevOrigins: [
    'https://steedless-regan-oversparingly.ngrok-free.dev', 
    'http://192.168.1.33:3000'
  ],

  /* 3. Empty experimental object or remove it if not needed */
  experimental: {
    // Other experimental features would go here
  },
};

export default nextConfig;