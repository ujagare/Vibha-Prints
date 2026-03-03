import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaintBrush,
  FaPrint,
  FaArrowRight,
  FaBehanceSquare,
} from "react-icons/fa";
import { vibha } from "../assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Footer links
  const footerLinks = {
    services: [
      { name: "Graphic Design", path: "/graphic-design" },
      { name: "Printing Services", path: "/printing" },
      { name: "Logo Design", path: "/logo-design-gallery" },
      { name: "Business Cards", path: "/business-card-design-gallery" },
      {
        name: "Brochures & Booklets",
        path: "/brochure-booklet-design-gallery",
      },
    ],
    company: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Testimonials", path: "/#testimonials" },
    ],
    contact: [
      { icon: <FaPhone />, text: "+91 86259 48046", link: "tel:+918624948046" },
      {
        icon: <FaEnvelope />,
        text: "vibhart07@gmail.com",
        link: "mailto:vibhart07@gmail.com",
      },
      {
        icon: <FaMapMarkerAlt />,
        text: "Pune, India",
        link: "https://maps.google.com",
      },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Logo and About */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <img
                src={vibha}
                alt="Vibha Art Logo"
                className="h-16 w-auto object-contain mb-4"
              />
              <p className="text-gray-300 mb-6">
                Professional graphic design and printing services to elevate
                your brand identity.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/15UZrzzFVz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#E65056] transition-colors"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://www.behance.net/komaljunghda64"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#E65056] transition-colors"
                >
                  <FaBehanceSquare size={20} />
                </a>
                <a
                  href="https://www.instagram.com/vibha_designing?igsh=MTMzMG92YWp0dGE3NA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#E65056] transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/posts/vibha-designing-marketing_unused-logo-design-product-design-sell-activity-7305508738193330176--Tgf?utm_source=share&utm_medium=member_android&rcm=ACoAAB0TP1gBxmfSMwxYuudAITsUFo1JgiXnrlQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#E65056] transition-colors"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <FaPaintBrush className="mr-2 text-[#E65056]" /> Our Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center"
                  >
                    <FaArrowRight className="mr-2 text-xs text-[#E65056]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <FaPrint className="mr-2 text-[#E65056]" /> Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all flex items-center"
                  >
                    <FaArrowRight className="mr-2 text-xs text-[#E65056]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              {footerLinks.contact.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <span className="mr-3 text-[#E65056]">{item.icon}</span>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 bg-[#E65056] text-white rounded-full hover:shadow-lg hover:shadow-[#E65056]/20 transition-all"
              >
                Get in Touch <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Vibha Art. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/sitemap"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
