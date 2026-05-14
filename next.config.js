const basePath = process.env.NEXT_BASE_PATH || '';
const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS || '127.0.0.1,localhost,51.75.67.76,51.195.102.49')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins,
  basePath,
  output: 'standalone',
  reactStrictMode: true
};

module.exports = nextConfig;
