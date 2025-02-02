/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "epic.gsfc.nasa.gov",
          pathname: "/archive/natural/**",
        },
      ],
    },
  };
  
  export default nextConfig;
  