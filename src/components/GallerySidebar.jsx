import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaIdCard,
  FaNewspaper,
  FaBox,
  FaDesktop,
  FaImage,
  FaPrint,
  FaTshirt,
  FaEnvelope,
} from "react-icons/fa";

const GallerySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarServices = [
    {
      title: "Business Card Printing",
      icon: FaIdCard,
      route: "/business-card-printing-gallery",
    },
    {
      title: "Pamphlet & Poster Printing",
      icon: FaNewspaper,
      route: "/pamphlet-poster-printing-gallery",
    },
    {
      title: "Brochure & Booklet Printing",
      icon: FaBox,
      route: "/brochure-booklet-printing-gallery",
    },
    {
      title: "Flex & Vinyl Printing",
      icon: FaDesktop,
      route: "/flex-vinyl-printing-gallery",
    },
    {
      title: "Sticker & Hangtags Printing",
      icon: FaPrint,
      route: "/sticker-hangtags-lanyard-printing-gallery",
    },
    {
      title: "Product Packaging Printing",
      icon: FaBox,
      route: "/product-packaging-printing-gallery",
    },
    {
      title: "Corporate Stationary Printing",
      icon: FaEnvelope,
      route: "/corporate-stationary-printing-gallery",
    },
    {
      title: "Bags & T-shirts Printing",
      icon: FaTshirt,
      route: "/bags-tshirts-printing-gallery",
    },
  ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="w-full bg-white h-full">
      <div className="px-4">
        <motion.div
          className="mb-8 pb-4 border-b border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-brand-primary-800">
            Our Printing Services
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Explore our professional printing services
          </p>
        </motion.div>

        <motion.div
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sidebarServices.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden"
            >
              <button
                onClick={() => navigate(service.route)}
                className={`
                  w-full flex items-center p-3 rounded-lg transition-all duration-300
                  ${
                    location.pathname === service.route
                      ? "bg-brand-primary-800 text-white shadow-md"
                      : "bg-white hover:bg-gray-50 text-gray-700 hover:text-brand-primary-800 border border-gray-100 hover:border-brand-primary-200"
                  }
                `}
              >
                <div
                  className={`
                  mr-3 text-lg p-2 rounded-md
                  ${
                    location.pathname === service.route
                      ? "bg-brand-primary-700 text-white"
                      : "bg-gray-50 text-brand-primary-800"
                  }
                `}
                >
                  <service.icon />
                </div>
                <span className="text-sm font-medium">{service.title}</span>

                {location.pathname === service.route && (
                  <motion.div
                    className="ml-auto bg-brand-secondary-500 rounded-full h-2 w-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GallerySidebar;
