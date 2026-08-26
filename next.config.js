/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Files under /downloads/ are private hand-offs (unlisted paths), never
  // meant for search results. Keep them out of indexes without listing the
  // paths in robots.txt — doing that would advertise them.
  async headers() {
    return [
      {
        source: "/downloads/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
