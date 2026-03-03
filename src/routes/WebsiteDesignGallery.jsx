import React from 'react';
import { createGalleryTemplate } from '../utils/createGalleryTemplate.jsx';
import withGallerySidebar from '../components/withGallerySidebar';

const WebsiteDesignGallery = createGalleryTemplate({
  title: "Website Design Gallery",
  description: "Innovative and user-friendly website designs that elevate your online presence.",
  items: [
    { 
      title: "Corporate Websites", 
      description: "Professional and sleek business websites",
      details: [
        "Clean, modern design",
        "Responsive layout",
        "Corporate color scheme",
        "Easy navigation",
        "Professional typography"
      ]
    },
    { 
      title: "E-commerce Platforms", 
      description: "Intuitive and conversion-focused online stores",
      details: [
        "User-friendly product browsing",
        "Secure checkout process",
        "Mobile-responsive design",
        "High-performance loading",
        "Clear product categorization"
      ]
    },
    { 
      title: "Portfolio Websites", 
      description: "Creative personal and professional showcases",
      details: [
        "Elegant gallery layouts",
        "Smooth image transitions",
        "Personal branding elements",
        "Interactive project displays",
        "Responsive design"
      ]
    },
    { 
      title: "Landing Pages", 
      description: "High-converting and visually appealing landing pages",
      details: [
        "Compelling call-to-action",
        "Minimalist design",
        "Fast loading speed",
        "Clear value proposition",
        "Mobile optimization"
      ]
    },
    { 
      title: "Startup Websites", 
      description: "Modern and dynamic websites for emerging businesses",
      details: [
        "Innovative design",
        "Storytelling elements",
        "Interactive animations",
        "Scalable architecture",
        "Vibrant color schemes"
      ]
    },
    { 
      title: "Responsive Design", 
      description: "Mobile-friendly and adaptive web interfaces",
      details: [
        "Cross-device compatibility",
        "Flexible grid layouts",
        "Adaptive typography",
        "Touch-friendly interfaces",
        "Performance optimization"
      ]
    }
  ]
});

export default withGallerySidebar(WebsiteDesignGallery, { 
  sidebar: 'graphic',
  sidebarTitle: 'Our Graphic Services'
});
