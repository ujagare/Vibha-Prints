import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import sticker and hangtags printing images
import Sticker1 from "../assets/Printing/Sticker & Hangtags/A Avacado Honey.png";
import Sticker2 from "../assets/Printing/Sticker & Hangtags/B Lavendor Honey.png";
import Sticker3 from "../assets/Printing/Sticker & Hangtags/Beautiful autumn badge collection.jpg";
import Sticker4 from "../assets/Printing/Sticker & Hangtags/Hand drawn floral wedding badges collection.jpg";
import Sticker5 from "../assets/Printing/Sticker & Hangtags/Original Honey.jpg";
import Sticker6 from "../assets/Printing/Sticker & Hangtags/PSD rounded stickers mockup.jpg";
import Sticker7 from "../assets/Printing/Sticker & Hangtags/Pack of christmas sale stickers.jpg";
import Sticker8 from "../assets/Printing/Sticker & Hangtags/Vintage new year 2018  label collection in red.jpg";
import Sticker9 from "../assets/Printing/Sticker & Hangtags/WhatsApp Image 2025-06-09 at 4.26.37 PM.jpeg";
import Sticker10 from "../assets/Printing/Sticker & Hangtags/WhatsApp Image 2025-06-09 at 4.27.01 PM.jpeg";
import Sticker11 from "../assets/Printing/Sticker & Hangtags/WhatsApp Image 2025-06-09 at 4.28.53 PM.jpeg";
import Sticker12 from "../assets/Printing/Sticker & Hangtags/WhatsApp Image 2025-06-09 at 4.29.33 PM.jpeg";

const StickerHangtagsLanyardPrintingGallery = createGalleryTemplate({
  title: "Sticker, Hangtags & Lanyard Printing Gallery",
  description:
    "Versatile printing solutions for stickers, hangtags, and lanyards.",
  category: "Sticker & Hangtags Printing",
  items: [
    {
      title: "Avocado Honey Sticker",
      description: "Premium avocado honey product sticker design",
      image: Sticker1,
      fullCover: true,
    },
    {
      title: "Lavender Honey Sticker",
      description: "Beautiful lavender honey product sticker design",
      image: Sticker2,
      fullCover: true,
    },
    {
      title: "Autumn Badge Collection",
      description: "Beautiful autumn badge collection sticker designs",
      image: Sticker3,
      fullCover: true,
    },
    {
      title: "Floral Wedding Badges",
      description: "Hand drawn floral wedding badges collection",
      image: Sticker4,
      fullCover: true,
    },
    {
      title: "Original Honey Sticker",
      description: "Premium original honey product sticker design",
      image: Sticker5,
      fullCover: true,
    },
    {
      title: "Rounded Stickers Mockup",
      description: "Professional PSD rounded stickers mockup template",
      image: Sticker6,
      fullCover: true,
    },
    {
      title: "Christmas Sale Stickers",
      description: "Festive pack of christmas sale stickers collection",
      image: Sticker7,
      fullCover: true,
    },
    {
      title: "Vintage New Year Labels",
      description: "Vintage new year 2018 label collection in red",
      image: Sticker8,
      fullCover: true,
    },
    {
      title: "Custom Hangtag Design 1",
      description: "Professional custom hangtag printing design",
      image: Sticker9,
      fullCover: true,
    },
    {
      title: "Custom Hangtag Design 2",
      description: "Creative custom hangtag printing solution",
      image: Sticker10,
      fullCover: true,
    },
    {
      title: "Custom Hangtag Design 3",
      description: "Elegant custom hangtag printing template",
      image: Sticker11,
      fullCover: true,
    },
    {
      title: "Custom Hangtag Design 4",
      description: "Modern custom hangtag printing design",
      image: Sticker12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(StickerHangtagsLanyardPrintingGallery);
