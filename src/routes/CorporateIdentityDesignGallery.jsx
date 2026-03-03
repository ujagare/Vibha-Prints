import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import corporate identity design images
import Corporate1 from "../assets/Corporate/10919666506709.5b1830b6ddbef.png";
import Corporate2 from "../assets/Corporate/1695210509.jpg";
import Corporate3 from "../assets/Corporate/3-3.jpg";
import Corporate4 from "../assets/Corporate/3-4.jpg";
import Corporate5 from "../assets/Corporate/Corporate-Brand-Identity-Stationery-Templates.webp";
import Corporate6 from "../assets/Corporate/Free-Corporate-Brand-Identity-Template.webp";
import Corporate7 from "../assets/Corporate/Free-Corporate-Identity-PSD-Mockup-scaled.jpg";
import Corporate8 from "../assets/Corporate/Free-corporate-identity-mockup.jpg";
import Corporate9 from "../assets/Corporate/Holt-Case-study-09.webp";
import Corporate10 from "../assets/Corporate/Name-Corporate-Identity-Pack-Design-Template-1.webp";
import Corporate11 from "../assets/Corporate/brand-identity-banner-envelope-and-invoice-set-design-with-creative-shapes-digital-marketing-and-brand-promotion-template-bundle-with-green-and-dark-colors-corporate-identity-design-collection-vect.jpg";
import Corporate12 from "../assets/Corporate/business-stationery-and-branding-design-with-orange-and-black-colors-fashion-brand-promotion-template-with-creative-shapes-corporate-brand-identity-design-with-envelope-and-invoice-vector-500x500.jpg";
import Corporate13 from "../assets/Corporate/corporate-identity-branding-mockup-in-top-view.jpg";
import Corporate14 from "../assets/Corporate/corporate-identity-of-the-construction-company-corporate-identity-stationary-items-free-vector.jpg";
import Corporate15 from "../assets/Corporate/corporate-identity-set-branding-template-design-kit-editable-brand-identity-with-abstract-background-color-for-business-company-free-vector.jpg";
import Corporate16 from "../assets/Corporate/corporate-identity-template-flat-style-vector-4329597.jpg";
import Corporate17 from "../assets/Corporate/corporate-identity-template-with-digital-elements-company-style-for-brand-book-and-guideline-eps-10-free-vector.jpg";
import Corporate18 from "../assets/Corporate/d2a74f67254113.5b332f9419237.png";
import Corporate19 from "../assets/Corporate/modern-corporate-identity-template-design-flat-vector-4329405.jpg";
import Corporate20 from "../assets/Corporate/office-stationery-items-and-corporate-branding-identity-template-for-industrial-vector-element_301294-original.webp";
import Corporate21 from "../assets/Corporate/rcsbranding-corporate-identity-design-umiyaji-enterprise.jpg";

const CorporateIdentityDesignGallery = createGalleryTemplate({
  title: "Corporate Identity Design Gallery",
  description:
    "Comprehensive corporate identity solutions that define and elevate your brand.",
  category: "Corporate Identity",
  items: [
    {
      title: "Brand Guidelines",
      description: "Comprehensive visual identity documentation",
      image: Corporate1,
      fullCover: true,
    },
    {
      title: "Logo System",
      description: "Versatile and consistent logo variations",
      image: Corporate2,
      fullCover: true,
    },
    {
      title: "Color Palette",
      description: "Strategic brand colors: #01334C and #DB5056 for strong recognition",
      image: Corporate3,
      fullCover: true,
    },
    {
      title: "Typography",
      description: "Custom typeface and font guidelines",
      image: Corporate4,
      fullCover: true,
    },
    {
      title: "Brand Collateral",
      description: "Cohesive design across various brand materials",
      image: Corporate5,
      fullCover: true,
    },
    {
      title: "Digital Branding",
      description: "Consistent online and digital brand presence",
      image: Corporate6,
      fullCover: true,
    },
    {
      title: "Corporate Stationery",
      description: "Professional stationery design templates",
      image: Corporate7,
      fullCover: true,
    },
    {
      title: "Brand Identity Mockup",
      description: "Complete brand identity presentation mockups",
      image: Corporate8,
      fullCover: true,
    },
    {
      title: "Case Study Design",
      description: "Professional case study and portfolio designs",
      image: Corporate9,
      fullCover: true,
    },
    {
      title: "Identity Pack Design",
      description: "Complete corporate identity design packages",
      image: Corporate10,
      fullCover: true,
    },
    {
      title: "Brand Promotion Kit",
      description: "Marketing and brand promotion template bundles",
      image: Corporate11,
      fullCover: true,
    },
    {
      title: "Business Stationery",
      description: "Professional business stationery and branding designs",
      image: Corporate12,
      fullCover: true,
    },
    {
      title: "Branding Mockup",
      description: "Top view corporate identity branding mockups",
      image: Corporate13,
      fullCover: true,
    },
    {
      title: "Construction Company Identity",
      description: "Industry-specific corporate identity designs",
      image: Corporate14,
      fullCover: true,
    },
    {
      title: "Brand Template Kit",
      description: "Editable brand identity template design kits",
      image: Corporate15,
      fullCover: true,
    },
    {
      title: "Flat Style Identity",
      description: "Modern flat style corporate identity templates",
      image: Corporate16,
      fullCover: true,
    },
    {
      title: "Digital Elements",
      description: "Corporate identity with digital elements and guidelines",
      image: Corporate17,
      fullCover: true,
    },
    {
      title: "Creative Brand Design",
      description: "Creative and unique brand identity designs",
      image: Corporate18,
      fullCover: true,
    },
    {
      title: "Modern Corporate Template",
      description: "Contemporary corporate identity template designs",
      image: Corporate19,
      fullCover: true,
    },
    {
      title: "Office Stationery",
      description: "Complete office stationery and branding templates",
      image: Corporate20,
      fullCover: true,
    },
    {
      title: "Enterprise Branding",
      description: "Professional enterprise corporate identity designs",
      image: Corporate21,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(CorporateIdentityDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
