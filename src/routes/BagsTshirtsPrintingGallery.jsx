import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import bags and t-shirts printing images
import BagTshirt1 from "../assets/printing/Bags & T-Shirts/0004-Free-Indoor-Light-Hanging-T-Shirt-Mockup.jpg";
import BagTshirt2 from "../assets/printing/Bags & T-Shirts/167759603.jpg";
import BagTshirt3 from "../assets/printing/Bags & T-Shirts/Cropped_T-Shirt_Mockup.jpg";
import BagTshirt4 from "../assets/printing/Bags & T-Shirts/Female-T-Shirt-Mockup-Free-Psd-01.jpg";
import BagTshirt5 from "../assets/printing/Bags & T-Shirts/Free-Hang-Tag-T-Shirt-Packaging-Box-Mockup-PSD.jpg";
import BagTshirt6 from "../assets/printing/Bags & T-Shirts/Free-T-Shirt-Mockup-for-Logo-Branding.jpg";
import BagTshirt7 from "../assets/printing/Bags & T-Shirts/Free-Young-Kid-T-Shirt-MockUp-PSD.jpg";
import BagTshirt8 from "../assets/printing/Bags & T-Shirts/Screen2-2.jpg";
import BagTshirt9 from "../assets/printing/Bags & T-Shirts/View of backpack mock-up.jpg";
import BagTshirt10 from "../assets/printing/Bags & T-Shirts/baby-t-shirt-psd-mockup_full_preview_retina.jpg";
import BagTshirt11 from "../assets/printing/Bags & T-Shirts/backpack-mockup_373676-3918.jpg";
import BagTshirt12 from "../assets/printing/Bags & T-Shirts/t-shirt-mockup-front-and-back-photoshop-template_434267-original.jpg";

const BagsTshirtsPrintingGallery = createGalleryTemplate({
  title: "Bags & T-Shirts Printing Gallery",
  description:
    "Creative and professional printing solutions for bags and t-shirts.",
  category: "Bags & T-Shirts Printing",
  items: [
    {
      title: "Indoor Light Hanging T-Shirt",
      description: "Free indoor light hanging t-shirt mockup presentation",
      image: BagTshirt1,
      fullCover: true,
    },
    {
      title: "Professional T-Shirt Design",
      description: "High-quality professional t-shirt printing design",
      image: BagTshirt2,
      fullCover: true,
    },
    {
      title: "Cropped T-Shirt Mockup",
      description: "Modern cropped t-shirt mockup template",
      image: BagTshirt3,
      fullCover: true,
    },
    {
      title: "Female T-Shirt Mockup",
      description: "Free female t-shirt mockup PSD template",
      image: BagTshirt4,
      fullCover: true,
    },
    {
      title: "T-Shirt Packaging Box Mockup",
      description: "Free hang tag t-shirt packaging box mockup PSD",
      image: BagTshirt5,
      fullCover: true,
    },
    {
      title: "T-Shirt Logo Branding Mockup",
      description: "Free t-shirt mockup for logo branding presentation",
      image: BagTshirt6,
      fullCover: true,
    },
    {
      title: "Young Kid T-Shirt Mockup",
      description: "Free young kid t-shirt mockup PSD template",
      image: BagTshirt7,
      fullCover: true,
    },
    {
      title: "T-Shirt Screen Print Design",
      description: "Professional t-shirt screen printing design",
      image: BagTshirt8,
      fullCover: true,
    },
    {
      title: "Backpack Mockup View",
      description: "Professional view of backpack mockup presentation",
      image: BagTshirt9,
      fullCover: true,
    },
    {
      title: "Baby T-Shirt PSD Mockup",
      description: "Baby t-shirt PSD mockup full preview template",
      image: BagTshirt10,
      fullCover: true,
    },
    {
      title: "Backpack Mockup Design",
      description: "Professional backpack mockup design template",
      image: BagTshirt11,
      fullCover: true,
    },
    {
      title: "T-Shirt Front & Back Mockup",
      description: "T-shirt mockup front and back photoshop template",
      image: BagTshirt12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(BagsTshirtsPrintingGallery);
