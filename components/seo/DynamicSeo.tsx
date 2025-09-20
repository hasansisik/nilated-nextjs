"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

/**
 * Dynamic SEO component for client-side rendered pages
 * This is useful for pages where metadata needs to be updated
 * dynamically after the page loads (for client-side data)
 */
export default function DynamicSeo({
  title,
  description,
  keywords,
  ogImage = "/og-image.jpg",
  ogType = "website",
  ogTitle,
  ogDescription,
  canonicalUrl,
}: SeoProps) {
  const pathname = usePathname();
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    // Get the site URL dynamically
    setSiteUrl(window.location.origin);
    
    // Update the document title
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        const newMetaDescription = document.createElement("meta");
        newMetaDescription.setAttribute("name", "description");
        newMetaDescription.setAttribute("content", description);
        document.head.appendChild(newMetaDescription);
      }
    }
    
    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        const newMetaKeywords = document.createElement("meta");
        newMetaKeywords.setAttribute("name", "keywords");
        newMetaKeywords.setAttribute("content", keywords);
        document.head.appendChild(newMetaKeywords);
      }
    }
    
    // Set OpenGraph meta tags
    const metaTags = [
      { property: "og:type", content: ogType },
      { property: "og:url", content: `${siteUrl}${pathname}` },
      { property: "og:title", content: ogTitle || title },
      { property: "og:description", content: ogDescription || description },
      { property: "og:image", content: `${siteUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}` },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:url", content: `${siteUrl}${pathname}` },
      { property: "twitter:title", content: ogTitle || title },
      { property: "twitter:description", content: ogDescription || description },
      { property: "twitter:image", content: `${siteUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}` },
    ];
    
    metaTags.forEach(({ property, content }) => {
      if (content) {
        const metaTag = document.querySelector(`meta[property="${property}"]`);
        if (metaTag) {
          metaTag.setAttribute("content", content);
        } else {
          const newMetaTag = document.createElement("meta");
          newMetaTag.setAttribute("property", property);
          newMetaTag.setAttribute("content", content);
          document.head.appendChild(newMetaTag);
        }
      }
    });
    
    // Set canonical URL
    const fullCanonicalUrl = canonicalUrl || `${siteUrl}${pathname}`;
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", fullCanonicalUrl);
    } else {
      const newCanonicalLink = document.createElement("link");
      newCanonicalLink.setAttribute("rel", "canonical");
      newCanonicalLink.setAttribute("href", fullCanonicalUrl);
      document.head.appendChild(newCanonicalLink);
    }
  }, [title, description, keywords, ogImage, ogType, ogTitle, ogDescription, canonicalUrl, pathname, siteUrl]);
  
  return null; // This component doesn't render anything visible
} 