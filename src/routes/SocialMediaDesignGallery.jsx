import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import social media design images
import SocialMedia1 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.18.18 PM.jpeg";
import SocialMedia2 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.19.08 PM (1).jpeg";
import SocialMedia3 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.19.08 PM.jpeg";
import SocialMedia4 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.19.09 PM.jpeg";
import SocialMedia5 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.19.48 PM (1).jpeg";
import SocialMedia6 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.19.48 PM (2).jpeg";
import SocialMedia7 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.19.48 PM.jpeg";
import SocialMedia8 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.20.54 PM.jpeg";
import SocialMedia9 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.20.55 PM (1).jpeg";
import SocialMedia10 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.20.55 PM.jpeg";
import SocialMedia11 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.21.55 PM (1).jpeg";
import SocialMedia12 from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.21.55 PM.jpeg";

const SocialMediaDesignGallery = createGalleryTemplate({
  title: "Social Media Design Gallery",
  description:
    "Engaging and creative social media designs that capture audience attention.",
  category: "Social Media Design",
  items: [
    {
      title: "Instagram Posts",
      description: "Visually stunning Instagram graphic designs",
      image: SocialMedia1,
      fullCover: true,
    },
    {
      title: "Facebook Covers",
      description: "Professional and eye-catching Facebook banner designs",
      image: SocialMedia2,
      fullCover: true,
    },
    {
      title: "LinkedIn Graphics",
      description: "Corporate and professional social media visuals",
      image: SocialMedia3,
      fullCover: true,
    },
    {
      title: "Twitter Headers",
      description: "Dynamic and impactful Twitter profile designs",
      image: SocialMedia4,
      fullCover: true,
    },
    {
      title: "Pinterest Pins",
      description: "Creative and shareable Pinterest graphic designs",
      image: SocialMedia5,
      fullCover: true,
    },
    {
      title: "Story Highlights",
      description: "Cohesive and branded Instagram story highlights",
      image: SocialMedia6,
      fullCover: true,
    },
    {
      title: "Social Media Campaigns",
      description: "Creative social media campaign designs",
      image: SocialMedia7,
      fullCover: true,
    },
    {
      title: "Brand Promotion Posts",
      description: "Engaging brand promotion social media graphics",
      image: SocialMedia8,
      fullCover: true,
    },
    {
      title: "Event Promotion",
      description: "Eye-catching event promotion social media designs",
      image: SocialMedia9,
      fullCover: true,
    },
    {
      title: "Product Showcase",
      description: "Professional product showcase social media graphics",
      image: SocialMedia10,
      fullCover: true,
    },
    {
      title: "Motivational Posts",
      description: "Inspiring motivational social media post designs",
      image: SocialMedia11,
      fullCover: true,
    },
    {
      title: "Business Announcements",
      description: "Professional business announcement social media graphics",
      image: SocialMedia12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(SocialMediaDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
