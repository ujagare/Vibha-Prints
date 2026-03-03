import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaPrint, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Printing = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  const printingCards = [
    {
      title: "Business Card Printing",
      description:
        "Premium business cards with multiple finishes — matte, glossy, spot UV, and embossed options to make a lasting first impression.",
      image:
        "https://images.unsplash.com/photo-1592669666752-a0f9b7ed6b86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      route: "/business-card-printing-gallery",
    },
    {
      title: "Pamphlet & Poster Printing",
      description:
        "Eye-catching pamphlets and posters in all sizes with vivid color reproduction, perfect for events, promotions, and advertisements.",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      route: "/pamphlet-poster-printing-gallery",
    },
    {
      title: "Brochure & Booklet Printing",
      description:
        "Professional brochures and booklets with saddle-stitch or perfect binding, ideal for showcasing your products and services.",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      route: "/brochure-booklet-printing-gallery",
    },
    {
      title: "Flex & Vinyl Printing",
      description:
        "Large-format flex banners and vinyl prints for outdoor and indoor signage, hoardings, and shop displays with weather-resistant inks.",
      image:
        "https://images.unsplash.com/photo-1579621970590-9d0f3e1c5de6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      route: "/flex-vinyl-printing-gallery",
    },
    {
      title: "Sticker, Hangtags & Lanyard Printing",
      description:
        "Custom stickers, product hangtags, and branded lanyards — perfect for packaging, events, and corporate branding needs.",
      image:
        "https://images.unsplash.com/photo-1600857062241-98e5dba1f245?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1398&q=80",
      route: "/sticker-hangtags-lanyard-printing-gallery",
    },
    {
      title: "Product & Packaging Printing",
      description:
        "Stunning product boxes, labels, and packaging materials that enhance your product's appeal and shelf presence.",
      image:
        "https://images.unsplash.com/photo-1579165466741-7a2aaaf6d7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      route: "/product-packaging-printing-gallery",
    },
    {
      title: "Corporate Stationary Printing",
      description:
        "Complete corporate stationary sets including letterheads, envelopes, notepads, and folders that reinforce your brand identity.",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1372&q=80",
      route: "/corporate-stationary-printing-gallery",
    },
    {
      title: "Bags & T-shirts Printing",
      description:
        "Custom printed bags and t-shirts with your logo and designs — great for merchandise, giveaways, and brand promotions.",
      image:
        "https://images.unsplash.com/photo-1601784551446-0c98243a9f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      route: "/bags-tshirts-printing-gallery",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section with Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1693031630369-bd429a57f115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByaW50aW5nJTIwcHJlc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1500&q=80"
            alt="Modern Printing Press Machine"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-800/90 to-brand-primary-800/70"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden"></div>

        {/* Hero Content */}
        <div
          ref={heroRef}
          className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-block px-6 py-2 bg-white text-brand-primary-800 rounded-full text-base font-medium tracking-wide shadow-sm">
                Professional Solutions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Printing{" "}
              <span className="text-brand-secondary-500">Services</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 max-w-2xl"
            >
              High-quality printing solutions for all your business and
              marketing needs.
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
      <div className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Colorful Printing Machine Background"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-brand-primary-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Printing Services
            </motion.h2>
            <motion.p
              className="text-lg text-brand-primary-700 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Explore our comprehensive range of printing services tailored to
              meet your business needs
            </motion.p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {printingCards.map((card, index) => (
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
                  relative
                `}
                  >
                    {/* Card Image with Overlay */}
                    <div className="relative overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className={`
                        w-full h-64 object-cover
                        transition-transform duration-300
                        ${hoveredCard === index ? "scale-110" : "scale-100"}
                      `}
                      />
                      <div
                        className={`
                      absolute inset-0 bg-black bg-opacity-0
                      group-hover:bg-opacity-20
                      transition-all duration-300
                    `}
                      ></div>

                      {/* Icon Badge */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`
                        bg-[#E65056] text-white p-3 rounded-full
                        shadow-lg transform transition-transform
                        ${hoveredCard === index ? "scale-110" : "scale-100"}
                      `}
                        >
                          <FaPrint className="text-xl" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3
                        className={`
                      text-2xl font-bold mb-2
                      transition-colors duration-300
                      ${hoveredCard === index ? "text-brand-primary-800" : "text-gray-800"}
                    `}
                      >
                        {card.title}
                      </h3>

                      <p className="text-gray-600 mb-6">{card.description}</p>

                      {/* Button */}
                      <motion.button
                        className={`
                        w-full py-3 rounded-lg font-semibold
                        text-white transition-all duration-300
                        bg-[#E65056]
                        hover:opacity-90 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-[#E65056]/50 focus:ring-offset-2 focus:ring-opacity-50
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
    </div>
  );
};

export default Printing;
