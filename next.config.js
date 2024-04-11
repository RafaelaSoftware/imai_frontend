/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: false,
    workboxOptions: {
      disableDevLogs: true,
    },
  });
  
  const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "tailwindui.com",
            port: "",
            pathname: "/**",
          },
        ],
      },    
  };
  
  module.exports = withPWA(nextConfig);