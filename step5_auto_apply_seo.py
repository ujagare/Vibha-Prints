#!/usr/bin/env python3
"""
VIBHA ART — AUTO SEO APPLY
- Phone/Email update karo
- SEO component har page mein add karo
- robots.txt + sitemap regenerate karo

Run: python step5_auto_apply_seo.py
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime

PROJECT  = r"C:\Users\ujaga\OneDrive\Desktop\Vibha Art"
SRC_DIR  = os.path.join(PROJECT, "src")
PUB_DIR  = os.path.join(PROJECT, "public")

PHONE = "+91-8624948046 / +91-8975805789"
EMAIL = "info@vibhaprints.com / vibhart07@gmail.com"
SITE_URL = "https://vibha-prints.vercel.app"

SKIP = {"node_modules", ".git", ".next", "dist", "build", ".vercel"}

# Page keyword → SEO page prop mapping
PAGE_MAP = {
    "home":      ["App.jsx","App.tsx","Home.jsx","Home.tsx","index.jsx","index.tsx","page.tsx"],
    "about":     ["About.jsx","About.tsx","EnhancedAbout.jsx","about.jsx","about.tsx"],
    "services":  ["Services.jsx","Services.tsx","ServiceLandingTemplate.jsx","services.jsx"],
    "portfolio": ["Portfolio.jsx","Portfolio.tsx","portfolio-layout.tsx","PortfolioPreview.jsx"],
    "contact":   ["Contact.jsx","Contact.tsx","contact.jsx","contact.tsx"],
}

# Reverse map: filename → page key
FILE_TO_PAGE = {}
for page_key, filenames in PAGE_MAP.items():
    for fname in filenames:
        FILE_TO_PAGE[fname.lower()] = page_key

stats = {"updated": 0, "skipped": 0, "seo_added": 0}

# ── SEO Component (updated with real phone/email) ─────────────
SEO_COMPONENT = f'''import {{ useEffect }} from "react";

const SEO_DATA = {{
  home: {{
    title: "Vibha Art | Graphic Design & Printing Services in Pune",
    description: "Vibha Art Pune — Professional graphic design, flex printing, visiting cards, banners, T-shirt printing & branding. Quality prints at affordable rates. Call {PHONE}!",
    keywords: "graphic design pune, printing services pune, flex printing pune, visiting card printing pune, banner printing pune, logo design pune, branding pune",
    canonical: "{SITE_URL}/",
  }},
  about: {{
    title: "About Vibha Art | Pune's Trusted Printing & Design Studio",
    description: "Learn about Vibha Art — Pune's creative design and printing studio. Expert team delivering high-quality branding, printing, and design solutions. Call {PHONE}.",
    keywords: "about vibha art pune, printing studio pune, design agency pune, creative studio maharashtra",
    canonical: "{SITE_URL}/about",
  }},
  services: {{
    title: "Printing & Design Services | Vibha Art Pune",
    description: "Vibha Art offers flex printing, visiting cards, banners, T-shirt printing, logo design, branding & more in Pune. Get instant quote at {EMAIL}.",
    keywords: "flex printing pune, visiting card printing pune, banner printing pune, logo design pune, t-shirt printing pune, brochure printing pune, sticker printing pune",
    canonical: "{SITE_URL}/services",
  }},
  portfolio: {{
    title: "Our Portfolio | Vibha Art Design & Print Work Pune",
    description: "Explore Vibha Art's portfolio — logo designs, banner printing, visiting cards, branding projects done for clients across Pune & Maharashtra.",
    keywords: "vibha art portfolio, design portfolio pune, print work pune, branding portfolio maharashtra",
    canonical: "{SITE_URL}/portfolio",
  }},
  contact: {{
    title: "Contact Vibha Art | Get Quote for Printing & Design Pune",
    description: "Contact Vibha Art Pune for printing and design services. Get free quotes. WhatsApp or call {PHONE} or email {EMAIL} today!",
    keywords: "contact vibha art pune, printing quote pune, vibha art phone number, info@vibhaprints.com, vibhart07@gmail.com",
    canonical: "{SITE_URL}/contact",
  }},
}};

const SCHEMA = {{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Vibha Art",
  "description": "Professional graphic design and printing services in Pune, Maharashtra.",
  "url": "{SITE_URL}",
  "telephone": "{PHONE}",
  "email": "{EMAIL}",
  "address": {{
    "@type": "PostalAddress",
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  }},
  "geo": {{ "@type": "GeoCoordinates", "latitude": "18.5204", "longitude": "73.8567" }},
  "openingHours": "Mo-Sa 09:00-19:00",
  "priceRange": "\\u20b9\\u20b9",
  "areaServed": ["Pune", "Maharashtra"],
  "sameAs": [
    "https://facebook.com/vibhaart",
    "https://instagram.com/vibhaart"
  ]
}};

export default function SEO({{ page = "home" }}) {{
  const data = SEO_DATA[page] || SEO_DATA.home;

  useEffect(() => {{
    document.title = data.title;

    const setMeta = (sel, val) => {{
      let el = document.querySelector(sel);
      if (!el) {{ el = document.createElement("meta"); document.head.appendChild(el); }}
      const isOg = sel.includes("property=");
      el.setAttribute(isOg ? "property" : "name", sel.match(/["\'](.*?)["\']/)?.[1] || "");
      el.setAttribute("content", val);
    }};

    setMeta('[name="description"]',          data.description);
    setMeta('[name="keywords"]',             data.keywords);
    setMeta('[name="robots"]',               "index, follow");
    setMeta('[name="author"]',               "Vibha Art");
    setMeta('[name="geo.region"]',           "IN-MH");
    setMeta('[name="geo.placename"]',        "Pune");
    setMeta('[property="og:title"]',         data.title);
    setMeta('[property="og:description"]',   data.description);
    setMeta('[property="og:url"]',           data.canonical);
    setMeta('[property="og:type"]',          "website");
    setMeta('[property="og:image"]',         "{SITE_URL}/assets/vibha-logo.webp");
    setMeta('[property="og:site_name"]',     "Vibha Art");
    setMeta('[property="og:locale"]',        "en_IN");
    setMeta('[name="twitter:card"]',         "summary_large_image");
    setMeta('[name="twitter:title"]',        data.title);
    setMeta('[name="twitter:description"]',  data.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {{ canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }}
    canonical.href = data.canonical;

    let schema = document.getElementById("vibha-schema");
    if (!schema) {{ schema = document.createElement("script"); schema.id = "vibha-schema"; schema.type = "application/ld+json"; document.head.appendChild(schema); }}
    schema.textContent = JSON.stringify(SCHEMA);
  }}, [page, data]);

  return null;
}}
'''

ROBOTS = f"""User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Sitemap: {SITE_URL}/sitemap.xml
Crawl-delay: 1
"""

def create_sitemap():
    today = datetime.now().strftime("%Y-%m-%d")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{SITE_URL}/</loc><lastmod>{today}</lastmod><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>{SITE_URL}/about</loc><lastmod>{today}</lastmod><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>{SITE_URL}/services</loc><lastmod>{today}</lastmod><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>{SITE_URL}/portfolio</loc><lastmod>{today}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>{SITE_URL}/contact</loc><lastmod>{today}</lastmod><priority>0.7</priority><changefreq>monthly</changefreq></url>
</urlset>"""


