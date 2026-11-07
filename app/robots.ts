import type { MetadataRoute } from "next";

const BASE_URL = "https://michisushigranada.es";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/reservation/edit",
        "/reservation/preview",
        "/product/create",
        "/product/update",
        "/api/",
        "/auth/",
        "/auth"
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
