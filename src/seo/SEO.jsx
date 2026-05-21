/**
 * SEO.jsx – Vibha Art SEO Component
 * react-helmet-async use karta hai
 * 
 * Install: npm install react-helmet-async
 * Usage: <SEO page="home" />  ya  <SEO {...customProps} />
 */
import { Helmet } from "react-helmet-async";
import { SEO_PAGES, SITE_CONFIG } from "../seo/seoConfig";

export default function SEO({
  page = "home",
  customTitle,
  customDesc,
  customKeywords,
  customPath,
  canonicalUrl,
  ogImage,
}) {
  const p = SEO_PAGES[page] || SEO_PAGES["home"];
  const siteUrl = SITE_CONFIG.site_url;
  const path = customPath || p.path;
  const canonical = canonicalUrl || `${siteUrl}${path}`;

  const title       = customTitle    || p.title;
  const description = customDesc     || p.description;
  const keywords    = customKeywords || p.keywords;
  const image       = ogImage        || SITE_CONFIG.og_image;

  // Build all schemas for this page
  const schemaObjects = (p.schemas || []).map(s => ({
    ...s,
    ...(s["@type"] === "BreadcrumbList"
      ? { itemListElement: _buildBreadcrumbs(path, siteUrl) }
      : {}),
  }));

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

      {/* ── Canonical ── */}
      <link rel="canonical" href={canonical} />

      {/* ── Hreflang ── */}
      <link rel="alternate" hrefLang="en-IN" href={canonical} />
      <link rel="alternate" hrefLang="hi-IN" href={`${canonical}?lang=hi`} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

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
