/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // CORS headers for extension API endpoints — applied to ALL responses including
  // Next.js's built-in OPTIONS handler (which doesn't run our route OPTIONS export)
  async headers() {
    const corsHeaders = [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
      { key: 'Access-Control-Allow-Headers', value: 'X-API-Key, X-Extension-Version, Content-Type, Authorization' },
      { key: 'Access-Control-Max-Age', value: '86400' },
    ]
    return [
      { source: '/api/usage', headers: corsHeaders },
      { source: '/api/usage/:path*', headers: corsHeaders },
    ]
  },
}

export default nextConfig
