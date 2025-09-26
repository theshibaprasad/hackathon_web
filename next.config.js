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
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
    
    // Exclude service worker from server-side bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        './sw.js': 'commonjs ./sw.js'
      });
    }
    
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
        // Additional alias to prevent punycode deprecation warnings
        punycode: require.resolve('punycode.js'),
      },
    };

    // Optimize bundle splitting for better performance
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
        usedExports: true,
        sideEffects: false,
      };
    }

    // Fix CommonJS/ES module compatibility
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.m?js$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    };

    // Optimize webpack cache for better performance
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
