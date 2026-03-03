import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const createGalleryTemplate = (config) => {
  const { title, description, items, category = "Design" } = config;

  const GalleryComponent = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index) => {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      setLightboxOpen(false);
      document.body.style.overflow = "auto";
    };

    const [slideDirection, setSlideDirection] = useState(0);

    const nextImage = () => {
      setSlideDirection(1);
      setCurrentImageIndex((prev) =>
        prev === items.length - 1 ? 0 : prev + 1
      );
    };

    const prevImage = () => {
      setSlideDirection(-1);
      setCurrentImageIndex((prev) =>
        prev === 0 ? items.length - 1 : prev - 1
      );
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    React.useEffect(() => {
      if (lightboxOpen) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [lightboxOpen, currentImageIndex]);
    return (
      <div className="w-full bg-white min-h-screen overflow-hidden">
        {/* Soft Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="pattern"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 25 Q25 0 50 25 T100 25"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                  strokeOpacity="0.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-4 text-brand-primary-800 tracking-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h1>

          <div className="text-center mb-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-24 h-1 bg-brand-secondary-500 mx-auto mb-6"
            ></motion.div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group border border-gray-100"
              >
                <div
                  className="w-full h-56 sm:h-64 md:h-72 overflow-hidden relative bg-white border-b border-gray-100"
                  style={{
                    backgroundImage:
                      "radial-gradient(#e1e1e1 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "-10px -10px",
                  }}
                >
                  {item.image ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`w-full h-full transition-transform duration-500 group-hover:scale-105 cursor-pointer ${
                          item.fullCover
                            ? "object-contain object-center p-2"
                            : "object-contain p-6"
                        }`}
                        style={{
                          filter:
                            "contrast(1.15) brightness(1.1) saturate(1.15) sharpen(1px)",
                          imageRendering: "crisp-edges",
                          WebkitImageSmoothing: "high",
                          imageSmoothing: "high",
                        }}
                        onClick={() => openLightbox(index)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      {/* Click overlay for better UX */}
                      <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => openLightbox(index)}
                      ></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                      <div className="text-gray-700 font-bold text-xl sm:text-2xl text-center px-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        {title} {index + 1}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-brand-primary-800 mb-2 truncate group-hover:text-brand-secondary-500 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{category}</span>
                    <button className="text-brand-secondary-500 hover:text-brand-secondary-600 transition-colors duration-300 text-sm font-medium flex items-center">
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-20 py-8 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                {"Copyright"} {new Date().getFullYear()} Vibha Art. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-70 rounded-full p-3 hover:bg-opacity-90 focus:outline-none"
                style={{ zIndex: 1000 }}
                type="button"
              >
                <FaTimes size={20} />
              </button>

              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-70 rounded-full p-3 hover:bg-opacity-90 focus:outline-none"
                style={{ zIndex: 1000 }}
                type="button"
              >
                <FaChevronLeft size={20} />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-70 rounded-full p-3 hover:bg-opacity-90 focus:outline-none"
                style={{ zIndex: 1000 }}
                type="button"
              >
                <FaChevronRight size={20} />
              </button>

              {/* Image Container */}
              <div className="relative w-full h-full flex items-center justify-center p-8 pt-16 pb-32">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{
                      x:
                        slideDirection > 0
                          ? 300
                          : slideDirection < 0
                            ? -300
                            : 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    exit={{
                      x:
                        slideDirection > 0
                          ? -300
                          : slideDirection < 0
                            ? 300
                            : 0,
                      opacity: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.3,
                    }}
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={items[currentImageIndex]?.image}
                      alt={items[currentImageIndex]?.title}
                      className="max-w-[80vw] max-h-[70vh] w-auto h-auto object-contain shadow-2xl rounded-lg"
                      style={{
                        filter: "contrast(1.1) brightness(1.05) saturate(1.1)",
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Image Info - Fixed Position */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-1">
                  {items[currentImageIndex]?.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {items[currentImageIndex]?.description}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  {currentImageIndex + 1} of {items.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-[90vw] overflow-x-auto bg-black bg-opacity-50 p-2 rounded-lg backdrop-blur-sm">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideDirection(index > currentImageIndex ? 1 : -1);
                      setCurrentImageIndex(index);
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? "border-white scale-110"
                        : "border-gray-500 opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return GalleryComponent;
};
