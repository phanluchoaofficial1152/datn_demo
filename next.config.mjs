/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.postimg.cc",
      },
    ],
  },
};

export default nextConfig;
