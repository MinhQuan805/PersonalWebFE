import type { NextConfig } from "next";
const { i18n } = require('./next-i18next.config');
const nextConfig: NextConfig = {
  transpilePackages: ['@ant-design/v5-patch-for-react-19'],
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
  i18n,
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     fs: false,
  //   };
  //   return config;
  // },
};

export default nextConfig;
