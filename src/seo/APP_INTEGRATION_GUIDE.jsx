/**
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
