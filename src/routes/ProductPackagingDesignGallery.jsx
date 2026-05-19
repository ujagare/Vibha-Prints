import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import packaging design images
import Package1 from "../assets/Packeging/image-194.webp";
import Package2 from "../assets/Packeging/image-195.webp";
import Package3 from "../assets/Packeging/behance-ad-1.webp";
import Package4 from "../assets/Packeging/behance-ad-4.webp";
import Package5 from "../assets/Packeging/behance-ad-6.webp";
import Package6 from "../assets/Packeging/behance-ad.webp";
import Package7 from "../assets/Packeging/image-200.webp";
import Package8 from "../assets/Packeging/image-201.webp";
import Package9 from "../assets/Packeging/image-202.webp";
import Package10 from "../assets/Packeging/image-203.webp";
import Package11 from "../assets/Packeging/image-204.webp";
import Package12 from "../assets/Packeging/image-205.webp";

const ProductPackagingDesignGallery = createGalleryTemplate({
  title: "Product Packaging Design Gallery",
  description:
    "Innovative and attractive packaging designs that enhance brand identity and product appeal.",
  category: "Packaging Design",
  items: [
    {
      title: "Almond Oil Packaging",
      description: "Premium almond oil packaging with elegant design",
      image: Package1,
      fullCover: true,
    },
    {
      title: "Almond Oil Label Design",
      description: "Modern and clean almond oil product labeling",
      image: Package2,
      fullCover: true,
    },
    {
      title: "Creative Product Ad",
      description: "Eye-catching product advertisement design",
      image: Package3,
      fullCover: true,
    },
    {
      title: "Brand Advertisement",
      description: "Professional brand promotion packaging",
      image: Package4,
      fullCover: true,
    },
    {
      title: "Product Marketing",
      description: "Effective product marketing packaging design",
      image: Package5,
      fullCover: true,
    },
    {
      title: "Behance Portfolio",
      description: "Creative portfolio packaging showcase",
      image: Package6,
      fullCover: true,
    },
    {
      title: "Cookie Food Label",
      description: "Playful and colorful cookie packaging design",
      image: Package7,
      fullCover: true,
    },
    {
      title: "Chocolate Packaging",
      description: "3D chocolate packaging mockup design",
      image: Package8,
      fullCover: true,
    },
    {
      title: "Tea Mix Organic Label",
      description: "Modern organic tea packaging design",
      image: Package9,
      fullCover: true,
    },
    {
      title: "Tea Packaging Mockup",
      description: "Animated tea packaging presentation",
      image: Package10,
      fullCover: true,
    },
    {
      title: "Banana Chips Packaging",
      description: "Illustrative banana chips food product label",
      image: Package11,
      fullCover: true,
    },
    {
      title: "Honey Bee Packaging",
      description: "Modern honey bee packaging label design",
      image: Package12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(ProductPackagingDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
