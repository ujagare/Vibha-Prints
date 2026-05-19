import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { vibha } from "../assets";
import {
  Menu as FaBars,
  X as FaTimes,
  Facebook as FaFacebook,
  Instagram as FaInstagram,
  Linkedin as FaLinkedin,
  BriefcaseBusiness as FaBehanceSquare,
  MessageCircle as FaWhatsapp,
  ChevronDown as FaChevronDown,
  Paintbrush as FaPaintBrush,
  Printer as FaPrint,
  ArrowRight as FaArrowRight,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const servicesTimeoutRef = useRef(null);
  const location = useLocation();
  const isDarkPage = false;

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
    {
      name: "Digital Marketing",
      path: "/digital-marketing",
      icon: <FaBehanceSquare />,
      description: "SEO, social media, ads & growth",
    },
    {
      name: "Web Development",
      path: "/web-development",
      icon: <FaArrowRight />,
      description: "Websites, stores & web apps",
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
    location.pathname === "/digital-marketing" ||
    location.pathname === "/web-development" ||
    location.pathname.startsWith("/services/") ||
    location.pathname.includes("-gallery") ||
    location.pathname.includes("-design-") ||
    location.pathname.includes("-printing-");

  return (
    <>
      {/* Main navbar */}
      <nav
        className={`fixed top-0 z-50 w-full py-3 backdrop-blur-xl ${
          isDarkPage
            ? "border-b border-white/10 bg-[#051225] shadow-none"
            : "border-b border-white/70 bg-white/86 shadow-[0_18px_50px_rgba(7,17,36,0.08)]"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="relative flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className={`group flex flex-shrink-0 items-center px-3 py-2 transition duration-300 hover:-translate-y-0.5 ${
                isDarkPage
                  ? "rounded-none border border-transparent bg-transparent shadow-none"
                  : "rounded-2xl border border-[#edf1f7] bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/80"
              }`}
            >
              <img loading="lazy"
                src={vibha}
                alt="Vibha Art Logo"
                className="h-14 w-auto transition duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            {/* Desktop Menu - Center Navigation */}
            <div className="absolute left-0 right-0 mx-auto hidden items-center justify-center lg:flex">
              <div
                className={`flex items-center gap-2 px-3 py-2 backdrop-blur ${
                  isDarkPage
                    ? "rounded-none border border-transparent bg-transparent shadow-none"
                    : "rounded-full border border-[#e2e7f0] bg-white/82 shadow-[0_12px_36px_rgba(7,17,36,0.07)]"
                }`}
              >
                {/* Home */}
                <Link
                  to="/"
                  className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    isDarkPage
                      ? "rounded-none text-white hover:text-[#ff525d]"
                      : location.pathname === "/"
                      ? "bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/25"
                      : "text-[#071124] hover:bg-[#f4f6fb] hover:text-[#ff525d]"
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
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                      isDarkPage
                        ? "rounded-none text-white hover:text-[#ff525d]"
                        : isServicesActive
                        ? "bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/25"
                        : "text-[#071124] hover:bg-[#f4f6fb] hover:text-[#ff525d]"
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
                        className="absolute left-1/2 top-full z-50 mt-5 w-80 -translate-x-1/2 overflow-hidden rounded-2xl border border-[#e2e7f0] bg-white shadow-[0_24px_70px_rgba(7,17,36,0.14)]"
                      >
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-[#e2e7f0] bg-white"></div>

                        <div className="relative border-b border-[#edf1f7] bg-[#f8fafc] px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff525d]">
                            Our Services
                          </p>
                          <p className="mt-1 text-sm text-[#536176]">
                            Design and print support for growing brands.
                          </p>
                        </div>
                        <div className="relative p-2">
                          {serviceLinks.map((service) => (
                            <Link
                              key={service.name}
                              to={service.path}
                              className="group flex items-start gap-4 rounded-xl px-4 py-4 transition-all duration-200 hover:bg-[#fff3f4]"
                              onClick={() => setIsServicesOpen(false)}
                            >
                              <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#ff525d]/15 bg-[#ff525d]/10 text-[#ff525d] transition-all duration-200 group-hover:bg-[#ff525d] group-hover:text-white">
                                {service.icon}
                              </div>
                              <div>
                                <p className="font-bold text-[#071124] transition-colors group-hover:text-[#ff525d]">
                                  {service.name}
                                </p>
                                <p className="mt-0.5 text-sm text-[#64748b]">
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
                  className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    isDarkPage
                      ? location.pathname === "/about"
                        ? "rounded-none text-[#ff525d] after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-10 after:-translate-x-1/2 after:bg-[#ff525d]"
                        : "rounded-none text-white hover:text-[#ff525d]"
                      : location.pathname === "/about"
                        ? "rounded-full bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/25"
                        : "rounded-full text-[#071124] hover:bg-[#f4f6fb] hover:text-[#ff525d]"
                  }`}
                >
                  {isDarkPage ? "About Us" : "About"}
                </Link>

                {isDarkPage && (
                  <>
                    <Link
                      to="/logo-design-gallery"
                      className="px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:text-[#ff525d]"
                    >
                      Portfolio
                    </Link>
                    <Link
                      to="/#blogs"
                      className="px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:text-[#ff525d]"
                    >
                      Blogs
                    </Link>
                  </>
                )}

                {/* Contact */}
                <Link
                  to="/contact"
                  className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    isDarkPage
                      ? location.pathname === "/contact"
                        ? "rounded-none text-[#ff525d] after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-10 after:-translate-x-1/2 after:bg-[#ff525d]"
                        : "rounded-none text-white hover:text-[#ff525d]"
                      : location.pathname === "/contact"
                      ? "bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/25"
                      : "text-[#071124] hover:bg-[#f4f6fb] hover:text-[#ff525d]"
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Social Media Icons - Right Aligned */}
            <div className="hidden items-center gap-2 lg:flex">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-lg ${
                    isDarkPage
                      ? "border-white/35 bg-transparent text-white"
                      : "border-[#e2e7f0] bg-white text-[#536176]"
                  }`}
                  style={{
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.boxShadow = `0 8px 25px ${social.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.boxShadow =
                      "0 2px 10px rgba(0,0,0,0.05)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
              {isDarkPage && (
                <Link
                  to="/contact"
                  className="ml-8 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#ff525d] px-7 text-sm font-black text-white shadow-lg shadow-[#ff525d]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff6871]"
                >
                  Start Project <FaArrowRight />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e2e7f0] bg-white text-[#071124] shadow-sm transition-all hover:text-[#ff525d] focus:outline-none"
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
            className="fixed left-0 right-0 top-[6.5rem] z-40 overflow-hidden border-b border-[#e2e7f0] bg-white/95 shadow-[0_24px_70px_rgba(7,17,36,0.14)] backdrop-blur-xl lg:hidden"
          >
            <div className="container mx-auto px-4 py-5">
              <div className="space-y-2 rounded-2xl border border-[#edf1f7] bg-[#f8fafc] p-3">
                {/* Home */}
                <Link
                  to="/"
                  className={`block rounded-xl py-3 text-center text-base font-bold transition-all ${
                    location.pathname === "/"
                      ? "bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/20"
                      : "bg-white text-[#071124] hover:text-[#ff525d]"
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
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-base font-bold transition-all ${
                      isServicesActive
                        ? "bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/20"
                        : "bg-white text-[#071124] hover:text-[#ff525d]"
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
                        className="mx-1 mt-2 overflow-hidden rounded-xl border border-[#e2e7f0] bg-white"
                      >
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.name}
                            to={service.path}
                            className="flex items-center gap-3 border-b border-[#edf1f7] px-5 py-3 text-[#536176] transition-all last:border-b-0 hover:bg-[#fff3f4] hover:text-[#ff525d]"
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
                  className={`block rounded-xl py-3 text-center text-base font-bold transition-all ${
                    location.pathname === "/about"
                      ? "bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/20"
                      : "bg-white text-[#071124] hover:text-[#ff525d]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>

                {/* Contact */}
                <Link
                  to="/contact"
                  className={`block rounded-xl py-3 text-center text-base font-bold transition-all ${
                    location.pathname === "/contact"
                      ? "bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/20"
                      : "bg-white text-[#071124] hover:text-[#ff525d]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>

                {/* Social Media Icons in Mobile Menu */}
                <div className="mt-4 border-t border-[#e2e7f0] pb-2 pt-5">
                  <p className="mb-4 text-center text-sm font-semibold text-[#64748b]">
                    Connect with us
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.ariaLabel}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e2e7f0] bg-white text-[#536176] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-lg"
                        style={{
                          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = social.color;
                          e.currentTarget.style.boxShadow = `0 8px 25px ${social.color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "";
                          e.currentTarget.style.boxShadow =
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
