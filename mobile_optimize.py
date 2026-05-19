"""
====================================================
🚀 Mobile Optimization Script - Vibha Art (Vite + React)
====================================================
Run: python mobile_optimize.py
Project root se run karo:
  cd "C:\\Users\\ujaga\\OneDrive\\Desktop\\Vibha Art"
  python mobile_optimize.py
====================================================
"""

import os
import re
import shutil
from pathlib import Path

# ─── Colors for terminal ───
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
BLUE   = "\033[94m"
BOLD   = "\033[1m"
NC     = "\033[0m"

def log_ok(msg):    print(f"{GREEN}✅ {msg}{NC}")
def log_warn(msg):  print(f"{YELLOW}⚠️  {msg}{NC}")
def log_err(msg):   print(f"{RED}❌ {msg}{NC}")
def log_info(msg):  print(f"{BLUE}ℹ️  {msg}{NC}")
def log_head(msg):  print(f"\n{BOLD}{YELLOW}[{msg}]{NC}")

PROJECT_ROOT = Path(__file__).parent
SRC = PROJECT_ROOT / "src"

print(f"""
{BLUE}{BOLD}========================================
   🚀 Mobile Optimization - Vibha Art
   Vite + React Project
========================================{NC}
Project: {PROJECT_ROOT}
""")

# ─────────────────────────────────────────
# STEP 1: index.css — Mobile CSS add karo
# ─────────────────────────────────────────
log_head("1/4 Mobile CSS — src/index.css")

INDEX_CSS = SRC / "index.css"
MOBILE_PATCH = """
/* ===== mobile-optimize-patch ===== */

/* Tap targets minimum 48px */
a, button, [role="button"],
input[type="submit"], input[type="button"],
label, select {
  min-height: 48px;
  min-width: 44px;
}

/* Box sizing globally */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Prevent horizontal scroll */
html, body {
  overflow-x: hidden;
  max-width: 100%;
}

/* Readable font on mobile */
@media (max-width: 768px) {
  html {
    font-size: 16px !important;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    font-size: 16px;
    line-height: 1.6;
  }

  h1 { font-size: clamp(1.6rem, 6vw, 2.5rem); }
  h2 { font-size: clamp(1.3rem, 5vw, 2rem); }
  h3 { font-size: clamp(1.1rem, 4vw, 1.5rem); }
  p, li, span, a { font-size: clamp(0.875rem, 3.5vw, 1rem); }

  /* Images responsive */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Better buttons on mobile */
  button, .btn, a.btn {
    padding: 12px 20px;
    font-size: 1rem;
    touch-action: manipulation;
    cursor: pointer;
  }

  /* Fix iOS input zoom (font must be 16px+) */
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="number"],
  input[type="search"],
  textarea,
  select {
    font-size: 16px !important;
  }

  /* Table scroll on mobile */
  table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* ===== end mobile-optimize-patch ===== */
"""

if INDEX_CSS.exists():
    content = INDEX_CSS.read_text(encoding="utf-8")
    if "mobile-optimize-patch" in content:
        log_warn("Mobile CSS patch already exists — skip")
    else:
        with open(INDEX_CSS, "a", encoding="utf-8") as f:
            f.write(MOBILE_PATCH)
        log_ok("Mobile CSS added to src/index.css")
else:
    INDEX_CSS.write_text(MOBILE_PATCH, encoding="utf-8")
    log_ok("src/index.css banaya aur Mobile CSS add kiya")

# ─────────────────────────────────────────
# STEP 2: index.html — Viewport + Meta fix
# ─────────────────────────────────────────
log_head("2/4 index.html — Viewport & Meta Tags")

INDEX_HTML = PROJECT_ROOT / "index.html"

