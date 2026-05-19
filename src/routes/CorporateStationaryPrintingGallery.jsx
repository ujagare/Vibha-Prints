import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import corporate stationary printing images
import Corporate1 from "../assets/Printing/Corporate Stationary/image-273.webp";
import Corporate2 from "../assets/Printing/Corporate Stationary/image-275.webp";
import Corporate3 from "../assets/Printing/Corporate Stationary/image-276.webp";
import Corporate4 from "../assets/Printing/Corporate Stationary/cup-mock-up.webp";
import Corporate5 from "../assets/Printing/Corporate Stationary/image-278.webp";
import Corporate6 from "../assets/Printing/Corporate Stationary/image-279.webp";
import Corporate7 from "../assets/Printing/Corporate Stationary/image-280.webp";
import Corporate8 from "../assets/Printing/Corporate Stationary/image-281.webp";
import Corporate9 from "../assets/Printing/Corporate Stationary/image-284.webp";
import Corporate10 from "../assets/Printing/Corporate Stationary/image-285.webp";
import Corporate11 from "../assets/Printing/Corporate Stationary/image-287.webp";
import Corporate12 from "../assets/Printing/Corporate Stationary/image-274.webp";
import Corporate13 from "../assets/Printing/Corporate Stationary/image-282.webp";
import Corporate14 from "../assets/Printing/Corporate Stationary/image-283.webp";
import Corporate15 from "../assets/Printing/Corporate Stationary/image-286.webp";
import Corporate16 from "../assets/Printing/Corporate Stationary/image-288.webp";
import Corporate17 from "../assets/Printing/Corporate Stationary/image-289.webp";
import Corporate18 from "../assets/Printing/Corporate Stationary/image-290.webp";
import Corporate19 from "../assets/Printing/Corporate Stationary/image-291.webp";
import Corporate20 from "../assets/Printing/Corporate Stationary/image-293.webp";
import Corporate21 from "../assets/Printing/Corporate Stationary/image-292.webp";

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
