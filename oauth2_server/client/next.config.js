/** @type {import('next').NextConfig} */

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8080/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};
