/** @type {import('next').NextConfig} */
const path = require('path');
const i18n = require('./i18n.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  i18n,
  env: {
    API_URL: process.env.API_URL,
    SERVER_URL: process.env.SERVER_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  }
}

module.exports = nextConfig
