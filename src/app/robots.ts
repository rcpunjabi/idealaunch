import { MetadataRoute } from "next";

const APP_URL = "https://idealaunch-five.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/sign-in", "/sign-up"],
        disallow: ["/dashboard", "/new", "/projects/", "/api/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
