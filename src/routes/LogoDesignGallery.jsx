import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import logo images
import Logo1 from "../assets/Logo/Logo_1.jpg";
import Logo2 from "../assets/Logo/Logo_2.jpg";
import Logo3 from "../assets/Logo/Logo_3.jpg";
import Logo4 from "../assets/Logo/Logo_4.jpg";
import Logo5 from "../assets/Logo/Logo_5.jpg";
import Logo6 from "../assets/Logo/Logo_6.jpg";
import Logo7 from "../assets/Logo/Logo_7.jpg";
import Logo8 from "../assets/Logo/Logo_8.jpg";
import Logo9 from "../assets/Logo/Logo_9 (1).jpg";
import Logo10 from "../assets/Logo/Logo_10.jpg";
import Logo11 from "../assets/Logo/Logo_11.jpg";

const LogoDesignGallery = createGalleryTemplate({
  title: "Logo Design Gallery",
  description:
    "Creative and memorable logo designs that capture your brand essence.",
  category: "Logo Design",
  items: [
    {
      title: "Corporate Logos",
      description: "Professional and sophisticated brand identities",
      image: Logo1,
      fullCover: true,
    },
    {
      title: "Startup Logos",
      description: "Innovative and dynamic logo designs for new ventures",
      image: Logo2,
      fullCover: true,
    },
    {
      title: "Minimalist Logos",
      description: "Clean and elegant logo solutions",
      image: Logo3,
      fullCover: true,
    },
    {
      title: "Creative Typography",
      description: "Unique logos leveraging creative typography",
      image: Logo4,
      fullCover: true,
    },
    {
      title: "Symbolic Logos",
      description: "Logos with meaningful symbolic representations",
      image: Logo5,
      fullCover: true,
    },
    {
      title: "Modern Emblem Designs",
      description: "Contemporary logo designs with modern flair",
      image: Logo6,
      fullCover: true,
    },
    {
      title: "Retail Brand Logos",
      description: "Eye-catching logos for retail and consumer brands",
      image: Logo7,
      fullCover: true,
    },
    {
      title: "Technology Logos",
      description: "Forward-thinking logos for tech companies",
      image: Logo8,
      fullCover: true,
    },
    {
      title: "Artistic Logos",
      description: "Creative and artistic logo designs with unique aesthetics",
      image: Logo9,
      fullCover: true,
    },
    {
      title: "Versatile Brand Marks",
      description: "Adaptable logos that work across multiple platforms",
      image: Logo10,
      fullCover: true,
    },
    {
      title: "Premium Brand Identity",
      description: "Sophisticated logo designs for premium brands",
      image: Logo11,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(LogoDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
