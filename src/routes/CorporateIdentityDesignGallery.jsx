import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import corporate identity design images
import Corporate1 from "../assets/Corporate/10919666506709.webp";
import Corporate2 from "../assets/Corporate/1695210509.webp";
import Corporate3 from "../assets/Corporate/3-3.webp";
import Corporate4 from "../assets/Corporate/3-4.webp";
import Corporate5 from "../assets/Corporate/image-062.webp";
import Corporate6 from "../assets/Corporate/image-069.webp";
import Corporate7 from "../assets/Corporate/image-071.webp";
import Corporate8 from "../assets/Corporate/image-070.webp";
import Corporate9 from "../assets/Corporate/holt-case-study-09.webp";
import Corporate10 from "../assets/Corporate/image-074.webp";
import Corporate11 from "../assets/Corporate/image-060.webp";
import Corporate12 from "../assets/Corporate/image-061.webp";
import Corporate13 from "../assets/Corporate/image-063.webp";
import Corporate14 from "../assets/Corporate/image-064.webp";
import Corporate15 from "../assets/Corporate/image-065.webp";
import Corporate16 from "../assets/Corporate/image-066.webp";
import Corporate17 from "../assets/Corporate/image-067.webp";
import Corporate18 from "../assets/Corporate/d2a74f67254113.webp";
import Corporate19 from "../assets/Corporate/image-073.webp";
import Corporate20 from "../assets/Corporate/image-075.webp";
import Corporate21 from "../assets/Corporate/image-076.webp";

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
