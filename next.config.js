/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for API routes to prevent build-time execution
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  // Ensure API routes are not pre-rendered during build
  trailingSlash: false,
  // Configure for Vercel deployment
  output: 'standalone'
};

module.exports = nextConfig;
