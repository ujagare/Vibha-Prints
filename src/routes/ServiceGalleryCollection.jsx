import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

import digitalHero from "../assets/Digital Marketing/image-077.webp";
import digitalServices from "../assets/Digital Marketing/image-078.webp";
import digitalProcess from "../assets/Digital Marketing/image-079.webp";
import digitalWhyChoose from "../assets/Digital Marketing/image-080.webp";
import digitalImpact from "../assets/Digital Marketing/image-081.webp";
import digitalCta from "../assets/Digital Marketing/image-082.webp";
import seoGallery1 from "../assets/Digital Marketing/SEO/image-127.webp";
import seoGallery2 from "../assets/Digital Marketing/SEO/image-128.webp";
import seoGallery3 from "../assets/Digital Marketing/SEO/image-129.webp";
import seoGallery4 from "../assets/Digital Marketing/SEO/image-130.webp";
import seoGallery5 from "../assets/Digital Marketing/SEO/image-131.webp";
import seoGallery6 from "../assets/Digital Marketing/SEO/image-132.webp";
import smmGallery1 from "../assets/Digital Marketing/Social Media/image-133.webp";
import smmGallery2 from "../assets/Digital Marketing/Social Media/image-134.webp";
import smmGallery3 from "../assets/Digital Marketing/Social Media/image-135.webp";
import smmGallery4 from "../assets/Digital Marketing/Social Media/image-136.webp";
import smmGallery5 from "../assets/Digital Marketing/Social Media/image-137.webp";
import smmGallery6 from "../assets/Digital Marketing/Social Media/image-138.webp";
import smmGallery7 from "../assets/Digital Marketing/Social Media/image-139.webp";
import smmGallery8 from "../assets/Digital Marketing/Social Media/image-140.webp";
import smmGallery9 from "../assets/Digital Marketing/Social Media/image-141.webp";
import smmGallery10 from "../assets/Digital Marketing/Social Media/image-142.webp";
import smmGallery11 from "../assets/Digital Marketing/Social Media/image-143.webp";
import smmGallery12 from "../assets/Digital Marketing/Social Media/image-144.webp";
import ppcGallery1 from "../assets/Digital Marketing/Pay-Per-Click/image-121.webp";
import ppcGallery2 from "../assets/Digital Marketing/Pay-Per-Click/image-122.webp";
import ppcGallery3 from "../assets/Digital Marketing/Pay-Per-Click/image-123.webp";
import ppcGallery4 from "../assets/Digital Marketing/Pay-Per-Click/image-124.webp";
import ppcGallery5 from "../assets/Digital Marketing/Pay-Per-Click/image-125.webp";
import ppcGallery6 from "../assets/Digital Marketing/Pay-Per-Click/image-126.webp";
import contentMarketingGallery1 from "../assets/Digital Marketing/Content -Marketing/image-089.webp";
import contentMarketingGallery2 from "../assets/Digital Marketing/Content -Marketing/image-090.webp";
import contentMarketingGallery3 from "../assets/Digital Marketing/Content -Marketing/image-091.webp";
import contentMarketingGallery4 from "../assets/Digital Marketing/Content -Marketing/image-092.webp";
import contentMarketingGallery5 from "../assets/Digital Marketing/Content -Marketing/image-093.webp";
import contentMarketingGallery6 from "../assets/Digital Marketing/Content -Marketing/image-094.webp";
import emailMarketingGallery1 from "../assets/Digital Marketing/Email/image-101.webp";
import emailMarketingGallery2 from "../assets/Digital Marketing/Email/image-102.webp";
import emailMarketingGallery3 from "../assets/Digital Marketing/Email/image-103.webp";
import emailMarketingGallery4 from "../assets/Digital Marketing/Email/image-104.webp";
import emailMarketingGallery5 from "../assets/Digital Marketing/Email/image-105.webp";
import emailMarketingGallery6 from "../assets/Digital Marketing/Email/image-106.webp";
import croGallery1 from "../assets/Digital Marketing/Conversion Rate/image-095.webp";
import croGallery2 from "../assets/Digital Marketing/Conversion Rate/image-096.webp";
import croGallery3 from "../assets/Digital Marketing/Conversion Rate/image-097.webp";
import croGallery4 from "../assets/Digital Marketing/Conversion Rate/image-098.webp";
import croGallery5 from "../assets/Digital Marketing/Conversion Rate/image-099.webp";
import croGallery6 from "../assets/Digital Marketing/Conversion Rate/image-100.webp";
import ormGallery1 from "../assets/Digital Marketing/Online Reputation/image-115.webp";
import ormGallery2 from "../assets/Digital Marketing/Online Reputation/image-116.webp";
import ormGallery3 from "../assets/Digital Marketing/Online Reputation/image-117.webp";
import ormGallery4 from "../assets/Digital Marketing/Online Reputation/image-118.webp";
import ormGallery5 from "../assets/Digital Marketing/Online Reputation/image-119.webp";
import ormGallery6 from "../assets/Digital Marketing/Online Reputation/image-120.webp";
import analyticsGallery1 from "../assets/Digital Marketing/Analytics & Reporting/image-083.webp";
import analyticsGallery2 from "../assets/Digital Marketing/Analytics & Reporting/image-084.webp";
import analyticsGallery3 from "../assets/Digital Marketing/Analytics & Reporting/image-085.webp";
import analyticsGallery4 from "../assets/Digital Marketing/Analytics & Reporting/image-086.webp";
import analyticsGallery5 from "../assets/Digital Marketing/Analytics & Reporting/image-087.webp";
import analyticsGallery6 from "../assets/Digital Marketing/Analytics & Reporting/image-088.webp";