def find_component_files():
    """All JSX/TSX files dhundho aur page type identify karo"""
    found = []
    for root, dirs, files in os.walk(SRC_DIR if os.path.exists(SRC_DIR) else PROJECT):
        dirs[:] = [d for d in dirs if d not in SKIP]
        for file in files:
            if file.endswith((".jsx", ".tsx")):
                page_key = FILE_TO_PAGE.get(file.lower())
                if page_key:
                    found.append((Path(root) / file, page_key))
    return found


def add_seo_to_file(filepath, page_key):
    """File mein SEO component import aur usage add karo"""
    try:
        text = filepath.read_text(encoding="utf-8", errors="ignore")
        original = text

        # Already has SEO? skip
        if "import SEO" in text or "<SEO" in text:
            print(f"  ⏭️  Already has SEO: {filepath.name}")
            stats["skipped"] += 1
            return

        # Find correct relative path to SEO component
        try:
            rel = os.path.relpath(
                os.path.join(SRC_DIR, "components", "SEO.jsx"),
                os.path.dirname(filepath)
            ).replace("\\", "/")
            if not rel.startswith("."):
                rel = "./" + rel
            rel = rel.replace(".jsx", "")
        except:
            rel = "../components/SEO"

        seo_import = f'import SEO from "{rel}";'

        # 1. Import add karo — existing imports ke baad
        last_import = max(
            (m.end() for m in re.finditer(r'^import .+;?$', text, re.MULTILINE)),
            default=0
        )
        if last_import > 0:
            text = text[:last_import] + "\n" + seo_import + text[last_import:]
        else:
            text = seo_import + "\n" + text

        # 2. <SEO page="..." /> add karo — return ke andar pehli tag ke baad
        # Pattern: return ( <> ya return ( <div ya return <div etc.
        def insert_seo_tag(m):
            tag = m.group(0)
            seo_tag = f'\n      <SEO page="{page_key}" />'
            return tag + seo_tag

        # Try fragment <>
        if re.search(r'return\s*\(\s*<>', text):
            text = re.sub(r'(return\s*\(\s*<>)', insert_seo_tag, text, count=1)
        # Try <main
        elif re.search(r'return\s*\(\s*<main', text):
            text = re.sub(r'(return\s*\(\s*<main[^>]*>)', insert_seo_tag, text, count=1)
        # Try first div in return
        elif re.search(r'return\s*\(\s*<div', text):
            text = re.sub(r'(return\s*\(\s*<div[^>]*>)', insert_seo_tag, text, count=1)
        # Try return <> (no parens)
        elif re.search(r'return\s+<>', text):
            text = re.sub(r'(return\s+<>)', insert_seo_tag, text, count=1)

        if text != original:
            filepath.write_text(text, encoding="utf-8")
            print(f"  ✅ SEO added ({page_key}): {filepath.name}")
            stats["updated"] += 1
            stats["seo_added"] += 1
        else:
            print(f"  ⚠️  Could not auto-insert in: {filepath.name} (manual add needed)")
            stats["skipped"] += 1

    except Exception as e:
        print(f"  ❌ Error: {filepath.name} — {e}")


