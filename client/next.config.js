/** @type {import('next').NextConfig} */
const path = require('path');
const i18n = require('./i18n.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  i18n
}

module.exports = nextConfig
