import type { NextConfig } from "next";
import { join } from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Set an alias so that any import of "isomorphic-ws" is redirected to our fix module.
    config.resolve.alias['isomorphic-ws'] = join(__dirname, 'fix-isomorphic-ws.js');
    // Disable persistent filesystem caching:
    config.cache = false;
    return config;
  },
};

export default nextConfig;
