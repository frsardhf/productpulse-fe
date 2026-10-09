/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
