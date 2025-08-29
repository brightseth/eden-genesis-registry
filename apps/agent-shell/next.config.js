/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow wildcard subdomains
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Path rewrites for agent configs
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/v1/status',
      },
    ];
  },
};

module.exports = nextConfig;