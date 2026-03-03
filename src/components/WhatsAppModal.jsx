import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaWhatsapp, FaDesktop, FaMobile } from "react-icons/fa";

/**
 * WhatsApp Modal Component
 *
 * Displays a modal window with options to connect to WhatsApp
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when closing the modal
 * @param {string} phoneNumber - WhatsApp phone number to connect to
 * @param {string} message - Optional pre-filled message
 */
const WhatsAppModal = ({
  isOpen,
  onClose,
  phoneNumber = "918625948046",
  message = "",
}) => {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Generate WhatsApp URL for web
  const getWhatsAppWebUrl = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);

    // Use WhatsApp Web URL
    return `https://web.whatsapp.com/send?phone=${cleanPhone}${encodedMessage ? `&text=${encodedMessage}` : ""}`;
  };

  // Generate WhatsApp URL for mobile app
  const getWhatsAppAppUrl = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);

    // Use WhatsApp App URL
    return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
  };

  // Handle opening WhatsApp Web
  const handleOpenWhatsAppWeb = () => {
    window.open(getWhatsAppWebUrl(), "_blank");
    onClose();
  };

  // Handle opening WhatsApp App
  const handleOpenWhatsAppApp = () => {
    window.open(getWhatsAppAppUrl(), "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#25D366] text-white">
              <div className="flex items-center">
                <FaWhatsapp className="mr-2 text-2xl" />
                <h3 className="font-bold">Connect on WhatsApp</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <FaWhatsapp className="text-[#25D366] text-6xl mb-4" />
                <h3 className="text-xl font-bold mb-2 text-center">
                  Choose How to Connect
                </h3>
                <p className="text-gray-600 text-center">
                  Select the option that works best for your device
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* WhatsApp Web Option */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={handleOpenWhatsAppWeb}
                >
                  <FaDesktop className="text-[#25D366] text-3xl mb-3" />
                  <h4 className="font-medium mb-1">WhatsApp Web</h4>
                  <p className="text-xs text-gray-500 text-center">
                    Best for desktop computers
                  </p>
                </motion.button>

                {/* WhatsApp App Option */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={handleOpenWhatsAppApp}
                >
                  <FaMobile className="text-[#25D366] text-3xl mb-3" />
                  <h4 className="font-medium mb-1">WhatsApp App</h4>
                  <p className="text-xs text-gray-500 text-center">
                    Best for mobile devices
                  </p>
                </motion.button>
              </div>

              {/* Message Preview */}
              {message && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Message Preview:
                  </h4>
                  <p className="text-xs text-gray-600 whitespace-pre-line line-clamp-3">
                    {message.length > 150
                      ? `${message.substring(0, 150)}...`
                      : message}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you'll be redirected to WhatsApp to continue
                  the conversation.
                </p>
              </div>
            </div>

            {/* Footer Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppModal;
