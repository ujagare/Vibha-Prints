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
  "graphic design services pune, printing services pune, logo design pune, branding agency pune, digital printing pune, business card printing pune, brochure printing pune, flex banner printing pune, packaging design pune, website design pune, digital marketing pune";

const pageSeo = {
  terms: {
    page: "services",
    path: "/terms",
    title: "Terms and Conditions | Design and Printing Services | Vibha Art",
    description:
      "Read Vibha Art terms for graphic design, printing, branding, delivery, payments, approvals, revisions and project service usage in Pune.",
    keywords:
      "vibha art terms, design service terms pune, printing service terms pune, branding project terms, print order policy pune",
  },
  privacy: {
    page: "services",
    path: "/privacy-policy",
    title: "Privacy Policy | Design, Printing and Marketing Studio | Vibha Art",
    description:
      "Learn how Vibha Art handles customer data, contact details, quote requests, project enquiries and website privacy for design and printing clients.",
    keywords:
      "vibha art privacy policy, printing company privacy policy, graphic design privacy policy, customer data policy pune, quote request privacy",
  },
  sitemap: {
    page: "services",
    path: "/sitemap",
    title: "Sitemap | Graphic Design, Printing and Marketing Pages | Vibha Art",
    description:
      "Explore Vibha Art pages for graphic design, logo design, printing services, branding, web development, digital marketing and portfolio galleries.",
    keywords:
      "vibha art sitemap, graphic design sitemap pune, printing services sitemap, logo design pages pune, branding portfolio sitemap",
  },
  printing: {
    page: "large-format-printing",
    path: "/printing",
    title: "Printing Services in Pune | Business Cards, Brochures, Flex | Vibha Art",
    description:
      "Premium printing services in Pune for business cards, brochures, flyers, flex banners, vinyl, packaging, labels, stickers, booklets and corporate stationery.",
    keywords:
      "printing services pune, business card printing pune, brochure printing pune, flex printing pune, banner printing pune, sticker printing pune, label printing pune, packaging printing pune, booklet printing pune",
  },
  digitalMarketing: {
    page: "services",
    path: "/digital-marketing",
    title: "Digital Marketing Services in Pune | SEO, Ads, Social Media | Vibha Art",
    description:
      "Grow your business with SEO, local SEO, Google Ads, social media marketing, content marketing, email campaigns, CRO, ORM and analytics support in Pune.",
    keywords:
      "digital marketing pune, SEO services pune, local SEO pune, social media marketing pune, Google ads agency pune, PPC services pune, content marketing pune, ORM services pune",
  },
  webDevelopment: {
    page: "services",
    path: "/web-development",
    title: "Website Design and Development in Pune | Business Websites | Vibha Art",
    description:
      "Professional website design and development in Pune for business websites, landing pages, ecommerce stores, responsive UI, CMS sites, speed optimization and support.",
    keywords:
      "website design pune, web development pune, business website design pune, ecommerce website development pune, landing page design pune, responsive website design pune, website maintenance pune",
  },
  digitalPrint: {
    page: "large-format-printing",
    path: "/digital-print",
    title: "Digital Printing Services in Pune | Fast Print Shop | Vibha Art",
    description:
      "Fast digital printing in Pune for business cards, flyers, brochures, posters, stickers, labels, booklets, catalogs and marketing collateral.",
    keywords:
      "digital printing pune, fast digital printing pune, print shop pune, flyer printing pune, poster printing pune, business card digital printing, brochure digital printing pune",
  },
  graphicDesign: {
    page: "logo-design",
    path: "/graphic-design",
    title: "Graphic Design Services in Pune | Logo, Branding, Packaging | Vibha Art",
    description:
      "Creative graphic design services in Pune for logos, brand identity, company profiles, brochures, packaging, business cards, social media creatives and print-ready artwork.",
    keywords:
      "graphic design pune, logo design pune, branding agency pune, brand identity design pune, packaging design pune, brochure design pune, social media design pune, company profile design pune",
  },
  notFound: {
    page: "home",
    path: "/404",
    title: "Page Not Found | Vibha Art",
    description:
      "The page was not found. Explore Vibha Art graphic design, logo design, printing services, branding, web development and digital marketing in Pune.",
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
    "Explore SEO strategy, local search optimization, keyword planning, content SEO and reporting examples for businesses that want stronger Google visibility.",
    "SEO services pune, local SEO pune, search engine optimization pune, keyword research pune, Google ranking services, SEO portfolio",
  ),
  smm: gallerySeo(
    "/smm-gallery",
    "Social Media Marketing Gallery",
    "Explore social media marketing creatives for Instagram, Facebook, LinkedIn, campaigns, reels, brand awareness and business growth.",
    "social media marketing pune, Instagram post design pune, Facebook creatives pune, LinkedIn post design, SMM agency pune, social media portfolio",
  ),
  ppc: gallerySeo(
    "/ppc-gallery",
    "PPC Advertising Gallery",
    "Explore PPC ad creatives and campaign concepts for Google Ads, Meta Ads, remarketing, lead generation and conversion-focused landing pages.",
    "PPC services pune, Google Ads agency pune, Meta Ads creatives, paid advertising pune, lead generation ads, remarketing campaign",
  ),
  contentMarketing: gallerySeo(
    "/content-marketing-gallery",
    "Content Marketing Gallery",
    "Explore content marketing ideas for blogs, SEO articles, guides, brand storytelling, lead magnets and audience education.",
    "content marketing pune, SEO content writing pune, blog writing services, brand storytelling, lead generation content, content strategy pune",
  ),
  emailMarketing: gallerySeo(
    "/email-marketing-gallery",
    "Email Marketing Gallery",
    "Explore email marketing campaign examples for newsletters, promotions, product launches, lead nurturing, customer retention and repeat sales.",
    "email marketing pune, email campaign design, newsletter design pune, lead nurturing emails, promotional email design, retention marketing",
  ),
  cro: gallerySeo(
    "/cro-gallery",
    "Conversion Rate Optimization Gallery",
    "Explore conversion rate optimization concepts for landing pages, lead funnels, enquiry forms, calls to action, trust signals and tracking.",
    "CRO services pune, conversion rate optimization, landing page optimization pune, funnel optimization, lead conversion design, CTA optimization",
  ),
  orm: gallerySeo(
    "/orm-gallery",
    "Online Reputation Management Gallery",
    "Explore online reputation management ideas for reviews, brand trust, business profiles, customer responses and stronger search visibility.",
    "online reputation management pune, ORM services pune, review management, brand reputation, Google review strategy, business profile optimization",
  ),
  analytics: gallerySeo(
    "/analytics-reporting-gallery",
    "Analytics and Reporting Gallery",
    "Explore analytics and reporting dashboard concepts for website traffic, leads, campaign ROI, conversions and monthly growth insights.",
    "analytics reporting pune, Google Analytics reporting, marketing dashboard, campaign performance reporting, lead tracking, ROI reporting",
  ),
  webCustom: gallerySeo(
    "/custom-website-development-gallery",
    "Custom Website Development Gallery",
    "Explore custom website development examples for service businesses, portfolios, landing pages, lead generation and high-converting brand websites.",
    "custom website development pune, business website design pune, lead generation website, service website development, web development portfolio",
  ),
  webEcommerce: gallerySeo(
    "/ecommerce-development-gallery",
    "Ecommerce Development Gallery",
    "Explore ecommerce website concepts for online stores, product catalogs, product pages, checkout flows, payment setup and sales dashboards.",
    "ecommerce development pune, online store design pune, ecommerce website development, product catalog website, checkout flow design, payment integration",
  ),
  webResponsive: gallerySeo(
    "/responsive-web-design-gallery",
    "Responsive Web Design Gallery",
    "Explore responsive website designs built for mobile, tablet and desktop experiences with fast loading, clean navigation and conversion-focused layouts.",
    "responsive web design pune, mobile friendly website pune, adaptive website design, responsive UI design, mobile first website, website design gallery",
  ),
  webCms: gallerySeo(
    "/cms-development-gallery",
    "CMS Development Gallery",
    "Explore CMS website concepts for editable pages, WordPress sites, content workflows, media libraries, admin training and business website management.",
    "CMS development pune, WordPress website pune, editable website design, content management system, business CMS website, website admin training",
  ),
  webApp: gallerySeo(
    "/web-application-development-gallery",
    "Web Application Development Gallery",
    "Explore web application concepts for dashboards, admin panels, customer portals, booking flows, user management and business workflows.",
    "web application development pune, admin dashboard development, customer portal development, booking system website, business web app, dashboard UI design",
  ),
  webApi: gallerySeo(
    "/api-integration-development-gallery",
    "API Integration Development Gallery",
    "Explore API integration concepts for payment gateways, CRM sync, WhatsApp enquiry flows, analytics events, automation and connected business systems.",
    "API integration pune, CRM integration pune, WhatsApp integration, payment gateway integration, business automation, custom API development",
  ),
  webSpeed: gallerySeo(
    "/website-speed-optimization-gallery",
    "Website Speed Optimization Gallery",
    "Explore website speed optimization ideas for Core Web Vitals, faster loading, image optimization, caching, mobile performance and stronger SEO.",
    "website speed optimization pune, Core Web Vitals optimization, performance optimization, image optimization website, fast loading website, mobile speed optimization",
  ),
  webMaintenance: gallerySeo(
    "/website-maintenance-support-gallery",
    "Website Maintenance Support Gallery",
    "Explore website maintenance concepts for updates, backups, security checks, bug fixes, uptime monitoring and ongoing website support.",
    "website maintenance pune, website support pune, website security checks, website backup service, bug fixing support, uptime monitoring",
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
    `View ${label.toLowerCase()} examples from Vibha Art for professional graphic design, printing, branding, marketing and business growth projects in Pune.`,
    `${keywords}, ${SERVICE_KEYWORDS}, portfolio examples, design portfolio pune, printing portfolio pune`,
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
    title: "Vibha Art - Graphic Design, Printing and Branding in Pune",
    description:
      "Vibha Art offers graphic design, logo design, printing, branding, website design and digital marketing services in Pune for growing businesses.",
    keywords:
      "graphic design pune, printing services pune, logo design pune, branding agency pune, website design pune, digital marketing pune, business card printing pune",
    image: "https://www.vibhaprints.com/assets/vibha-og.webp",
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

const HomePage = () => <Home />;

const AboutPage = () => <EnhancedAbout />;

const ContactPage = () => <EnhancedContact />;

const GraphicDesignPage = () => <EnhancedGraphicDesign />;

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
