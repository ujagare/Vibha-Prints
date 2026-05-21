/**
 * imageUtils.js – SEO-friendly image helpers
 * Har image par proper alt text ensure karta hai
 */

/**
 * SEO-optimized image component
 * Usage: <SeoImage src={img} alt="logo design pune" category="logo" />
 */
import React from "react";

export function SeoImage({ src, alt, category = "design", className = "", style = {}, lazy = true }) {
  // Auto-generate alt text agar missing ho
  const seoAlt = alt || generateAltText(src, category);
  
  return (
    <img
      src={src}
      alt={seoAlt}
      className={className}
      style={style}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      onError={(e) => {
        // Broken image tracking
        console.warn(`[SEO] Broken image: ${src}`);
        e.target.style.display = "none";
      }}
    />
  );
}

/**
 * Generate SEO alt text from filename
 */
export function generateAltText(src, category = "design") {
  if (!src) return "Vibha Art – Graphic Design & Printing Pune";
  
  const filename = src.split("/").pop().split(".")[0];
  const clean = filename
    .replace(/[-_]/g, " ")
    .replace(/[A-Z]/g, c => " " + c.toLowerCase())
    .replace(/\s+/g, " ")
    .trim();
  
  const categoryMap = {
    logo:      "logo design",
    banner:    "banner printing",
    brochure:  "brochure design",
    card:      "business card",
    portfolio: "portfolio",
    design:    "graphic design",
  };
  
  const cat = categoryMap[category] || "design";
  return `${clean} – ${cat} by Vibha Art Pune`.substring(0, 125);
}

/**
 * Audit: Find all images without alt text
 * Run in browser console: window.auditImageAlt()
 */
if (typeof window !== "undefined") {
  window.auditImageAlt = () => {
    const imgs = document.querySelectorAll("img");
    const missing = [];
    imgs.forEach(img => {
      if (!img.alt || img.alt.trim() === "") {
        missing.push({ src: img.src, element: img });
        img.style.outline = "3px solid red"; // Highlight missing
      }
    });
    console.log(`[SEO Audit] ${missing.length} images missing alt text:`, missing);
    return missing;
  };
}