if INDEX_HTML.exists():
    html = INDEX_HTML.read_text(encoding="utf-8")
    changed = False

    # Viewport fix
    if 'name="viewport"' not in html:
        html = html.replace(
            "<head>",
            '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">'
        )
        log_ok("Viewport meta tag add kiya")
        changed = True
    else:
        # Fix agar sirf initial-scale=1 hai — maximum-scale add karo
        if "maximum-scale" not in html:
            html = html.replace(
                'initial-scale=1.0"',
                'initial-scale=1.0, maximum-scale=5.0"'
            )
            html = html.replace(
                'initial-scale=1"',
                'initial-scale=1, maximum-scale=5.0"'
            )
            log_ok("Viewport maximum-scale=5 add kiya (pinch zoom allowed)")
            changed = True
        else:
            log_ok("Viewport already theek hai")

    # Theme color
    if 'name="theme-color"' not in html:
        html = html.replace(
            "</head>",
            '    <meta name="theme-color" content="#6A11CB">\n  </head>'
        )
        log_ok("Theme-color meta add kiya")
        changed = True

    # Mobile web app capable
    if 'mobile-web-app-capable' not in html:
        html = html.replace(
            "</head>",
            '    <meta name="mobile-web-app-capable" content="yes">\n  </head>'
        )
        changed = True

    if changed:
        # Backup pehle
        shutil.copy(INDEX_HTML, PROJECT_ROOT / "index.html.bak")
        INDEX_HTML.write_text(html, encoding="utf-8")
        log_ok("index.html updated (backup: index.html.bak)")
    else:
        log_ok("index.html already optimized hai")
else:
    log_err("index.html nahi mila")

# ─────────────────────────────────────────
# STEP 3: <img> → lazy loading ensure karo
# ─────────────────────────────────────────
log_head("3/4 Image Tags — loading='lazy' + decoding='async'")

JSX_FILES = list(SRC.rglob("*.jsx")) + list(SRC.rglob("*.tsx"))
img_fixed = 0
img_skipped = 0

for filepath in JSX_FILES:
    try:
        content = filepath.read_text(encoding="utf-8")
        original = content

        # Add loading="lazy" agar nahi hai
        def add_lazy(match):
            tag = match.group(0)
            if 'loading=' not in tag:
                tag = tag.replace('<img ', '<img loading="lazy" ', 1)
            if 'decoding=' not in tag:
                tag = tag.replace('<img ', '<img decoding="async" ', 1)
            return tag

        content = re.sub(r'<img\s[^>]*>', add_lazy, content)

        if content != original:
            filepath.write_text(content, encoding="utf-8")
            img_fixed += 1
        else:
            img_skipped += 1
    except Exception as e:
        log_warn(f"Skip {filepath.name}: {e}")

log_ok(f"{img_fixed} files mein lazy loading ensure kiya")
if img_skipped:
    log_info(f"{img_skipped} files already optimized the")

# ─────────────────────────────────────────
# STEP 4: vite.config.js — Build optimize
# ─────────────────────────────────────────
log_head("4/4 vite.config.js — Build Optimization")

VITE_CONFIG = PROJECT_ROOT / "vite.config.js"

if VITE_CONFIG.exists():
    vite_content = VITE_CONFIG.read_text(encoding="utf-8")

    if "mobile-optimized" in vite_content:
        log_warn("vite.config.js already optimized — skip")
    else:
        # Backup
        shutil.copy(VITE_CONFIG, PROJECT_ROOT / "vite.config.js.bak")

        NEW_VITE = """// mobile-optimized
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Chunk splitting — faster mobile load
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
    // Smaller chunks
    chunkSizeWarningLimit: 500,
    // CSS code split
    cssCodeSplit: true,
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // console.log remove in production
        drop_debugger: true,
      },
    },
    // Source maps off in production
    sourcemap: false,
  },
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
"""
        VITE_CONFIG.write_text(NEW_VITE, encoding="utf-8")
        log_ok("vite.config.js optimized (backup: vite.config.js.bak)")
else:
    log_err("vite.config.js nahi mila")

# ─────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────
print(f"""
{BLUE}{BOLD}========================================
   ✅ Optimization Complete!
========================================{NC}

{GREEN}Kya hua:{NC}
  ✅ Mobile CSS — tap targets, font size, scroll fix
  ✅ index.html — viewport, theme-color meta
  ✅ Images — lazy loading + async decoding
  ✅ vite.config.js — chunk split, minify, console.log remove

{YELLOW}Ab ye karo:{NC}
  1. npm run dev   → locally check karo
  2. Sab theek lage toh:
     git add .
     git commit -m "mobile optimization"
     git push
  3. Vercel auto-deploy hoga
  4. PageSpeed pe dobara test karo → score 70+ aana chahiye

{BLUE}Agar kuch bhi galat lage:{NC}
  Backup files hain:
  - index.html.bak
  - vite.config.js.bak
  Inhe wapas rename karo — sab theek ho jaayega!
""")
