/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/packages/fixed-5-day",
        destination: "/packages?section=fixed-5-day",
        permanent: true,
      },
      {
        source: "/packages/fixed-7-day",
        destination: "/packages?section=fixed-7-day",
        permanent: true,
      },
      {
        source: "/packages/fixed-10-day",
        destination: "/packages?section=fixed-10-day",
        permanent: true,
      },
      {
        source: "/packages/fixed-16-day",
        destination: "/packages?section=fixed-16-day",
        permanent: true,
      },
      {
        source: "/packages/add-ons",
        destination: "/packages?section=add-ons",
        permanent: true,
      },
      {
        source: "/packages/specialty-tours",
        destination: "/packages?section=specialty-tours",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
