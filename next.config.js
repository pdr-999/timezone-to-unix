/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  distDir: "docs",
  basePath: "/timezone-to-unix",
};

module.exports = nextConfig;
