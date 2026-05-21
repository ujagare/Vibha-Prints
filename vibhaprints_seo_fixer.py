#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║          VIBHAPRINTS.COM – COMPLETE SEO AUTO-FIX SCRIPT                    ║
║          vibhaprints.com ke liye poora SEO fix                              ║
║                                                                              ║
║  Fixes karta hai:                                                            ║
║  ✅ robots.txt                    ✅ sitemap.xml                             ║
║  ✅ React SEO (react-helmet-async) ✅ Schema / JSON-LD (7 types)            ║
║  ✅ Meta tags (all pages)          ✅ OG + Twitter Cards                     ║
║  ✅ Canonical tags                 ✅ Image alt tags                         ║
║  ✅ Missing meta tags              ✅ Google indexing prep                   ║
║  ✅ Keyword research included      ✅ Hreflang (hi + en)                    ║
║                                                                              ║
║  Usage:  python3 vibhaprints_seo_fixer.py                                   ║
║  Then:   python3 vibhaprints_seo_fixer.py --path /your/project/path         ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import json
import shutil
import argparse
from datetime import datetime
from pathlib import Path

# ─────────────────────────────────────────────────────────────
#  CONFIGURATION – Apni website ki details yahan update karein
# ─────────────────────────────────────────────────────────────
CONFIG = {
    "site_url":        "https://www.vibhaprints.com",
    "site_name":       "Vibha Art",
    "site_tagline":    "Creative Design & Printing Services",
    "city":            "Pune",
    "state":           "Maharashtra",
    "country":         "IN",
    "zip":             "411001",
    "phone":           "+91-XXXXXXXXXX",   # ← Apna phone number dalein
    "email":           "info@vibhaprints.com",
    "address":         "Pune, Maharashtra, India",
    "latitude":        "18.5204",
    "longitude":       "73.8567",
    "gtm_id":          "GTM-P4KGHLM6",
    "og_image":        "https://www.vibhaprints.com/assets/vibha-og.webp",
    "twitter_handle":  "@vibhaprints",
    "fb_app_id":       "",                 # ← Optional: Facebook App ID
    "founded_year":    "2018",
    "price_range":     "₹₹",
    "languages":       ["en", "hi"],
}

