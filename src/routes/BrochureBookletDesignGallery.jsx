import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import brochure images
import Brochure1 from "../assets/Brouchers/17947819.webp";
import Brochure2 from "../assets/Brouchers/3327941.webp";
import Brochure3 from "../assets/Brouchers/3329102.webp";
import Brochure4 from "../assets/Brouchers/3593222.webp";
import Brochure5 from "../assets/Brouchers/380.webp";
import Brochure6 from "../assets/Brouchers/5506044.webp";
import Brochure7 from "../assets/Brouchers/brochure-2.webp";
import Brochure8 from "../assets/Brouchers/image-034.webp";
import Brochure9 from "../assets/Brouchers/image-035.webp";

const BrochureBookletDesignGallery = createGalleryTemplate({
  title: "Brochure & Booklet Design Gallery",
  description:
    "Comprehensive and visually stunning brochure and booklet designs.",
  category: "Brochure Design",
  items: [
    {
      title: "Corporate Profile",
      description: "Elegant company overview brochures",
      image: Brochure7,
      fullCover: true,
    },
    {
      title: "Product Catalog",
      description: "Comprehensive and attractive product booklets",
      image: Brochure1,
      fullCover: true,
    },
    {
      title: "Travel Guide",
      description: "Engaging and informative travel brochures",
      image: Brochure2,
      fullCover: true,
    },
    {
      title: "Educational Prospectus",
      description: "Professional institutional booklets",
      image: Brochure3,
      fullCover: true,
    },
    {
      title: "Service Portfolio",
      description: "Detailed service presentation brochures",
      image: Brochure4,
      fullCover: true,
    },
    {
      title: "Event Program",
      description: "Creative and stylish event booklets",
      image: Brochure5,
      fullCover: true,
    },
    {
      title: "Marketing Brochure",
      description: "Professional marketing material designs",
      image: Brochure6,
      fullCover: true,
    },
    {
      title: "Business Brochure",
      description: "Modern business presentation brochures",
      image: Brochure8,
      fullCover: true,
    },
    {
      title: "Creative Booklet",
      description: "Innovative and creative booklet designs",
      image: Brochure9,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(BrochureBookletDesignGallery, {
  sidebar: "graphic",
  sidebarTitle: "Our Graphic Services",
});
