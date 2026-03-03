import React from "react";
import { createGalleryTemplate } from "../utils/createGalleryTemplate.jsx";
import withGallerySidebar from "../components/withGallerySidebar";

// Import vinyl and flex printing images
import Vinyl1 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 3.56.36 PM.jpeg";
import Vinyl2 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.40.41 PM.jpeg";
import Vinyl3 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.43.56 PM.jpeg";
import Vinyl4 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.52.53 PM.jpeg";
import Vinyl5 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.53.59 PM (1).jpeg";
import Vinyl6 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.53.59 PM.jpeg";
import Vinyl7 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.54.00 PM (1).jpeg";
import Vinyl8 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.54.00 PM (2).jpeg";
import Vinyl9 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.54.00 PM.jpeg";
import Vinyl10 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.54.56 PM (1).jpeg";
import Vinyl11 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.54.56 PM.jpeg";
import Vinyl12 from "../assets/Printing/vinyl & Flex/WhatsApp Image 2025-06-10 at 4.58.36 PM.jpeg";

const FlexVinylPrintingGallery = createGalleryTemplate({
  title: "Flex & Vinyl Printing Gallery",
  description:
    "High-quality flex and vinyl printing solutions for various applications.",
  category: "Flex & Vinyl Printing",
  items: [
    {
      title: "Professional Vinyl Banner 1",
      description: "High-quality vinyl banner printing for outdoor advertising",
      image: Vinyl1,
      fullCover: true,
    },
    {
      title: "Custom Flex Signage",
      description: "Professional flex signage for business promotion",
      image: Vinyl2,
      fullCover: true,
    },
    {
      title: "Event Backdrop Design",
      description: "Vibrant vinyl backdrop for events and exhibitions",
      image: Vinyl3,
      fullCover: true,
    },
    {
      title: "Outdoor Advertising Banner",
      description: "Large-format flex banner for outdoor campaigns",
      image: Vinyl4,
      fullCover: true,
    },
    {
      title: "Professional Vinyl Display 1",
      description: "Custom vinyl display for retail environments",
      image: Vinyl5,
      fullCover: true,
    },
    {
      title: "Professional Vinyl Display 2",
      description: "Eye-catching vinyl graphics for business promotion",
      image: Vinyl6,
      fullCover: true,
    },
    {
      title: "Trade Show Banner 1",
      description: "Professional flex banner for trade shows and exhibitions",
      image: Vinyl7,
      fullCover: true,
    },
    {
      title: "Trade Show Banner 2",
      description: "High-impact vinyl banner for trade show displays",
      image: Vinyl8,
      fullCover: true,
    },
    {
      title: "Trade Show Banner 3",
      description: "Professional trade show vinyl banner design",
      image: Vinyl9,
      fullCover: true,
    },
    {
      title: "Indoor Vinyl Signage 1",
      description: "Elegant vinyl signage for interior spaces",
      image: Vinyl10,
      fullCover: true,
    },
    {
      title: "Indoor Vinyl Signage 2",
      description: "Professional indoor vinyl display solution",
      image: Vinyl11,
      fullCover: true,
    },
    {
      title: "Custom Vinyl Banner",
      description: "Custom designed vinyl banner for various applications",
      image: Vinyl12,
      fullCover: true,
    },
  ],
});

export default withGallerySidebar(FlexVinylPrintingGallery);
