const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_OUTPUT === 'standalone' && {
    output: 'standalone',
    experimental: { outputFileTracingRoot: path.join(__dirname, '../../') },
  }),
};

module.exports = nextConfig;
