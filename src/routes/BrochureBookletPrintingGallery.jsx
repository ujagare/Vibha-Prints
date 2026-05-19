import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import brochure and booklet printing images
import Brochure1 from "../assets/Printing/Broucher & Booklet/a5-bifold.webp";
import Brochure2 from "../assets/Printing/Broucher & Booklet/image-250.webp";
import Brochure3 from "../assets/Printing/Broucher & Booklet/image-251.webp";
import Brochure4 from "../assets/Printing/Broucher & Booklet/image-252.webp";
import Brochure5 from "../assets/Printing/Broucher & Booklet/image-253.webp";
import Brochure6 from "../assets/Printing/Broucher & Booklet/image-254.webp";
import Brochure7 from "../assets/Printing/Broucher & Booklet/image-255.webp";
import Brochure8 from "../assets/Printing/Broucher & Booklet/image-256.webp";
import Brochure9 from "../assets/Printing/Broucher & Booklet/image-257.webp";
import Brochure10 from "../assets/Printing/Broucher & Booklet/image-258.webp";
import Brochure11 from "../assets/Printing/Broucher & Booklet/image-260.webp";
import Brochure12 from "../assets/Printing/Broucher & Booklet/image-259.webp";

const BrochureBookletPrintingGallery = createGalleryTemplate({
  title: "Brochure & Booklet Printing Gallery",
  description:
    "Comprehensive and visually appealing brochure and booklet designs.",
  category: "Brochure Printing",
  items: [
    {
      title: "A5 Bifold Brochure",
      description: "Professional A5 bifold brochure design",
      image: Brochure1,
      fullCover: true,
    },
    {
      title: "Brochure Template Layout",
      description: "Modern brochure template layout design",
      image: Brochure2,
      fullCover: true,
    },
    {
      title: "Coffee Shop Bifold",
      description: "Coffee shop bifold brochure design",
      image: Brochure3,
      fullCover: true,
    },
    {
      title: "Corporate Bifold Brochure",
      description: "Professional corporate bifold brochure template",
      image: Brochure4,
      fullCover: true,
    },
    {
      title: "Dietary Program Brochure PSD",
      description: "Health and dietary program brochure template",
      image: Brochure5,
      fullCover: true,
    },
    {
      title: "Paradise Hotel Bifold Brochure",
      description: "Geometric paradise hotel bifold brochure design",
      image: Brochure6,
      fullCover: true,
    },
    {
      title: "Food Rescue Charity Trifold",
      description: "Global food rescue charity trifold brochure",
      image: Brochure7,
      fullCover: true,
    },
    {
      title: "Blue Shapes Leaflet Template",
      description: "Great leaflet template with blue geometric shapes",
      image: Brochure8,
      fullCover: true,
    },
    {
      title: "Marketing Brochure Template",
      description: "Professional marketing brochure template design",
      image: Brochure9,
      fullCover: true,
    },
    {
      title: "Bifold Mockup Top View",
      description: "Top side view of bifold brochure mockup cover",
      image: Brochure10,
      fullCover: true,
    },
    {
      title: "US Letter Brochure Mockup",
      description: "Professional US letter size brochure mockup presentation",
      image: Brochure11,
      fullCover: true,
    },
    {
      title: "Trifold Invitation Mockup",
      description: "Trifold brochure or invitation mockup still life concept",
      image: Brochure12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(BrochureBookletPrintingGallery);
