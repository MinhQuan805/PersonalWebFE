import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@ant-design/v5-patch-for-react-19'],
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     fs: false,
  //   };
  //   return config;
  // },
};

export default nextConfig;
