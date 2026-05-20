import { useEffect } from "react";

const SEO_DATA = {
  home: {
    title: "Vibha Art | Graphic Design & Printing Services in Pune",
    description: "Vibha Art Pune — Professional graphic design, flex printing, visiting cards, banners, T-shirt printing & branding. Quality prints at affordable rates. Call +91-8624948046!",
    keywords: "graphic design pune, printing services pune, flex printing pune, visiting card printing pune, banner printing pune, logo design pune, branding pune",
    canonical: "https://www.vibhaprints.com/",
  },
  about: {
    title: "About Vibha Art | Pune's Trusted Printing & Design Studio",
    description: "Learn about Vibha Art — Pune's creative design and printing studio. Expert team delivering high-quality branding, printing, and design solutions. Call +91-8624948046.",
    keywords: "about vibha art pune, printing studio pune, design agency pune, creative studio maharashtra",
    canonical: "https://www.vibhaprints.com/about",
  },
  services: {
    title: "Printing & Design Services | Vibha Art Pune",
    description: "Vibha Art offers flex printing, visiting cards, banners, T-shirt printing, logo design, branding & more in Pune. Get instant quote at info@vibhapints.com or vibhart07@gmail.com.",
    keywords: "flex printing pune, visiting card printing pune, banner printing pune, logo design pune, t-shirt printing pune, brochure printing pune, sticker printing pune",
    canonical: "https://www.vibhaprints.com/services",
  },
  portfolio: {
    title: "Our Portfolio | Vibha Art Design & Print Work Pune",
    description: "Explore Vibha Art's portfolio — logo designs, banner printing, visiting cards, branding projects done for clients across Pune & Maharashtra.",
    keywords: "vibha art portfolio, design portfolio pune, print work pune, branding portfolio maharashtra",
    canonical: "https://www.vibhaprints.com/portfolio",
  },
  contact: {
    title: "Contact Vibha Art | Get Quote for Printing & Design Pune",
    description: "Contact Vibha Art Pune for printing and design services. Get free quotes. WhatsApp or call +91-8624948046 or email info@vibhapints.com / vibhart07@gmail.com today!",
    keywords: "contact vibha art pune, printing quote pune, vibha art phone number, info@vibhapints.com, vibhart07@gmail.com",
    canonical: "https://www.vibhaprints.com/contact",
  },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Vibha Art",
  "description": "Professional graphic design and printing services in Pune, Maharashtra.",
  "url": "https://www.vibhaprints.com/",
  "telephone": "+91-8624948046",
  "email": ["info@vibhapints.com", "vibhart07@gmail.com"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Pune SB Road",
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "18.5204", "longitude": "73.8567" },
  "openingHours": "Mo-Sa 09:00-19:00",
  "priceRange": "\u20b9\u20b9",
  "areaServed": ["Pune", "Maharashtra"],
  "sameAs": [
    "https://facebook.com/vibhaart",
    "https://instagram.com/vibhaart"
  ]
};

export default function SEO({ page = "home" }) {
  const data = SEO_DATA[page] || SEO_DATA.home;

  useEffect(() => {
    document.title = data.title;

    const setMeta = (sel, val) => {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      const isOg = sel.includes("property=");
      el.setAttribute(isOg ? "property" : "name", sel.match(/["'](.*?)["']/)?.[1] || "");
      el.setAttribute("content", val);
    };

    setMeta('[name="description"]',          data.description);
    setMeta('[name="keywords"]',             data.keywords);
    setMeta('[name="robots"]',               "index, follow");
    setMeta('[name="author"]',               "Vibha Art");
    setMeta('[name="geo.region"]',           "IN-MH");
    setMeta('[name="geo.placename"]',        "Pune SB Road");
    setMeta('[property="og:title"]',         data.title);
    setMeta('[property="og:description"]',   data.description);
    setMeta('[property="og:url"]',           data.canonical);
    setMeta('[property="og:type"]',          "website");
    setMeta('[property="og:image"]',         "https://www.vibhaprints.com/assets/vibha-logo.webp");
    setMeta('[property="og:site_name"]',     "Vibha Art");
    setMeta('[property="og:locale"]',        "en_IN");
    setMeta('[name="twitter:card"]',         "summary_large_image");
    setMeta('[name="twitter:title"]',        data.title);
    setMeta('[name="twitter:description"]',  data.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = data.canonical;

    let schema = document.getElementById("vibha-schema");
    if (!schema) { schema = document.createElement("script"); schema.id = "vibha-schema"; schema.type = "application/ld+json"; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify(SCHEMA);
  }, [page, data]);

  return null;
}
