import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import pamphlet and poster printing images
import Pamphlet1 from "../assets/printing/Pamphlet & Poster Printing/32_pamphlet-mockup.jpg";
import Pamphlet2 from "../assets/printing/Pamphlet & Poster Printing/60-Free-A4-Flyer-Mockup-PSD-Files-2.jpg";
import Pamphlet3 from "../assets/printing/Pamphlet & Poster Printing/63JpIkbEsTXFV.jpg";
import Pamphlet4 from "../assets/printing/Pamphlet & Poster Printing/Business flyer template.jpg";
import Pamphlet5 from "../assets/printing/Pamphlet & Poster Printing/Mobile app flyer.jpg";
import Pamphlet6 from "../assets/printing/Pamphlet & Poster Printing/Poster or Flyer mockup.jpg";
import Pamphlet7 from "../assets/printing/Pamphlet & Poster Printing/Tri-Fold-Brochure-Mockup-PSD.jpg";
import Pamphlet8 from "../assets/printing/Pamphlet & Poster Printing/Web page template mock up.jpg";
import Pamphlet9 from "../assets/printing/Pamphlet & Poster Printing/dental-clinic-flyer-poster-template-cover.jpg";
import Pamphlet10 from "../assets/printing/Pamphlet & Poster Printing/featured-pamphlet-mockup.jpg";
import Pamphlet11 from "../assets/printing/Pamphlet & Poster Printing/free-travel-poster-templates.jpg";
import Pamphlet12 from "../assets/printing/Pamphlet & Poster Printing/sporting-goods-outlet-a4-poster-advertisement-templates.jpg";

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
