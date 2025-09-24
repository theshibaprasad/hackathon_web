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
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
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
        // Additional alias to prevent punycode deprecation warnings
        punycode: require.resolve('punycode.js'),
      },
    };

    // Fix exports issue by disabling problematic optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: false, // Disable code splitting to avoid vendors.js issues
    };

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
