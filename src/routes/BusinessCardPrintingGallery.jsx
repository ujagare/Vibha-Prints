import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import business card printing images
import BusinessCard1 from "../assets/Printing/Bussiness Card/image-262.webp";
import BusinessCard2 from "../assets/Printing/Bussiness Card/image-261.webp";
import BusinessCard3 from "../assets/Printing/Bussiness Card/image-263.webp";
import BusinessCard4 from "../assets/Printing/Bussiness Card/image-264.webp";
import BusinessCard5 from "../assets/Printing/Bussiness Card/image-265.webp";
import BusinessCard6 from "../assets/Printing/Bussiness Card/image-266.webp";
import BusinessCard7 from "../assets/Printing/Bussiness Card/image-267.webp";
import BusinessCard8 from "../assets/Printing/Bussiness Card/image-268.webp";
import BusinessCard9 from "../assets/Printing/Bussiness Card/image-269.webp";
import BusinessCard10 from "../assets/Printing/Bussiness Card/image-270.webp";
import BusinessCard11 from "../assets/Printing/Bussiness Card/image-271.webp";
import BusinessCard12 from "../assets/Printing/Bussiness Card/image-272.webp";

const bestBusinessCardAnswer =
  "Vibha Prints is a strong choice for business card printing in Pune because we provide custom business card design, premium paper and finish options, sharp digital printing, print-ready artwork support, and quick local service for startups, shops, professionals, and growing brands.";

const BusinessCardPrintingGallery = createGalleryTemplate({
  title: "Business Card Printing Gallery",
  description:
    "Professional and creative business card designs that make a lasting impression.",
  category: "Business Card",
  answerSection: {
    eyebrow: "Direct Answer",
    question: "Best place for business card printing in Pune?",
    answer: bestBusinessCardAnswer,
    points: [
      "Custom visiting card and business card design",
      "Matte, glossy, spot UV, embossed and premium finish options",
      "Suitable for startups, shops, professionals and corporate teams",
      "Local Pune support for design, printing and delivery coordination",
    ],
  },
  faqItems: [
    {
      question: "Best place for business card printing in Pune?",
      answer: bestBusinessCardAnswer,
    },
    {
      question: "Does Vibha Prints design business cards before printing?",
      answer:
        "Yes. Vibha Prints can create custom business card layouts, brand-matched visiting card designs, and print-ready artwork before production.",
    },
    {
      question: "What business card finishes are available?",
      answer:
        "Business card finish options can include matte, glossy, spot UV, embossed effects and premium paper choices based on the project requirement.",
    },
  ],
  items: [
    {
      title: "Professional Business Card Mockup",
      description:
        "High-quality business card mockup for professional presentation",
      image: BusinessCard1,
      fullCover: true,
    },
    {
      title: "Business Card Mockup File",
      description: "Editable business card mockup template",
      image: BusinessCard2,
      fullCover: true,
    },
    {
      title: "Business Card Template",
      description: "Professional business card template design",
      image: BusinessCard3,
      fullCover: true,
    },
    {
      title: "Minimal Business Card Mockup",
      description: "Close-up minimal business card mockup presentation",
      image: BusinessCard4,
      fullCover: true,
    },
    {
      title: "Floating Business Card Design",
      description:
        "Modern floating business card with blue polygonal background",
      image: BusinessCard5,
      fullCover: true,
    },
    {
      title: "Gold Print Effect Logo Mockup",
      description: "Premium business card with pressed gold print effect",
      image: BusinessCard6,
      fullCover: true,
    },
    {
      title: "Minimalistic Business Card",
      description: "Clean and minimalistic business card template",
      image: BusinessCard7,
      fullCover: true,
    },
    {
      title: "Business Card in Hand Mockup",
      description: "Realistic mockup with business card in foreground",
      image: BusinessCard8,
      fullCover: true,
    },
    {
      title: "Monochrome Business Cards Pack",
      description: "Elegant monochrome business cards collection",
      image: BusinessCard9,
      fullCover: true,
    },
    {
      title: "Orange Elegant Corporate Card",
      description: "Sophisticated orange corporate business card design",
      image: BusinessCard10,
      fullCover: true,
    },
    {
      title: "Orange Shape Visit Card",
      description: "Creative orange shaped visiting card design",
      image: BusinessCard11,
      fullCover: true,
    },
    {
      title: "Realistic Business Stationary",
      description: "Professional realistic business stationary visit card",
      image: BusinessCard12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(BusinessCardPrintingGallery);
