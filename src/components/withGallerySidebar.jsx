import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu as FaBars,
  X as FaTimes,
  ChevronRight as FaChevronRight,
} from "lucide-react";
import GallerySidebar from "./GallerySidebar";
import GraphicServicesSidebar from "./GraphicServicesSidebar";
import ServiceCategorySidebar from "./ServiceCategorySidebar";
import { useLocation } from "react-router-dom";

const withGallerySidebar = (WrappedComponent, options = {}) => {
  const { sidebar = "printing", sidebarTitle } = options;

  return function WithGallerySidebarComponent(props) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const SidebarComponent =
      sidebar === "graphic"
        ? GraphicServicesSidebar
        : sidebar === "digitalMarketing" || sidebar === "webDevelopment"
          ? ServiceCategorySidebar
          : GallerySidebar;

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

    const containSidebarScroll = (event) => {
      event.stopPropagation();
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
              className="fixed bottom-0 left-0 top-0 z-50 w-80 bg-[#f8fafc] pt-24 shadow-2xl lg:hidden"
            >
              <div
                className="relative h-full overflow-y-auto overscroll-contain px-4"
                data-lenis-prevent
                onWheelCapture={containSidebarScroll}
                onTouchMoveCapture={containSidebarScroll}
              >
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
                  <SidebarComponent sidebarTitle={sidebarTitle} group={sidebar} />
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

        {/* Main Content Area - Mobile */}
        <motion.div
          className="pt-24 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WrappedComponent {...props} />
        </motion.div>

        {/* Main Content Area - Desktop */}
        <div className="hidden min-h-[calc(100vh-6rem)] pt-24 lg:flex">
          <AnimatePresence initial={false}>
            {isDesktopSidebarOpen && (
              <motion.aside
                className="sticky top-24 h-[calc(100vh-6rem)] w-80 shrink-0 self-start overflow-y-auto overscroll-contain border-r border-[#dfe6f0] bg-[#f8fafc] pt-4 shadow-[18px_0_55px_rgba(7,17,36,0.08)]"
                data-lenis-prevent
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onWheelCapture={containSidebarScroll}
                onTouchMoveCapture={containSidebarScroll}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <motion.div
                  className="mt-10 w-80 p-6 pb-24"
                  animate={{ x: isHovered ? 3 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SidebarComponent sidebarTitle={sidebarTitle} group={sidebar} />
                </motion.div>

                {/* Hover indicator */}
                <motion.div
                  className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-l-md bg-brand-primary-800/10 p-1 text-brand-primary-800 lg:flex"
                  animate={{
                    opacity: isHovered ? 1 : 0.5,
                    x: isHovered ? 0 : 3,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronRight size={12} />
                </motion.div>
              </motion.aside>
            )}
          </AnimatePresence>

          <motion.div
            className={`min-w-0 flex-1 ${isDesktopSidebarOpen ? "" : "pl-16"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WrappedComponent {...props} />
          </motion.div>
        </div>

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
