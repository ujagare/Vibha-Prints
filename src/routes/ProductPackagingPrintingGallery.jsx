import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import product packaging printing images
import Package1 from "../assets/Printing/product packaging/1865228026.webp";
import Package2 from "../assets/Printing/product packaging/image-307.webp";
import Package3 from "../assets/Printing/product packaging/image-308.webp";
import Package4 from "../assets/Printing/product packaging/image-309.webp";
import Package5 from "../assets/Printing/product packaging/image-310.webp";
import Package6 from "../assets/Printing/product packaging/image-311.webp";
import Package7 from "../assets/Printing/product packaging/image-312.webp";
import Package8 from "../assets/Printing/product packaging/image-313.webp";
import Package9 from "../assets/Printing/product packaging/image-315.webp";
import Package10 from "../assets/Printing/product packaging/image-316.webp";
import Package11 from "../assets/Printing/product packaging/image-317.webp";
import Package12 from "../assets/Printing/product packaging/image-314.webp";

const ProductPackagingPrintingGallery = createGalleryTemplate({
  title: "Product Packaging Printing Gallery",
  description:
    "Innovative and attractive packaging solutions that enhance brand identity.",
  category: "Packaging Printing",
  items: [
    {
      title: "Professional Product Packaging",
      description: "High-quality professional product packaging design",
      image: Package1,
      fullCover: true,
    },
    {
      title: "3D Packaged Mockup",
      description: "Realistic colorful 3D packaged mockup presentation",
      image: Package2,
      fullCover: true,
    },
    {
      title: "Honey Avocado Packaging",
      description: "Premium honey avocado product packaging design",
      image: Package3,
      fullCover: true,
    },
    {
      title: "Honey Lavender Packaging",
      description: "Beautiful honey lavender product packaging design",
      image: Package4,
      fullCover: true,
    },
    {
      title: "Beauty Product Mockup",
      description: "Professional beauty product packaging mockup",
      image: Package5,
      fullCover: true,
    },
    {
      title: "Cosmetic Tube Packaging",
      description:
        "Orange cosmetic packaging plastic tube with cardboard design",
      image: Package6,
      fullCover: true,
    },
    {
      title: "Original Honey Packaging",
      description: "Premium original honey product packaging design",
      image: Package7,
      fullCover: true,
    },
    {
      title: "Jewelry Box Mockup",
      description: "Elegant jewelry box packaging mockup presentation",
      image: Package8,
      fullCover: true,
    },
    {
      title: "Premium Herbal Tea Packaging",
      description: "Premium herbal tea packaging label design",
      image: Package9,
      fullCover: true,
    },
    {
      title: "Cosmetic Dropper Bottle",
      description: "Cosmetic product in dropper bottle with mock-up packaging",
      image: Package10,
      fullCover: true,
    },
    {
      title: "Cosmetic Product Packaging",
      description: "Professional cosmetic product with mock-up packaging",
      image: Package11,
      fullCover: true,
    },
    {
      title: "Pasta Bag Packaging Mockup",
      description: "Professional pasta bag packaging mockup design",
      image: Package12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(ProductPackagingPrintingGallery);
