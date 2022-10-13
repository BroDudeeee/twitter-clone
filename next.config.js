/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "images.pexels.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