import webHero from "../assets/Web-developmet/image-385.webp";
import webServices from "../assets/Web-developmet/image-386.webp";
import webProcess from "../assets/Web-developmet/image-387.webp";
import webWhyChoose from "../assets/Web-developmet/image-388.webp";
import webImpact from "../assets/Web-developmet/image-384.webp";
import webCta from "../assets/Web-developmet/image-383.webp";
import customWebsiteGallery1 from "../assets/Web-developmet/Galary/image-389.webp";
import customWebsiteGallery2 from "../assets/Web-developmet/Galary/image-390.webp";
import customWebsiteGallery3 from "../assets/Web-developmet/Galary/image-391.webp";
import customWebsiteGallery4 from "../assets/Web-developmet/Galary/image-392.webp";
import customWebsiteGallery5 from "../assets/Web-developmet/Galary/image-393.webp";
import customWebsiteGallery6 from "../assets/Web-developmet/Galary/image-394.webp";
import cmsGallery1 from "../assets/Web-developmet/Galary/CMS/image-401.webp";
import cmsGallery2 from "../assets/Web-developmet/Galary/CMS/image-402.webp";
import cmsGallery3 from "../assets/Web-developmet/Galary/CMS/image-403.webp";
import cmsGallery4 from "../assets/Web-developmet/Galary/CMS/image-404.webp";
import cmsGallery5 from "../assets/Web-developmet/Galary/CMS/image-405.webp";
import cmsGallery6 from "../assets/Web-developmet/Galary/CMS/image-406.webp";
import ecommerceGallery1 from "../assets/Web-developmet/Galary/Ecommerce/image-417.webp";
import ecommerceGallery2 from "../assets/Web-developmet/Galary/Ecommerce/image-418.webp";
import ecommerceGallery3 from "../assets/Web-developmet/Galary/Ecommerce/image-413.webp";
import ecommerceGallery4 from "../assets/Web-developmet/Galary/Ecommerce/image-414.webp";
import ecommerceGallery5 from "../assets/Web-developmet/Galary/Ecommerce/image-415.webp";
import ecommerceGallery6 from "../assets/Web-developmet/Galary/Ecommerce/image-416.webp";
import responsiveGallery1 from "../assets/Web-developmet/Galary/Risposive/image-419.webp";
import responsiveGallery2 from "../assets/Web-developmet/Galary/Risposive/image-420.webp";
import responsiveGallery3 from "../assets/Web-developmet/Galary/Risposive/image-421.webp";
import responsiveGallery4 from "../assets/Web-developmet/Galary/Risposive/image-422.webp";
import responsiveGallery5 from "../assets/Web-developmet/Galary/Risposive/image-423.webp";
import customAppGallery1 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-21 233836.jpg";
import customAppGallery2 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-21 234233.jpg";
import customAppGallery3 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-21 234416.jpg";
import customAppGallery4 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-21 234824.jpg";
import customAppGallery5 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-21 234907.jpg";
import customAppGallery6 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-21 235405.jpg";
import apiGallery1 from "../assets/Web-developmet/Galary/API/image-395.webp";
import apiGallery2 from "../assets/Web-developmet/Galary/API/image-396.webp";
import apiGallery3 from "../assets/Web-developmet/Galary/API/image-397.webp";
import apiGallery4 from "../assets/Web-developmet/Galary/API/image-398.webp";
import apiGallery5 from "../assets/Web-developmet/Galary/API/image-399.webp";
import apiGallery6 from "../assets/Web-developmet/Galary/API/image-400.webp";
import websiteSpeedGallery1 from "../assets/Web-developmet/Galary/Website Speed/image-430.webp";
import websiteSpeedGallery2 from "../assets/Web-developmet/Galary/Website Speed/image-431.webp";
import websiteSpeedGallery3 from "../assets/Web-developmet/Galary/Website Speed/image-432.webp";
import websiteSpeedGallery4 from "../assets/Web-developmet/Galary/Website Speed/image-433.webp";
import websiteSpeedGallery5 from "../assets/Web-developmet/Galary/Website Speed/image-434.webp";
import websiteSpeedGallery6 from "../assets/Web-developmet/Galary/Website Speed/image-435.webp";
import webMaintenanceGallery1 from "../assets/Web-developmet/Galary/Web-maintance/image-424.webp";
import webMaintenanceGallery2 from "../assets/Web-developmet/Galary/Web-maintance/image-425.webp";
import webMaintenanceGallery3 from "../assets/Web-developmet/Galary/Web-maintance/image-426.webp";
import webMaintenanceGallery4 from "../assets/Web-developmet/Galary/Web-maintance/image-427.webp";
import webMaintenanceGallery5 from "../assets/Web-developmet/Galary/Web-maintance/image-428.webp";
import webMaintenanceGallery6 from "../assets/Web-developmet/Galary/Web-maintance/image-429.webp";

