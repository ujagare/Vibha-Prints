import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

import digitalHero from "../assets/Digital Marketing/ChatGPT Image May 17, 2026, 09_13_46 PM.png";
import digitalServices from "../assets/Digital Marketing/ChatGPT Image May 17, 2026, 09_14_28 PM.png";
import digitalProcess from "../assets/Digital Marketing/ChatGPT Image May 17, 2026, 09_15_32 PM.png";
import digitalWhyChoose from "../assets/Digital Marketing/ChatGPT Image May 17, 2026, 09_17_03 PM.png";
import digitalImpact from "../assets/Digital Marketing/ChatGPT Image May 17, 2026, 09_18_23 PM.png";
import digitalCta from "../assets/Digital Marketing/ChatGPT Image May 17, 2026, 09_19_49 PM.png";
import seoGallery1 from "../assets/Digital Marketing/SEO/Screenshot 2026-05-18 145704.jpg";
import seoGallery2 from "../assets/Digital Marketing/SEO/Screenshot 2026-05-18 145744.jpg";
import seoGallery3 from "../assets/Digital Marketing/SEO/Screenshot 2026-05-18 145806.jpg";
import seoGallery4 from "../assets/Digital Marketing/SEO/Screenshot 2026-05-18 145829.jpg";
import seoGallery5 from "../assets/Digital Marketing/SEO/Screenshot 2026-05-18 145852.jpg";
import seoGallery6 from "../assets/Digital Marketing/SEO/Screenshot 2026-05-18 145912.jpg";
import smmGallery1 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.18.18 PM.jpeg";
import smmGallery2 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.19.08 PM (1).jpeg";
import smmGallery3 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.19.08 PM.jpeg";
import smmGallery4 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.19.09 PM.jpeg";
import smmGallery5 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.19.48 PM (1).jpeg";
import smmGallery6 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.19.48 PM (2).jpeg";
import smmGallery7 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.19.48 PM.jpeg";
import smmGallery8 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.20.54 PM.jpeg";
import smmGallery9 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.20.55 PM (1).jpeg";
import smmGallery10 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.20.55 PM.jpeg";
import smmGallery11 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.21.55 PM (1).jpeg";
import smmGallery12 from "../assets/Digital Marketing/Social Media/WhatsApp Image 2025-06-07 at 4.21.55 PM.jpeg";
import ppcGallery1 from "../assets/Digital Marketing/Pay-Per-Click/Screenshot 2026-05-18 150637.jpg";
import ppcGallery2 from "../assets/Digital Marketing/Pay-Per-Click/Screenshot 2026-05-18 150927.jpg";
import ppcGallery3 from "../assets/Digital Marketing/Pay-Per-Click/Screenshot 2026-05-18 150948.jpg";
import ppcGallery4 from "../assets/Digital Marketing/Pay-Per-Click/Screenshot 2026-05-18 151012.jpg";
import ppcGallery5 from "../assets/Digital Marketing/Pay-Per-Click/Screenshot 2026-05-18 151031.jpg";
import ppcGallery6 from "../assets/Digital Marketing/Pay-Per-Click/Screenshot 2026-05-18 151048.jpg";
import contentMarketingGallery1 from "../assets/Digital Marketing/Content -Marketing/Screenshot 2026-05-18 151231.jpg";
import contentMarketingGallery2 from "../assets/Digital Marketing/Content -Marketing/Screenshot 2026-05-18 151333.jpg";
import contentMarketingGallery3 from "../assets/Digital Marketing/Content -Marketing/Screenshot 2026-05-18 151358.jpg";
import contentMarketingGallery4 from "../assets/Digital Marketing/Content -Marketing/Screenshot 2026-05-18 151423.jpg";
import contentMarketingGallery5 from "../assets/Digital Marketing/Content -Marketing/Screenshot 2026-05-18 151451.jpg";
import contentMarketingGallery6 from "../assets/Digital Marketing/Content -Marketing/Screenshot 2026-05-18 151510.jpg";
import emailMarketingGallery1 from "../assets/Digital Marketing/Email/Screenshot 2026-05-18 152110.jpg";
import emailMarketingGallery2 from "../assets/Digital Marketing/Email/Screenshot 2026-05-18 152132.jpg";
import emailMarketingGallery3 from "../assets/Digital Marketing/Email/Screenshot 2026-05-18 152151.jpg";
import emailMarketingGallery4 from "../assets/Digital Marketing/Email/Screenshot 2026-05-18 152210.jpg";
import emailMarketingGallery5 from "../assets/Digital Marketing/Email/Screenshot 2026-05-18 152231.jpg";
import emailMarketingGallery6 from "../assets/Digital Marketing/Email/Screenshot 2026-05-18 152252.jpg";
import croGallery1 from "../assets/Digital Marketing/Conversion Rate/Screenshot 2026-05-18 202031.jpg";
import croGallery2 from "../assets/Digital Marketing/Conversion Rate/Screenshot 2026-05-18 202429.jpg";
import croGallery3 from "../assets/Digital Marketing/Conversion Rate/Screenshot 2026-05-18 202447.jpg";
import croGallery4 from "../assets/Digital Marketing/Conversion Rate/Screenshot 2026-05-18 202506.jpg";
import croGallery5 from "../assets/Digital Marketing/Conversion Rate/Screenshot 2026-05-18 202522.jpg";
import croGallery6 from "../assets/Digital Marketing/Conversion Rate/Screenshot 2026-05-18 202539.jpg";
import ormGallery1 from "../assets/Digital Marketing/Online Reputation/Screenshot 2026-05-18 201827.jpg";
import ormGallery2 from "../assets/Digital Marketing/Online Reputation/Screenshot 2026-05-18 201849.jpg";
import ormGallery3 from "../assets/Digital Marketing/Online Reputation/Screenshot 2026-05-18 201910.jpg";
import ormGallery4 from "../assets/Digital Marketing/Online Reputation/Screenshot 2026-05-18 201930.jpg";
import ormGallery5 from "../assets/Digital Marketing/Online Reputation/Screenshot 2026-05-18 201947.jpg";
import ormGallery6 from "../assets/Digital Marketing/Online Reputation/Screenshot 2026-05-18 202005.jpg";
import analyticsGallery1 from "../assets/Digital Marketing/Analytics & Reporting/Screenshot 2026-05-18 202903.jpg";
import analyticsGallery2 from "../assets/Digital Marketing/Analytics & Reporting/Screenshot 2026-05-18 202923.jpg";
import analyticsGallery3 from "../assets/Digital Marketing/Analytics & Reporting/Screenshot 2026-05-18 202938.jpg";
import analyticsGallery4 from "../assets/Digital Marketing/Analytics & Reporting/Screenshot 2026-05-18 202953.jpg";
import analyticsGallery5 from "../assets/Digital Marketing/Analytics & Reporting/Screenshot 2026-05-18 203009.jpg";
import analyticsGallery6 from "../assets/Digital Marketing/Analytics & Reporting/Screenshot 2026-05-18 203026.jpg";

