import React from 'react';
import { createGalleryTemplate } from '../utils/createGalleryTemplate.jsx';
import withGallerySidebar from '../components/withGallerySidebar';

const MagazinePrintingGallery = createGalleryTemplate({
  title: "Magazine Printing Gallery",
  description: "Professional magazine printing with stunning design and quality.",
  items: [
    { title: "Corporate Magazine", description: "Elegant corporate publication design" },
    { title: "Fashion Magazine", description: "High-end fashion and lifestyle magazine" },
    { title: "Educational Journal", description: "Academic and research publication design" },
    { title: "Travel Magazine", description: "Vibrant and inspiring travel publication" },
    { title: "Art & Culture Magazine", description: "Creative and visually rich cultural magazine" },
    { title: "Technology Review", description: "Modern and sleek tech industry publication" }
  ]
});

export default withGallerySidebar(MagazinePrintingGallery);
