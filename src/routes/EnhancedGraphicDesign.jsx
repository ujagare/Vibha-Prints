import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/Logo/Logo_9 (1).jpg";
import bussness from "../assets/Visiting Card/11506671.jpg";
import brochureImage from "../assets/Brouchers/Brochure_2.jpg";
import pamphletImage from "../assets/Pamphlet/Blue and Yellow Modern Digital Marketing Flyer (1).jpg";
import packagingImage from "../assets/Packeging/Almond Oil Packege.jpg";
import companyProfileImage from "../assets/Comoany Profile/WhatsApp Image 2025-06-07 at 3.43.50 PM.jpeg";
import socialMediaImage from "../assets/Social Media/WhatsApp Image 2025-06-07 at 4.18.18 PM.jpeg";
import corporateImage from "../assets/Corporate/Corporate-Brand-Identity-Stationery-Templates.webp";
import {
  FaPalette,
  FaImage,
  FaDesktop,
  FaSearchPlus,
  FaIdCard,
  FaBox,
  FaEnvelope,
  FaNewspaper,
  FaArrowRight,
} from "react-icons/fa";

const EnhancedGraphicDesign = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const graphicDesignCards = [
    {
      title: "Logo Design",
      description:
        "Create unique and memorable brand identities that stand out in the market.",
      image: LogoImage,
      icon: FaPalette,
      color: "bg-brand-primary-800",
      route: "/logo-design-gallery",
    },
    {
      title: "Business Cards",
      description:
        "Design professional and creative business cards that leave a lasting impression.",
      image: bussness,
      icon: FaIdCard,
      color: "bg-brand-secondary-500",
      route: "/business-card-design-gallery",
    },
    {
      title: "Brochure & Booklet Design",
      description:
        "Craft compelling brochures that effectively communicate your brand message.",
      image: brochureImage,
      icon: FaNewspaper,
      color: "bg-brand-primary-800",
      route: "/brochure-booklet-design-gallery",
    },
    {
      title: "Pamphlet & Poster Design",
      description:
        "Create informative and visually appealing pamphlets for your marketing needs.",
      image: pamphletImage,
      icon: FaBox,
      color: "bg-brand-secondary-500",
      route: "/pamphlet-poster-design-gallery",
    },
    {
      title: "Product Packaging Design",
      description:
        "Design eye-catching leaflets that grab attention and convey your message.",
      image: packagingImage,
      icon: FaDesktop,
      color: "bg-brand-primary-800",
      route: "/product-packaging-design-gallery",
    },
    {
      title: "Company Profile Design",
      description:
        "Design innovative packaging that enhances your product's visual appeal.",
      image: companyProfileImage,
      icon: FaBox,
      color: "bg-brand-secondary-500",
      route: "/company-profile-design-gallery",
    },
    {
      title: "Social Media Design",
      description:
        "Create engaging social media graphics that boost your online presence.",
      image: socialMediaImage,
      icon: FaImage,
      color: "bg-brand-primary-800",
      route: "/social-media-design-gallery",
    },
    {
      title: "Corporate Identity",
      description:
        "Design a cohesive corporate identity that reflects your brand's essence.",
      image: corporateImage,
      icon: FaPalette,
      color: "bg-brand-secondary-500",
      route: "/corporate-identity-design-gallery",
    },
    {
      title: "Website Design",
      description:
        "Create stunning, functional websites that captivate and convert.",
      image:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      icon: FaEnvelope,
      color: "bg-brand-primary-800",
      route: "/website-design-gallery",
    },
  ];

  return (
    <div className="w-full h-full bg-white relative overflow-hidden object-cover">
      {/* Hero Section with Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Graphic Design Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-800/90 to-brand-primary-800/70"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <svg
            className="absolute top-0 right-0 h-full w-1/2 text-white/5"
            viewBox="0 0 500 500"
            preserveAspectRatio="none"
          >
            <circle cx="400" cy="100" r="100" />
            <circle cx="450" cy="250" r="70" />
            <circle cx="350" cy="350" r="120" />
            <circle cx="200" cy="450" r="50" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-block px-6 py-2 bg-white text-brand-primary-800 rounded-full text-base font-medium tracking-wide shadow-sm">
                Creative Solutions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Graphic Design{" "}
              <span className="text-brand-secondary-500">Services</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 max-w-2xl"
            >
              Transform your brand with our professional design solutions
              tailored to your unique needs.
            </motion.p>
          </div>
        </div>

        {/* Bottom Wave Shape */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto fill-white"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 text-brand-primary-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Design Expertise
          </motion.h2>
          <motion.p
            className="text-lg text-brand-primary-700 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explore our comprehensive range of graphic design services tailored
            to elevate your brand presence
          </motion.p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          <AnimatePresence>
            {graphicDesignCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`
                  bg-white rounded-2xl overflow-hidden shadow-lg
                  transform transition-all duration-300
                  ${hoveredCard === index ? "scale-105 shadow-2xl" : "scale-100"}
                  relative w-full
                `}
                >
                  {/* Card Image with Overlay */}
                  <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`
                        w-full h-full object-contain object-center p-2
                        transition-transform duration-300
                        ${hoveredCard === index ? "scale-105" : "scale-100"}
                      `}
                      style={{
                        filter: "contrast(1.1) brightness(1.05) saturate(1.1)",
                        imageRendering: "crisp-edges",
                        WebkitImageSmoothing: "high",
                        imageSmoothing: "high",
                      }}
                    />
                    <div
                      className={`
                      absolute inset-0 bg-black bg-opacity-0
                      group-hover:bg-opacity-10
                      transition-all duration-300
                    `}
                    ></div>

                    {/* Icon */}
                    <div className="absolute top-4 right-4">
                      {React.createElement(card.icon, {
                        className: `
                          text-2xl text-white
                          ${card.color} rounded-full p-2
                          shadow-lg transform transition-transform
                          ${hoveredCard === index ? "scale-110" : "scale-100"}
                        `,
                      })}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3
                      className={`
                      text-2xl font-bold mb-4
                      transition-colors duration-300
                      ${hoveredCard === index ? "text-brand-primary-800" : "text-gray-800"}
                    `}
                    >
                      {card.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {card.description}
                    </p>

                    {/* Button */}
                    <motion.button
                      className={`
                        w-full py-3 rounded-lg font-semibold
                        text-white transition-all duration-300
                        bg-brand-secondary-500
                        hover:opacity-90 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-brand-secondary-300 focus:ring-offset-2 focus:ring-opacity-50
                        flex items-center justify-center
                        ${hoveredCard === index ? "scale-105" : "scale-100"}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(card.route)}
                    >
                      Explore More
                      <FaArrowRight className="ml-2" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGraphicDesign;
