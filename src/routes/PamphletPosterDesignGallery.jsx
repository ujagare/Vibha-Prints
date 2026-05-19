import React from "react";
import { motion } from "framer-motion";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import pamphlet and poster images
import Pamphlet1 from "../assets/Pamphlet/1984.webp";
import Pamphlet2 from "../assets/Pamphlet/2036992.webp";
import Pamphlet3 from "../assets/Pamphlet/2123.webp";
import Pamphlet4 from "../assets/Pamphlet/image-209.webp";
import Pamphlet5 from "../assets/Pamphlet/image-210.webp";
import Pamphlet6 from "../assets/Pamphlet/image-211.webp";
import Pamphlet7 from "../assets/Pamphlet/image-212.webp";
import Pamphlet8 from "../assets/Pamphlet/image-214.webp";
import Pamphlet9 from "../assets/Pamphlet/image-213.webp";

const PamphletPosterDesignGallery = createGalleryTemplate({
  title: "Pamphlet & Poster Design Gallery",
  description:
    "Engaging and impactful pamphlet and poster designs for various purposes.",
  category: "Pamphlet Design",
  items: [
    {
      title: "Event Promotion",
      description: "Eye-catching designs for event marketing",
      image: Pamphlet1,
      fullCover: true,
    },
    {
      title: "Product Launch",
      description: "Compelling posters for product announcements",
      image: Pamphlet2,
      fullCover: true,
    },
    {
      title: "Educational Infographics",
      description: "Informative pamphlets with clear visuals",
      image: Pamphlet3,
      fullCover: true,
    },
    {
      title: "Corporate Announcement",
      description: "Professional posters for business communications",
      image: Pamphlet4,
      fullCover: true,
    },
    {
      title: "Festival Marketing",
      description: "Vibrant designs for seasonal promotions",
      image: Pamphlet5,
      fullCover: true,
    },
    {
      title: "Conference Materials",
      description: "Detailed pamphlets for professional events",
      image: Pamphlet6,
      fullCover: true,
    },
    {
      title: "Business Webinar",
      description: "Modern and professional webinar flyers",
      image: Pamphlet7,
      fullCover: true,
    },
    {
      title: "Real Estate Marketing",
      description: "Attractive property sale flyers",
      image: Pamphlet8,
      fullCover: true,
    },
    {
      title: "Digital Marketing",
      description: "Creative digital marketing campaign flyers",
      image: Pamphlet9,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(PamphletPosterDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
