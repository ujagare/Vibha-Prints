import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
  useLocation,
  ScrollRestoration,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Lenis from "@studio-freight/lenis";
import Navbar from "./components/Navbar";
import QueryProvider from "./providers/QueryProvider";
// Smooth scrolling is handled with CSS
import CursorEffect from "./components/CursorEffect";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import HotjarScript from "./components/HotjarScript";
import GoogleAdsScript from "./components/GoogleAdsScript";
import EnhancedChatBot from "./components/EnhancedChatBot";
import WhatsAppOrderWidget from "./components/WhatsAppOrderWidget";
import WhatsAppChatbot from "./components/WhatsAppChatbot";
import { ToastProvider } from "./components/ui/ToastProvider";

// Lazy load components for better performance
const Home = lazy(() => import("./routes/Home"));
const EnhancedAbout = lazy(() => import("./routes/EnhancedAbout"));
const EnhancedContact = lazy(() => import("./routes/EnhancedContact"));
const Printing = lazy(() => import("./routes/Printing"));
const DigitalMarketing = lazy(() => import("./routes/DigitalMarketing"));
const WebDevelopment = lazy(() => import("./routes/WebDevelopment"));
const ServiceGalleryCollection = lazy(() =>
  import("./routes/ServiceGalleryCollection"),
);
const ServicePage = lazy(() => import("./routes/ServicePage"));
const DigitalPrint = lazy(() => import("./routes/DigitalPrint"));
const LogoDesignGallery = lazy(() => import("./routes/LogoDesignGallery"));
const Terms = lazy(() => import("./routes/Terms"));
const PrivacyPolicy = lazy(() => import("./routes/PrivacyPolicy"));
const SitemapPage = lazy(() => import("./routes/SitemapPage"));
import EnhancedGraphicDesign from "./routes/EnhancedGraphicDesign";
import BusinessCardPrintingGallery from "./routes/BusinessCardPrintingGallery";
import PamphletPosterPrintingGallery from "./routes/PamphletPosterPrintingGallery";
import BrochureBookletPrintingGallery from "./routes/BrochureBookletPrintingGallery";
import FlexVinylPrintingGallery from "./routes/FlexVinylPrintingGallery";
import MagazinePrintingGallery from "./routes/MagazinePrintingGallery";
import StickerHangtagsLanyardPrintingGallery from "./routes/StickerHangtagsLanyardPrintingGallery";
import ProductPackagingPrintingGallery from "./routes/ProductPackagingPrintingGallery";
import CorporateStationaryPrintingGallery from "./routes/CorporateStationaryPrintingGallery";
import BagsTshirtsPrintingGallery from "./routes/BagsTshirtsPrintingGallery";
import BusinessCardDesignGallery from "./routes/BusinessCardDesignGallery";
import BrochureBookletDesignGallery from "./routes/BrochureBookletDesignGallery";
import PamphletPosterDesignGallery from "./routes/PamphletPosterDesignGallery";
import ProductPackagingDesignGallery from "./routes/ProductPackagingDesignGallery";
import CompanyProfileDesignGallery from "./routes/CompanyProfileDesignGallery";
import SocialMediaDesignGallery from "./routes/SocialMediaDesignGallery";
import CorporateIdentityDesignGallery from "./routes/CorporateIdentityDesignGallery";
import WebsiteDesignGallery from "./routes/WebsiteDesignGallery";
import NotFound from "./routes/NotFound";

// Security Configurations
const securityConfig = {
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://cdn.jsdelivr.net",
      "https://*.hotjar.com",
      "https://*.hotjar.io",
      "wss://*.hotjar.com",
      "https://www.googletagmanager.com",
      "https://*.google-analytics.com",
      "https://*.googleadservices.com",
      "https://*.googlesyndication.com",
      "https://*.g.doubleclick.net",
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
      "https://*.hotjar.com",
    ],
    imgSrc: ["'self'", "data:", "https:", "https://*.hotjar.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "https://*.hotjar.com"],
    connectSrc: [
      "'self'",
      "https://*.hotjar.com",
      "wss://*.hotjar.com",
      "https://*.google-analytics.com",
      "https://*.googleadservices.com",
      "https://*.g.doubleclick.net",
    ],
    frameSrc: [
      "'none'",
      "https://*.hotjar.com",
      "https://*.doubleclick.net",
      "https://*.googlesyndication.com",
      "https://web.whatsapp.com",
    ],
  },
  headers: {
    "X-XSS-Protection": "1; mode=block",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  },
};

