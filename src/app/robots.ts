import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/products/", "/faq", "/contact", "/track-order"],
        disallow: ["/admin/", "/api/", "/cart", "/checkout", "/order-confirmed"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}