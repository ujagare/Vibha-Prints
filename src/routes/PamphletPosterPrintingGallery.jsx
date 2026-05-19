import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import pamphlet and poster printing images
import Pamphlet1 from "../assets/Printing/Pamphlet & Poster Printing/image-294.webp";
import Pamphlet2 from "../assets/Printing/Pamphlet & Poster Printing/image-295.webp";
import Pamphlet3 from "../assets/Printing/Pamphlet & Poster Printing/63jpikbestxfv.webp";
import Pamphlet4 from "../assets/Printing/Pamphlet & Poster Printing/image-297.webp";
import Pamphlet5 from "../assets/Printing/Pamphlet & Poster Printing/image-301.webp";
import Pamphlet6 from "../assets/Printing/Pamphlet & Poster Printing/image-302.webp";
import Pamphlet7 from "../assets/Printing/Pamphlet & Poster Printing/image-304.webp";
import Pamphlet8 from "../assets/Printing/Pamphlet & Poster Printing/image-305.webp";
import Pamphlet9 from "../assets/Printing/Pamphlet & Poster Printing/image-298.webp";
import Pamphlet10 from "../assets/Printing/Pamphlet & Poster Printing/image-299.webp";
import Pamphlet11 from "../assets/Printing/Pamphlet & Poster Printing/image-300.webp";
import Pamphlet12 from "../assets/Printing/Pamphlet & Poster Printing/image-303.webp";

const PamphletPosterPrintingGallery = createGalleryTemplate({
  title: "Pamphlet & Poster Printing Gallery",
  description:
    "Engaging and informative pamphlet and poster designs for various purposes.",
  category: "Pamphlet Printing",
  items: [
    {
      title: "Professional Pamphlet Mockup",
      description: "High-quality pamphlet mockup for professional presentation",
      image: Pamphlet1,
      fullCover: true,
    },
    {
      title: "A4 Flyer Mockup PSD",
      description: "Free A4 flyer mockup template for design presentation",
      image: Pamphlet2,
      fullCover: true,
    },
    {
      title: "Creative Poster Design",
      description: "Modern and creative poster design template",
      image: Pamphlet3,
      fullCover: true,
    },
    {
      title: "Business Flyer Template",
      description: "Professional business flyer template design",
      image: Pamphlet4,
      fullCover: true,
    },
    {
      title: "Mobile App Flyer",
      description: "Modern mobile app promotional flyer design",
      image: Pamphlet5,
      fullCover: true,
    },
    {
      title: "Poster or Flyer Mockup",
      description: "Versatile poster and flyer mockup presentation",
      image: Pamphlet6,
      fullCover: true,
    },
    {
      title: "Tri-Fold Brochure Mockup",
      description: "Professional tri-fold brochure mockup PSD template",
      image: Pamphlet7,
      fullCover: true,
    },
    {
      title: "Web Page Template Mockup",
      description: "Modern web page template mockup design",
      image: Pamphlet8,
      fullCover: true,
    },
    {
      title: "Dental Clinic Flyer Poster",
      description: "Healthcare dental clinic flyer and poster template",
      image: Pamphlet9,
      fullCover: true,
    },
    {
      title: "Featured Pamphlet Mockup",
      description: "Premium featured pamphlet mockup presentation",
      image: Pamphlet10,
      fullCover: true,
    },
    {
      title: "Free Travel Poster Templates",
      description: "Beautiful travel poster templates for tourism marketing",
      image: Pamphlet11,
      fullCover: true,
    },
    {
      title: "Sporting Goods A4 Poster",
      description: "Sports outlet A4 poster advertisement template",
      image: Pamphlet12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(PamphletPosterPrintingGallery);
