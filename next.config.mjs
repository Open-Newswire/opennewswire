/** @type {import('next').NextConfig} */
const nextConfig = {
  nodeMiddleware: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
