/**
 * seoConfig.js – vibhaprints.com SEO Configuration
 * Sabhi pages ki SEO settings aur Schema data
 * 
 * ⚠️  Phone number, address, social links update karein!
 */

export const SITE_CONFIG = {
  "site_url": "https://www.vibhaprints.com",
  "site_name": "Vibha Art",
  "site_tagline": "Creative Design & Printing Services",
  "city": "Pune",
  "state": "Maharashtra",
  "state_code": "MH",
  "country": "IN",
  "zip": "411001",
  "phone": "+91-8624948046",
  "email": "info@vibhaprints.com",
  "address": "Pune, Maharashtra, India",
  "latitude": "18.5204",
  "longitude": "73.8567",
  "gtm_id": "GTM-P4KGHLM6",
  "og_image": "https://www.vibhaprints.com/assets/vibha-og.webp",
  "twitter_handle": "@vibhaprints",
  "fb_app_id": "",
  "founded_year": "2018",
  "price_range": "₹₹",
  "languages": [
    "en",
    "hi"
  ]
};

export const SEO_PAGES = {
  "home": {
    "path": "/",
    "title": "Graphic Design & Printing Services in Pune | Vibha Art",
    "description": "Vibha Art – Pune ki leading graphic design & printing company. Logo design, banner printing, branding, business cards, brochures. ✓ Fast Delivery ✓ Affordable Prices. Call now!",
    "keywords": "graphic design pune, printing services pune, logo design pune, branding agency pune, banner printing pune",
    "h1": "Professional Graphic Design & Printing Services in Pune",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": [
          "LocalBusiness",
          "DesignAgency"
        ],
        "@id": "https://www.vibhaprints.com/#business",
        "name": "Vibha Art",
        "alternateName": "Vibha Prints",
        "description": "Vibha Art – Pune ki leading graphic design & printing company. Logo design, banner printing, branding, business cards, brochures. ✓ Fast Delivery ✓ Affordable Prices. Call now!",
        "url": "https://www.vibhaprints.com",
        "telephone": "+91-8624948046",
        "email": "info@vibhaprints.com",
        "foundingDate": "2018",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pune",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN",
          "postalCode": "411001",
          "streetAddress": "Pune, Maharashtra, India"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "18.5204",
          "longitude": "73.8567"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:00",
            "closes": "19:00"
          }
        ],
        "image": "https://www.vibhaprints.com/assets/vibha-og.webp",
        "logo": "https://www.vibhaprints.com/assets/logo.png",
        "sameAs": [
          "https://www.instagram.com/vibhaprints",
          "https://www.facebook.com/vibhaprints",
          "https://www.linkedin.com/company/vibhaprints"
        ],
        "hasMap": "https://maps.google.com/?q=18.5204,73.8567",
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        },
        "serviceType": [
          "Graphic Design",
          "Logo Design",
          "Large Format Printing",
          "Business Card Printing",
          "Brochure Design",
          "Branding Services"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://www.vibhaprints.com/#organization",
        "name": "Vibha Art",
        "url": "https://www.vibhaprints.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.vibhaprints.com/assets/logo.png",
          "width": 200,
          "height": 60
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-8624948046",
          "contactType": "customer service",
          "availableLanguage": [
            "English",
            "Hindi",
            "Marathi"
          ]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://www.vibhaprints.com/#website",
        "url": "https://www.vibhaprints.com",
        "name": "Vibha Art",
        "description": "Creative Design & Printing Services",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.vibhaprints.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": [
          "en-IN",
          "hi-IN"
        ]
      }
    ]
  },
  "services": {
    "path": "/services",
    "title": "Our Services – Logo, Branding & Printing | Vibha Art Pune",
    "description": "Complete design & printing solutions in Pune: logo design, large format printing, business cards, brochures, flex banners & more. Get instant quote!",
    "keywords": "design services pune, printing services pune, logo design, banner printing, brochure design pune",
    "h1": "Our Design & Printing Services in Pune",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://www.vibhaprints.com/services#service",
        "name": "Our Design & Printing Services in Pune",
        "description": "Complete design & printing solutions in Pune: logo design, large format printing, business cards, brochures, flex banners & more. Get instant quote!",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.vibhaprints.com/#business",
          "name": "Vibha Art"
        },
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        },
        "url": "https://www.vibhaprints.com/services"
      }
    ]
  },
  "logo-design": {
    "path": "/services/logo-design",
    "title": "Logo Design in Pune – Professional Brand Identity | Vibha Art",
    "description": "Custom logo design for startups & businesses in Pune. Unique, memorable brand identity that stands out. Affordable pricing. Get free consultation today!",
    "keywords": "logo design pune, logo designer pune, brand identity pune, custom logo pune, startup logo pune",
    "h1": "Professional Logo Design in Pune",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://www.vibhaprints.com/services/logo-design#service",
        "name": "Professional Logo Design in Pune",
        "description": "Custom logo design for startups & businesses in Pune. Unique, memorable brand identity that stands out. Affordable pricing. Get free consultation today!",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.vibhaprints.com/#business",
          "name": "Vibha Art"
        },
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        },
        "url": "https://www.vibhaprints.com/services/logo-design"
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does logo design cost in Pune?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Logo design prices in Pune vary based on complexity. Vibha Art offers affordable logo packages starting from basic to premium. Contact us for a custom quote."
            }
          },
          {
            "@type": "Question",
            "name": "What is the turnaround time for printing services in Pune?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standard turnaround at Vibha Art is 2-3 business days. Express same-day or next-day printing is available for urgent orders."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide design services for startups?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Vibha Art specializes in helping startups and small businesses with complete branding solutions including logo, business cards, brochures, and more."
            }
          }
        ]
      }
    ]
  },
  "large-format-printing": {
    "path": "/services/large-format-printing",
    "title": "Large Format Printing in Pune – Banners, Flex, Hoardings | Vibha Art",
    "description": "High-quality large format printing in Pune: flex banners, hoardings, standees, backlit displays & more. Fast turnaround. Order now for best prices!",
    "keywords": "large format printing pune, banner printing pune, flex printing pune, hoarding printing pune, standee printing pune",
    "h1": "Large Format Printing Services in Pune",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://www.vibhaprints.com/services/large-format-printing#service",
        "name": "Large Format Printing Services in Pune",
        "description": "High-quality large format printing in Pune: flex banners, hoardings, standees, backlit displays & more. Fast turnaround. Order now for best prices!",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.vibhaprints.com/#business",
          "name": "Vibha Art"
        },
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        },
        "url": "https://www.vibhaprints.com/services/large-format-printing"
      }
    ]
  },
  "business-cards": {
    "path": "/services/business-cards",
    "title": "Business Card Printing in Pune – Premium Quality | Vibha Art",
    "description": "Premium business card printing in Pune. Custom designs, UV coating, matte & glossy finishes. Minimum 100 cards. Same-day design available!",
    "keywords": "business card printing pune, visiting card printing pune, custom business cards pune, visiting card design pune",
    "h1": "Business Card Design & Printing in Pune",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://www.vibhaprints.com/services/business-cards#service",
        "name": "Business Card Design & Printing in Pune",
        "description": "Premium business card printing in Pune. Custom designs, UV coating, matte & glossy finishes. Minimum 100 cards. Same-day design available!",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.vibhaprints.com/#business",
          "name": "Vibha Art"
        },
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        },
        "url": "https://www.vibhaprints.com/services/business-cards"
      }
    ]
  },
  "brochure-design": {
    "path": "/services/brochure-design",
    "title": "Brochure Design & Printing Pune – Tri-fold, Bi-fold | Vibha Art",
    "description": "Professional brochure design and printing in Pune. Tri-fold, bi-fold, Z-fold designs for your business. Affordable bulk printing. Request quote!",
    "keywords": "brochure design pune, brochure printing pune, tri-fold brochure pune, pamphlet design pune, leaflet printing pune",
    "h1": "Brochure Design & Printing in Pune",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://www.vibhaprints.com/services/brochure-design#service",
        "name": "Brochure Design & Printing in Pune",
        "description": "Professional brochure design and printing in Pune. Tri-fold, bi-fold, Z-fold designs for your business. Affordable bulk printing. Request quote!",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.vibhaprints.com/#business",
          "name": "Vibha Art"
        },
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        },
        "url": "https://www.vibhaprints.com/services/brochure-design"
      }
    ]
  },
  "portfolio": {
    "path": "/portfolio",
    "title": "Design Portfolio – Vibha Art | Creative Work Samples Pune",
    "description": "View Vibha Art's portfolio of logo designs, branding projects & print materials. Trusted by 100+ clients in Pune. See our creative work!",
    "keywords": "design portfolio pune, logo portfolio pune, branding portfolio, printing samples pune, vibha art work",
    "h1": "Our Creative Portfolio",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Our Creative Portfolio",
        "description": "View Vibha Art's portfolio of logo designs, branding projects & print materials. Trusted by 100+ clients in Pune. See our creative work!",
        "url": "https://www.vibhaprints.com/portfolio"
      }
    ]
  },
  "about": {
    "path": "/about",
    "title": "About Vibha Art – Pune's Creative Design Studio",
    "description": "Meet the team behind Vibha Art. Years of design excellence in Pune. Passionate about branding & print. Learn our story and values.",
    "keywords": "about vibha art, vibha art pune, design studio pune, graphic design company pune, printing company pune",
    "h1": "About Vibha Art – Pune's Creative Design Studio",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://www.vibhaprints.com/#organization",
        "name": "Vibha Art",
        "url": "https://www.vibhaprints.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.vibhaprints.com/assets/logo.png",
          "width": 200,
          "height": 60
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-8624948046",
          "contactType": "customer service",
          "availableLanguage": [
            "English",
            "Hindi",
            "Marathi"
          ]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Vibha",
        "jobTitle": "Creative Director",
        "worksFor": {
          "@type": "Organization",
          "@id": "https://www.vibhaprints.com/#organization"
        }
      }
    ]
  },
  "contact": {
    "path": "/contact",
    "title": "Contact Vibha Art – Design & Printing Studio, Pune",
    "description": "Get in touch with Vibha Art for graphic design & printing services. Visit us in Pune or call +91-8624948046. Quick response guaranteed!",
    "keywords": "contact vibha art, vibha art pune contact, printing services contact pune, graphic designer contact pune",
    "h1": "Contact Vibha Art",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": [
          "LocalBusiness",
          "DesignAgency"
        ],
        "@id": "https://www.vibhaprints.com/#business",
        "name": "Vibha Art",
        "alternateName": "Vibha Prints",
        "description": "Get in touch with Vibha Art for graphic design & printing services. Visit us in Pune or call +91-8624948046. Quick response guaranteed!",
        "url": "https://www.vibhaprints.com",
        "telephone": "+91-8624948046",
        "email": "info@vibhaprints.com",
        "foundingDate": "2018",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pune",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN",
          "postalCode": "411001",
          "streetAddress": "Pune, Maharashtra, India"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "18.5204",
          "longitude": "73.8567"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:00",
            "closes": "19:00"
          }
        ],
        "image": "https://www.vibhaprints.com/assets/vibha-og.webp",
        "logo": "https://www.vibhaprints.com/assets/logo.png",
        "sameAs": [
          "https://www.instagram.com/vibhaprints",
          "https://www.facebook.com/vibhaprints",
          "https://www.linkedin.com/company/vibhaprints"
        ],
        "hasMap": "https://maps.google.com/?q=18.5204,73.8567",
        "areaServed": {
          "@type": "City",
          "name": "Pune"
        },
        "serviceType": [
          "Graphic Design",
          "Logo Design",
          "Large Format Printing",
          "Business Card Printing",
          "Brochure Design",
          "Branding Services"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Vibha Art – Design & Printing Studio, Pune",
        "url": "https://www.vibhaprints.com/contact"
      }
    ]
  },
  "blog": {
    "path": "/blog",
    "title": "Design & Printing Tips Blog | Vibha Art Pune",
    "description": "Expert tips on graphic design, printing, branding & more. Learn from Vibha Art's design professionals in Pune.",
    "keywords": "design tips pune, printing guide, logo design tips, branding tips, graphic design blog india",
    "h1": "Design & Printing Blog",
    "og_type": "website",
    "schemas": [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Design & Printing Tips Blog | Vibha Art Pune",
        "description": "Expert tips on graphic design, printing, branding & more. Learn from Vibha Art's design professionals in Pune.",
        "url": "https://www.vibhaprints.com/blog",
        "publisher": {
          "@type": "Organization",
          "@id": "https://www.vibhaprints.com/#organization"
        }
      }
    ]
  }
};

export const KEYWORDS = {
  "primary": [
    "graphic design services pune",
    "printing services pune",
    "logo design pune",
    "branding agency pune",
    "large format printing pune",
    "business card printing pune"
  ],
  "long_tail": [
    "logo design service near me pune",
    "banner printing pune cheap",
    "visiting card design printing pune",
    "flex printing services pune",
    "brochure design and printing pune",
    "custom stationery design pune",
    "affordable logo design india",
    "packaging design pune",
    "graphic designer near me",
    "best printing shop pune"
  ],
  "hindi_hinglish": [
    "pune mein printing service",
    "logo design kaise karein",
    "banner print near me",
    "graphic designer near me"
  ],
  "local_modifiers": [
    "near me",
    "in pune",
    "pune",
    "maharashtra",
    "pimpri",
    "chinchwad",
    "hadapsar",
    "kothrud",
    "viman nagar"
  ]
};
