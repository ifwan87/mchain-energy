/** @type {import('next').NextConfig} */
const repo = 'mchain-energy'
const assetPrefix = `/${repo}/`
const basePath = `/${repo}`
const nextConfig = {
  output: 'export',
  assetPrefix: assetPrefix,
  basePath: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Exclude backend directory from frontend build
    config.resolve.alias = {
      ...config.resolve.alias,
      './backend': false,
    }
    return config
  },
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: 'devnet',
    NEXT_PUBLIC_RPC_ENDPOINT: 'https://api.devnet.solana.com',
  },
};

module.exports = nextConfig;