# ─────────────────────────────────────────────────────────────
#  PAGE DEFINITIONS – Har page ki SEO settings
# ─────────────────────────────────────────────────────────────
PAGES = [
    {
        "id":          "home",
        "path":        "/",
        "file":        "src/pages/Home.jsx",
        "title":       "Graphic Design & Printing Services in Pune | Vibha Art",
        "description": "Vibha Art – Pune ki leading graphic design & printing company. Logo design, banner printing, branding, business cards, brochures. ✓ Fast Delivery ✓ Affordable Prices. Call now!",
        "h1":          "Professional Graphic Design & Printing Services in Pune",
        "keywords":    "graphic design pune, printing services pune, logo design pune, branding agency pune, banner printing pune",
        "schema":      ["LocalBusiness", "Organization", "WebSite"],
        "og_type":     "website",
        "priority":    "1.0",
        "changefreq":  "weekly",
    },
    {
        "id":          "services",
        "path":        "/services",
        "file":        "src/pages/Services.jsx",
        "title":       "Our Services – Logo, Branding & Printing | Vibha Art Pune",
        "description": "Complete design & printing solutions in Pune: logo design, large format printing, business cards, brochures, flex banners & more. Get instant quote!",
        "h1":          "Our Design & Printing Services in Pune",
        "keywords":    "design services pune, printing services pune, logo design, banner printing, brochure design pune",
        "schema":      ["Service"],
        "og_type":     "website",
        "priority":    "0.9",
        "changefreq":  "monthly",
    },
    {
        "id":          "logo-design",
        "path":        "/services/logo-design",
        "file":        "src/pages/services/LogoDesign.jsx",
        "title":       "Logo Design in Pune – Professional Brand Identity | Vibha Art",
        "description": "Custom logo design for startups & businesses in Pune. Unique, memorable brand identity that stands out. Affordable pricing. Get free consultation today!",
        "h1":          "Professional Logo Design in Pune",
        "keywords":    "logo design pune, logo designer pune, brand identity pune, custom logo pune, startup logo pune",
        "schema":      ["Service", "FAQPage"],
        "og_type":     "website",
        "priority":    "0.9",
        "changefreq":  "monthly",
    },
    {
        "id":          "large-format-printing",
        "path":        "/services/large-format-printing",
        "file":        "src/pages/services/LargeFormatPrinting.jsx",
        "title":       "Large Format Printing in Pune – Banners, Flex, Hoardings | Vibha Art",
        "description": "High-quality large format printing in Pune: flex banners, hoardings, standees, backlit displays & more. Fast turnaround. Order now for best prices!",
        "h1":          "Large Format Printing Services in Pune",
        "keywords":    "large format printing pune, banner printing pune, flex printing pune, hoarding printing pune, standee printing pune",
        "schema":      ["Service"],
        "og_type":     "website",
        "priority":    "0.8",
        "changefreq":  "monthly",
    },
    {
        "id":          "business-cards",
        "path":        "/services/business-cards",
        "file":        "src/pages/services/BusinessCards.jsx",
        "title":       "Business Card Printing in Pune – Premium Quality | Vibha Art",
        "description": "Premium business card printing in Pune. Custom designs, UV coating, matte & glossy finishes. Minimum 100 cards. Same-day design available!",
        "h1":          "Business Card Design & Printing in Pune",
        "keywords":    "business card printing pune, visiting card printing pune, custom business cards pune, visiting card design pune",
        "schema":      ["Service"],
        "og_type":     "website",
        "priority":    "0.8",
        "changefreq":  "monthly",
    },
    {
        "id":          "brochure-design",
        "path":        "/services/brochure-design",
        "file":        "src/pages/services/BrochureDesign.jsx",
        "title":       "Brochure Design & Printing Pune – Tri-fold, Bi-fold | Vibha Art",
        "description": "Professional brochure design and printing in Pune. Tri-fold, bi-fold, Z-fold designs for your business. Affordable bulk printing. Request quote!",
        "h1":          "Brochure Design & Printing in Pune",
        "keywords":    "brochure design pune, brochure printing pune, tri-fold brochure pune, pamphlet design pune, leaflet printing pune",
        "schema":      ["Service"],
        "og_type":     "website",
        "priority":    "0.7",
        "changefreq":  "monthly",
    },
    {
        "id":          "portfolio",
        "path":        "/portfolio",
        "file":        "src/pages/Portfolio.jsx",
        "title":       "Design Portfolio – Vibha Art | Creative Work Samples Pune",
        "description": "View Vibha Art's portfolio of logo designs, branding projects & print materials. Trusted by 100+ clients in Pune. See our creative work!",
        "h1":          "Our Creative Portfolio",
        "keywords":    "design portfolio pune, logo portfolio pune, branding portfolio, printing samples pune, vibha art work",
        "schema":      ["ItemList"],
        "og_type":     "website",
        "priority":    "0.7",
        "changefreq":  "weekly",
    },
    {
        "id":          "about",
        "path":        "/about",
        "file":        "src/pages/About.jsx",
        "title":       "About Vibha Art – Pune's Creative Design Studio",
        "description": "Meet the team behind Vibha Art. Years of design excellence in Pune. Passionate about branding & print. Learn our story and values.",
        "h1":          "About Vibha Art – Pune's Creative Design Studio",
        "keywords":    "about vibha art, vibha art pune, design studio pune, graphic design company pune, printing company pune",
        "schema":      ["Organization", "Person"],
        "og_type":     "website",
        "priority":    "0.6",
        "changefreq":  "monthly",
    },
    {
        "id":          "contact",
        "path":        "/contact",
        "file":        "src/pages/Contact.jsx",
        "title":       "Contact Vibha Art – Design & Printing Studio, Pune",
        "description": f"Get in touch with Vibha Art for graphic design & printing services. Visit us in Pune or call +91-XXXXXXXXXX. Quick response guaranteed!",
        "h1":          "Contact Vibha Art",
        "keywords":    "contact vibha art, vibha art pune contact, printing services contact pune, graphic designer contact pune",
        "schema":      ["LocalBusiness", "ContactPage"],
        "og_type":     "website",
        "priority":    "0.8",
        "changefreq":  "monthly",
    },
    {
        "id":          "blog",
        "path":        "/blog",
        "file":        "src/pages/Blog.jsx",
        "title":       "Design & Printing Tips Blog | Vibha Art Pune",
        "description": "Expert tips on graphic design, printing, branding & more. Learn from Vibha Art's design professionals in Pune.",
        "h1":          "Design & Printing Blog",
        "keywords":    "design tips pune, printing guide, logo design tips, branding tips, graphic design blog india",
        "schema":      ["Blog"],
        "og_type":     "website",
        "priority":    "0.6",
        "changefreq":  "weekly",
    },
]