function SecurityHeaders() {
  useEffect(() => {
    // Apply CSP via meta tag
    const cspContent = Object.entries(securityConfig.csp)
      .filter(([key]) =>
        [
          "default-src",
          "script-src",
          "style-src",
          "img-src",
          "font-src",
          "connect-src",
          "frame-src",
        ].includes(key),
      )
      .map(([key, values]) => `${key} ${values.join(" ")}`)
      .join("; ");

    const metaCSP = document.createElement("meta");
    metaCSP.httpEquiv = "Content-Security-Policy";
    metaCSP.content = cspContent;
    document.head.appendChild(metaCSP);

    // Apply other security headers via meta tags
    Object.entries(securityConfig.headers).forEach(([header, value]) => {
      if (header !== "X-Frame-Options") {
        const metaTag = document.createElement("meta");
        metaTag.httpEquiv = header;
        metaTag.content = value;
        document.head.appendChild(metaTag);
      }
    });

    return () => {
      // Cleanup meta tags if needed
      document.head.removeChild(metaCSP);
    };
  }, []);

  return null;
}

function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 z-50"
      style={{
        width: `${scrollProgress}%`,
        background: "linear-gradient(to right, #6A11CB, #2575FC)",
        boxShadow: "0 2px 10px rgba(106, 17, 203, 0.3)",
        transition: "width 0.1s ease-out",
      }}
    />
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Root layout component
function RootLayout() {
  const [loading, setLoading] = useState(true);

  const defaultSEO = {
    title: "Vibha Prints - Creative Design & Printing Services",
    description:
      "Vibha Prints offers professional graphic design, printing, and branding services. From logo design to large format printing, we help businesses create stunning visual identities.",
    keywords:
      "graphic design, printing services, logo design, branding, marketing materials, digital printing, offset printing",
    image: "/logo.png",
    url: import.meta.env.VITE_APP_URL || "https://vibhaprints.com",
  };

  // Enable Lenis smooth scrolling globally
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      mouseMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      wheelEventsTarget: window,
      wrapper: window,
      content: document.body,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Prevent scrolling when loader is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  return (
    <>
      {loading && <Loader finishLoading={() => setLoading(false)} />}
      <div className="flex flex-col min-h-screen bg-brand-white-50 text-brand-white-900 overflow-x-hidden max-w-full">
        <SecurityHeaders />
        <CursorEffect />
        <BackToTop />
        <HotjarScript hotjarId={import.meta.env.VITE_HOTJAR_ID || "3851307"} />
        <GoogleAdsScript
          conversionId={
            import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID || "AW-123456789"
          }
        />
        <EnhancedChatBot />
        <WhatsAppChatbot />
        <Helmet
          defaultTitle={defaultSEO.title}
          titleTemplate="%s | Vibha Art"
          meta={[
            { name: "description", content: defaultSEO.description },
            { name: "keywords", content: defaultSEO.keywords },
            { property: "og:type", content: "business.business" },
            { property: "og:title", content: defaultSEO.title },
            {
              property: "og:description",
              content: defaultSEO.description,
            },
            { property: "og:image", content: defaultSEO.image },
            { property: "og:url", content: defaultSEO.url },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: defaultSEO.title },
            {
              name: "twitter:description",
              content: defaultSEO.description,
            },
            { name: "twitter:image", content: defaultSEO.image },
          ]}
          link={[{ rel: "canonical", href: defaultSEO.url }]}
        />
        <Navbar />
        <ScrollProgressBar />
        <ScrollToTop />
        <ScrollRestoration />
        <AnimatePresence mode="wait">
          <main
            className="flex-1 w-full max-w-full overflow-x-hidden bg-brand-white-100"
            key="main-content"
          >
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
          </main>
        </AnimatePresence>
        <WhatsAppOrderWidget />
        <Footer />
      </div>
    </>
  );
}

// Home page with Helmet
const HomePage = () => (
  <>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <Home />
  </>
);

// About page with Helmet
const AboutPage = () => (
  <>
    <Helmet>
      <title>About Us</title>
    </Helmet>
    <EnhancedAbout />
  </>
);

// Contact page with Helmet
const ContactPage = () => (
  <>
    <Helmet>
      <title>Contact Us</title>
    </Helmet>
    <EnhancedContact />
  </>
);

// Graphic Design page with Helmet
const GraphicDesignPage = () => (
  <>
    <Helmet>
      <title>Graphic Design Services</title>
    </Helmet>
    <EnhancedGraphicDesign />
  </>
);

