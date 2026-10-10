/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.metmuseum.org",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
