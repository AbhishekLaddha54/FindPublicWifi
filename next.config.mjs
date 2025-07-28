/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export - Vercel supports serverless functions on free tier
  // output: 'export', // Remove this line
  // trailingSlash: true, // Remove this line
  // skipTrailingSlashRedirect: true, // Remove this line
  // distDir: 'out', // Remove this line
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization - keep unoptimized for compatibility
  images: {
    unoptimized: true,
  },
  
  // PWA and performance optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
