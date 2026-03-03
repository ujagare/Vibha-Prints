import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaHome, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E65056]/5 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#01334C]/5 blur-3xl"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-[#E65056]/10"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-[#01334C]/10"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="text-center relative z-10 max-w-lg">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <h1 className="text-[150px] md:text-[200px] font-extrabold leading-none select-none">
            <span className="bg-gradient-to-br from-[#E65056] to-[#01334C] bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#01334C] mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(230, 80, 86, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-[#E65056] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaHome />
              Go Home
            </motion.button>
          </Link>

          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 border-2 border-[#01334C] text-[#01334C] rounded-full font-semibold hover:bg-[#01334C] hover:text-white transition-all duration-300"
            >
              <FaEnvelope />
              Contact Us
            </motion.button>
          </Link>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-[#E65056] transition-colors flex items-center gap-2 mx-auto text-sm"
          >
            <FaArrowLeft className="text-xs" />
            Go back to previous page
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
