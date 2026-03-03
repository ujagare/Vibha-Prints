import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import business card images
import Visi1 from "../assets/Visiting Card/Visi_1.jpg";
import Visi2 from "../assets/Visiting Card/Visi_2.jpg";
import Visi3 from "../assets/Visiting Card/Visi_3.jpg";
import Visi4 from "../assets/Visiting Card/Visi_4.jpg";
import Visi5 from "../assets/Visiting Card/Visi_5.jpg";
import Visi6 from "../assets/Visiting Card/Visi_6.jpg";
import Visi7 from "../assets/Visiting Card/Visi_7.jpg";
import Visi8 from "../assets/Visiting Card/Visi_8.jpg";
import Visi9 from "../assets/Visiting Card/Visi_9.jpg";

const BusinessCardDesignGallery = createGalleryTemplate({
  title: "Business Card Design Gallery",
  description:
    "Innovative and professional business card designs that make a lasting impression.",
  category: "Business Card",
  items: [
    {
      title: "Corporate Professional",
      description: "Elegant and minimalist business card designs",
      image: Visi1,
      fullCover: true,
    },
    {
      title: "Creative Entrepreneur",
      description: "Unique and bold business card layouts",
      image: Visi2,
      fullCover: true,
    },
    {
      title: "Tech Industry",
      description: "Modern and cutting-edge card designs",
      image: Visi3,
      fullCover: true,
    },
    {
      title: "Luxury Branding",
      description: "Premium and sophisticated business card styles",
      image: Visi4,
      fullCover: true,
    },
    {
      title: "Minimalist White",
      description: "Clean and simple business card aesthetics",
      image: Visi5,
      fullCover: true,
    },
    {
      title: "Bold Typography",
      description: "Cards focusing on strong typographic elements",
      image: Visi6,
      fullCover: true,
    },
    {
      title: "Creative Design",
      description: "Innovative and eye-catching business card designs",
      image: Visi7,
      fullCover: true,
    },
    {
      title: "Professional Layout",
      description: "Well-structured and balanced business card layouts",
      image: Visi8,
      fullCover: true,
    },
    {
      title: "Premium Finish",
      description: "High-quality business cards with premium finishes",
      image: Visi9,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(BusinessCardDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