import webHero from "../assets/Web-developmet/ChatGPT Image May 17, 2026, 09_40_49 PM.png";
import webServices from "../assets/Web-developmet/ChatGPT Image May 17, 2026, 09_44_14 PM.png";
import webProcess from "../assets/Web-developmet/ChatGPT Image May 17, 2026, 09_48_25 PM.png";
import webWhyChoose from "../assets/Web-developmet/ChatGPT Image May 17, 2026, 09_51_12 PM.png";
import webImpact from "../assets/Web-developmet/ChatGPT Image May 17, 2026, 09_18_23 PM.png";
import webCta from "../assets/Web-developmet/ChatGPT Image May 17, 2026, 01_21_35 PM.png";
import customWebsiteGallery1 from "../assets/Web-developmet/Galary/ChatGPT Image May 18, 2026, 12_09_47 PM.png";
import customWebsiteGallery2 from "../assets/Web-developmet/Galary/ChatGPT Image May 18, 2026, 12_11_48 PM.png";
import customWebsiteGallery3 from "../assets/Web-developmet/Galary/ChatGPT Image May 18, 2026, 12_13_07 PM.png";
import customWebsiteGallery4 from "../assets/Web-developmet/Galary/ChatGPT Image May 18, 2026, 12_15_00 PM.png";
import customWebsiteGallery5 from "../assets/Web-developmet/Galary/ChatGPT Image May 18, 2026, 12_19_00 PM.png";
import customWebsiteGallery6 from "../assets/Web-developmet/Galary/ChatGPT Image May 18, 2026, 12_22_23 PM.png";
import cmsGallery1 from "../assets/Web-developmet/Galary/CMS/Screenshot 2026-05-18 125928.jpg";
import cmsGallery2 from "../assets/Web-developmet/Galary/CMS/Screenshot 2026-05-18 130006.jpg";
import cmsGallery3 from "../assets/Web-developmet/Galary/CMS/Screenshot 2026-05-18 130030.jpg";
import cmsGallery4 from "../assets/Web-developmet/Galary/CMS/Screenshot 2026-05-18 130045.jpg";
import cmsGallery5 from "../assets/Web-developmet/Galary/CMS/Screenshot 2026-05-18 130108.jpg";
import cmsGallery6 from "../assets/Web-developmet/Galary/CMS/Screenshot 2026-05-18 130124.jpg";
import ecommerceGallery1 from "../assets/Web-developmet/Galary/Ecommerce/ChatGPT Image May 18, 2026, 12_44_56 PM.png";
import ecommerceGallery2 from "../assets/Web-developmet/Galary/Ecommerce/ChatGPT Image May 18, 2026, 12_47_44 PM.png";
import ecommerceGallery3 from "../assets/Web-developmet/Galary/Ecommerce/ChatGPT Image May 18, 2026, 01_02_11 PM.png";
import ecommerceGallery4 from "../assets/Web-developmet/Galary/Ecommerce/ChatGPT Image May 18, 2026, 01_04_58 PM.png";
import ecommerceGallery5 from "../assets/Web-developmet/Galary/Ecommerce/ChatGPT Image May 18, 2026, 01_10_00 PM.png";
import ecommerceGallery6 from "../assets/Web-developmet/Galary/Ecommerce/ChatGPT Image May 18, 2026, 01_13_23 PM.png";
import responsiveGallery1 from "../assets/Web-developmet/Galary/Risposive/ChatGPT Image May 18, 2026, 02_29_46 PM.png";
import responsiveGallery2 from "../assets/Web-developmet/Galary/Risposive/ChatGPT Image May 18, 2026, 02_31_26 PM.png";
import responsiveGallery3 from "../assets/Web-developmet/Galary/Risposive/ChatGPT Image May 18, 2026, 02_33_46 PM.png";
import responsiveGallery4 from "../assets/Web-developmet/Galary/Risposive/ChatGPT Image May 18, 2026, 02_35_16 PM.png";
import responsiveGallery5 from "../assets/Web-developmet/Galary/Risposive/ChatGPT Image May 18, 2026, 02_36_05 PM.png";
import customAppGallery1 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-18 130632.jpg";
import customAppGallery2 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-18 130713.jpg";
import customAppGallery3 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-18 130731.jpg";
import customAppGallery4 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-18 130753.jpg";
import customAppGallery5 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-18 130813.jpg";
import customAppGallery6 from "../assets/Web-developmet/Galary/Custom App/Screenshot 2026-05-18 130832.jpg";
import apiGallery1 from "../assets/Web-developmet/Galary/API/Screenshot 2026-05-18 131111.jpg";
import apiGallery2 from "../assets/Web-developmet/Galary/API/Screenshot 2026-05-18 131137.jpg";
import apiGallery3 from "../assets/Web-developmet/Galary/API/Screenshot 2026-05-18 131151.jpg";
import apiGallery4 from "../assets/Web-developmet/Galary/API/Screenshot 2026-05-18 131211.jpg";
import apiGallery5 from "../assets/Web-developmet/Galary/API/Screenshot 2026-05-18 131227.jpg";
import apiGallery6 from "../assets/Web-developmet/Galary/API/Screenshot 2026-05-18 131245.jpg";
import websiteSpeedGallery1 from "../assets/Web-developmet/Galary/Website Speed/Screenshot 2026-05-18 131450.jpg";
import websiteSpeedGallery2 from "../assets/Web-developmet/Galary/Website Speed/Screenshot 2026-05-18 131612.jpg";
import websiteSpeedGallery3 from "../assets/Web-developmet/Galary/Website Speed/Screenshot 2026-05-18 131628.jpg";
import websiteSpeedGallery4 from "../assets/Web-developmet/Galary/Website Speed/Screenshot 2026-05-18 131648.jpg";
import websiteSpeedGallery5 from "../assets/Web-developmet/Galary/Website Speed/Screenshot 2026-05-18 131704.jpg";
import websiteSpeedGallery6 from "../assets/Web-developmet/Galary/Website Speed/Screenshot 2026-05-18 131721.jpg";
import webMaintenanceGallery1 from "../assets/Web-developmet/Galary/Web-maintance/Screenshot 2026-05-18 141823.jpg";
import webMaintenanceGallery2 from "../assets/Web-developmet/Galary/Web-maintance/Screenshot 2026-05-18 142415.jpg";
import webMaintenanceGallery3 from "../assets/Web-developmet/Galary/Web-maintance/Screenshot 2026-05-18 142448.jpg";
import webMaintenanceGallery4 from "../assets/Web-developmet/Galary/Web-maintance/Screenshot 2026-05-18 142510.jpg";
import webMaintenanceGallery5 from "../assets/Web-developmet/Galary/Web-maintance/Screenshot 2026-05-18 142536.jpg";
import webMaintenanceGallery6 from "../assets/Web-developmet/Galary/Web-maintance/Screenshot 2026-05-18 142556.jpg";

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
        { title: "Keyword Strategy", description: "Search terms mapped to high-intent customer journeys." },
        { title: "Technical SEO", description: "Site speed, crawlability, indexing, and structured data checks." },
        { title: "On-Page SEO", description: "Optimized pages with strong headings, metadata, and internal links." },
        { title: "Local SEO", description: "Location-focused visibility for maps, calls, and local leads." },
        { title: "Content Growth", description: "SEO content plans built to earn traffic and trust." },
        { title: "Ranking Reports", description: "Clear reporting for ranking movement and organic results." },
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
        { title: "Brand Content", description: "Consistent social posts that carry your visual identity." },
        { title: "Campaign Planning", description: "Monthly calendars aligned with offers and audience behavior." },
        { title: "Reels & Stories", description: "Short-form creative ideas for higher reach and engagement." },
        { title: "Community Growth", description: "Engagement-led social activity for stronger brand connection." },
        { title: "Festival Creatives", description: "Timely posts for events, promotions, and seasonal campaigns." },
        { title: "Performance Insights", description: "Readable reports for reach, engagement, and follower growth." },
        { title: "Product Awareness", description: "Social visuals crafted to introduce offers with strong recall." },
        { title: "Brand Promotion", description: "Campaign posts designed to keep the brand active and visible." },
        { title: "Lead Creatives", description: "Inquiry-focused designs for service promotions and responses." },
        { title: "Engagement Posts", description: "Content formats made for saves, shares, comments, and reach." },
        { title: "Offer Graphics", description: "Clear promotional designs for deals, launches, and updates." },
        { title: "Social Ad Visuals", description: "Scroll-stopping creative concepts for paid social campaigns." },
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
        { title: "Google Ads", description: "Search campaigns for high-intent customer queries." },
        { title: "Meta Ads", description: "Visual ad campaigns for awareness, leads, and conversions." },
        { title: "Landing Pages", description: "Conversion-focused pages matched to every ad campaign." },
        { title: "Remarketing", description: "Audience retargeting creatives that bring visitors back." },
        { title: "Lead Campaigns", description: "Structured campaigns designed for qualified enquiries." },
        { title: "Ad Reports", description: "Spend, clicks, conversions, and ROI presented clearly." },
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
        { title: "Blog Strategy", description: "Topic clusters that answer customer questions and support SEO." },
        { title: "Brand Storytelling", description: "Content themes that make your brand easier to remember." },
        { title: "Lead Magnets", description: "Guides, checklists, and resources built for lead capture." },
        { title: "Visual Content", description: "Graphics and carousels that simplify important messages." },
        { title: "Website Copy", description: "Clear page content that supports trust and conversion." },
        { title: "Content Calendar", description: "Planned publishing rhythm across channels and campaigns." },
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
        { title: "Welcome Emails", description: "First-touch email flows that introduce your brand clearly." },
        { title: "Offer Campaigns", description: "Promotional emails designed around strong calls to action." },
        { title: "Lead Nurturing", description: "Automated sequences that move prospects toward enquiry." },
        { title: "Newsletter Design", description: "Useful updates packaged in clean branded layouts." },
        { title: "Customer Retention", description: "Emails that encourage repeat orders and loyalty." },
        { title: "Email Reports", description: "Open rates, clicks, replies, and conversion tracking." },
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
        { title: "Landing Page Audit", description: "Page reviews focused on clarity, hierarchy, and action." },
        { title: "CTA Optimization", description: "Button and offer improvements for stronger response." },
        { title: "Form Improvements", description: "Shorter, cleaner forms built to reduce drop-offs." },
        { title: "Trust Signals", description: "Reviews, proof points, and guarantees placed where they matter." },
        { title: "A/B Testing", description: "Experiment ideas to compare layouts, offers, and messaging." },
        { title: "Funnel Reports", description: "Conversion tracking from visit to lead or sale." },
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
        { title: "Review Strategy", description: "Systems to request, collect, and showcase genuine reviews." },
        { title: "Brand Monitoring", description: "Tracking brand mentions across important online channels." },
        { title: "Response Templates", description: "Professional replies for customer feedback and concerns." },
        { title: "Trust Building", description: "Reputation assets that improve buyer confidence." },
        { title: "Profile Optimization", description: "Improved business profiles across relevant platforms." },
        { title: "Reputation Reports", description: "Simple reporting for ratings, mentions, and sentiment." },
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
        { title: "Traffic Dashboard", description: "Website traffic, source, and user behavior snapshots." },
        { title: "Campaign Reports", description: "Paid and organic campaign performance in one view." },
        { title: "Lead Tracking", description: "Enquiries and conversion sources tracked with clarity." },
        { title: "ROI Measurement", description: "Marketing spend compared against outcomes and revenue." },
        { title: "Monthly Insights", description: "Readable summaries with next-step recommendations." },
        { title: "Goal Tracking", description: "Measurement setup for calls, forms, purchases, and events." },
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
          description: "Dark premium layouts for machinery, manufacturing, and industrial product businesses.",
        },
        {
          title: "Coaching Website",
          tagline: "Warm visuals for personal transformation.",
          description: "Elegant coaching pages built around sessions, programs, stories, and booking actions.",
        },
        {
          title: "Real Estate Website",
          tagline: "Property discovery made clear and credible.",
          description: "Lead-focused real estate layouts for advisory, listings, site visits, and consultations.",
        },
        {
          title: "Construction Website",
          tagline: "Strong structure for serious B2B enquiries.",
          description: "Bold construction and supplier websites with services, projects, and consultation flows.",
        },
        {
          title: "Personal Brand Website",
          tagline: "Premium storytelling for expert-led brands.",
          description: "High-impact personal brand pages for philosophy, portfolio, insights, and client journeys.",
        },
        {
          title: "Project Gallery Website",
          tagline: "Field work showcased with clean proof.",
          description: "Practical gallery layouts for site photos, progress documentation, and project credibility.",
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
        { title: "Product Listing", description: "Organized product grids built for browsing and comparison." },
        { title: "Product Detail", description: "Product pages with images, specs, pricing, and trust signals." },
        { title: "Checkout Flow", description: "Simple purchase journeys that reduce friction." },
        { title: "Payment Setup", description: "Secure payment integration and order handling." },
        { title: "Inventory Structure", description: "Product categories, filters, and stock-friendly layouts." },
        { title: "Sales Dashboard", description: "Store reporting for orders, revenue, and customer activity." },
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
        { title: "Mobile Layouts", description: "Compact page layouts designed for thumb-friendly use." },
        { title: "Tablet Views", description: "Balanced layouts for medium screen browsing." },
        { title: "Desktop Experience", description: "Full-width website views with strong visual hierarchy." },
        { title: "Adaptive Navigation", description: "Menus that remain simple across screen sizes." },
        { title: "Responsive Media", description: "Images and sections sized to avoid layout breaks." },
        { title: "Cross-Device QA", description: "Testing plans for consistent user experience." },
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
        { title: "WordPress Website", description: "Editable business websites with familiar admin workflows." },
        { title: "Blog System", description: "Publishing setups for articles, updates, and SEO content." },
        { title: "Page Builder", description: "Reusable sections for fast content updates." },
        { title: "Media Library", description: "Organized image and document management." },
        { title: "Admin Training", description: "Simple handover structure for everyday content changes." },
        { title: "CMS Maintenance", description: "Updates, backups, and health checks for stability." },
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
        { title: "Admin Dashboard", description: "Control panels for teams, metrics, and operations." },
        { title: "Customer Portal", description: "Secure user areas for customers and members." },
        { title: "Booking Flow", description: "Custom workflows for appointments and reservations." },
        { title: "Data Tables", description: "Organized records with search, filters, and actions." },
        { title: "User Management", description: "Roles, permissions, and account workflows." },
        { title: "Scalable App UI", description: "Interfaces designed for growing business needs." },
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
        { title: "Payment Integration", description: "Secure payment gateways connected to website flows." },
        { title: "CRM Sync", description: "Lead and customer data moved into business tools." },
        { title: "WhatsApp Flow", description: "Enquiry and order journeys connected to messaging." },
        { title: "Analytics Events", description: "Tracking key actions across the website." },
        { title: "Custom APIs", description: "Backend endpoints built around business requirements." },
        { title: "Automation Links", description: "Connected systems that reduce manual work." },
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
        { title: "Image Optimization", description: "Compressed, correctly sized assets for faster pages." },
        { title: "Core Web Vitals", description: "Performance work around loading, stability, and responsiveness." },
        { title: "Code Cleanup", description: "Smaller scripts and styles for lighter page weight." },
        { title: "Caching Setup", description: "Browser and server caching for repeat visits." },
        { title: "Mobile Speed", description: "Performance checks focused on mobile networks." },
        { title: "Speed Reports", description: "Before-after metrics with clear improvements." },
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
        { title: "Website Updates", description: "Regular content, plugin, theme, and framework updates." },
        { title: "Security Checks", description: "Monitoring for vulnerabilities, spam, and access issues." },
        { title: "Backup Setup", description: "Scheduled backups for safer recovery." },
        { title: "Bug Fixes", description: "Small fixes and improvements handled quickly." },
        { title: "Uptime Monitoring", description: "Checks that help keep the site available." },
        { title: "Support Reports", description: "Monthly maintenance summaries and recommendations." },
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
