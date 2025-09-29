/** @type {import('next').NextConfig} */

// Suppress punycode deprecation warnings
if (typeof process !== 'undefined') {
  const originalEmit = process.emit;
  process.emit = function (name, data, ...args) {
    if (name === 'warning' && data && data.name === 'DeprecationWarning' && data.message.includes('punycode')) {
      return false;
    }
    return originalEmit.apply(process, arguments);
  };
}

const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Enable modern bundling optimizations
    // optimizeCss: true, // Disabled due to critters module issue
    // Note: ppr is canary-only; disabled to avoid dev error
    // serverActions require specific Next.js versions; keep default
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // Enable React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Enable modern bundling features
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  webpack: (config, { dev, isServer }) => {
    // Suppress deprecation warnings
    const originalEmit = process.emit;
    process.emit = function (name, data, ...args) {
      if (name === 'warning' && data && data.name === 'DeprecationWarning' && data.message.includes('punycode')) {
        return false;
      }
      return originalEmit.apply(process, arguments);
    };
    
    // Fix module system compatibility
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        punycode: require.resolve('punycode.js'),
      },
      alias: {
        ...config.resolve.alias,
        '@emotion/is-prop-valid': require.resolve('@emotion/is-prop-valid'),
        punycode: require.resolve('punycode.js'),
      },
    };
    
    return config;
  },
}

module.exports = nextConfig
