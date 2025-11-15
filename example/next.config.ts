import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  serverExternalPackages: ['@napi-rs/canvas'],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
