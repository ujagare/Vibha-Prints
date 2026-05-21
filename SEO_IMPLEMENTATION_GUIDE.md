# 🚀 VIBHA ART SEO IMPLEMENTATION GUIDE

## STEP 1: SEO Component Use Karo

Har page ke top mein add karo:

```jsx
import SEO from '../components/SEO';

// Home page
export default function Home() {
  return (
    <>
      <SEO page="home" />
      <main>
        {/* baaki content */}
      </main>
    </>
  );
}

// About page
export default function About() {
  return (
    <>
      <SEO page="about" />
      ...
    </>
  );
}
```

Available pages: "home", "about", "services", "portfolio", "contact"

---

## STEP 2: Semantic HTML Structure

Har page mein yeh structure use karo:

```jsx
<body>
  <header>           {/* Navbar */}
    <nav>
      <a href="/">Home</a>
      <a href="/services">Services</a>
    </nav>
  </header>

  <main>             {/* Main content */}
    <section>        {/* Hero section */}
      <h1>Page ka main heading — sirf EK h1 per page</h1>
    </section>

    <section>        {/* Services section */}
      <h2>Our Services</h2>
      <article>      {/* Individual service */}
        <h3>Flex Printing</h3>
        <p>Description...</p>
      </article>
    </section>

    <aside>          {/* Sidebar ya related content */}
    </aside>
  </main>

  <footer>           {/* Footer */}
    <address>        {/* Contact info */}
      Vibha Art, Pune, Maharashtra
      <a href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a>
    </address>
  </footer>
</body>
```

---

## STEP 3: robots.txt aur sitemap.xml

Dono files public/ folder mein already create ho gayi hain:
- `public/robots.txt` ✅
- `public/sitemap.xml` ✅

---

## STEP 4: Google Search Console

1. https://search.google.com/search-console/ par jao
2. "Add Property" -> "URL prefix" me `https://www.vibhaprints.com/` add karo
3. HTML file ya DNS method se verify karo
4. Sitemap submit karo: `https://www.vibhaprints.com/sitemap.xml`
5. "URL Inspection" me `https://www.vibhaprints.com/` inspect karke "Request Indexing" karo

---

## STEP 5: Google Business Profile (FREE — BAHUT ZAROORI)

1. https://business.google.com par jao
2. Business register karo "Vibha Art Pune"
3. Phone number, address, photos add karo
4. Yeh LOCAL SEO ke liye #1 most important step hai!

---

## Schema Checker

Schema validate karo:
https://validator.schema.org/
https://search.google.com/test/rich-results

---

## Ye Sab Add Karne ke Baad Expected Results:

- Google indexing: 1-2 hafte mein
- Local search (Pune printing): 2-4 hafte
- "Vibha Art" search: turant
- Rich snippets (FAQ boxes): 4-8 hafte
