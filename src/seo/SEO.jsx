/**
 * SEO.jsx – Vibha Art SEO Component
 * react-helmet-async use karta hai
 * 
 * Install: npm install react-helmet-async
 * Usage: <SEO page="home" />  ya  <SEO {...customProps} />
 */
import { Helmet } from "react-helmet-async";
import { SEO_PAGES, SITE_CONFIG } from "../seo/seoConfig";
import { GEO_PROFILE, GEO_QUESTIONS, GEO_SERVICES } from "../seo/geoConfig";

const BUSINESS_ID = `${SITE_CONFIG.site_url}/#business`;
const ORGANIZATION_ID = `${SITE_CONFIG.site_url}/#organization`;
const WEBSITE_ID = `${SITE_CONFIG.site_url}/#website`;

export default function SEO({
  page = "home",
  customTitle,
  customDesc,
  customKeywords,
  customPath,
  canonicalUrl,
  ogImage,
  schemaType,
}) {
  const p = SEO_PAGES[page] || SEO_PAGES["home"];
  const siteUrl = SITE_CONFIG.site_url;
  const path = customPath || p.path;
  const canonical = canonicalUrl || `${siteUrl}${path}`;

  const title       = customTitle    || p.title;
  const description = customDesc     || p.description;
  const keywords    = customKeywords || p.keywords;
  const image       = ogImage        || SITE_CONFIG.og_image;

  const schemaObjects = buildSchemaObjects({
    pageConfig: p,
    title,
    description,
    path,
    canonical,
    image,
    schemaType,
    hasCustomPath: Boolean(customPath || canonicalUrl),
  });

  return (
    <Helmet>
      {/* ── Basic Meta ── */}
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords"    content={keywords} />
      <meta name="robots"      content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="author"      content={SITE_CONFIG.site_name} />
      <meta name="geo.region"  content={`${SITE_CONFIG.country}-${SITE_CONFIG.state_code}`} />
      <meta name="geo.placename" content={SITE_CONFIG.city} />
      <meta name="geo.position"  content={`${SITE_CONFIG.latitude};${SITE_CONFIG.longitude}`} />
      <meta name="ICBM"          content={`${SITE_CONFIG.latitude}, ${SITE_CONFIG.longitude}`} />
      <meta name="language"      content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating"        content="general" />
      <meta name="ai-summary" content={GEO_PROFILE.oneLine} />
      <meta name="business:audience" content={GEO_PROFILE.audience} />

      {/* ── Canonical ── */}
      <link rel="canonical" href={canonical} />

      {/* ── Hreflang ── */}
      <link rel="alternate" hrefLang="en-IN" href={canonical} />
      <link rel="alternate" hrefLang="hi-IN" href={`${canonical}?lang=hi`} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <link rel="alternate" type="text/plain" href={`${SITE_CONFIG.site_url}/llms.txt`} />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={p.og_type || "website"} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"   content={`${SITE_CONFIG.site_name} – ${SITE_CONFIG.site_tagline}`} />
      <meta property="og:site_name"   content={SITE_CONFIG.site_name} />
      <meta property="og:locale"      content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      {SITE_CONFIG.fb_app_id && (
        <meta property="fb:app_id" content={SITE_CONFIG.fb_app_id} />
      )}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SITE_CONFIG.twitter_handle} />
      <meta name="twitter:creator"     content={SITE_CONFIG.twitter_handle} />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
      <meta name="twitter:image:alt"   content={title} />

      {/* ── WhatsApp Preview ── */}
      <meta property="og:image:secure_url" content={image} />

      {/* ── Schema JSON-LD ── */}
      {schemaObjects.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

function buildSchemaObjects({
  pageConfig,
  title,
  description,
  path,
  canonical,
  image,
  schemaType,
  hasCustomPath,
}) {
  const inferredType = schemaType || inferSchemaType(path, pageConfig);
  const shouldUseConfiguredSchemas =
    !hasCustomPath ||
    pageConfig.path === path ||
    ["home", "about", "contact"].includes(schemaKeyFromPath(path));

  const configuredSchemas = shouldUseConfiguredSchemas
    ? (pageConfig.schemas || []).map(schema =>
        normalizeConfiguredSchema(schema, { title, description, path, canonical }),
      )
    : [];

  const schemas = [
    ...configuredSchemas,
    buildGeoEntityProfileSchema(),
    buildGeoServiceCatalogSchema(),
    buildGeoFAQSchema(),
    buildWebPageSchema({ title, description, canonical, image, inferredType }),
    buildBreadcrumbSchema(path, canonical),
  ];

  const primarySchema = buildPrimarySchema({
    inferredType,
    title,
    description,
    canonical,
    image,
  });

  if (primarySchema) schemas.push(primarySchema);

  return dedupeSchemas(schemas);
}

function schemaKeyFromPath(path) {
  return path.replace(/^\/|\/$/g, "") || "home";
}

function inferSchemaType(path, pageConfig) {
  const normalizedPath = path.toLowerCase();
  const pageType = pageConfig?.og_type;

  if (normalizedPath === "/contact") return "ContactPage";
  if (normalizedPath === "/about") return "AboutPage";
  if (normalizedPath.includes("gallery") || pageConfig?.path === "/portfolio") {
    return "CollectionPage";
  }
  if (
    normalizedPath.startsWith("/services/") ||
    ["/printing", "/digital-print", "/graphic-design", "/digital-marketing", "/web-development", "/web-developmen"].includes(normalizedPath)
  ) {
    return "Service";
  }
  if (pageType === "article") return "Article";

  return "WebPage";
}

function normalizeConfiguredSchema(schema, { title, description, path, canonical }) {
  const type = schema["@type"];
  const types = Array.isArray(type) ? type : [type];

  if (types.includes("Service")) {
    return {
      ...schema,
      "@id": `${canonical}#service`,
      name: title,
      description,
      url: canonical,
    };
  }

  if (type === "ItemList") {
    return {
      ...schema,
      name: title,
      description,
      url: canonical,
    };
  }

  if (type === "BreadcrumbList") {
    return {
      ...schema,
      itemListElement: _buildBreadcrumbs(path, SITE_CONFIG.site_url),
    };
  }

  return schema;
}

function buildWebPageSchema({ title, description, canonical, image, inferredType }) {
  const webPageType = ["ContactPage", "AboutPage", "CollectionPage"].includes(inferredType)
    ? inferredType
    : "WebPage";

  return {
    "@context": "https://schema.org",
    "@type": webPageType,
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_CONFIG.site_url,
      name: SITE_CONFIG.site_name,
    },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_CONFIG.site_name,
    },
    about: {
      "@type": "LocalBusiness",
      "@id": BUSINESS_ID,
      name: SITE_CONFIG.site_name,
    },
    mentions: GEO_SERVICES.map(service => ({
      "@type": "Service",
      name: service.name,
      url: `${SITE_CONFIG.site_url}${service.url}`,
      description: service.description,
    })),
    keywords: GEO_PROFILE.knowsAbout.join(", "),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(image),
    },
    inLanguage: "en-IN",
  };
}

function buildGeoEntityProfileSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization", "DesignAgency"],
    "@id": `${SITE_CONFIG.site_url}/#geo-entity-profile`,
    name: GEO_PROFILE.businessName,
    alternateName: GEO_PROFILE.alternateName,
    description: GEO_PROFILE.oneLine,
    url: SITE_CONFIG.site_url,
    image: SITE_CONFIG.og_image,
    logo: SITE_CONFIG.og_image,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    priceRange: SITE_CONFIG.price_range,
    foundingDate: SITE_CONFIG.founded_year,
    sameAs: GEO_PROFILE.sameAs,
    knowsAbout: GEO_PROFILE.knowsAbout,
    slogan: SITE_CONFIG.site_tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.state,
      postalCode: SITE_CONFIG.zip,
      addressCountry: SITE_CONFIG.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.latitude,
      longitude: SITE_CONFIG.longitude,
    },
    areaServed: [
      {
        "@type": "City",
        name: SITE_CONFIG.city,
      },
      {
        "@type": "AdministrativeArea",
        name: SITE_CONFIG.state,
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
    makesOffer: GEO_SERVICES.map(service => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: `${SITE_CONFIG.site_url}${service.url}`,
      },
    })),
  };
}

function buildGeoServiceCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_CONFIG.site_url}/#service-catalog`,
    name: "Vibha Art service catalog",
    description:
      "AI-readable catalog of Vibha Art design, printing, web development and digital marketing services.",
    url: SITE_CONFIG.site_url,
    itemListElement: GEO_SERVICES.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: `${SITE_CONFIG.site_url}${service.url}`,
        provider: {
          "@type": "LocalBusiness",
          "@id": BUSINESS_ID,
          name: SITE_CONFIG.site_name,
        },
        areaServed: {
          "@type": "City",
          name: SITE_CONFIG.city,
        },
      },
    })),
  };
}

function buildGeoFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_CONFIG.site_url}/#geo-faq`,
    mainEntity: GEO_QUESTIONS.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema(path, canonical) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: _buildBreadcrumbs(path, SITE_CONFIG.site_url),
  };
}

function buildPrimarySchema({ inferredType, title, description, canonical, image }) {
  if (inferredType === "Service") {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: title,
      description,
      url: canonical,
      image: absoluteUrl(image),
      provider: {
        "@type": "LocalBusiness",
        "@id": BUSINESS_ID,
        name: SITE_CONFIG.site_name,
        telephone: SITE_CONFIG.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_CONFIG.city,
          addressRegion: SITE_CONFIG.state,
          addressCountry: SITE_CONFIG.country,
          postalCode: SITE_CONFIG.zip,
          streetAddress: SITE_CONFIG.address,
        },
      },
      areaServed: {
        "@type": "City",
        name: SITE_CONFIG.city,
      },
    };
  }

  if (inferredType === "CollectionPage") {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${canonical}#itemlist`,
      name: title,
      description,
      url: canonical,
    };
  }

  return null;
}

function absoluteUrl(value) {
  if (!value) return SITE_CONFIG.og_image;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_CONFIG.site_url}${value.startsWith("/") ? "" : "/"}${value}`;
}

function dedupeSchemas(schemas) {
  const seen = new Set();

  return schemas.filter(schema => {
    const key = schema["@id"] || `${schema["@type"]}:${schema.name || schema.url || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function _buildBreadcrumbs(path, siteUrl) {
  const parts = path.split("/").filter(Boolean);
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }];
  let current = siteUrl;
  parts.forEach((p, i) => {
    current += "/" + p;
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: p.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      item: current,
    });
  });
  return items;
}
