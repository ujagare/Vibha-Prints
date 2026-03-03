import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaChevronRight } from "react-icons/fa";
import GallerySidebar from "./GallerySidebar";
import GraphicServicesSidebar from "./GraphicServicesSidebar";
import { useLocation } from "react-router-dom";

const withGallerySidebar = (WrappedComponent, options = {}) => {
  const { sidebar = "printing", sidebarTitle } = options;

  return function WithGallerySidebarComponent(props) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const SidebarComponent =
      sidebar === "graphic" ? GraphicServicesSidebar : GallerySidebar;

    // Close mobile sidebar when route changes
    useEffect(() => {
      setIsMobileSidebarOpen(false);
    }, [location]);

    const toggleMobileSidebar = () => {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const toggleDesktopSidebar = () => {
      setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
    };

    return (
      <div className="relative min-h-screen bg-white">
        {/* Mobile Sidebar Toggle - Always Visible */}
        <div className="lg:hidden fixed top-24 left-0 z-40">
          <motion.button
            onClick={toggleMobileSidebar}
            className="ml-4 mt-2 text-gray-800 hover:text-brand-primary-600 transition-all duration-300 bg-white shadow-lg p-3 rounded-r-full"
            whileHover={{
              scale: 1.1,
              boxShadow: "0 10px 25px rgba(106, 17, 203, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMobileSidebarOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileSidebarOpen ? (
                <FaTimes className="text-2xl text-brand-primary-600" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-50 lg:hidden pt-24"
            >
              <div className="px-4 overflow-y-auto h-full relative">
                {/* Close Button - Prominent and Visible */}
                <motion.button
                  onClick={toggleMobileSidebar}
                  className="absolute top-4 right-4 z-50 text-brand-primary-600 bg-white shadow-md rounded-full p-2 transition-all duration-300"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 5px 15px rgba(106, 17, 203, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <SidebarComponent sidebarTitle={sidebarTitle} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar Toggle Button */}
        <div className="hidden lg:block fixed top-24 left-0 z-40">
          <motion.button
            onClick={toggleDesktopSidebar}
            className="ml-4 mt-2 text-gray-800 hover:text-brand-primary-600 transition-all duration-300 bg-white shadow-lg p-3 rounded-r-full"
            whileHover={{
              scale: 1.1,
              boxShadow: "0 10px 25px rgba(106, 17, 203, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isDesktopSidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDesktopSidebarOpen ? (
                <FaChevronRight className="text-xl text-brand-primary-600" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Sidebar - Desktop */}
        <AnimatePresence>
          {isDesktopSidebarOpen && (
            <motion.div
              className="hidden lg:block fixed left-0 top-24 bottom-0 w-72 bg-white shadow-lg border-r border-gray-100 pt-4 overflow-y-auto"
              initial={{ x: -72 }}
              animate={{ x: 0 }}
              exit={{ x: -72 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <motion.div
                className="p-6 pb-24 mt-10" // Added extra padding at bottom for scrolling and top for button
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <SidebarComponent sidebarTitle={sidebarTitle} />
              </motion.div>

              {/* Hover indicator */}
              <motion.div
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-brand-primary-800/10 text-brand-primary-800 p-1 rounded-l-md hidden lg:flex items-center justify-center"
                animate={{
                  opacity: isHovered ? 1 : 0.5,
                  x: isHovered ? 0 : 3,
                }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronRight size={12} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <motion.div
          className={`pt-24 lg:pt-24 ${isDesktopSidebarOpen ? "lg:ml-72" : "lg:ml-16"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WrappedComponent {...props} />
        </motion.div>

        {/* Overlay for Mobile Sidebar */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-brand-primary-900 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };
};

export default withGallerySidebar;