const digitalImages = [
  digitalHero,
  digitalServices,
  digitalProcess,
  digitalWhyChoose,
  digitalImpact,
  digitalCta,
];

const seoGalleryImages = [
  seoGallery1,
  seoGallery2,
  seoGallery3,
  seoGallery4,
  seoGallery5,
  seoGallery6,
];

const smmGalleryImages = [
  smmGallery1,
  smmGallery2,
  smmGallery3,
  smmGallery4,
  smmGallery5,
  smmGallery6,
  smmGallery7,
  smmGallery8,
  smmGallery9,
  smmGallery10,
  smmGallery11,
  smmGallery12,
];

const ppcGalleryImages = [
  ppcGallery1,
  ppcGallery2,
  ppcGallery3,
  ppcGallery4,
  ppcGallery5,
  ppcGallery6,
];

const contentMarketingGalleryImages = [
  contentMarketingGallery1,
  contentMarketingGallery2,
  contentMarketingGallery3,
  contentMarketingGallery4,
  contentMarketingGallery5,
  contentMarketingGallery6,
];

const emailMarketingGalleryImages = [
  emailMarketingGallery1,
  emailMarketingGallery2,
  emailMarketingGallery3,
  emailMarketingGallery4,
  emailMarketingGallery5,
  emailMarketingGallery6,
];

const croGalleryImages = [
  croGallery1,
  croGallery2,
  croGallery3,
  croGallery4,
  croGallery5,
  croGallery6,
];

