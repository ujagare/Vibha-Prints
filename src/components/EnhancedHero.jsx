import React, { useRef, useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { FaPaintBrush, FaPrint, FaArrowRight, FaRocket } from "react-icons/fa";
import {
  FiBox,
  FiCircle,
  FiHexagon,
  FiEye,
  FiPackage,
  FiLayers,
  FiTarget,
  FiCrosshair,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./EnhancedHero.css";
import AnimatedButton from "./AnimatedButton";
import ParallaxEffect from "./ParallaxEffect";
import Testimonials from "./Testimonials";
import ProcessSection from "./ProcessSection";
import { LandingAccordionItem } from "./ui/interactive-image-accordion";
import VibhaBrochurePdf from "../assets/Brouchers/Vibha_Printing Media.pdf";
import heroSlideOne from "../assets/vibha contact1.png";
import heroSlideTwo from "../assets/vibha contact2.png";
import heroSlideThree from "../assets/vibha contact.png";
import { submitBrochureLead } from "../services/supabaseLeadService";

const pngLogoModules = import.meta.glob("../assets/png logos/*.png", {
  eager: true,
  import: "default",
});

const formatLogoName = (path) =>
  path
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() ?? "Brand logo";

const ServiceCard = ({ title, description, icon, link, image }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.8,
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(106, 17, 203, 0.15)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      className="modern-card h-auto min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-primary-900/50"></div>
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg">
          <div className="text-xl sm:text-2xl text-brand-primary-600">{icon}</div>
        </div>
      </div>
      <div className="p-5 sm:p-6 lg:p-8 flex-grow flex flex-col justify-between bg-white rounded-b-xl">
        <div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">{title}</h3>
          <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>
        <AnimatedButton to={link} variant="primary" icon={<FaArrowRight />}>
          Learn More
        </AnimatedButton>
      </div>
    </motion.div>
  );
};

const EnhancedHero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroSlides = [
    {
      title: "Creative Design Solutions",
      description:
        "Transform your vision into a powerful brand identity that resonates with your audience",
      image: heroSlideOne,
    },
    {
      title: "Professional Printing Services",
      description:
        "High-quality printing solutions for all your marketing and branding needs",
      image: heroSlideTwo,
    },
    {
      title: "Comprehensive Branding",
      description:
        "End-to-end branding solutions to establish a strong market presence",
      image: heroSlideThree,
    },
  ];

  const trustedBrands = [
    { name: "TechFlow", icon: FiBox, gradient: "from-blue-600 to-indigo-700" },
    {
      name: "Nexus Labs",
      icon: FiCircle,
      gradient: "from-emerald-600 to-teal-700",
    },
    {
      name: "DataSync",
      icon: FiHexagon,
      gradient: "from-purple-600 to-violet-700",
    },
    {
      name: "VisionCorp",
      icon: FiEye,
      gradient: "from-orange-600 to-red-700",
    },
    {
      name: "CloudBase",
      icon: FiPackage,
      gradient: "from-cyan-600 to-blue-700",
    },
    {
      name: "InnovateTech",
      icon: FiLayers,
      gradient: "from-pink-600 to-rose-700",
    },
    {
      name: "FlowState",
      icon: FiCrosshair,
      gradient: "from-amber-600 to-orange-700",
    },
    {
      name: "CoreGrid",
      icon: FiTarget,
      gradient: "from-lime-600 to-green-700",
    },
  ];

  const trustedBrandPngLogos = useMemo(
    () =>
      Object.entries(pngLogoModules)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([path, src]) => ({
          name: formatLogoName(path),
          src,
        })),
    [],
  );

  const firstLogoRow = useMemo(() => {
    if (trustedBrandPngLogos.length <= 1) return trustedBrandPngLogos;
    const midpoint = Math.ceil(trustedBrandPngLogos.length / 2);
    return trustedBrandPngLogos.slice(0, midpoint);
  }, [trustedBrandPngLogos]);

  const secondLogoRow = useMemo(() => {
    if (trustedBrandPngLogos.length <= 1) return trustedBrandPngLogos;
    const midpoint = Math.ceil(trustedBrandPngLogos.length / 2);
    return trustedBrandPngLogos.slice(midpoint);
  }, [trustedBrandPngLogos]);

  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureForm, setBrochureForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isBrochureModalOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isBrochureModalOpen]);

  const handleBrochureInputChange = (event) => {
    const { name, value } = event.target;
    setBrochureForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeBrochureModal = () => {
    setIsBrochureModalOpen(false);
    setFormError("");
  };

  const handleBrochureSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!brochureForm.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!emailRegex.test(brochureForm.email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!brochureForm.phone.trim()) {
      setFormError("Please enter your phone number.");
      return;
    }

    try {
      await submitBrochureLead({
        name: brochureForm.name.trim(),
        email: brochureForm.email.trim(),
        phone: brochureForm.phone.trim(),
        company: brochureForm.company.trim(),
        brochure_name: "Vibha_Printing Media",
        source: "hero-download-brochure",
      });
    } catch (error) {
      // Download should still work even if lead capture fails.
      console.error("Brochure lead save failed:", error);
    }

    const link = document.createElement("a");
    link.href = VibhaBrochurePdf;
    link.download = "Vibha_Printing Media.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setBrochureForm({
      name: "",
      email: "",
      phone: "",
      company: "",
    });
    closeBrochureModal();
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Interactive Accordion Hero Section */}
      <LandingAccordionItem />

      {/* Trusted Brands Section */}
      <section className="relative z-10 py-10 sm:py-12 md:py-16 bg-gradient-to-br from-white via-brand-primary-50 to-white overflow-hidden">
        <div className="relative w-full max-w-full">
          <motion.div
            className="text-center mb-6 sm:mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm sm:text-base font-medium text-brand-primary-600">
              TRUSTED BY LEADING BRANDS
            </p>
          </motion.div>
          <div className="relative overflow-hidden w-full max-w-full">
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-brand-primary-50 via-brand-primary-50/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-brand-primary-50 via-brand-primary-50/80 to-transparent z-10 pointer-events-none"></div>
            {trustedBrandPngLogos.length > 0 ? (
              <div className="py-2 space-y-3 sm:space-y-4">
                <div className="hero-trusted-ticker-track flex items-center gap-6 sm:gap-8">
                  {[...firstLogoRow, ...firstLogoRow].map((brand, index) => (
                    <div
                      key={`row1-${brand.name}-${index}`}
                      className="shrink-0 flex items-center justify-center h-16 w-40 sm:h-20 sm:w-52"
                    >
                      <img
                        src={brand.src}
                        alt={brand.name}
                        className="max-h-10 sm:max-h-14 w-auto object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                <div className="hero-trusted-ticker-track hero-trusted-ticker-track-reverse flex items-center gap-6 sm:gap-8">
                  {[
                    ...(secondLogoRow.length > 0 ? secondLogoRow : firstLogoRow),
                    ...(secondLogoRow.length > 0 ? secondLogoRow : firstLogoRow),
                  ].map((brand, index) => (
                    <div
                      key={`row2-${brand.name}-${index}`}
                      className="shrink-0 flex items-center justify-center h-16 w-40 sm:h-20 sm:w-52"
                    >
                      <img
                        src={brand.src}
                        alt={brand.name}
                        className="max-h-10 sm:max-h-14 w-auto object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="hero-trusted-ticker-track flex items-center gap-10 sm:gap-16 py-2 sm:py-3">
                {[...trustedBrands, ...trustedBrands].map((brand, index) => {
                  const Icon = brand.icon;
                  return (
                    <div
                      key={`${brand.name}-${index}`}
                      className="flex items-center gap-2 sm:gap-3 text-zinc-400 hover:text-brand-primary-700 transition-colors duration-300 shrink-0"
                    >
                      <div
                        className={`h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br ${brand.gradient} flex items-center justify-center`}
                      >
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                      <span className="text-base sm:text-lg font-semibold text-brand-primary-700">
                        {brand.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 max-w-[100vw]">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gray-50/80 z-0"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-primary-50 to-transparent z-0 hidden md:block"></div>
        <div className="absolute left-0 bottom-0 w-1/3 h-1/2 bg-gradient-to-t from-brand-secondary-50 to-transparent z-0 hidden md:block"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-40 h-40 sm:w-64 sm:h-64 rounded-full border-4 sm:border-8 border-brand-primary-100/30 z-0 hidden lg:block"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-8 border-brand-secondary-100/30 z-0 hidden lg:block"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 max-w-full"
          >
            <div className="inline-block mb-3 sm:mb-4">
              <span className="inline-block px-3 py-1 sm:px-4 bg-brand-secondary-50 text-brand-secondary-500 rounded-full text-xs sm:text-sm font-medium tracking-wide">
                WHAT WE OFFER
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 lg:mb-6 text-brand-primary-800 px-4">
              Our <span className="text-brand-secondary-500">Services</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Comprehensive design and printing solutions to elevate your brand
              presence in today's competitive market
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 md:grid-cols-2 max-w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <ServiceCard
                title="Graphic Design"
                description="Crafting visual identities that tell your unique story and captivate your audience. From logos to complete brand guidelines, we create designs that make an impact."
                icon={<FaPaintBrush />}
                link="/graphic-design"
                image="https://images.unsplash.com/photo-1613909207039-6b173b755cc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ServiceCard
                title="Printing Services"
                description="Bringing your designs to life with high-quality, professional printing solutions. From business cards to large format printing, we deliver exceptional quality."
                icon={<FaPrint />}
                link="/printing"
                image="https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600&q=80"
              />
            </motion.div>
          </div>

          {/* Additional Services Button */}
          <motion.div
            className="text-center mt-12 sm:mt-14 md:mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          ></motion.div>
        </div>
      </div>

      {/* Process Section */}
      <ProcessSection />

      {/* Swiper Slider Section */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 relative z-10 max-w-full overflow-hidden">
        <ParallaxEffect direction="up" speed={0.2}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            effect="fade"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-[280px] sm:h-[360px] md:h-[460px] lg:h-[560px] xl:h-[600px] w-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-900/80 to-transparent flex items-end">
                    <div className="max-w-3xl p-4 sm:p-6 md:p-8 lg:p-10 text-white">
                      <h2 className="mb-2 sm:mb-3 md:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        {slide.title}
                      </h2>
                      <p className="mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base md:text-lg lg:text-xl">{slide.description}</p>
                      <AnimatedButton
                        to="/graphic-design"
                        variant="primary"
                        className="bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30 text-sm sm:text-base"
                      >
                        Learn More
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </ParallaxEffect>
      </div>

      {/* Enhanced Marquee Section with Brand-Appropriate Styling */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-brand-primary-700 via-brand-primary-600 to-brand-secondary-600 py-5 sm:py-6 md:py-8 max-w-[100vw]">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>

        {/* First marquee - left to right */}
        <div className="mb-3 sm:mb-4">
          <motion.div
            className="whitespace-nowrap flex"
            initial={{ x: "-25%" }}
            animate={{ x: "0%" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            }}
          >
            {Array(8)
              .fill(null)
              .map((_, index) => (
                <React.Fragment key={`first-${index}`}>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Creative Design
                  </span>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Brand Identity
                  </span>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Print Solutions
                  </span>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Visual Storytelling
                  </span>
                </React.Fragment>
              ))}
          </motion.div>
        </div>

        {/* Second marquee - right to left (opposite direction) */}
        <div>
          <motion.div
            className="whitespace-nowrap flex"
            initial={{ x: "0%" }}
            animate={{ x: "-25%" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            }}
          >
            {Array(8)
              .fill(null)
              .map((_, index) => (
                <React.Fragment key={`second-${index}`}>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Graphic Excellence
                  </span>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Digital Printing
                  </span>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Logo Design
                  </span>
                  <span className="mx-4 text-base font-bold uppercase tracking-wider text-white font-serif sm:mx-5 sm:text-xl md:mx-8 md:text-2xl lg:text-3xl xl:text-4xl">
                    Marketing Materials
                  </span>
                </React.Fragment>
              ))}
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Enhanced Call to Action */}
      <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 max-w-[100vw]">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-600 to-brand-secondary-600 opacity-95 z-0"></div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1200 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 L1200,0 L1200,600 L0,600 Z"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.05)" />
            <circle cx="1000" cy="450" r="120" fill="rgba(255,255,255,0.05)" />
            <path
              d="M100,100 C300,50 500,300 700,200 S1000,100 1100,300"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
          </svg>

          {/* Animated Particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 hidden sm:block"
              style={{
                width: Math.random() * 80 + 20,
                height: Math.random() * 80 + 20,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 50 - 25],
                x: [0, Math.random() * 50 - 25],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 7,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-full">
          <ParallaxEffect direction="up" speed={0.1}>
            <motion.div
              className="mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 md:p-10 lg:p-16 shadow-2xl backdrop-blur-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.h2
                className="mb-5 sm:mb-6 lg:mb-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center sm:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Ready to Transform <br className="hidden sm:block" />
                <span className="text-white/90">Your Brand?</span>
              </motion.h2>

              <motion.p
                className="mx-auto mb-7 sm:mb-8 lg:mb-12 max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/80 text-center sm:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Let's collaborate to bring your vision to life with our expert
                design and printing services.
              </motion.p>

              <motion.div
                className="text-center sm:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <AnimatedButton
                  to="/contact"
                  variant="light"
                  size="lg"
                  className="bg-white text-brand-primary-600 hover:bg-white/90 px-8 py-3.5 sm:px-10 sm:py-4 lg:px-12 lg:py-5 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  Get in Touch Today
                </AnimatedButton>
              </motion.div>
            </motion.div>
          </ParallaxEffect>
        </div>
      </div>

      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close brochure form"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeBrochureModal}
          />

          <div className="relative z-10 w-full max-w-lg rounded-xl sm:rounded-2xl bg-white p-5 sm:p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-primary-800">
              Download Vibha_Printing Media
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Fill your details and brochure download will start instantly.
            </p>

            <form className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4" onSubmit={handleBrochureSubmit}>
              <div>
                <label
                  htmlFor="brochure-name"
                  className="mb-1 block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="brochure-name"
                  name="name"
                  type="text"
                  value={brochureForm.name}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-200"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="brochure-email"
                  className="mb-1 block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="brochure-email"
                  name="email"
                  type="email"
                  value={brochureForm.email}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-200"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="brochure-phone"
                  className="mb-1 block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="brochure-phone"
                  name="phone"
                  type="tel"
                  value={brochureForm.phone}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-200"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="brochure-company"
                  className="mb-1 block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Company (Optional)
                </label>
                <input
                  id="brochure-company"
                  name="company"
                  type="text"
                  value={brochureForm.company}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-brand-primary-500 focus:ring-2 focus:ring-brand-primary-200"
                  placeholder="Your company name"
                />
              </div>

              {formError && (
                <p className="text-xs sm:text-sm font-medium text-red-600">{formError}</p>
              )}

              <div className="flex flex-col gap-2.5 sm:gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
                  onClick={closeBrochureModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-lg bg-brand-primary-800 px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary-700 active:scale-95"
                >
                  Submit & Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedHero;
