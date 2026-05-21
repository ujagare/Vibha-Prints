import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
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
import SEO from "./seo/SEO";

const SERVICE_KEYWORDS =
  "graphic design pune, printing services pune, branding pune, digital printing pune, logo design pune, business card printing pune";

const pageSeo = {
  terms: {
    page: "services",
    path: "/terms",
    title: "Terms and Conditions | Vibha Art",
    description:
      "Read Vibha Art terms for design, printing, delivery, payments, approvals, revisions and service usage.",
    keywords: "vibha art terms, printing terms pune, design service terms",
  },
  privacy: {
    page: "services",
    path: "/privacy-policy",
    title: "Privacy Policy | Vibha Art",
    description:
      "Learn how Vibha Art handles customer data, contact information, quote requests and website privacy.",
    keywords: "vibha art privacy policy, printing company privacy, customer data policy",
  },
  sitemap: {
    page: "services",
    path: "/sitemap",
    title: "Sitemap | Vibha Art",
    description:
      "Explore Vibha Art website pages for graphic design, printing, branding, web development and digital marketing services.",
    keywords: "vibha art sitemap, design services sitemap, printing services sitemap",
  },
  printing: {
    page: "large-format-printing",
    path: "/printing",
    title: "Printing Services in Pune | Business Cards, Brochures, Flex | Vibha Art",
    description:
      "Premium printing services in Pune for business cards, brochures, flex, vinyl, banners, packaging, labels, stickers and corporate stationery.",
    keywords:
      "printing services pune, business card printing pune, brochure printing pune, flex printing pune, sticker printing pune",
  },
  digitalMarketing: {
    page: "services",
    path: "/digital-marketing",
    title: "Digital Marketing Services in Pune | SEO, Ads, Social Media | Vibha Art",
    description:
      "Grow your brand with SEO, Google Ads, social media creatives, content marketing, email marketing and reporting support from Vibha Art.",
    keywords:
      "digital marketing pune, SEO services pune, social media marketing pune, Google ads pune, content marketing pune",
  },
  webDevelopment: {
    page: "services",
    path: "/web-development",
    title: "Website Design and Development in Pune | Vibha Art",
    description:
      "Professional website design, landing pages, ecommerce development, responsive web design and maintenance support for Pune businesses.",
    keywords:
      "website design pune, web development pune, ecommerce website pune, landing page design pune, responsive website pune",
  },
  digitalPrint: {
    page: "large-format-printing",
    path: "/digital-print",
    title: "Digital Printing Services in Pune | Vibha Art",
    description:
      "Fast digital printing in Pune for business materials, brochures, cards, flyers, labels and marketing collateral.",
    keywords: "digital printing pune, fast printing pune, print shop pune, marketing material printing",
  },
  graphicDesign: {
    page: "logo-design",
    path: "/graphic-design",
    title: "Graphic Design Services in Pune | Logo, Branding, Packaging | Vibha Art",
    description:
      "Creative graphic design services for logos, brand identity, company profiles, brochures, packaging and social media creatives.",
    keywords:
      "graphic design pune, logo design pune, branding agency pune, packaging design pune, brochure design pune",
  },
  notFound: {
    page: "home",
    path: "/404",
    title: "Page Not Found | Vibha Art",
    description:
      "The page you are looking for was not found. Explore Vibha Art design, printing and marketing services.",
    keywords: SERVICE_KEYWORDS,
  },
};

const gallerySeo = (path, title, description, keywords = SERVICE_KEYWORDS) => ({
  page: "portfolio",
  path,
  title: `${title} | Vibha Art Pune`,
  description,
  keywords,
});

