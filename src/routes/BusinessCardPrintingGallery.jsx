import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import business card printing images
import BusinessCard1 from "../assets/printing/Bussiness Card/Business Card Mockup.jpg";
import BusinessCard2 from "../assets/printing/Bussiness Card/Business card mockup file.jpg";
import BusinessCard3 from "../assets/printing/Bussiness Card/Business card template.jpg";
import BusinessCard4 from "../assets/printing/Bussiness Card/Close up on minimal business card mockup.jpg";
import BusinessCard5 from "../assets/printing/Bussiness Card/Floating business card mockup design with a blue polygonal background.jpg";
import BusinessCard6 from "../assets/printing/Bussiness Card/Logo Mockup on Business Card with Pressed Gold Print Effect.jpg";
import BusinessCard7 from "../assets/printing/Bussiness Card/Minimalistic business card template.jpg";
import BusinessCard8 from "../assets/printing/Bussiness Card/Mock up with young man and business card in foreground.jpg";
import BusinessCard9 from "../assets/printing/Bussiness Card/Monochrome business cards pack.jpg";
import BusinessCard10 from "../assets/printing/Bussiness Card/Orange elegant corporate card.jpg";
import BusinessCard11 from "../assets/printing/Bussiness Card/Orange shape visit card.jpg";
import BusinessCard12 from "../assets/printing/Bussiness Card/Realistic business stationary visit card.jpg";

const BusinessCardPrintingGallery = createGalleryTemplate({
  title: "Business Card Printing Gallery",
  description:
    "Professional and creative business card designs that make a lasting impression.",
  category: "Business Card",
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
