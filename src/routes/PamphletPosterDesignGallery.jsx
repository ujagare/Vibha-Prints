import React from "react";
import { motion } from "framer-motion";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import pamphlet and poster images
import Pamphlet1 from "../assets/Pamphlet/1984.jpg";
import Pamphlet2 from "../assets/Pamphlet/2036992.jpg";
import Pamphlet3 from "../assets/Pamphlet/2123.jpg";
import Pamphlet4 from "../assets/Pamphlet/429363-PEB6V6-74.jpg";
import Pamphlet5 from "../assets/Pamphlet/508383-PI3JZN-432.jpg";
import Pamphlet6 from "../assets/Pamphlet/509096-PIAGSV-693.jpg";
import Pamphlet7 from "../assets/Pamphlet/Black and Grey Modern Business Webinar Flyer.jpg";
import Pamphlet8 from "../assets/Pamphlet/Blue Modern Home For Sale Flyer.jpg";
import Pamphlet9 from "../assets/Pamphlet/Blue and Yellow Modern Digital Marketing Flyer (1).jpg";

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