def main():
    print("""
╔══════════════════════════════════════════════════════════════╗
║        VIBHA ART — AUTO SEO APPLY                            ║
╚══════════════════════════════════════════════════════════════╝
""")

    # 1. SEO Component update karo
    print("  📝 Updating SEO component with real phone/email...")
    comp_dir = os.path.join(SRC_DIR, "components")
    os.makedirs(comp_dir, exist_ok=True)
    Path(os.path.join(comp_dir, "SEO.jsx")).write_text(SEO_COMPONENT, encoding="utf-8")
    print(f"  ✅ SEO.jsx updated — {PHONE} | {EMAIL}\n")

    # 2. robots.txt + sitemap.xml
    print("  🤖 Regenerating robots.txt and sitemap.xml...")
    os.makedirs(PUB_DIR, exist_ok=True)
    Path(os.path.join(PUB_DIR, "robots.txt")).write_text(ROBOTS, encoding="utf-8")
    Path(os.path.join(PUB_DIR, "sitemap.xml")).write_text(create_sitemap(), encoding="utf-8")
    print("  ✅ robots.txt updated")
    print("  ✅ sitemap.xml updated\n")

    # 3. Har page mein SEO component add karo
    print("  🔍 Finding page files...\n")
    files = find_component_files()

    if not files:
        print("  ⚠️  Koi page file nahi mili src/ folder mein!")
        print("  Manually check karo: src/ folder exist karta hai?")
    else:
        print(f"  {len(files)} page files mili:\n")
        for filepath, page_key in files:
            add_seo_to_file(filepath, page_key)

    print(f"""
{'═'*55}
  ✅ SEO Component Updated    (phone + email)
  ✅ robots.txt Regenerated
  ✅ sitemap.xml Regenerated
  ✅ Pages Updated            : {stats['updated']}
  ⏭️  Already had SEO / Manual: {stats['skipped']}
{'═'*55}

  🚀 AB KYA KARNA HAI:

  1. Website locally test karo:
     npm run dev

  2. Deploy karo:
     vercel --prod

  3. Google Search Console mein sitemap submit karo:
     https://search.google.com/search-console
     Sitemap: {SITE_URL}/sitemap.xml

  4. Google Business Profile banao (FREE + IMPORTANT):
     https://business.google.com
     Name: "Vibha Art"
     Phone: {PHONE}
     Email: {EMAIL}
{'═'*55}
""")


if __name__ == "__main__":
    main()
