import type { NextConfig } from "next";

// Old WordPress URLs on eventsatglenlary.com, sent to the closest new page so
// indexed links and bookmarks keep working after the domain moves to Vercel.
const galleryPaths = [
  "gallery",
  "photo-gallery",
  "sliders",
  "allison-greg",
  "carrie-ben",
  "elizabeth-steven",
  "malloree-charlie",
  "nicole-arthur",
  "ninas-shoot",
  "rachel-ajay",
  "sandra-brad",
  "sarah-brian",
  "styled-shoot",
  "barn-launch-event",
  "test-gallery-page-1",
];

const oldPaths: [string, string][] = [
  ["about-us", "/estate"],
  ["about", "/estate"],
  ["event-packages", "/weddings"],
  ["vendors", "/weddings"],
  ["testimonials", "/love-notes"],
  ["contact-us-we-love-hearing-from-you", "/tour"],
  ["our-blog", "/"],
  ["test", "/"],
  ["test-2", "/"],
  ...galleryPaths
    .filter((p) => p !== "gallery")
    .map((p): [string, string] => [p, "/gallery"]),
];

const oldQueries: [string, string][] = [
  ["package", "/weddings"],
  ["vendor", "/weddings"],
  ["testimonials", "/love-notes"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // the temporary hosts forward to the real domain, path and all, so
      // search engines and shared links consolidate on one site
      ...["glenlary.smwolf.com", "glenlary.vercel.app"].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://eventsatglenlary.com/:path*",
        permanent: true,
      })),
      // /gallery itself is a live page, so only its old child pages redirect.
      { source: "/gallery/:path+", destination: "/gallery", permanent: true },
      ...oldPaths.map(([from, to]) => ({
        source: `/${from}/:path*`,
        destination: to,
        permanent: true,
      })),
      ...oldQueries.map(([key, to]) => ({
        source: "/",
        has: [{ type: "query" as const, key }],
        destination: to,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