const galleryPages = {
  seo: gallerySeo(
    "/seo-gallery",
    "SEO Services Gallery",
    "Explore SEO strategy, local search, content and reporting examples for businesses that want more online visibility.",
    "SEO gallery, SEO services pune, local SEO pune, search engine optimization",
  ),
  smm: gallerySeo(
    "/smm-gallery",
    "Social Media Marketing Gallery",
    "Explore social media post, campaign and creative examples for Instagram, Facebook and business brand growth.",
    "social media design pune, Instagram posts, Facebook creatives, SMM pune",
  ),
  ppc: gallerySeo(
    "/ppc-gallery",
    "PPC Advertising Gallery",
    "Explore paid ad creative and campaign concepts for Google Ads, Meta Ads, lead generation and remarketing.",
    "PPC ads pune, Google ads creatives, paid advertising pune, Meta ads",
  ),
  contentMarketing: gallerySeo(
    "/content-marketing-gallery",
    "Content Marketing Gallery",
    "Explore content marketing ideas for blogs, guides, social storytelling, lead capture and brand education.",
    "content marketing pune, blog content, brand content, lead generation content",
  ),
  emailMarketing: gallerySeo(
    "/email-marketing-gallery",
    "Email Marketing Gallery",
    "Explore email campaign examples for promotions, launches, lead nurturing, retention and repeat sales.",
    "email marketing pune, email campaign design, newsletter design, lead nurturing",
  ),
  cro: gallerySeo(
    "/cro-gallery",
    "Conversion Rate Optimization Gallery",
    "Explore CRO concepts for landing pages, funnels, forms, calls to action and conversion tracking.",
    "CRO services, conversion optimization, landing page optimization, funnel optimization",
  ),
  orm: gallerySeo(
    "/orm-gallery",
    "Online Reputation Management Gallery",
    "Explore online reputation management ideas for reviews, brand trust, customer response and visibility.",
    "online reputation management pune, ORM services, review management, brand trust",
  ),
  analytics: gallerySeo(
    "/analytics-reporting-gallery",
    "Analytics and Reporting Gallery",
    "Explore reporting dashboard concepts for tracking traffic, leads, campaigns and business growth.",
    "analytics reporting, marketing dashboard, Google Analytics reporting, campaign reporting",
  ),
  webCustom: gallerySeo(
    "/custom-website-development-gallery",
    "Custom Website Development Gallery",
    "Explore custom website development examples for service businesses, portfolios and lead generation websites.",
    "custom website development pune, business website design, web development gallery",
  ),
  webEcommerce: gallerySeo(
    "/ecommerce-development-gallery",
    "Ecommerce Development Gallery",
    "Explore ecommerce website concepts for product catalogs, checkout flows, product pages and online stores.",
    "ecommerce development pune, online store design, ecommerce website gallery",
  ),
  webResponsive: gallerySeo(
    "/responsive-web-design-gallery",
    "Responsive Web Design Gallery",
    "Explore responsive website designs built for mobile, tablet and desktop business experiences.",
    "responsive web design pune, mobile friendly website, website design gallery",
  ),
  webCms: gallerySeo(
    "/cms-development-gallery",
    "CMS Development Gallery",
    "Explore CMS website concepts for editable pages, content workflows and business website management.",
    "CMS development pune, WordPress website pune, editable website design",
  ),
  webApp: gallerySeo(
    "/web-application-development-gallery",
    "Web Application Development Gallery",
    "Explore web application concepts for dashboards, admin panels, portals and business workflows.",
    "web application development pune, dashboard design, admin panel development",
  ),
  webApi: gallerySeo(
    "/api-integration-development-gallery",
    "API Integration Development Gallery",
    "Explore API integration concepts for payments, CRM, WhatsApp, analytics and business systems.",
    "API integration pune, CRM integration, WhatsApp integration, payment integration",
  ),
  webSpeed: gallerySeo(
    "/website-speed-optimization-gallery",
    "Website Speed Optimization Gallery",
    "Explore website speed optimization ideas for faster loading, better UX and stronger SEO performance.",
    "website speed optimization pune, Core Web Vitals, performance optimization",
  ),
  webMaintenance: gallerySeo(
    "/website-maintenance-support-gallery",
    "Website Maintenance Support Gallery",
    "Explore website maintenance concepts for updates, backups, security checks and ongoing support.",
    "website maintenance pune, website support, website security, web backups",
  ),
};

const routeWithSEO = (element, seo) => (
  <>
    <SEO
      page={seo.page}
      customTitle={seo.title}
      customDesc={seo.description}
      customKeywords={seo.keywords}
      customPath={seo.path}
    />
    {element}
  </>
);

const serviceGallerySEO = (path, label, keywords = SERVICE_KEYWORDS) =>
  gallerySeo(
    path,
    label,
    `View ${label.toLowerCase()} examples from Vibha Art for professional design, printing, branding and marketing projects in Pune.`,
    keywords,
  );

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

function scrollWindowToTop() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollWindowToTop();
  }, [pathname]);

  return null;
}

