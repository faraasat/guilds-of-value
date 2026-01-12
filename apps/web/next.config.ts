import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // // Standard way to handle Node.js native or SSR-problematic packages
  // serverExternalPackages: [
  //   "helia",
  //   "@helia/unixfs",
  //   "node-datachannel",
  //   "@libp2p/webrtc",
  // ],
  // webpack: (config, { isServer }) => {
  //   // Standard polyfills for Helia/libp2p on the client
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       net: false,
  //       tls: false,
  //       crypto: false,
  //       os: false,
  //       path: false,
  //       stream: false,
  //       perf_hooks: false,
  //     };
  //     // Tell Webpack to completely ignore 'node-datachannel' on the client
  //     config.resolve.alias = {
  //       ...config.resolve.alias,
  //       "node-datachannel": false,
  //       "utf-8-validate": false,
  //       bufferutil: false,
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
