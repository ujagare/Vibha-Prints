import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight as FaArrowRight,
  Play as FaPlay,
  CalendarCheck as FaRegCalendarCheck,
  Handshake as FaRegHandshake,
  Star as FaRegStar,
  Users as FaUsers,
} from "lucide-react";
import {
  Box as FiBox,
  Circle as FiCircle,
  Crosshair as FiCrosshair,
  Eye as FiEye,
  Hexagon as FiHexagon,
  Layers as FiLayers,
  Package as FiPackage,
  Target as FiTarget,
} from "lucide-react";
import Testimonials from "./Testimonials";
import heroShowcase from "../assets/Home/ChatGPT Image May 16, 2026, 04_34_55 PM.png";
import heroShowcaseMobile from "../assets/Home/Mobile/ChatGPT Image May 18, 2026, 12_53_59 AM.png";
import darkPattern from "../assets/Home/ChatGPT Image May 16, 2026, 04_50_15 PM.png";
import packageWork from "../assets/Home/ChatGPT Image May 16, 2026, 04_54_38 PM.png";
import brandWork from "../assets/Home/ChatGPT Image May 16, 2026, 04_55_27 PM.png";
import websiteWork from "../assets/Home/ChatGPT Image May 16, 2026, 04_57_33 PM.png";
import marketingWork from "../assets/Home/ChatGPT Image May 16, 2026, 04_58_15 PM.png";
import ctaShowcase from "../assets/Home/ChatGPT Image May 16, 2026, 05_07_33 PM.png";
import ctaShowcaseMobile from "../assets/Home/Mobile/ChatGPT Image May 18, 2026, 12_54_46 AM.png";
import designIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_39_19 PM.png";
import printIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_41_01 PM.png";
import marketingIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_41_38 PM.png";
import websiteIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_42_17 PM.png";
import creativeIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_44_31 PM.png";
import qualityIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_45_09 PM.png";
import deliveryIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_45_44 PM.png";
import supportIcon from "../assets/Home/Icons/ChatGPT Image May 16, 2026, 04_47_29 PM.png";

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

const SectionLabel = ({ children, dark = false }) => (
  <span
    className={`inline-flex items-center rounded-full border px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${
      dark
        ? "border-[#7b4cff]/70 bg-white/5 text-white/80"
        : "border-[#d6dce8] bg-white text-[#0b1830]"
    }`}
  >
    {children}
  </span>
);

const services = [
  {
    number: "01",
    title: "Graphic Design",
    description:
      "Stunning visuals that communicate your brand message with impact.",
    icon: designIcon,
    color: "#ff525d",
    link: "/graphic-design",
  },
  {
    number: "02",
    title: "Printing Services",
    description:
      "High-quality prints for business cards, brochures, packaging and more.",
    icon: printIcon,
    color: "#9b5cff",
    link: "/printing",
  },
  {
    number: "03",
    title: "Website Development",
    description: "Responsive websites that are fast, modern and built to convert.",
    icon: websiteIcon,
    color: "#2f92ff",
    link: "/website-design-gallery",
  },
  {
    number: "04",
    title: "Digital Marketing",
    description:
      "Smart marketing strategies to increase visibility, engage audience and drive sales.",
    icon: marketingIcon,
    color: "#54d873",
    link: "/social-media-design-gallery",
  },
];

const whyItems = [
  { title: "Creative Designers", icon: creativeIcon },
  { title: "Quality Assurance", icon: qualityIcon },
  { title: "On-Time Delivery", icon: deliveryIcon },
  { title: "Customer Support", icon: supportIcon },
];

const workItems = [
  { title: "Brand Identity", image: brandWork },
  { title: "Product Packaging", image: packageWork },
  { title: "Website Design", image: websiteWork },
  { title: "Digital Marketing", image: marketingWork },
];

const stats = [
  { value: "250+", label: "Projects Completed", icon: FaRegHandshake },
  { value: "98%", label: "Client Satisfaction", icon: FaRegStar },
  { value: "10+", label: "Years Experience", icon: FaRegCalendarCheck },
  { value: "50+", label: "Brands Empowered", icon: FaUsers },
];