const ormGalleryImages = [
  ormGallery1,
  ormGallery2,
  ormGallery3,
  ormGallery4,
  ormGallery5,
  ormGallery6,
];

const analyticsGalleryImages = [
  analyticsGallery1,
  analyticsGallery2,
  analyticsGallery3,
  analyticsGallery4,
  analyticsGallery5,
  analyticsGallery6,
];

const webImages = [
  webHero,
  webServices,
  webProcess,
  webWhyChoose,
  webImpact,
  webCta,
];

const customWebsiteGalleryImages = [
  customWebsiteGallery1,
  customWebsiteGallery2,
  customWebsiteGallery3,
  customWebsiteGallery4,
  customWebsiteGallery5,
  customWebsiteGallery6,
];

const cmsGalleryImages = [
  cmsGallery1,
  cmsGallery2,
  cmsGallery3,
  cmsGallery4,
  cmsGallery5,
  cmsGallery6,
];

const ecommerceGalleryImages = [
  ecommerceGallery1,
  ecommerceGallery2,
  ecommerceGallery3,
  ecommerceGallery4,
  ecommerceGallery5,
  ecommerceGallery6,
];

const responsiveGalleryImages = [
  responsiveGallery1,
  responsiveGallery2,
  responsiveGallery3,
  responsiveGallery4,
  responsiveGallery5,
];

const customAppGalleryImages = [
  customAppGallery1,
  customAppGallery2,
  customAppGallery3,
  customAppGallery4,
  customAppGallery5,
  customAppGallery6,
];

const apiGalleryImages = [
  apiGallery1,
  apiGallery2,
  apiGallery3,
  apiGallery4,
  apiGallery5,
  apiGallery6,
];

const websiteSpeedGalleryImages = [
  websiteSpeedGallery1,
  websiteSpeedGallery2,
  websiteSpeedGallery3,
  websiteSpeedGallery4,
  websiteSpeedGallery5,
  websiteSpeedGallery6,
];

const webMaintenanceGalleryImages = [
  webMaintenanceGallery1,
  webMaintenanceGallery2,
  webMaintenanceGallery3,
  webMaintenanceGallery4,
  webMaintenanceGallery5,
  webMaintenanceGallery6,
];

const buildItems = (titles, images, options = {}) =>
  titles.map((item, index) => ({
    title: item.title,
    description: item.description,
    tagline: item.tagline,
    link: item.link,
    image: images[index % images.length],
    fullCover: options.fullCover ?? true,
    flushFit: options.flushFit ?? false,
  }));

