import React from "react";
import { Helmet } from "react-helmet-async";
import EnhancedHero from "../components/EnhancedHero";
import FaqSection from "../components/FaqSection";
import SEO from "../components/SEO";

const Home = () => {
  // Comprehensive SEO Keywords (50+)
  const seoKeywords = [
    // Primary Keywords
    "graphic design services",
    "printing services",
    "logo design",
    "branding agency",
    "design studio",

    // Printing Services
    "business cards printing",
    "brochure design",
    "packaging design",
    "digital printing",
    "offset printing",
    "banner printing",
    "sticker printing",
    "label printing",
    "magazine printing",
    "flex printing",

    // Design Services
    "creative design",
    "design and printing",
    "professional design",
    "print design",
    "brand identity",
    "design solutions",
    "visual design",
    "marketing materials",
    "social media design",
    "website design",

    // Local/Business Keywords
    "printing company",
    "design agency",
    "local printing",
    "professional printing",
    "quality printing",
    "affordable design",
    "custom printing",
    "print solutions",

    // Long-tail Keywords
    "affordable graphic design services",
    "professional logo design company",
    "best printing services near me",
    "custom brochure design",
    "business card printing online",
    "packaging design services",
    "digital marketing materials",
    "brand design agency",
    "print marketing solutions",
    "creative branding services",
    "professional printing company",
    "design and print services",
    "corporate branding solutions",
    "marketing collateral design",
    "print advertising services",
  ];

  // Structured Data - Local Business
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.vibhaprints.com/",
    name: "Vibha Prints",
    image: "https://www.vibhaprints.com/logo.png",
    description:
      "Professional graphic design and printing services. We specialize in logo design, branding, brochures, packaging, business cards, and digital/offset printing solutions for businesses.",
    url: "https://www.vibhaprints.com/",
    telephone: "+91-86249-48046",
    email: ["info@vibhapints.com", "vibhart07@gmail.com"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pune SB Road",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    priceRange: "₹5,000 - ₹5,00,000+",
    areaServed: "IN",
    sameAs: [
      "https://www.facebook.com/vibhaprints",
      "https://www.instagram.com/vibhaprints",
      "https://www.linkedin.com/company/vibhaprints",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "50",
    },
  };

  // Structured Data - Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vibha Prints",
    url: "https://www.vibhaprints.com/",
    logo: "https://www.vibhaprints.com/logo.png",
    description: "Creative design and printing solutions for businesses",
    sameAs: [
      "https://www.facebook.com/vibhaprints",
      "https://www.instagram.com/vibhaprints",
      "https://www.linkedin.com/company/vibhaprints",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+91-86249-48046",
      email: ["info@vibhapints.com", "vibhart07@gmail.com"],
    },
  };

  // Structured Data - Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Graphic Design & Printing Services",
    description:
      "Professional graphic design and printing services including logo design, branding, brochures, packaging, and printing solutions",
    provider: {
      "@type": "LocalBusiness",
      name: "Vibha Prints",
    },
    areaServed: "IN",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://www.vibhaprints.com/",
    },
  };

  // Structured Data - FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What graphic design services does Vibha Prints offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vibha Prints offers comprehensive graphic design services including logo design, brand identity development, brochure design, packaging design, social media graphics, website design, and corporate identity solutions.",
        },
      },
      {
        "@type": "Question",
        name: "What printing services are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We provide digital printing, offset printing, business card printing, brochure printing, packaging printing, flex printing, banner printing, sticker printing, and magazine printing services.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a design project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Project timelines vary based on complexity. Simple designs like business cards take 3-5 days, while comprehensive branding projects may take 2-4 weeks. We provide custom timelines for each project.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer revisions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we include multiple revision rounds in our design packages to ensure you're completely satisfied with the final output.",
        },
      },
      {
        "@type": "Question",
        name: "What is your pricing structure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our pricing ranges from ₹5,000 for basic designs to ₹5,00,000+ for comprehensive branding projects. We offer customized quotes based on your specific requirements.",
        },
      },
    ],
  };

  // Structured Data - BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.vibhaprints.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Graphic Design",
        item: "https://www.vibhaprints.com/graphic-design",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Printing Services",
        item: "https://www.vibhaprints.com/printing",
      },
    ],
  };

  return (
    <div className="overflow-x-hidden pt-[7rem] md:pt-[6.5rem]">
      <SEO page="home" />
      <Helmet>
        {/* ===== PRIMARY META TAGS ===== */}
        <title>
          Vibha Prints - Professional Graphic Design & Printing Services India |
          Logo Design, Branding
        </title>
        <meta
          name="description"
          content="Vibha Prints offers professional graphic design and printing services in India. Expert logo design, branding, brochures, packaging, business cards, digital & offset printing. Transform your brand vision into reality with our creative design solutions."
        />
        <meta name="keywords" content={seoKeywords.join(", ")} />

        {/* ===== OPEN GRAPH TAGS (Social Media) ===== */}
        <meta property="og:type" content="business.business" />
        <meta
          property="og:title"
          content="Vibha Prints - Professional Graphic Design & Printing Services"
        />
        <meta
          property="og:description"
          content="Professional graphic design and printing services. Logo design, branding, brochures, packaging, and digital/offset printing."
        />
        <meta property="og:url" content="https://www.vibhaprints.com/" />
        <meta
          property="og:image"
          content="https://www.vibhaprints.com/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Vibha Prints" />
        <meta property="og:locale" content="en_IN" />

        {/* ===== TWITTER CARD TAGS ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Vibha Prints - Professional Graphic Design & Printing Services"
        />
        <meta
          name="twitter:description"
          content="Professional graphic design and printing services for your business needs."
        />
        <meta
          name="twitter:image"
          content="https://www.vibhaprints.com/twitter-image.jpg"
        />
        <meta name="twitter:creator" content="@vibhaprints" />

        {/* ===== TECHNICAL SEO TAGS ===== */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Vibha Prints" />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="theme-color" content="#6A11CB" />

        {/* ===== CANONICAL URL ===== */}
        <link rel="canonical" href="https://www.vibhaprints.com/" />

        {/* ===== ALTERNATE LINKS ===== */}
        <link rel="alternate" hrefLang="en-IN" href="https://www.vibhaprints.com/" />
        <link rel="alternate" hrefLang="en" href="https://www.vibhaprints.com/" />

        {/* ===== STRUCTURED DATA (JSON-LD) ===== */}
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

        {/* ===== PRECONNECT & DNS PREFETCH ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ===== FAVICON & APP ICONS ===== */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* ===== ADDITIONAL SEO ===== */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Helmet>
      <EnhancedHero />
      <FaqSection />
    </div>
  );
};

export default Home;
