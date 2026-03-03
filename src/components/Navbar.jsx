import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { vibha } from "../assets";
import {
  FaBars,
  FaTimes,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaBehanceSquare,
  FaWhatsapp,
  FaChevronDown,
  FaPaintBrush,
  FaPrint,
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const servicesTimeoutRef = useRef(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const serviceLinks = [
    {
      name: "Graphic Design",
      path: "/graphic-design",
      icon: <FaPaintBrush />,
      description: "Logo, branding & visual identity",
    },
    {
      name: "Printing Services",
      path: "/printing",
      icon: <FaPrint />,
      description: "Business cards, brochures & more",
    },
  ];

  // Social media links
  const socialLinks = [
    {
      icon: <FaWhatsapp size={22} />,
      url: "https://api.whatsapp.com/send?phone=918625948046&text=I%20am%20interested%20in%20your%20services%20please%20call%20back",
      color: "#25D366",
      ariaLabel: "WhatsApp",
    },
    {
      icon: <FaFacebook size={22} />,
      url: "https://www.facebook.com/share/15UZrzzFVz/",
      color: "#1877F2",
      ariaLabel: "Facebook",
    },
    {
      icon: <FaBehanceSquare size={22} />,
      url: "https://www.behance.net/komaljunghda64",
      color: "#053eff",
      ariaLabel: "Behance",
    },
    {
      icon: <FaInstagram size={22} />,
      url: "https://www.instagram.com/vibha_designing?igsh=MTMzMG92YWp0dGE3NA==",
      color: "#E1306C",
      ariaLabel: "Instagram",
    },
    {
      icon: <FaLinkedin size={22} />,
      url: "https://www.linkedin.com/posts/vibha-designing-marketing_unused-logo-design-product-design-sell-activity-7305508738193330176--Tgf?utm_source=share&utm_medium=member_android&rcm=ACoAAB0TP1gBxmfSMwxYuudAITsUFo1JgiXnrlQ",
      color: "#0A66C2",
      ariaLabel: "LinkedIn",
    },
  ];

  // Check if current page is a services sub-page
  const isServicesActive =
    location.pathname === "/graphic-design" ||
    location.pathname === "/printing" ||
    location.pathname.includes("-gallery") ||
    location.pathname.includes("-design-") ||
    location.pathname.includes("-printing-");

  return (
    <>
      {/* Main navbar */}
      <nav className="w-full z-50 py-3 bg-white shadow-md fixed top-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20 relative">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={vibha} alt="Vibha Art Logo" className="h-16 w-auto" />
            </Link>

            {/* Desktop Menu - Center Navigation */}
            <div className="hidden lg:flex items-center justify-center absolute left-0 right-0 mx-auto">
              <div className="flex space-x-12">
                {/* Home */}
                <Link
                  to="/"
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === "/"
                      ? "text-[#E65056]"
                      : "text-gray-800 hover:text-[#E65056]"
                  }`}
                >
                  Home
                </Link>

                {/* Services Dropdown */}
                <div
                  ref={servicesRef}
                  className="relative"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <button
                    className={`text-lg font-medium transition-colors flex items-center gap-1 ${
                      isServicesActive
                        ? "text-[#E65056]"
                        : "text-gray-800 hover:text-[#E65056]"
                    }`}
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                  >
                    Services
                    <FaChevronDown
                      className={`text-xs transition-transform duration-200 ${
                        isServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown */}
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

                        <div className="relative py-2">
                          {serviceLinks.map((service) => (
                            <Link
                              key={service.name}
                              to={service.path}
                              className="flex items-start gap-4 px-5 py-4 hover:bg-gradient-to-r hover:from-[#E65056]/5 hover:to-transparent transition-all duration-200 group"
                              onClick={() => setIsServicesOpen(false)}
                            >
                              <div className="mt-0.5 w-10 h-10 rounded-lg bg-[#E65056]/10 flex items-center justify-center text-[#E65056] group-hover:bg-[#E65056] group-hover:text-white transition-all duration-200 flex-shrink-0">
                                {service.icon}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 group-hover:text-[#E65056] transition-colors">
                                  {service.name}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {service.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* About */}
                <Link
                  to="/about"
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === "/about"
                      ? "text-[#E65056]"
                      : "text-gray-800 hover:text-[#E65056]"
                  }`}
                >
                  About
                </Link>

                {/* Contact */}
                <Link
                  to="/contact"
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === "/contact"
                      ? "text-[#E65056]"
                      : "text-gray-800 hover:text-[#E65056]"
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Social Media Icons - Right Aligned */}
            <div className="hidden lg:flex items-center">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="flex items-center justify-center w-10 h-10 mx-1 rounded-full bg-gray-100 text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  style={{
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = social.color;
                    e.target.style.boxShadow = `0 8px 25px ${social.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "";
                    e.target.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-[#E65056] transition-colors focus:outline-none"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-lg overflow-hidden fixed top-[5.75rem] left-0 right-0 z-40"
          >
            <div className="container mx-auto px-4 py-4 divide-y divide-gray-100">
              <div className="py-3 space-y-1">
                {/* Home */}
                <Link
                  to="/"
                  className={`block py-3 text-center text-lg font-medium ${
                    location.pathname === "/"
                      ? "text-[#E65056]"
                      : "text-gray-800 hover:text-[#E65056]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>

                {/* Services Accordion */}
                <div>
                  <button
                    onClick={() =>
                      setIsMobileServicesOpen(!isMobileServicesOpen)
                    }
                    className={`w-full py-3 text-center text-lg font-medium flex items-center justify-center gap-2 ${
                      isServicesActive
                        ? "text-[#E65056]"
                        : "text-gray-800 hover:text-[#E65056]"
                    }`}
                  >
                    Services
                    <FaChevronDown
                      className={`text-xs transition-transform duration-200 ${
                        isMobileServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-gray-50 rounded-lg mx-4"
                      >
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.name}
                            to={service.path}
                            className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:text-[#E65056] hover:bg-white transition-all"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="text-[#E65056]">
                              {service.icon}
                            </span>
                            <span className="font-medium">{service.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* About */}
                <Link
                  to="/about"
                  className={`block py-3 text-center text-lg font-medium ${
                    location.pathname === "/about"
                      ? "text-[#E65056]"
                      : "text-gray-800 hover:text-[#E65056]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>

                {/* Contact */}
                <Link
                  to="/contact"
                  className={`block py-3 text-center text-lg font-medium ${
                    location.pathname === "/contact"
                      ? "text-[#E65056]"
                      : "text-gray-800 hover:text-[#E65056]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>

                {/* Social Media Icons in Mobile Menu */}
                <div className="pt-6 pb-2 mt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Connect with us
                  </p>
                  <div className="flex items-center justify-center">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.ariaLabel}
                        className="flex items-center justify-center w-12 h-12 mx-2 rounded-full bg-gray-100 text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                        style={{
                          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = social.color;
                          e.target.style.boxShadow = `0 8px 25px ${social.color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "";
                          e.target.style.boxShadow =
                            "0 2px 10px rgba(0,0,0,0.05)";
                        }}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