const EnhancedHero = () => {
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

  return (
    <div className="bg-white text-[#071124]">
      <section className="relative min-h-[680px] overflow-hidden bg-[#050d1d] text-white sm:min-h-[820px] lg:min-h-[900px]">
        <picture>
          <source media="(max-width: 640px)" srcSet={heroShowcaseMobile} />
          <img
            src={heroShowcase}
            alt="Vibha brand stationery, tablet and print mockups"
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchpriority="high"
          />
        </picture>

        <div className="container relative z-10 mx-auto flex min-h-[680px] items-start px-4 pb-12 pt-16 sm:min-h-[820px] sm:items-center sm:px-6 sm:py-24 lg:min-h-[900px] lg:px-8">
          <motion.div
            className="max-w-2xl drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 text-xs font-semibold text-white/90 sm:mb-5 sm:text-sm">
              We Design. We Print. We Grow Brands.
            </p>
            <h1
              className="mb-5 text-[2.35rem] font-extrabold leading-[1.08] text-white sm:mb-6 sm:text-5xl lg:text-6xl"
              style={{ WebkitTextFillColor: "currentColor" }}
            >
              Creative Solutions
              <span className="block text-[#ff525d]">
                That Drive Results.
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/78 sm:text-lg sm:leading-8">
              From eye-catching designs to high-quality prints and powerful
              digital strategies, we help businesses stand out and achieve real
              growth.
            </p>
            <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/graphic-design"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ff525d] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-[#ff525d]/25 transition hover:-translate-y-0.5 hover:bg-[#ff6871] sm:justify-start"
              >
                Explore Services <FaArrowRight />
              </Link>
              <Link
                to="/logo-design-gallery"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/35 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10 sm:justify-start"
              >
                View Our Work
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff525d]">
                  <FaPlay className="ml-0.5 text-[10px]" />
                </span>
              </Link>
            </div>
            <div className="mt-12 hidden max-w-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid sm:grid-cols-4 sm:gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <Icon className="text-2xl text-[#ff525d]" />
                    <div className="min-w-0">
                      <p className="text-xl font-extrabold text-white">
                        {stat.value}
                      </p>
                      <p className="max-w-[110px] text-[10px] leading-tight text-white/65 sm:text-[11px]">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className="relative z-10 overflow-hidden bg-[#f7f9fc] py-12 sm:py-20"
        aria-label="Trusted by leading brands"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,36,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(7,17,36,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9e0ec] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d9e0ec] to-transparent" />
        <div className="relative w-full max-w-full">
          <motion.div
            className="mx-auto mb-7 max-w-3xl px-4 text-center sm:mb-10 sm:px-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center rounded-full border border-[#d6dce8] bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#071124] shadow-sm">
              Trusted Brands
            </span>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#071124] sm:text-4xl">
              Trusted by Leading{" "}
              <span className="text-[#ff525d]">Brands & Businesses</span>
            </h2>
          </motion.div>
          <div className="relative w-full overflow-hidden border-y border-[#e2e7f0] bg-white/78 py-4 shadow-[0_24px_70px_rgba(7,17,36,0.08)] backdrop-blur sm:py-6">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-10 bg-gradient-to-r from-white via-white/92 to-transparent sm:w-24"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-10 bg-gradient-to-l from-white via-white/92 to-transparent sm:w-24"></div>
            {trustedBrandPngLogos.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="hero-trusted-ticker-track flex items-center gap-4 sm:gap-8">
                  {[...firstLogoRow, ...firstLogoRow].map((brand, index) => (
                    <div
                      key={`row1-${brand.name}-${index}`}
                      className="flex h-16 w-36 shrink-0 items-center justify-center rounded-lg border border-[#edf1f7] bg-white px-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#ff525d]/35 hover:shadow-xl hover:shadow-slate-200/70 sm:h-24 sm:w-56 sm:px-7"
                    >
                      <img
                        src={brand.src}
                        alt={brand.name}
                        className="max-h-10 w-auto object-contain sm:max-h-14"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                <div className="hero-trusted-ticker-track hero-trusted-ticker-track-reverse flex items-center gap-4 sm:gap-8">
                  {[
                    ...(secondLogoRow.length > 0
                      ? secondLogoRow
                      : firstLogoRow),
                    ...(secondLogoRow.length > 0
                      ? secondLogoRow
                      : firstLogoRow),
                  ].map((brand, index) => (
                    <div
                      key={`row2-${brand.name}-${index}`}
                      className="flex h-16 w-36 shrink-0 items-center justify-center rounded-lg border border-[#edf1f7] bg-white px-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#ff525d]/35 hover:shadow-xl hover:shadow-slate-200/70 sm:h-24 sm:w-56 sm:px-7"
                    >
                      <img
                        src={brand.src}
                        alt={brand.name}
                        className="max-h-10 w-auto object-contain sm:max-h-14"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="hero-trusted-ticker-track flex items-center gap-16 py-3">
                {[...trustedBrands, ...trustedBrands].map((brand, index) => {
                  const Icon = brand.icon;
                  return (
                    <div
                      key={`${brand.name}-${index}`}
                      className="flex shrink-0 items-center gap-3 rounded-lg border border-[#edf1f7] bg-white px-7 py-5 text-zinc-500 shadow-sm transition duration-300 hover:-translate-y-1 hover:text-[#071124] hover:shadow-xl hover:shadow-slate-200/70"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${brand.gradient} flex items-center justify-center`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-brand-primary-700">
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

      <section className="relative overflow-hidden bg-[#040b19] py-14 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(35,91,190,0.28),transparent_42%)]" />
        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-9 max-w-4xl text-center sm:mb-14">
            <SectionLabel dark>Our Services</SectionLabel>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:mt-7 sm:text-5xl lg:text-6xl">
              End-to-End <span className="text-[#ff525d]">Solutions</span> for
              Your Brand
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/68 sm:mt-6 sm:text-lg sm:leading-8">
              We offer a complete range of creative and digital services to help
              your brand look amazing, communicate clearly, and grow faster.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="group relative min-h-[360px] overflow-hidden rounded-2xl border bg-white/[0.035] p-5 text-center transition duration-300 hover:-translate-y-2 sm:min-h-[430px] sm:rounded-[26px] sm:p-8 lg:min-h-[470px]"
                style={{
                  borderColor: `${service.color}70`,
                  boxShadow: `inset 0 0 70px ${service.color}18`,
                }}
              >
                <span
                  className="absolute right-0 top-0 rounded-bl-2xl px-4 py-3 text-base font-extrabold text-white sm:px-5 sm:py-4 sm:text-xl"
                  style={{ backgroundColor: service.color }}
                >
                  {service.number}
                </span>
                <div
                  className="mx-auto mt-7 flex h-28 w-28 items-center justify-center rounded-full border sm:mt-8 sm:h-40 sm:w-40"
                  style={{
                    borderColor: `${service.color}90`,
                    boxShadow: `0 0 40px ${service.color}24`,
                  }}
                >
                  <img
                    src={service.icon}
                    alt=""
                    className="h-20 w-20 object-contain sm:h-28 sm:w-28"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-7 text-xl font-extrabold text-white sm:mt-10 sm:text-2xl">
                  {service.title}
                </h3>
                <div
                  className="mx-auto my-6 h-1 w-20 rounded-full"
                  style={{ backgroundColor: service.color }}
                />
                <p className="mx-auto max-w-[250px] text-sm leading-7 text-white/68 sm:min-h-[96px] sm:text-base sm:leading-8">
                  {service.description}
                </p>
                <span
                  className="mt-5 inline-flex items-center gap-3 text-sm font-bold sm:mt-7 sm:text-base"
                  style={{ color: service.color }}
                >
                  Learn More <FaArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[#051126] py-16 text-white"
        style={{ backgroundImage: `url("${darkPattern}")` }}
      >
        <div className="absolute inset-0 bg-[#051126]/85" />
        <div className="container relative z-10 mx-auto grid items-center gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
          <div>
            <SectionLabel dark>Why Work With Us</SectionLabel>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              We Don't Just Design,
              <span className="block">
                We Build <span className="text-[#ff525d]">Brand Value</span>
              </span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              We combine creativity, strategy and technology to deliver
              solutions that make your brand memorable and successful.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-4">
            {whyItems.map((item, index) => (
              <div key={item.title} className="relative text-center">
                {index > 0 && (
                  <span className="absolute -left-3 top-12 hidden h-px w-6 bg-[#ff525d]/70 sm:block" />
                )}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#ff525d]/40 bg-white/5">
                  <img
                    src={item.icon}
                    alt=""
                    className="h-14 w-14 object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 text-lg font-extrabold leading-snug text-white">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <SectionLabel>Our Work</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#071124] sm:text-4xl">
              Work That <span className="text-[#ff525d]">Speaks</span> for
              Itself
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3">
              {["All", "Branding", "Print", "Web Development", "Marketing"].map(
                (item, index) => (
                  <span
                    key={item}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold sm:px-6 sm:text-sm ${
                      index === 0
                        ? "border-[#ff525d] bg-[#ff525d] text-white"
                        : "border-gray-200 bg-white text-[#071124]"
                    }`}
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workItems.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-lg bg-white shadow-xl shadow-slate-200/70"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                  loading="lazy"
                />
              </article>
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link
              to="/logo-design-gallery"
              className="inline-flex items-center gap-3 rounded-full bg-[#ff525d] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff525d]/20 transition hover:bg-[#ff6871]"
            >
              View All Projects <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#061225] py-8 text-white sm:py-10">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-2xl bg-white/[0.035] shadow-2xl shadow-black/25 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex items-center gap-4 px-5 py-5 sm:gap-5 sm:px-8 sm:py-7 ${
                    index > 0 ? "border-t border-white/10 lg:border-l lg:border-t-0" : ""
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#ff525d]/35 bg-[#ff525d]/10 text-[#ff525d] sm:h-16 sm:w-16">
                    <Icon className="text-2xl sm:text-3xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-xs leading-snug text-white/65">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="w-full bg-white py-0">
          <div className="relative min-h-[380px] w-full overflow-hidden bg-[#061225] px-5 py-12 text-white sm:min-h-[430px] sm:px-8 sm:py-16 md:px-16 lg:px-24">
          <picture>
            <source media="(max-width: 640px)" srcSet={ctaShowcaseMobile} />
            <img
              src={ctaShowcase}
              alt="Vibha stationery showcase"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-[#061225] via-[#061225]/88 to-[#061225]/28" />
          <div className="relative z-10 flex min-h-[280px] items-center sm:min-h-[300px]">
            <div className="max-w-xl">
              <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                Ready to Elevate
                <span className="block">Your Brand?</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
                Let's create something extraordinary together that connects,
                inspires, and drives real results.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#ff525d] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#ff6871]"
              >
                Let's Get Started <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedHero;
