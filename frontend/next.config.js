/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'affilimart.com',
      'cdn.affilimart.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      'storage.googleapis.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Internationalization
  i18n: {
    locales: ['uz', 'ru', 'en', 'ar'],
    defaultLocale: 'uz',
    localeDetection: false,
    domains: [
      {
        domain: 'affilimart.com',
        defaultLocale: 'uz'
      },
      {
        domain: 'ru.affilimart.com',
        defaultLocale: 'ru'
      },
      {
        domain: 'en.affilimart.com',
        defaultLocale: 'en'
      }
    ]
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true
      },
      {
        source: '/merchant',
        destination: '/merchant/dashboard',
        permanent: true
      },
      {
        source: '/blogger',
        destination: '/blogger/dashboard',
        permanent: true
      }
    ];
  },

  // Rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:5000'}/api/:path*`
      }
    ];
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }

    // Add custom webpack plugins
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId)
      })
    );

    return config;
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true
  },

  // TypeScript
  typescript: {
    ignoreBuildErrors: false
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: false
  },

  // Output configuration
  output: 'standalone',

  // Trailing slash
  trailingSlash: false,

  // Powered by header
  poweredByHeader: false,

  // React strict mode
  reactStrictMode: true,

  // Swc minify
  swcMinify: true
};

module.exports = withPWA(nextConfig); 