const galleryConfigs = {
  "digital-seo": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Search Engine Optimization (SEO) Gallery",
    description:
      "SEO strategy visuals focused on rankings, technical health, content growth, and measurable organic traffic.",
    category: "SEO",
    items: buildItems(
      [
        {
          title: "Keyword Strategy",
          description: "Search terms mapped to high-intent customer journeys.",
        },
        {
          title: "Technical SEO",
          description:
            "Site speed, crawlability, indexing, and structured data checks.",
        },
        {
          title: "On-Page SEO",
          description:
            "Optimized pages with strong headings, metadata, and internal links.",
        },
        {
          title: "Local SEO",
          description:
            "Location-focused visibility for maps, calls, and local leads.",
        },
        {
          title: "Content Growth",
          description: "SEO content plans built to earn traffic and trust.",
        },
        {
          title: "Ranking Reports",
          description:
            "Clear reporting for ranking movement and organic results.",
        },
      ],
      seoGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "digital-smm": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Social Media Marketing (SMM) Gallery",
    description:
      "Social media campaign concepts for brand awareness, engagement, creative posts, and audience growth.",
    category: "SMM",
    items: buildItems(
      [
        {
          title: "Brand Content",
          description:
            "Consistent social posts that carry your visual identity.",
        },
        {
          title: "Campaign Planning",
          description:
            "Monthly calendars aligned with offers and audience behavior.",
        },
        {
          title: "Reels & Stories",
          description:
            "Short-form creative ideas for higher reach and engagement.",
        },
        {
          title: "Community Growth",
          description:
            "Engagement-led social activity for stronger brand connection.",
        },
        {
          title: "Festival Creatives",
          description:
            "Timely posts for events, promotions, and seasonal campaigns.",
        },
        {
          title: "Performance Insights",
          description:
            "Readable reports for reach, engagement, and follower growth.",
        },
        {
          title: "Product Awareness",
          description:
            "Social visuals crafted to introduce offers with strong recall.",
        },
        {
          title: "Brand Promotion",
          description:
            "Campaign posts designed to keep the brand active and visible.",
        },
        {
          title: "Lead Creatives",
          description:
            "Inquiry-focused designs for service promotions and responses.",
        },
        {
          title: "Engagement Posts",
          description:
            "Content formats made for saves, shares, comments, and reach.",
        },
        {
          title: "Offer Graphics",
          description:
            "Clear promotional designs for deals, launches, and updates.",
        },
        {
          title: "Social Ad Visuals",
          description:
            "Scroll-stopping creative concepts for paid social campaigns.",
        },
      ],
      smmGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "digital-ppc": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Pay-Per-Click Advertising (PPC) Gallery",
    description:
      "Paid advertising layouts and funnel ideas for traffic, leads, sales, and remarketing campaigns.",
    category: "PPC",
    items: buildItems(
      [
        {
          title: "Google Ads",
          description: "Search campaigns for high-intent customer queries.",
        },
        {
          title: "Meta Ads",
          description:
            "Visual ad campaigns for awareness, leads, and conversions.",
        },
        {
          title: "Landing Pages",
          description: "Conversion-focused pages matched to every ad campaign.",
        },
        {
          title: "Remarketing",
          description:
            "Audience retargeting creatives that bring visitors back.",
        },
        {
          title: "Lead Campaigns",
          description: "Structured campaigns designed for qualified enquiries.",
        },
        {
          title: "Ad Reports",
          description: "Spend, clicks, conversions, and ROI presented clearly.",
        },
      ],
      ppcGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "digital-content-marketing": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Content Marketing Gallery",
    description:
      "Content strategy examples for blogs, social storytelling, brand education, and lead generation.",
    category: "Content Marketing",
    items: buildItems(
      [
        {
          title: "Blog Strategy",
          description:
            "Topic clusters that answer customer questions and support SEO.",
        },
        {
          title: "Brand Storytelling",
          description:
            "Content themes that make your brand easier to remember.",
        },
        {
          title: "Lead Magnets",
          description:
            "Guides, checklists, and resources built for lead capture.",
        },
        {
          title: "Visual Content",
          description:
            "Graphics and carousels that simplify important messages.",
        },
        {
          title: "Website Copy",
          description: "Clear page content that supports trust and conversion.",
        },
        {
          title: "Content Calendar",
          description:
            "Planned publishing rhythm across channels and campaigns.",
        },
      ],
      contentMarketingGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "digital-email-marketing": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Email Marketing Gallery",
    description:
      "Email campaign concepts for nurturing leads, launching offers, retaining customers, and driving repeat sales.",
    category: "Email Marketing",
    items: buildItems(
      [
        {
          title: "Welcome Emails",
          description:
            "First-touch email flows that introduce your brand clearly.",
        },
        {
          title: "Offer Campaigns",
          description:
            "Promotional emails designed around strong calls to action.",
        },
        {
          title: "Lead Nurturing",
          description:
            "Automated sequences that move prospects toward enquiry.",
        },
        {
          title: "Newsletter Design",
          description: "Useful updates packaged in clean branded layouts.",
        },
        {
          title: "Customer Retention",
          description: "Emails that encourage repeat orders and loyalty.",
        },
        {
          title: "Email Reports",
          description: "Open rates, clicks, replies, and conversion tracking.",
        },
      ],
      emailMarketingGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "digital-cro": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Conversion Rate Optimization (CRO) Gallery",
    description:
      "CRO examples for stronger landing pages, clearer user journeys, trust signals, and better conversion rates.",
    category: "CRO",
    items: buildItems(
      [
        {
          title: "Landing Page Audit",
          description:
            "Page reviews focused on clarity, hierarchy, and action.",
        },
        {
          title: "CTA Optimization",
          description: "Button and offer improvements for stronger response.",
        },
        {
          title: "Form Improvements",
          description: "Shorter, cleaner forms built to reduce drop-offs.",
        },
        {
          title: "Trust Signals",
          description:
            "Reviews, proof points, and guarantees placed where they matter.",
        },
        {
          title: "A/B Testing",
          description:
            "Experiment ideas to compare layouts, offers, and messaging.",
        },
        {
          title: "Funnel Reports",
          description: "Conversion tracking from visit to lead or sale.",
        },
      ],
      croGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "digital-orm": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Online Reputation Management (ORM) Gallery",
    description:
      "ORM visuals for reviews, brand trust, customer response, reputation monitoring, and positive visibility.",
    category: "ORM",
    items: buildItems(
      [
        {
          title: "Review Strategy",
          description:
            "Systems to request, collect, and showcase genuine reviews.",
        },
        {
          title: "Brand Monitoring",
          description:
            "Tracking brand mentions across important online channels.",
        },
        {
          title: "Response Templates",
          description:
            "Professional replies for customer feedback and concerns.",
        },
        {
          title: "Trust Building",
          description: "Reputation assets that improve buyer confidence.",
        },
        {
          title: "Profile Optimization",
          description: "Improved business profiles across relevant platforms.",
        },
        {
          title: "Reputation Reports",
          description: "Simple reporting for ratings, mentions, and sentiment.",
        },
      ],
      ormGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "digital-analytics-reporting": {
    sidebar: "digitalMarketing",
    sidebarTitle: "Digital Marketing Services",
    title: "Analytics & Reporting Gallery",
    description:
      "Reporting dashboard concepts for tracking traffic, leads, campaigns, user behavior, and business outcomes.",
    category: "Analytics",
    items: buildItems(
      [
        {
          title: "Traffic Dashboard",
          description: "Website traffic, source, and user behavior snapshots.",
        },
        {
          title: "Campaign Reports",
          description: "Paid and organic campaign performance in one view.",
        },
        {
          title: "Lead Tracking",
          description: "Enquiries and conversion sources tracked with clarity.",
        },
        {
          title: "ROI Measurement",
          description: "Marketing spend compared against outcomes and revenue.",
        },
        {
          title: "Monthly Insights",
          description: "Readable summaries with next-step recommendations.",
        },
        {
          title: "Goal Tracking",
          description:
            "Measurement setup for calls, forms, purchases, and events.",
        },
      ],
      analyticsGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
  "web-custom-development": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "Custom Website Development Gallery",
    description:
      "Custom website examples for brand-led pages, business workflows, responsive layouts, and scalable foundations.",
    category: "Custom Website",
    items: buildItems(
      [
        {
          title: "Industrial Website",
          tagline: "Heavy-duty brand, high-trust presentation.",
          description:
            "Dark premium layouts for machinery, manufacturing, and industrial product businesses.",
          link: "https://alfanio.com/",
        },
        {
          title: "Coaching Website",
          tagline: "Warm visuals for personal transformation.",
          description:
            "Elegant coaching pages built around sessions, programs, stories, and booking actions.",
          link: "https://touchandmove.in/",
        },
        {
          title: "Real Estate Website",
          tagline: "Property discovery made clear and credible.",
          description:
            "Lead-focused real estate layouts for advisory, listings, site visits, and consultations.",
          link: "https://kappstonerealty.com/",
        },
        {
          title: "Construction Website",
          tagline: "Strong structure for serious B2B enquiries.",
          description:
            "Bold construction and supplier websites with services, projects, and consultation flows.",
          link: "https://www.ddtech.in/",
        },
        {
          title: "Personal Brand Website",
          tagline: "Premium storytelling for expert-led brands.",
          description:
            "High-impact personal brand pages for philosophy, portfolio, insights, and client journeys.",
          link: "https://www.sarveshmopkar.co/",
        },
        {
          title: "Project Gallery Website",
          tagline: "Field work showcased with clean proof.",
          description:
            "Practical gallery layouts for site photos, progress documentation, and project credibility.",
          link: "https://greenspacess.com/",
        },
      ],
      customWebsiteGalleryImages,
    ),
  },
  "web-ecommerce-development": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "E-Commerce Development Gallery",
    description:
      "Online store concepts for product discovery, checkout, customer trust, and sales-focused shopping experiences.",
    category: "E-Commerce",
    items: buildItems(
      [
        {
          title: "Product Listing",
          description:
            "Organized product grids built for browsing and comparison.",
          link: "https://www.gratiaglobal.com/",
        },
        {
          title: "Product Detail",
          description:
            "Product pages with images, specs, pricing, and trust signals.",
          link: "https://www.gratiaglobal.com/products",
        },
        {
          title: "Checkout Flow",
          description: "Simple purchase journeys that reduce friction.",
          link: "https://www.gratiaglobal.com/contact",
        },
        {
          title: "Payment Setup",
          description: "Secure payment integration and order handling.",
          link: "https://swadistbite.com/#",
        },
        {
          title: "Inventory Structure",
          description:
            "Product categories, filters, and stock-friendly layouts.",
          link: "https://swadistbite.com/cookies",
        },
        {
          title: "Sales Dashboard",
          description:
            "Store reporting for orders, revenue, and customer activity.",
          link: "https://swadistbite.com/cup-cakes",
        },
      ],
      ecommerceGalleryImages,
    ),
  },
  "web-responsive-design": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "Responsive Web Design Gallery",
    description:
      "Responsive design examples that keep websites readable, fast, and easy to use on every screen size.",
    category: "Responsive Design",
    items: buildItems(
      [
        {
          title: "Mobile Layouts",
          description: "Compact page layouts designed for thumb-friendly use.",
          link: "https://alfanio.com/",
        },
        {
          title: "Tablet Views",
          description: "Balanced layouts for medium screen browsing.",
          link: "https://touchandmove.in/",
        },
        {
          title: "Desktop Experience",
          description: "Full-width website views with strong visual hierarchy.",
          link: "https://kappstonerealty.com/",
        },
        {
          title: "Adaptive Navigation",
          description: "Menus that remain simple across screen sizes.",
          link: "https://www.ddtech.in/",
        },
        {
          title: "Responsive Media",
          description: "Images and sections sized to avoid layout breaks.",
          link: "https://www.sarveshmopkar.co/",
        },
        {
          title: "Cross-Device QA",
          description: "Testing plans for consistent user experience.",
          link: "https://greenspacess.com/",
        },
      ],
      responsiveGalleryImages,
    ),
  },
  "web-cms-development": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "CMS Development Gallery",
    description:
      "CMS website concepts for easy editing, flexible page management, blog publishing, and content control.",
    category: "CMS",
    items: buildItems(
      [
        {
          title: "WordPress Website",
          description:
            "Editable business websites with familiar admin workflows.",
        },
        {
          title: "Blog System",
          description:
            "Publishing setups for articles, updates, and SEO content.",
        },
        {
          title: "Page Builder",
          description: "Reusable sections for fast content updates.",
        },
        {
          title: "Media Library",
          description: "Organized image and document management.",
        },
        {
          title: "Admin Training",
          description:
            "Simple handover structure for everyday content changes.",
        },
        {
          title: "CMS Maintenance",
          description: "Updates, backups, and health checks for stability.",
        },
      ],
      cmsGalleryImages,
    ),
  },
  "web-application-development": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "Web Application Development Gallery",
    description:
      "Web app interface examples for dashboards, portals, data workflows, and custom business tools.",
    category: "Web Application",
    items: buildItems(
      [
        {
          title: "Admin Dashboard",
          description: "Control panels for teams, metrics, and operations.",
          link: "https://ujagare.github.io/premier/",
        },
        {
          title: "Customer Portal",
          description: "Secure user areas for customers and members.",
          link: "https://ujagare.github.io/obys-agenc/",
        },
        {
          title: "Booking Flow",
          description: "Custom workflows for appointments and reservations.",
          link: "https://ujagare.github.io/Sundown-Studio/",
        },
        {
          title: "Data Tables",
          description: "Organized records with search, filters, and actions.",
          link: "https://ujagare.github.io/Duo-Studio/",
        },
        {
          title: "User Management",
          description: "Roles, permissions, and account workflows.",
          link: "https://ujagare.github.io/Two-Good/",
        },
        {
          title: "Scalable App UI",
          description: "Interfaces designed for growing business needs.",
          link: "https://ujagare.github.io/Anchor/#/",
        },
      ],
      customAppGalleryImages,
    ),
  },
  "web-api-integration": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "API Integration & Development Gallery",
    description:
      "Integration concepts for connecting websites with payments, CRM, WhatsApp, analytics, and business systems.",
    category: "API Integration",
    items: buildItems(
      [
        {
          title: "Payment Integration",
          description: "Secure payment gateways connected to website flows.",
        },
        {
          title: "CRM Sync",
          description: "Lead and customer data moved into business tools.",
        },
        {
          title: "WhatsApp Flow",
          description: "Enquiry and order journeys connected to messaging.",
        },
        {
          title: "Analytics Events",
          description: "Tracking key actions across the website.",
        },
        {
          title: "Custom APIs",
          description: "Backend endpoints built around business requirements.",
        },
        {
          title: "Automation Links",
          description: "Connected systems that reduce manual work.",
        },
      ],
      apiGalleryImages,
    ),
  },
  "web-speed-optimization": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "Website Speed Optimization Gallery",
    description:
      "Performance improvement examples for fast loading, image optimization, Core Web Vitals, and smoother browsing.",
    category: "Speed Optimization",
    items: buildItems(
      [
        {
          title: "Image Optimization",
          description: "Compressed, correctly sized assets for faster pages.",
        },
        {
          title: "Core Web Vitals",
          description:
            "Performance work around loading, stability, and responsiveness.",
        },
        {
          title: "Code Cleanup",
          description: "Smaller scripts and styles for lighter page weight.",
        },
        {
          title: "Caching Setup",
          description: "Browser and server caching for repeat visits.",
        },
        {
          title: "Mobile Speed",
          description: "Performance checks focused on mobile networks.",
        },
        {
          title: "Speed Reports",
          description: "Before-after metrics with clear improvements.",
        },
      ],
      websiteSpeedGalleryImages,
    ),
  },
  "web-maintenance-support": {
    sidebar: "webDevelopment",
    sidebarTitle: "Web Development Services",
    title: "Website Maintenance & Support Gallery",
    description:
      "Maintenance service examples for updates, security checks, backups, uptime monitoring, and ongoing support.",
    category: "Maintenance",
    items: buildItems(
      [
        {
          title: "Website Updates",
          description: "Regular content, plugin, theme, and framework updates.",
        },
        {
          title: "Security Checks",
          description:
            "Monitoring for vulnerabilities, spam, and access issues.",
        },
        {
          title: "Backup Setup",
          description: "Scheduled backups for safer recovery.",
        },
        {
          title: "Bug Fixes",
          description: "Small fixes and improvements handled quickly.",
        },
        {
          title: "Uptime Monitoring",
          description: "Checks that help keep the site available.",
        },
        {
          title: "Support Reports",
          description: "Monthly maintenance summaries and recommendations.",
        },
      ],
      webMaintenanceGalleryImages,
      { fullCover: false, flushFit: true },
    ),
  },
};

const ServiceGalleryCollection = ({ galleryKey }) => {
  const config = galleryConfigs[galleryKey] || galleryConfigs["digital-seo"];
  const Gallery = createGalleryTemplate(config);
  const WrappedGallery = withGallerySidebar(Gallery, {
    sidebar: config.sidebar,
    sidebarTitle: config.sidebarTitle,
  });

  return <WrappedGallery />;
};

export default ServiceGalleryCollection;