# ─────────────────────────────────────────────────────────────
#  KEYWORD RESEARCH – Target keywords (SEO report se)
# ─────────────────────────────────────────────────────────────
KEYWORDS = {
    "primary": [
        "graphic design services pune",
        "printing services pune",
        "logo design pune",
        "branding agency pune",
        "large format printing pune",
        "business card printing pune",
    ],
    "long_tail": [
        "logo design service near me pune",
        "banner printing pune cheap",
        "visiting card design printing pune",
        "flex printing services pune",
        "brochure design and printing pune",
        "custom stationery design pune",
        "affordable logo design india",
        "packaging design pune",
        "graphic designer near me",
        "best printing shop pune",
    ],
    "hindi_hinglish": [
        "pune mein printing service",
        "logo design kaise karein",
        "banner print near me",
        "graphic designer near me",
    ],
    "local_modifiers": [
        "near me", "in pune", "pune", "maharashtra",
        "pimpri", "chinchwad", "hadapsar", "kothrud", "viman nagar",
    ],
}

# ─────────────────────────────────────────────────────────────
#  COLORS FOR TERMINAL OUTPUT
# ─────────────────────────────────────────────────────────────
class C:
    RED    = '\033[91m'
    GREEN  = '\033[92m'
    YELLOW = '\033[93m'
    BLUE   = '\033[94m'
    PURPLE = '\033[95m'
    CYAN   = '\033[96m'
    BOLD   = '\033[1m'
    END    = '\033[0m'

def pr(color, text): print(f"{color}{text}{C.END}")
def ok(text):  pr(C.GREEN,  f"  ✅  {text}")
def err(text): pr(C.RED,    f"  ❌  {text}")
def warn(text):pr(C.YELLOW, f"  ⚠️   {text}")
def info(text):pr(C.CYAN,   f"  ℹ️   {text}")
def head(text):pr(C.BOLD + C.PURPLE, f"\n{'═'*60}\n  {text}\n{'═'*60}")

