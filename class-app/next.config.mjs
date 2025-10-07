/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/form-creation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
