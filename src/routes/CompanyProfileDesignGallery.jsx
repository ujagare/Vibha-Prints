import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import company profile images
import CompanyProfile1 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 3.43.50 PM.jpeg";
import CompanyProfile2 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 3.50.04 PM.jpeg";
import CompanyProfile3 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 3.57.17 PM.jpeg";
import CompanyProfile4 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 3.59.34 PM.jpeg";
import CompanyProfile5 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 4.01.56 PM.jpeg";
import CompanyProfile6 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 4.05.34 PM.jpeg";
import CompanyProfile7 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 4.07.48 PM.jpeg";
import CompanyProfile8 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 4.10.21 PM.jpeg";
import CompanyProfile9 from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 4.12.32 PM.jpeg";

const CompanyProfileDesignGallery = createGalleryTemplate({
  title: "Company Profile Design Gallery",
  description:
    "Professional and compelling company profile designs that tell your brand story.",
  category: "Company Profile",
  items: [
    {
      title: "Corporate Overview",
      description: "Comprehensive company profile layouts",
      image: CompanyProfile1,
      fullCover: true,
    },
    {
      title: "Startup Narrative",
      description: "Innovative design for emerging businesses",
      image: CompanyProfile2,
      fullCover: true,
    },
    {
      title: "Luxury Brand Presentation",
      description: "Sophisticated profile designs for high-end brands",
      image: CompanyProfile3,
      fullCover: true,
    },
    {
      title: "Technology Company",
      description: "Modern and sleek tech company profiles",
      image: CompanyProfile4,
      fullCover: true,
    },
    {
      title: "Non-Profit Organization",
      description: "Impactful designs for mission-driven organizations",
      image: CompanyProfile5,
      fullCover: true,
    },
    {
      title: "Annual Report Design",
      description: "Professional and engaging annual report layouts",
      image: CompanyProfile6,
      fullCover: true,
    },
    {
      title: "Business Portfolio",
      description: "Creative business portfolio presentation designs",
      image: CompanyProfile7,
      fullCover: true,
    },
    {
      title: "Corporate Branding",
      description: "Professional corporate branding profile designs",
      image: CompanyProfile8,
      fullCover: true,
    },
    {
      title: "Company Showcase",
      description: "Modern company showcase and presentation layouts",
      image: CompanyProfile9,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(CompanyProfileDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
