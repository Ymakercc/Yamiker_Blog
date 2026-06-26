import type { MetadataRoute } from "next";

// Allow the public site; keep the anonymized telemetry JSON out of indexes.
// NOTE: intentionally does NOT list the hidden panel route — doing so would
// advertise it. That route stays unindexed via its own `noindex` metadata.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/data/"],
    },
  };
}
