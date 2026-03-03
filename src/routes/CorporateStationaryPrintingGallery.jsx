import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import corporate stationary printing images
import Corporate1 from "../assets/printing/Corporate Stationary/5-Free-ID-Card-Holder-Mockup-PSD-Files-1.jpg";
import Corporate2 from "../assets/printing/Corporate Stationary/Blue polygonal identity corporative.jpg";
import Corporate3 from "../assets/printing/Corporate Stationary/Branding-Notebook-and-Vertical-Business-Card-Mockup-PSD-Free-Download.webp";
import Corporate4 from "../assets/printing/Corporate Stationary/Cup mock up.jpg";
import Corporate5 from "../assets/printing/Corporate Stationary/Flat design business stationery template.jpg";
import Corporate6 from "../assets/printing/Corporate Stationary/Front view of luxury pen mockup isolated.jpg";
import Corporate7 from "../assets/printing/Corporate Stationary/Hot drink paper cup with mockup sleeve.jpg";
import Corporate8 from "../assets/printing/Corporate Stationary/Modern business corporate identity stationery.jpg";
import Corporate9 from "../assets/printing/Corporate Stationary/Realistic notebook.jpg";
import Corporate10 from "../assets/printing/Corporate Stationary/Stylish business stationery items set in blue color.jpg";
import Corporate11 from "../assets/printing/Corporate Stationary/Two luxury pens mockup.jpg";
import Corporate12 from "../assets/printing/Corporate Stationary/black-glossy-11oz-mug-mockup.jpg";
import Corporate13 from "../assets/printing/Corporate Stationary/pin-button-badge-mockup-002.jpg";
import Corporate14 from "../assets/printing/Corporate Stationary/professional-id-card-mockup-vector.jpg";
import Corporate15 from "../assets/printing/Corporate Stationary/three-pin-button-badge-mockups-1.jpg";
import Corporate16 from "../assets/printing/Corporate Stationary/WhatsApp Image 2025-06-10 at 5.02.18 PM (1).jpeg";
import Corporate17 from "../assets/printing/Corporate Stationary/WhatsApp Image 2025-06-10 at 5.02.18 PM (2).jpeg";
import Corporate18 from "../assets/printing/Corporate Stationary/WhatsApp Image 2025-06-10 at 5.02.18 PM.jpeg";
import Corporate19 from "../assets/printing/Corporate Stationary/WhatsApp Image 2025-06-10 at 5.02.19 PM (1).jpeg";
import Corporate20 from "../assets/printing/Corporate Stationary/WhatsApp Image 2025-06-10 at 5.02.19 PM.jpeg";
import Corporate21 from "../assets/printing/Corporate Stationary/WhatsApp Image 2025-06-10 at 5.02.19 PM (2).jpeg";

const CorporateStationaryPrintingGallery = createGalleryTemplate({
  title: "Corporate Stationary Printing Gallery",
  description: "Professional and sophisticated corporate stationary solutions.",
  category: "Corporate Stationary Printing",
  items: [
    {
      title: "ID Card Holder Mockup",
      description:
        "Free ID card holder mockup PSD files for corporate identity",
      image: Corporate1,
      fullCover: true,
    },
    {
      title: "Blue Polygonal Corporate Identity",
      description: "Modern blue polygonal corporate identity design",
      image: Corporate2,
      fullCover: true,
    },
    {
      title: "Branding Notebook & Business Card",
      description:
        "Professional branding notebook and vertical business card mockup",
      image: Corporate3,
      fullCover: true,
    },
    {
      title: "Corporate Cup Mockup",
      description: "Professional corporate cup mockup for branding",
      image: Corporate4,
      fullCover: true,
    },
    {
      title: "Business Stationery Template",
      description: "Flat design business stationery template collection",
      image: Corporate5,
      fullCover: true,
    },
    {
      title: "Luxury Pen Mockup",
      description: "Front view of luxury pen mockup isolated design",
      image: Corporate6,
      fullCover: true,
    },
    {
      title: "Paper Cup with Sleeve",
      description: "Hot drink paper cup with mockup sleeve design",
      image: Corporate7,
      fullCover: true,
    },
    {
      title: "Modern Corporate Identity",
      description: "Modern business corporate identity stationery set",
      image: Corporate8,
      fullCover: true,
    },
    {
      title: "Realistic Notebook",
      description: "Professional realistic notebook mockup design",
      image: Corporate9,
      fullCover: true,
    },
    {
      title: "Blue Stationery Items Set",
      description: "Stylish business stationery items set in blue color",
      image: Corporate10,
      fullCover: true,
    },
    {
      title: "Two Luxury Pens Mockup",
      description: "Premium two luxury pens mockup presentation",
      image: Corporate11,
      fullCover: true,
    },
    {
      title: "Black Glossy Mug Mockup",
      description: "Professional black glossy 11oz mug mockup design",
      image: Corporate12,
      fullCover: true,
    },
    {
      title: "Pin Button Badge Mockup",
      description: "Professional pin button badge mockup design",
      image: Corporate13,
      fullCover: true,
    },
    {
      title: "Professional ID Card Mockup",
      description: "Professional ID card mockup vector design",
      image: Corporate14,
      fullCover: true,
    },
    {
      title: "Three Pin Button Badge Mockups",
      description: "Collection of three pin button badge mockups",
      image: Corporate15,
      fullCover: true,
    },
    {
      title: "Custom Corporate Stationery 1",
      description: "Professional custom corporate stationery design",
      image: Corporate16,
      fullCover: true,
    },
    {
      title: "Custom Corporate Stationery 2",
      description: "Modern custom corporate stationery solution",
      image: Corporate17,
      fullCover: true,
    },
    {
      title: "Custom Corporate Stationery 3",
      description: "Elegant custom corporate stationery template",
      image: Corporate18,
      fullCover: true,
    },
    {
      title: "Custom Corporate Stationery 4",
      description: "Creative custom corporate stationery design",
      image: Corporate19,
      fullCover: true,
    },
    {
      title: "Custom Corporate Stationery 5",
      description: "Premium custom corporate stationery presentation",
      image: Corporate20,
      fullCover: true,
    },
    {
      title: "Custom Corporate Stationery 6",
      description: "Advanced custom corporate stationery design solution",
      image: Corporate21,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(CorporateStationaryPrintingGallery);
