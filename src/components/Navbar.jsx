import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { vibha } from "../assets";
import {
  Home as FaHome,
  Info as FaInfo,
  Phone as FaPhone,
  MessageCircle as FaMessageCircle,
  Facebook as FaFacebook,
  Instagram as FaInstagram,
  Linkedin as FaLinkedin,
  BriefcaseBusiness as FaBehanceSquare,
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
    { name: "Home", path: "/", icon: <FaHome size={20} /> },
    { name: "About", path: "/about", icon: <FaInfo size={20} /> },
    { name: "Contact", path: "/contact", icon: <FaPhone size={20} /> },
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

  // Social media links - using component references instead of JSX
  const socialLinks = [
    {
      Icon: FaFacebook,
      url: "https://facebook.com/share/15UZrzzFVz",
      color: "#1877F2",
      ariaLabel: "Facebook",
    },
    {
      Icon: FaBehanceSquare,
      url: "https://behance.net/komaljunghda64",
      color: "#053eff",
      ariaLabel: "Behance",
    },
    {
      Icon: FaInstagram,
      url: "https://instagram.com/vibha_designing",
      color: "#E1306C",
      ariaLabel: "Instagram",
    },
    {
      Icon: FaLinkedin,
      url: "https://linkedin.com/in/vibha-designing-marketing",
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
            : "border-b border-white/80 bg-white/95 shadow-[0_18px_50px_rgba(7,17,36,0.12)]"
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
              <img decoding="async" loading="lazy"
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
                    : "rounded-full border border-[#e2e7f0] bg-white/95 shadow-[0_12px_36px_rgba(7,17,36,0.1)]"
                }`}
              >
                {/* Home */}
                <Link
                  to="/"
                  className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    isDarkPage
                      ? "rounded-none text-white hover:text-[#ff525d]"
                    : location.pathname === "/"
                      ? "rounded-full bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/25"
                      : "rounded-full text-[#071124] hover:bg-[#f4f6fb] hover:text-[#ff525d]"
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
                        ? "rounded-full bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/25"
                        : "rounded-full text-[#071124] hover:bg-[#f4f6fb] hover:text-[#ff525d]"
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
                      ? "rounded-full bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/25"
                      : "rounded-full text-[#071124] hover:bg-[#f4f6fb] hover:text-[#ff525d]"
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Social Media Icons - Right Aligned */}
            <div className="hidden items-center gap-2 lg:flex">
              {socialLinks.map((social, index) => {
                const IconComponent = social.Icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className={`social-icon-link flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-lg ${
                      isDarkPage
                        ? "border-white/35 bg-transparent text-white"
                        : "border-[#e2e7f0] bg-white text-[#536176]"
                    }`}
                    style={{
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 100,
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
                    <IconComponent size={22} />
                  </a>
                );
              })}
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
                className={`nav-mobile-toggle flex h-12 w-12 items-center justify-center rounded-full border text-[#071124] shadow-sm transition-all hover:-translate-y-0.5 hover:text-[#ff525d] focus:outline-none focus:ring-4 focus:ring-[#ff525d]/15 ${
                  isOpen
                    ? "border-[#ff525d]/25 bg-[#fff1f2] shadow-[#ff525d]/10"
                    : "border-[#e2e7f0] bg-white"
                }`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <span
                  className="relative block h-6 w-7"
                  aria-hidden="true"
                >
                  <span
                    className="absolute left-0 top-1/2 block h-0.5 w-7 rounded-full bg-current transition-transform duration-300 ease-out"
                    style={{
                      transform: isOpen
                        ? "translateY(-50%) rotate(45deg)"
                        : "translateY(calc(-50% - 5px)) rotate(0deg)",
                    }}
                  />
                  <span
                    className="absolute left-0 top-1/2 block h-0.5 w-7 rounded-full bg-current transition-transform duration-300 ease-out"
                    style={{
                      transform: isOpen
                        ? "translateY(-50%) rotate(-45deg)"
                        : "translateY(calc(-50% + 5px)) rotate(0deg)",
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close mobile menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[6.5rem] z-40 bg-[#071124]/30 backdrop-blur-[2px] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -28, scaleY: 0.96 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -22, scaleY: 0.96 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 right-0 top-[6.5rem] z-50 origin-top px-3 lg:hidden"
            >
              <div className="mx-auto max-h-[calc(100vh-7.75rem)] max-w-md overflow-y-auto rounded-[1.75rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(7,17,36,0.2)]">
                <div className="border-b border-[#edf1f7] bg-[#f8fafc] px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff525d]">
                    Vibha Prints
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#536176]">
                    Design, printing and digital growth support.
                  </p>
                </div>

                <div className="space-y-2 p-3">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;

                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`group flex min-h-[54px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                          isActive
                            ? "border-[#ff525d] bg-[#ff525d] text-white shadow-lg shadow-[#ff525d]/20"
                            : "border-[#edf1f7] bg-white text-[#071124] shadow-sm hover:border-[#ff525d]/30 hover:bg-[#fff7f8] hover:text-[#ff525d]"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                            isActive
                              ? "bg-white/18 text-white"
                              : "bg-[#f4f6fb] text-[#ff525d] group-hover:bg-white"
                          }`}
                        >
                          {link.icon}
                        </span>
                        <span className="text-base font-black">{link.name}</span>
                      </Link>
                    );
                  })}

                  {/* Services Accordion */}
                  <div className="rounded-2xl border border-[#edf1f7] bg-white shadow-sm">
                    <button
                      onClick={() =>
                        setIsMobileServicesOpen(!isMobileServicesOpen)
                      }
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                        isServicesActive
                          ? "bg-[#fff1f2] text-[#ff525d]"
                          : "text-[#071124] hover:bg-[#fff7f8] hover:text-[#ff525d]"
                      }`}
                      aria-expanded={isMobileServicesOpen}
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#ff525d]/10 text-[#ff525d]">
                        <FaPaintBrush size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-black">
                          Services
                        </span>
                        <span className="block truncate text-xs font-semibold text-[#64748b]">
                          Branding, print, websites and marketing
                        </span>
                      </span>
                      <FaChevronDown
                        className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
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
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 border-t border-[#edf1f7] bg-[#f8fafc] p-2">
                            {serviceLinks.map((service) => {
                              const isActive = location.pathname === service.path;

                              return (
                                <Link
                                  key={service.name}
                                  to={service.path}
                                  className={`group flex items-start gap-3 rounded-xl border px-3 py-3 transition-all ${
                                    isActive
                                      ? "border-[#ff525d]/30 bg-white text-[#ff525d] shadow-sm"
                                      : "border-transparent bg-white/70 text-[#536176] hover:border-[#ff525d]/20 hover:bg-white hover:text-[#ff525d]"
                                  }`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#ff525d]/10 text-[#ff525d] transition-all group-hover:bg-[#ff525d] group-hover:text-white">
                                    {service.icon}
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-black text-[#071124] group-hover:text-[#ff525d]">
                                      {service.name}
                                    </span>
                                    <span className="mt-0.5 block text-xs font-medium leading-5 text-[#64748b]">
                                      {service.description}
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/contact"
                    className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-[#071124] px-4 py-3 text-center text-base font-black text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-[#ff525d] hover:shadow-[#ff525d]/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaMessageCircle size={20} />
                    Start a Project
                  </Link>
                </div>

                {/* Social Media Icons in Mobile Menu */}
                <div className="border-t border-[#edf1f7] px-5 pb-5 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-[#64748b]">
                      Connect with us
                    </p>
                    <div className="flex items-center gap-2">
                      {socialLinks.map((social, index) => {
                        const IconComponent = social.Icon;
                        return (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.ariaLabel}
                            className="social-icon-link flex h-11 w-11 items-center justify-center rounded-full border border-[#e2e7f0] bg-white text-[#536176] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-lg"
                            style={{
                              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                              cursor: "pointer",
                            }}
                            onClick={(e) => e.stopPropagation()}
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
                            <IconComponent size={20} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
