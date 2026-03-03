import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaPalette,
  FaImage,
  FaRegFileAlt,
  FaDesktop,
  FaShapes,
  FaRegIdCard,
  FaGlobe,
  FaShareAlt,
  FaProjectDiagram,
} from "react-icons/fa";

const GraphicServicesSidebar = ({ sidebarTitle = "Our Graphic Services" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const graphicServices = [
    {
      title: "Logo Design",
      icon: FaShapes,
      route: "/logo-design-gallery",
    },
    {
      title: "Business Card Design",
      icon: FaRegIdCard,
      route: "/business-card-design-gallery",
    },
    {
      title: "Brochure & Booklet Design",
      icon: FaRegFileAlt,
      route: "/brochure-booklet-design-gallery",
    },
    {
      title: "Pamphlet & Poster Design",
      icon: FaImage,
      route: "/pamphlet-poster-design-gallery",
    },
    {
      title: "Product Packaging Design",
      icon: FaProjectDiagram,
      route: "/product-packaging-design-gallery",
    },
    {
      title: "Company Profile Design",
      icon: FaDesktop,
      route: "/company-profile-design-gallery",
    },
    {
      title: "Corporate Identity Design",
      icon: FaPalette,
      route: "/corporate-identity-design-gallery",
    },
    {
      title: "Social Media Design",
      icon: FaShareAlt,
      route: "/social-media-design-gallery",
    },
    {
      title: "Website Design",
      icon: FaGlobe,
      route: "/website-design-gallery",
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
            {sidebarTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Explore our professional design services
          </p>
        </motion.div>

        <motion.div
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {graphicServices.map((service, index) => (
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

        {/* Contact CTA */}
        <motion.div
          className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-brand-primary-800 mb-2">
            Need Custom Design?
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Contact us for personalized design solutions tailored to your needs.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="w-full py-2 bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white text-sm font-medium rounded transition-colors duration-300"
          >
            Get in Touch
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default GraphicServicesSidebar;
