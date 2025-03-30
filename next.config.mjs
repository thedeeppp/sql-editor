/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
   webpack: (config) => {
    config.resolve.fallback = {
      "react-native": false,
      "react-native-fs": false,
      "react-native-fetch-blob": false,
    };
    return config;
  },
}


export default nextConfig