function DisableScrollRestoration() {
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    scrollWindowToTop();

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

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
        <DisableScrollRestoration />
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <main
            className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden bg-brand-white-100"
            key="main-content"
          >
            <Suspense fallback={<div className="min-h-screen bg-white" />}>
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
      <Route index element={routeWithSEO(<HomePage />, { page: "home" })} />
      <Route path="about" element={routeWithSEO(<AboutPage />, { page: "about" })} />
      <Route path="contact" element={routeWithSEO(<ContactPage />, { page: "contact" })} />
      <Route path="terms" element={routeWithSEO(<Terms />, pageSeo.terms)} />
      <Route
        path="privacy-policy"
        element={routeWithSEO(<PrivacyPolicy />, pageSeo.privacy)}
      />
      <Route path="sitemap" element={routeWithSEO(<SitemapPage />, pageSeo.sitemap)} />
      <Route path="printing" element={routeWithSEO(<Printing />, pageSeo.printing)} />
      <Route
        path="digital-marketing"
        element={routeWithSEO(<DigitalMarketing />, pageSeo.digitalMarketing)}
      />
      <Route
        path="web-development"
        element={routeWithSEO(<WebDevelopment />, pageSeo.webDevelopment)}
      />
      <Route
        path="web-developmen"
        element={routeWithSEO(<WebDevelopment />, {
          ...pageSeo.webDevelopment,
          path: "/web-developmen",
        })}
      />
      <Route
        path="seo-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-seo" />,
          galleryPages.seo,
        )}
      />
      <Route
        path="smm-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-smm" />,
          galleryPages.smm,
        )}
      />
      <Route
        path="ppc-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-ppc" />,
          galleryPages.ppc,
        )}
      />
      <Route
        path="content-marketing-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-content-marketing" />,
          galleryPages.contentMarketing,
        )}
      />
      <Route
        path="email-marketing-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-email-marketing" />,
          galleryPages.emailMarketing,
        )}
      />
      <Route
        path="cro-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-cro" />,
          galleryPages.cro,
        )}
      />
      <Route
        path="orm-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-orm" />,
          galleryPages.orm,
        )}
      />
      <Route
        path="analytics-reporting-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="digital-analytics-reporting" />,
          galleryPages.analytics,
        )}
      />
      <Route
        path="custom-website-development-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-custom-development" />,
          galleryPages.webCustom,
        )}
      />
      <Route
        path="ecommerce-development-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-ecommerce-development" />,
          galleryPages.webEcommerce,
        )}
      />
      <Route
        path="responsive-web-design-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-responsive-design" />,
          galleryPages.webResponsive,
        )}
      />
      <Route
        path="cms-development-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-cms-development" />,
          galleryPages.webCms,
        )}
      />
      <Route
        path="web-application-development-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-application-development" />,
          galleryPages.webApp,
        )}
      />
      <Route
        path="api-integration-development-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-api-integration" />,
          galleryPages.webApi,
        )}
      />
      <Route
        path="website-speed-optimization-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-speed-optimization" />,
          galleryPages.webSpeed,
        )}
      />
      <Route
        path="website-maintenance-support-gallery"
        element={routeWithSEO(
          <ServiceGalleryCollection galleryKey="web-maintenance-support" />,
          galleryPages.webMaintenance,
        )}
      />
      <Route path="services/:slug" element={<ServicePage />} />
      <Route
        path="digital-print"
        element={routeWithSEO(<DigitalPrint />, pageSeo.digitalPrint)}
      />
      <Route
        path="logo-design-gallery"
        element={routeWithSEO(
          <LogoDesignGallery />,
          serviceGallerySEO(
            "/logo-design-gallery",
            "Logo Design Gallery",
            "logo design pune, logo design gallery, brand identity examples",
          ),
        )}
      />
      <Route
        path="logo-gallery"
        element={routeWithSEO(
          <LogoDesignGallery />,
          serviceGallerySEO(
            "/logo-gallery",
            "Logo Gallery",
            "logo gallery, brand identity portfolio, logo design pune",
          ),
        )}
      />
      <Route
        path="graphic-design"
        element={routeWithSEO(<GraphicDesignPage />, pageSeo.graphicDesign)}
      />
      <Route
        path="business-card-printing-gallery"
        element={routeWithSEO(
          <BusinessCardPrintingGallery />,
          serviceGallerySEO(
            "/business-card-printing-gallery",
            "Business Card Printing Gallery",
            "business card printing pune, visiting card printing, premium business cards",
          ),
        )}
      />
      <Route
        path="pamphlet-poster-printing-gallery"
        element={routeWithSEO(
          <PamphletPosterPrintingGallery />,
          serviceGallerySEO(
            "/pamphlet-poster-printing-gallery",
            "Pamphlet and Poster Printing Gallery",
            "pamphlet printing pune, poster printing pune, flyer printing",
          ),
        )}
      />
      <Route
        path="brochure-booklet-printing-gallery"
        element={routeWithSEO(
          <BrochureBookletPrintingGallery />,
          serviceGallerySEO(
            "/brochure-booklet-printing-gallery",
            "Brochure and Booklet Printing Gallery",
            "brochure printing pune, booklet printing, catalog printing",
          ),
        )}
      />
      <Route
        path="flex-vinyl-printing-gallery"
        element={routeWithSEO(
          <FlexVinylPrintingGallery />,
          serviceGallerySEO(
            "/flex-vinyl-printing-gallery",
            "Flex and Vinyl Printing Gallery",
            "flex printing pune, vinyl printing pune, banner printing",
          ),
        )}
      />
      <Route
        path="magazine-printing-gallery"
        element={routeWithSEO(
          <MagazinePrintingGallery />,
          serviceGallerySEO(
            "/magazine-printing-gallery",
            "Magazine Printing Gallery",
            "magazine printing pune, catalog printing, booklet printing",
          ),
        )}
      />
      <Route
        path="sticker-hangtags-lanyard-printing-gallery"
        element={routeWithSEO(
          <StickerHangtagsLanyardPrintingGallery />,
          serviceGallerySEO(
            "/sticker-hangtags-lanyard-printing-gallery",
            "Sticker, Hangtag and Lanyard Printing Gallery",
            "sticker printing pune, hangtag printing, lanyard printing, label printing",
          ),
        )}
      />
      <Route
        path="product-packaging-printing-gallery"
        element={routeWithSEO(
          <ProductPackagingPrintingGallery />,
          serviceGallerySEO(
            "/product-packaging-printing-gallery",
            "Product Packaging Printing Gallery",
            "packaging printing pune, product label printing, box printing",
          ),
        )}
      />
      <Route
        path="corporate-stationary-printing-gallery"
        element={routeWithSEO(
          <CorporateStationaryPrintingGallery />,
          serviceGallerySEO(
            "/corporate-stationary-printing-gallery",
            "Corporate Stationery Printing Gallery",
            "corporate stationery printing, letterhead printing pune, envelope printing",
          ),
        )}
      />
      <Route
        path="bags-tshirts-printing-gallery"
        element={routeWithSEO(
          <BagsTshirtsPrintingGallery />,
          serviceGallerySEO(
            "/bags-tshirts-printing-gallery",
            "Bags and T-Shirts Printing Gallery",
            "t-shirt printing pune, bag printing pune, merchandise printing",
          ),
        )}
      />
      <Route
        path="business-card-design-gallery"
        element={routeWithSEO(
          <BusinessCardDesignGallery />,
          serviceGallerySEO(
            "/business-card-design-gallery",
            "Business Card Design Gallery",
            "business card design pune, visiting card design, premium card design",
          ),
        )}
      />
      <Route
        path="brochure-booklet-design-gallery"
        element={routeWithSEO(
          <BrochureBookletDesignGallery />,
          serviceGallerySEO(
            "/brochure-booklet-design-gallery",
            "Brochure and Booklet Design Gallery",
            "brochure design pune, booklet design, company brochure design",
          ),
        )}
      />
      <Route
        path="pamphlet-poster-design-gallery"
        element={routeWithSEO(
          <PamphletPosterDesignGallery />,
          serviceGallerySEO(
            "/pamphlet-poster-design-gallery",
            "Pamphlet and Poster Design Gallery",
            "pamphlet design pune, poster design, flyer design",
          ),
        )}
      />
      <Route
        path="product-packaging-design-gallery"
        element={routeWithSEO(
          <ProductPackagingDesignGallery />,
          serviceGallerySEO(
            "/product-packaging-design-gallery",
            "Product Packaging Design Gallery",
            "packaging design pune, label design, product box design",
          ),
        )}
      />
      <Route
        path="company-profile-design-gallery"
        element={routeWithSEO(
          <CompanyProfileDesignGallery />,
          serviceGallerySEO(
            "/company-profile-design-gallery",
            "Company Profile Design Gallery",
            "company profile design pune, corporate profile design, business profile design",
          ),
        )}
      />
      <Route
        path="social-media-design-gallery"
        element={routeWithSEO(
          <SocialMediaDesignGallery />,
          serviceGallerySEO(
            "/social-media-design-gallery",
            "Social Media Design Gallery",
            "social media post design pune, Instagram creatives, Facebook post design",
          ),
        )}
      />
      <Route
        path="corporate-identity-design-gallery"
        element={routeWithSEO(
          <CorporateIdentityDesignGallery />,
          serviceGallerySEO(
            "/corporate-identity-design-gallery",
            "Corporate Identity Design Gallery",
            "corporate identity design pune, brand identity design, stationery design",
          ),
        )}
      />
      <Route
        path="website-design-gallery"
        element={routeWithSEO(
          <WebsiteDesignGallery />,
          serviceGallerySEO(
            "/website-design-gallery",
            "Website Design Gallery",
            "website design pune, web design gallery, landing page design",
          ),
        )}
      />
      <Route path="*" element={routeWithSEO(<NotFound />, pageSeo.notFound)} />
    </Route>,
  ),
);

function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>
  );
}

export default App;
