import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://eventsatglenlary.com";
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/estate`, priority: 0.9 },
    { url: `${base}/weddings`, priority: 0.9 },
    { url: `${base}/gallery`, priority: 0.8 },
    { url: `${base}/tour`, priority: 0.9 },
    { url: `${base}/vendors`, priority: 0.6 },
    { url: `${base}/love-notes`, priority: 0.6 },
  ];
}