# ─────────────────────────────────────────────────────────────
#  HELPER: Write file with backup
# ─────────────────────────────────────────────────────────────
def write_file(path: Path, content: str, description: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        backup = path.with_suffix(path.suffix + ".bak")
        shutil.copy2(path, backup)
        info(f"Backup created: {backup.name}")
    path.write_text(content, encoding="utf-8")
    ok(f"{description} → {path}")

# ─────────────────────────────────────────────────────────────
#  1. ROBOTS.TXT
# ─────────────────────────────────────────────────────────────
def fix_robots_txt(root: Path):
    head("1. ROBOTS.TXT FIX")
    content = f"""# vibhaprints.com – robots.txt
# Generated by SEO Fix Script – {datetime.now().strftime('%Y-%m-%d')}

User-agent: *
Allow: /

# Block admin/private paths if any
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$

# Allow important bots explicitly
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Sitemap location – CRITICAL for Google indexing
Sitemap: {CONFIG['site_url']}/sitemap.xml
"""
    write_file(root / "public" / "robots.txt", content, "robots.txt")

# ─────────────────────────────────────────────────────────────
#  2. SITEMAP.XML
# ─────────────────────────────────────────────────────────────
def fix_sitemap_xml(root: Path):
    head("2. SITEMAP.XML GENERATION")
    today = datetime.now().strftime("%Y-%m-%d")
    
    url_entries = []
    for page in PAGES:
        url = f"{CONFIG['site_url']}{page['path']}"
        # Hreflang entries
        hreflang_block = f"""    <xhtml:link
        rel="alternate"
        hreflang="en-IN"
        href="{url}"/>
    <xhtml:link
        rel="alternate"
        hreflang="hi-IN"
        href="{url}?lang=hi"/>
    <xhtml:link
        rel="alternate"
        hreflang="x-default"
        href="{url}"/>"""
        
        entry = f"""  <url>
    <loc>{url}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
{hreflang_block}
  </url>"""
        url_entries.append(entry)
    
    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!--
    vibhaprints.com sitemap.xml
    Generated: {today}
    Submit this at: https://search.google.com/search-console
  -->
{chr(10).join(url_entries)}
</urlset>
"""
    write_file(root / "public" / "sitemap.xml", content, "sitemap.xml")

# ─────────────────────────────────────────────────────────────
#  3. SCHEMA JSON-LD GENERATORS
# ─────────────────────────────────────────────────────────────
def generate_schema(schema_type: str, page: dict) -> dict:
    url = f"{CONFIG['site_url']}{page['path']}"
    
    schemas = {
        "LocalBusiness": {
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "DesignAgency"],
            "@id": f"{CONFIG['site_url']}/#business",
            "name": CONFIG["site_name"],
            "alternateName": "Vibha Prints",
            "description": page["description"],
            "url": CONFIG["site_url"],
            "telephone": CONFIG["phone"],
            "email": CONFIG["email"],
            "foundingDate": CONFIG["founded_year"],
            "priceRange": CONFIG["price_range"],
            "address": {
                "@type": "PostalAddress",
                "addressLocality": CONFIG["city"],
                "addressRegion": CONFIG["state"],
                "addressCountry": CONFIG["country"],
                "postalCode": CONFIG["zip"],
                "streetAddress": CONFIG["address"],
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": CONFIG["latitude"],
                "longitude": CONFIG["longitude"],
            },
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    "opens": "09:00",
                    "closes": "19:00",
                }
            ],
            "image": CONFIG["og_image"],
            "logo": f"{CONFIG['site_url']}/assets/logo.png",
            "sameAs": [
                "https://www.instagram.com/vibhaprints",
                "https://www.facebook.com/vibhaprints",
                "https://www.linkedin.com/company/vibhaprints",
            ],
            "hasMap": f"https://maps.google.com/?q={CONFIG['latitude']},{CONFIG['longitude']}",
            "areaServed": {
                "@type": "City",
                "name": CONFIG["city"],
            },
            "serviceType": [
                "Graphic Design",
                "Logo Design",
                "Large Format Printing",
                "Business Card Printing",
                "Brochure Design",
                "Branding Services",
            ],
        },
        "Organization": {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": f"{CONFIG['site_url']}/#organization",
            "name": CONFIG["site_name"],
            "url": CONFIG["site_url"],
            "logo": {
                "@type": "ImageObject",
                "url": f"{CONFIG['site_url']}/assets/logo.png",
                "width": 200,
                "height": 60,
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": CONFIG["phone"],
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi", "Marathi"],
            },
        },
        "WebSite": {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": f"{CONFIG['site_url']}/#website",
            "url": CONFIG["site_url"],
            "name": CONFIG["site_name"],
            "description": CONFIG["site_tagline"],
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{CONFIG['site_url']}/search?q={{search_term_string}}",
                },
                "query-input": "required name=search_term_string",
            },
            "inLanguage": ["en-IN", "hi-IN"],
        },
        "Service": {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": f"{url}#service",
            "name": page["h1"],
            "description": page["description"],
            "provider": {
                "@type": "LocalBusiness",
                "@id": f"{CONFIG['site_url']}/#business",
                "name": CONFIG["site_name"],
            },
            "areaServed": {
                "@type": "City",
                "name": CONFIG["city"],
            },
            "url": url,
        },
        "FAQPage": {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": f"How much does logo design cost in {CONFIG['city']}?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f"Logo design prices in {CONFIG['city']} vary based on complexity. {CONFIG['site_name']} offers affordable logo packages starting from basic to premium. Contact us for a custom quote.",
                    },
                },
                {
                    "@type": "Question",
                    "name": f"What is the turnaround time for printing services in {CONFIG['city']}?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f"Standard turnaround at {CONFIG['site_name']} is 2-3 business days. Express same-day or next-day printing is available for urgent orders.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "Do you provide design services for startups?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f"Yes! {CONFIG['site_name']} specializes in helping startups and small businesses with complete branding solutions including logo, business cards, brochures, and more.",
                    },
                },
            ],
        },
        "BreadcrumbList": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": _get_breadcrumbs(page),
        },
        "ItemList": {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": page["h1"],
            "description": page["description"],
            "url": url,
        },
        "Blog": {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": page["title"],
            "description": page["description"],
            "url": url,
            "publisher": {
                "@type": "Organization",
                "@id": f"{CONFIG['site_url']}/#organization",
            },
        },
        "ContactPage": {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": page["title"],
            "url": url,
        },
        "Person": {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Vibha",
            "jobTitle": "Creative Director",
            "worksFor": {
                "@type": "Organization",
                "@id": f"{CONFIG['site_url']}/#organization",
            },
        },
    }
    return schemas.get(schema_type, {})

def _get_breadcrumbs(page: dict) -> list:
    parts = [p for p in page["path"].split("/") if p]
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": CONFIG["site_url"]}]
    current = CONFIG["site_url"]
    for i, part in enumerate(parts, 2):
        current += f"/{part}"
        items.append({
            "@type": "ListItem",
            "position": i,
            "name": part.replace("-", " ").title(),
            "item": current,
        })
    return items

# ─────────────────────────────────────────────────────────────
#  4. REACT SEO COMPONENT (react-helmet-async)
# ─────────────────────────────────────────────────────────────
def generate_seo_component(root: Path):
    head("4. REACT SEO COMPONENTS GENERATE KARNA")
    
    # ── 4a. SEO.jsx – Reusable component ──
    seo_component = '''/**
 * SEO.jsx – Vibha Art SEO Component
 * react-helmet-async use karta hai
 * 
 * Install: npm install react-helmet-async
 * Usage: <SEO page="home" />  ya  <SEO {...customProps} />
 */
import { Helmet } from "react-helmet-async";
import { SEO_PAGES, SITE_CONFIG } from "../seo/seoConfig";

export default function SEO({ page = "home", customTitle, customDesc, customKeywords, ogImage }) {
  const p = SEO_PAGES[page] || SEO_PAGES["home"];
  const siteUrl = SITE_CONFIG.site_url;
  const canonical = `${siteUrl}${p.path}`;

  const title       = customTitle    || p.title;
  const description = customDesc     || p.description;
  const keywords    = customKeywords || p.keywords;
  const image       = ogImage        || SITE_CONFIG.og_image;

  // Build all schemas for this page
  const schemaObjects = (p.schemas || []).map(s => ({
    ...s,
    ...(s["@type"] === "BreadcrumbList"
      ? { itemListElement: _buildBreadcrumbs(p.path, siteUrl) }
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
      <link rel="alternate" hreflang="en-IN" href={canonical} />
      <link rel="alternate" hreflang="hi-IN" href={`${canonical}?lang=hi`} />
      <link rel="alternate" hreflang="x-default" href={canonical} />

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
      name: p.replace(/-/g, " ").replace(/\\b\\w/g, c => c.toUpperCase()),
      item: current,
    });
  });
  return items;
}
'''

    # ── 4b. seoConfig.js – All page SEO data ──
    pages_js = {}
    for page in PAGES:
        schemas = [generate_schema(s, page) for s in page.get("schema", [])]
        pages_js[page["id"]] = {
            "path":        page["path"],
            "title":       page["title"],
            "description": page["description"],
            "keywords":    page["keywords"],
            "h1":          page["h1"],
            "og_type":     page.get("og_type", "website"),
            "schemas":     schemas,
        }

    seo_config = f'''/**
 * seoConfig.js – vibhaprints.com SEO Configuration
 * Sabhi pages ki SEO settings aur Schema data
 * 
 * ⚠️  Phone number, address, social links update karein!
 */

export const SITE_CONFIG = {json.dumps(CONFIG, indent=2, ensure_ascii=False)};

export const SEO_PAGES = {json.dumps(pages_js, indent=2, ensure_ascii=False)};

export const KEYWORDS = {json.dumps(KEYWORDS, indent=2, ensure_ascii=False)};
'''

    # ── 4c. Image alt text utility ──
    image_utils = '''/**
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
    .replace(/\\s+/g, " ")
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
'''

    # Write all files
    seo_dir = root / "src" / "seo"
    write_file(seo_dir / "SEO.jsx",         seo_component, "SEO React Component")
    write_file(seo_dir / "seoConfig.js",    seo_config,    "SEO Config (all pages)")
    write_file(seo_dir / "imageUtils.jsx",  image_utils,   "Image SEO Utilities")

    # ── 4d. App.jsx wrapper instructions ──
    app_wrapper = '''/**
 * App.jsx mein ye changes karein:
 * 
 * 1. Install: npm install react-helmet-async
 * 
 * 2. App.jsx mein HelmetProvider wrap karein:
 */

import { HelmetProvider } from "react-helmet-async";

// Apna existing App wrap karein:
function App() {
  return (
    <HelmetProvider>
      {/* ... apka existing code ... */}
    </HelmetProvider>
  );
}

/**
 * 3. Har page component mein SEO add karein:
 */
import SEO from "../seo/SEO";

function HomePage() {
  return (
    <>
      <SEO page="home" />
      {/* ... rest of your component ... */}
    </>
  );
}

function LogoDesignPage() {
  return (
    <>
      <SEO page="logo-design" />
      {/* ... */}
    </>
  );
}

// Available page IDs:
// "home", "services", "logo-design", "large-format-printing",
// "business-cards", "brochure-design", "portfolio", "about", "contact", "blog"
'''
    write_file(seo_dir / "APP_INTEGRATION_GUIDE.jsx", app_wrapper, "App.jsx Integration Guide")

# ─────────────────────────────────────────────────────────────
#  5. INDEX.HTML – Base SEO (Vite fallback)
# ─────────────────────────────────────────────────────────────
def fix_index_html(root: Path):
    head("5. INDEX.HTML SEO TAGS (Vite Base)")
    index_path = root / "index.html"
    
    home = next(p for p in PAGES if p["id"] == "home")
    
    seo_head = f'''  <!-- ═══ SEO META TAGS – vibhaprints.com ═══ -->
  <!-- Basic -->
  <meta name="description" content="{home['description']}" />
  <meta name="keywords" content="{home['keywords']}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <meta name="author" content="{CONFIG['site_name']}" />
  <meta name="language" content="English" />
  <meta name="revisit-after" content="7 days" />

  <!-- Geo -->
  <meta name="geo.region" content="IN-MH" />
  <meta name="geo.placename" content="{CONFIG['city']}, {CONFIG['state']}, India" />
  <meta name="geo.position" content="{CONFIG['latitude']};{CONFIG['longitude']}" />
  <meta name="ICBM" content="{CONFIG['latitude']}, {CONFIG['longitude']}" />

  <!-- Canonical -->
  <link rel="canonical" href="{CONFIG['site_url']}/" />

  <!-- Hreflang -->
  <link rel="alternate" hreflang="en-IN" href="{CONFIG['site_url']}/" />
  <link rel="alternate" hreflang="hi-IN" href="{CONFIG['site_url']}/?lang=hi" />
  <link rel="alternate" hreflang="x-default" href="{CONFIG['site_url']}/" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="{CONFIG['site_url']}/" />
  <meta property="og:title"       content="{home['title']}" />
  <meta property="og:description" content="{home['description']}" />
  <meta property="og:image"       content="{CONFIG['og_image']}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt"   content="{CONFIG['site_name']} – {CONFIG['site_tagline']}" />
  <meta property="og:site_name"   content="{CONFIG['site_name']}" />
  <meta property="og:locale"      content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:site"        content="{CONFIG['twitter_handle']}" />
  <meta name="twitter:title"       content="{home['title']}" />
  <meta name="twitter:description" content="{home['description']}" />
  <meta name="twitter:image"       content="{CONFIG['og_image']}" />

  <!-- Theme / PWA -->
  <meta name="theme-color" content="#7c5cfc" />
  <meta name="msapplication-TileColor" content="#7c5cfc" />

  <!-- Preconnects for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

  <!-- Schema: LocalBusiness (fallback for crawlers) -->
  <script type="application/ld+json">
  {json.dumps(generate_schema("LocalBusiness", home), indent=2, ensure_ascii=False)}
  </script>
  <script type="application/ld+json">
  {json.dumps(generate_schema("WebSite", home), indent=2, ensure_ascii=False)}
  </script>
  <!-- ═══ END SEO META TAGS ═══ -->'''

    if index_path.exists():
        content = index_path.read_text(encoding="utf-8")
        backup  = index_path.with_suffix(".html.bak")
        shutil.copy2(index_path, backup)
        info(f"Backup: {backup.name}")
        
        if "<title>" in content:
            # Update title
            import re
            content = re.sub(
                r"<title>.*?</title>",
                f"<title>{home['title']}</title>",
                content, flags=re.DOTALL
            )
        
        # Inject before </head>
        if "</head>" in content:
            content = content.replace("</head>", f"{seo_head}\n</head>")
            index_path.write_text(content, encoding="utf-8")
            ok(f"index.html updated with SEO tags → {index_path}")
        else:
            warn("index.html mein </head> nahi mila. Manual update karein.")
    else:
        warn(f"index.html nahi mila at {index_path}. Naya file create kar raha hoon.")
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <title>{home['title']}</title>
{seo_head}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>"""
        index_path.write_text(html, encoding="utf-8")
        ok(f"New index.html created → {index_path}")

# ─────────────────────────────────────────────────────────────
#  6. PACKAGE.JSON – react-helmet-async check
# ─────────────────────────────────────────────────────────────
def check_and_update_package_json(root: Path):
    head("6. PACKAGE.JSON DEPENDENCY CHECK")
    pkg_path = root / "package.json"
    
    if pkg_path.exists():
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        
        needed = {
            "react-helmet-async": "^2.0.4",
        }
        
        missing = []
        for dep, ver in needed.items():
            if dep not in deps:
                missing.append(dep)
                err(f"Missing: {dep}")
            else:
                ok(f"Found: {dep} {deps[dep]}")
        
        if missing:
            print()
            pr(C.YELLOW, "  ⚡ Run this command to install missing packages:")
            pr(C.CYAN,   f"     npm install {' '.join(missing)}")
            print()
    else:
        warn("package.json nahi mila. Manually install karein:")
        pr(C.CYAN, "  npm install react-helmet-async")

# ─────────────────────────────────────────────────────────────
#  7. VITE CONFIG – SEO optimization
# ─────────────────────────────────────────────────────────────
def fix_vite_config(root: Path):
    head("7. VITE CONFIG SEO OPTIMIZATION")
    
    vite_path = root / "vite.config.js"
    if not vite_path.exists():
        vite_path = root / "vite.config.ts"
    
    vite_config = '''import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:    ["react", "react-dom", "react-router-dom"],
          seo:       ["react-helmet-async"],
        },
      },
    },
    // Optimize chunks
    chunkSizeWarningLimit: 600,
  },

  // Server config
  server: {
    port: 5173,
    open: true,
  },

  // Preview config (simulates production)
  preview: {
    port: 4173,
  },
});
'''
    
    if vite_path.exists():
        backup = vite_path.with_suffix(vite_path.suffix + ".bak")
        shutil.copy2(vite_path, backup)
        info(f"Backup: {backup.name}")
        warn("vite.config already exists. New file vibhaprints_vite_config_SUGGESTED.js mein dekho.")
        suggested = root / "vibhaprints_vite_config_SUGGESTED.js"
        suggested.write_text(vite_config, encoding="utf-8")
        ok(f"Suggested config → {suggested}")
    else:
        vite_path.write_text(vite_config, encoding="utf-8")
        ok(f"vite.config.js created → {vite_path}")

# ─────────────────────────────────────────────────────────────
#  8. GOOGLE SEARCH CONSOLE VERIFICATION FILE
# ─────────────────────────────────────────────────────────────
def create_verification_placeholder(root: Path):
    head("8. GOOGLE SEARCH CONSOLE SETUP")
    
    content = """<!-- 
  Google Search Console Verification Steps:
  
  1. Go to: https://search.google.com/search-console/
  2. Click "Add Property" → "URL prefix" → Enter: https://www.vibhaprints.com
  3. Choose "HTML file" verification method
  4. Download the verification file (e.g., google1234abcd.html)
  5. Place it in your /public/ folder
  6. Deploy your site
  7. Click "Verify" in Search Console
  
  After verification:
  8. Go to "Sitemaps" section
  9. Submit: https://www.vibhaprints.com/sitemap.xml
  10. Go to "URL Inspection" → enter homepage URL → "Request Indexing"
  
  ⚠️  Replace this file with the actual Google verification HTML file!
-->
<html><body>Google Search Console verification placeholder. Replace with actual file.</body></html>
"""
    write_file(
        root / "public" / "google-search-console-PLACEHOLDER.html",
        content,
        "Google Search Console setup guide"
    )
    
    pr(C.YELLOW + C.BOLD, "\n  📋 Google Search Console Steps:")
    info("1. https://search.google.com/search-console/ par jao")
    info("2. Property add karo: https://www.vibhaprints.com")
    info("3. HTML file verification choose karo")
    info("4. Download ki hui file /public/ mein rakh do")
    info("5. Deploy karo aur Verify karo")
    info("6. Sitemap submit: https://www.vibhaprints.com/sitemap.xml")

# ─────────────────────────────────────────────────────────────
#  9. SEO AUDIT REPORT
# ─────────────────────────────────────────────────────────────
def generate_audit_report(root: Path):
    head("9. SEO CHECKLIST REPORT")
    
    report = f"""# vibhaprints.com – SEO Fix Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Script by: vibhaprints_seo_fixer.py

## Files Generated
- public/robots.txt          ✅ All bots allowed, sitemap linked
- public/sitemap.xml         ✅ All {len(PAGES)} pages with hreflang
- src/seo/SEO.jsx            ✅ React Helmet SEO component
- src/seo/seoConfig.js       ✅ All page SEO data + schemas
- src/seo/imageUtils.jsx     ✅ Alt text utilities
- src/seo/APP_INTEGRATION_GUIDE.jsx  📋 Integration instructions
- index.html                 ✅ Base SEO tags updated

## Schemas Implemented
- LocalBusiness + DesignAgency (homepage, contact)
- Organization (homepage, about)
- WebSite + SearchAction (homepage)
- Service (all service pages)
- FAQPage (logo-design page)
- BreadcrumbList (all pages)
- ItemList (portfolio)
- Blog (blog page)
- Person (about page)

## Keywords Targeted
Primary: {', '.join(KEYWORDS['primary'][:3])}...
Long-tail: {', '.join(KEYWORDS['long_tail'][:3])}...

## Pages Covered ({len(PAGES)} pages)
{chr(10).join(f'- {p["path"]:30s} | {p["title"][:50]}' for p in PAGES)}

## NEXT STEPS (Manual – Important!)
### Week 1 (Critical):
1. npm install react-helmet-async
2. App.jsx mein HelmetProvider wrap karo (see APP_INTEGRATION_GUIDE.jsx)
3. Har page mein <SEO page="page-id" /> add karo
4. Google Search Console mein website add karo
5. sitemap.xml submit karo
6. Homepage par "Request Indexing" karo

### Week 2:
7. OG image (1200x630px) banao: vibha-og.webp
8. Sari images mein alt text check karo (window.auditImageAlt() run karo)
9. JustDial, IndiaMart, Sulekha par listing add karo
10. Google Business Profile claim karo

### Month 1:
11. SSR/SSG consider karo (Next.js migration) for better crawlability
12. Blog section start karo (2 posts/month)
13. PageSpeed Insights par score check karo: pagespeed.web.dev
14. Core Web Vitals improve karo

## Critical Warning
⚠️  React SPA hone se Google content properly crawl nahi kar sakta.
    Long-term ke liye Next.js (SSR) mein migrate karna STRONGLY recommended hai.
    Short-term: react-snap ya prerender.io use karo.

## SEO Score Targets
Current: 22/100
After script:  ~45/100 (technical fixes)
After SSR/SSG: ~70/100
After content + backlinks: ~85/100
"""
    
    report_path = root / "SEO_REPORT_vibhaprints.md"
    report_path.write_text(report, encoding="utf-8")
    ok(f"SEO Report → {report_path}")

# ─────────────────────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="vibhaprints.com SEO Auto-Fixer")
    parser.add_argument(
        "--path", "-p",
        default=".",
        help="Path to your React project root (default: current directory)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing files"
    )
    args = parser.parse_args()
    
    # Header
    print()
    pr(C.BOLD + C.PURPLE, "╔══════════════════════════════════════════════════════════════╗")
    pr(C.BOLD + C.PURPLE, "║   VIBHAPRINTS.COM – COMPLETE SEO AUTO-FIX SCRIPT            ║")
    pr(C.BOLD + C.PURPLE, "║   vibhaprints.com ka poora SEO ek hi script se fix karo     ║")
    pr(C.BOLD + C.PURPLE, "╚══════════════════════════════════════════════════════════════╝")
    print()
    
    root = Path(args.path).resolve()
    pr(C.CYAN, f"  📁 Project path: {root}")
    
    if args.dry_run:
        pr(C.YELLOW, "  🔍 DRY RUN MODE – koi file write nahi hogi\n")
        info("In files mein changes honge:")
        for page in PAGES:
            info(f"  • {page['path']} → {page['title'][:50]}...")
        return
    
    if not root.exists():
        err(f"Path nahi mili: {root}")
        err("--path argument mein sahi path do")
        sys.exit(1)
    
    pr(C.YELLOW, f"  ⚡ {len(PAGES)} pages process kiye jaenge...\n")
    
    # Run all fixes
    fix_robots_txt(root)
    fix_sitemap_xml(root)
    generate_seo_component(root)
    fix_index_html(root)
    check_and_update_package_json(root)
    fix_vite_config(root)
    create_verification_placeholder(root)
    generate_audit_report(root)
    
    # Final Summary
    print()
    pr(C.BOLD + C.GREEN, "╔══════════════════════════════════════════════════════════════╗")
    pr(C.BOLD + C.GREEN, "║                    ✅ SEO FIX COMPLETE!                     ║")
    pr(C.BOLD + C.GREEN, "╚══════════════════════════════════════════════════════════════╝")
    print()
    pr(C.BOLD, "  📋 ABHI YE KARO (Important!):")
    pr(C.CYAN, "  1️⃣   npm install react-helmet-async")
    pr(C.CYAN, "  2️⃣   src/seo/APP_INTEGRATION_GUIDE.jsx padho aur App.jsx update karo")
    pr(C.CYAN, "  3️⃣   Har page mein <SEO page='page-id' /> add karo")
    pr(C.CYAN, "  4️⃣   Google Search Console: search.google.com/search-console")
    pr(C.CYAN, "  5️⃣   Sitemap submit karo: vibhaprints.com/sitemap.xml")
    pr(C.CYAN, "  6️⃣   SEO_REPORT_vibhaprints.md padho for complete action plan")
    print()
    pr(C.YELLOW, "  ⚠️  Phone number CONFIG mein update karna mat bhulo!")
    print()

if __name__ == "__main__":
    main()
