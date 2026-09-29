import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/estate`, priority: 0.9 },
    { url: `${base}/weddings`, priority: 0.9 },
    { url: `${base}/gallery`, priority: 0.8 },
    { url: `${base}/tour`, priority: 0.9 },
    { url: `${base}/love-notes`, priority: 0.6 },
  ];
}
