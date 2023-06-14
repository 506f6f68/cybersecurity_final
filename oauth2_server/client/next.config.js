/** @type {import('next').NextConfig} */

module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/me",
        destination: "http://127.0.0.1:8080/api/me",
      },
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8080/:path*",
      },
      {
        source: "/oauth/:path*",
        destination: "http://127.0.0.1:8080/oauth/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};
