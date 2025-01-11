/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/personal-website",
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
