/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "phstorage213.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
