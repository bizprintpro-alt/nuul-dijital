import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://nuul.mn", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://nuul.mn/auth/signin", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://nuul.mn/auth/signup", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
