/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.ts|\.tsx$/,
      use: ['@svgr/webpack', 'url-loader'],
    })

    return config
  },
}

module.exports = nextConfig