// Create router with routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="terms" element={<Terms />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="sitemap" element={<SitemapPage />} />
      <Route path="printing" element={<Printing />} />
      <Route path="digital-marketing" element={<DigitalMarketing />} />
      <Route path="web-development" element={<WebDevelopment />} />
      <Route path="web-developmen" element={<WebDevelopment />} />
      <Route
        path="seo-gallery"
        element={<ServiceGalleryCollection galleryKey="digital-seo" />}
      />
      <Route
        path="smm-gallery"
        element={<ServiceGalleryCollection galleryKey="digital-smm" />}
      />
      <Route
        path="ppc-gallery"
        element={<ServiceGalleryCollection galleryKey="digital-ppc" />}
      />
      <Route
        path="content-marketing-gallery"
        element={
          <ServiceGalleryCollection galleryKey="digital-content-marketing" />
        }
      />
      <Route
        path="email-marketing-gallery"
        element={
          <ServiceGalleryCollection galleryKey="digital-email-marketing" />
        }
      />
      <Route
        path="cro-gallery"
        element={<ServiceGalleryCollection galleryKey="digital-cro" />}
      />
      <Route
        path="orm-gallery"
        element={<ServiceGalleryCollection galleryKey="digital-orm" />}
      />
      <Route
        path="analytics-reporting-gallery"
        element={
          <ServiceGalleryCollection galleryKey="digital-analytics-reporting" />
        }
      />
      <Route
        path="custom-website-development-gallery"
        element={<ServiceGalleryCollection galleryKey="web-custom-development" />}
      />
      <Route
        path="ecommerce-development-gallery"
        element={<ServiceGalleryCollection galleryKey="web-ecommerce-development" />}
      />
      <Route
        path="responsive-web-design-gallery"
        element={<ServiceGalleryCollection galleryKey="web-responsive-design" />}
      />
      <Route
        path="cms-development-gallery"
        element={<ServiceGalleryCollection galleryKey="web-cms-development" />}
      />
      <Route
        path="web-application-development-gallery"
        element={
          <ServiceGalleryCollection galleryKey="web-application-development" />
        }
      />
      <Route
        path="api-integration-development-gallery"
        element={<ServiceGalleryCollection galleryKey="web-api-integration" />}
      />
      <Route
        path="website-speed-optimization-gallery"
        element={<ServiceGalleryCollection galleryKey="web-speed-optimization" />}
      />
      <Route
        path="website-maintenance-support-gallery"
        element={<ServiceGalleryCollection galleryKey="web-maintenance-support" />}
      />
      <Route path="services/:slug" element={<ServicePage />} />
      <Route path="digital-print" element={<DigitalPrint />} />
      <Route path="logo-design-gallery" element={<LogoDesignGallery />} />
      <Route path="logo-gallery" element={<LogoDesignGallery />} />
      <Route path="graphic-design" element={<GraphicDesignPage />} />
      <Route
        path="business-card-printing-gallery"
        element={<BusinessCardPrintingGallery />}
      />
      <Route
        path="pamphlet-poster-printing-gallery"
        element={<PamphletPosterPrintingGallery />}
      />
      <Route
        path="brochure-booklet-printing-gallery"
        element={<BrochureBookletPrintingGallery />}
      />
      <Route
        path="flex-vinyl-printing-gallery"
        element={<FlexVinylPrintingGallery />}
      />
      <Route
        path="magazine-printing-gallery"
        element={<MagazinePrintingGallery />}
      />
      <Route
        path="sticker-hangtags-lanyard-printing-gallery"
        element={<StickerHangtagsLanyardPrintingGallery />}
      />
      <Route
        path="product-packaging-printing-gallery"
        element={<ProductPackagingPrintingGallery />}
      />
      <Route
        path="corporate-stationary-printing-gallery"
        element={<CorporateStationaryPrintingGallery />}
      />
      <Route
        path="bags-tshirts-printing-gallery"
        element={<BagsTshirtsPrintingGallery />}
      />
      <Route
        path="business-card-design-gallery"
        element={<BusinessCardDesignGallery />}
      />
      <Route
        path="brochure-booklet-design-gallery"
        element={<BrochureBookletDesignGallery />}
      />
      <Route
        path="pamphlet-poster-design-gallery"
        element={<PamphletPosterDesignGallery />}
      />
      <Route
        path="product-packaging-design-gallery"
        element={<ProductPackagingDesignGallery />}
      />
      <Route
        path="company-profile-design-gallery"
        element={<CompanyProfileDesignGallery />}
      />
      <Route
        path="social-media-design-gallery"
        element={<SocialMediaDesignGallery />}
      />
      <Route
        path="corporate-identity-design-gallery"
        element={<CorporateIdentityDesignGallery />}
      />
      <Route path="website-design-gallery" element={<WebsiteDesignGallery />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

function App() {
  return (
    <QueryProvider>
      <HelmetProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </HelmetProvider>
    </QueryProvider>
  );
}

export default App;
