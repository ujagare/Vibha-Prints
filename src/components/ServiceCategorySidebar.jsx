import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  Code2,
  FileText,
  Filter,
  Gauge,
  Globe2,
  Mail,
  MonitorSmartphone,
  MousePointerClick,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from "lucide-react";

const serviceGroups = {
  digitalMarketing: {
    title: "Digital Marketing Services",
    description: "Growth-focused galleries for campaigns, content, and reporting.",
    accent: "#ff3f51",
    homeRoute: "/digital-marketing",
    homeLabel: "Digital Marketing",
    services: [
      { title: "Search Engine Optimization", icon: Search, route: "/seo-gallery" },
      { title: "Social Media Marketing", icon: Share2, route: "/smm-gallery" },
      { title: "Pay-Per-Click Advertising", icon: MousePointerClick, route: "/ppc-gallery" },
      { title: "Content Marketing", icon: FileText, route: "/content-marketing-gallery" },
      { title: "Email Marketing", icon: Mail, route: "/email-marketing-gallery" },
      { title: "Conversion Rate Optimization", icon: Filter, route: "/cro-gallery" },
      { title: "Online Reputation Management", icon: ShieldCheck, route: "/orm-gallery" },
      { title: "Analytics & Reporting", icon: BarChart3, route: "/analytics-reporting-gallery" },
    ],
  },
  webDevelopment: {
    title: "Web Development Services",
    description: "Premium website, app, performance, and support galleries.",
    accent: "#ff3f51",
    homeRoute: "/web-development",
    homeLabel: "Web Development",
    services: [
      { title: "Custom Website Development", icon: Globe2, route: "/custom-website-development-gallery" },
      { title: "E-Commerce Development", icon: ShoppingCart, route: "/ecommerce-development-gallery" },
      { title: "Responsive Web Design", icon: MonitorSmartphone, route: "/responsive-web-design-gallery" },
      { title: "CMS Development", icon: Code2, route: "/cms-development-gallery" },
      { title: "Web Application Development", icon: Settings, route: "/web-application-development-gallery" },
      { title: "API Integration & Development", icon: Boxes, route: "/api-integration-development-gallery" },
      { title: "Website Speed Optimization", icon: Gauge, route: "/website-speed-optimization-gallery" },
      { title: "Website Maintenance & Support", icon: Wrench, route: "/website-maintenance-support-gallery" },
    ],
  },
};

const ServiceCategorySidebar = ({ group = "digitalMarketing", sidebarTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebar = serviceGroups[group] || serviceGroups.digitalMarketing;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -18 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 320, damping: 25 },
    },
  };

  return (
    <div className="h-full w-full bg-[#f8fafc]">
      <div className="px-4 pb-8">
        <motion.div
          className="relative mb-6 overflow-hidden rounded-lg bg-[#071124] p-5 text-white shadow-[0_24px_70px_rgba(7,17,36,0.18)]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10">
            <span className="mb-4 inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/78">
              Gallery Menu
            </span>
            <h2 className="text-2xl font-extrabold leading-tight text-white">
              {sidebarTitle || sidebar.title}
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-white/68">
              {sidebar.description}
            </p>
            <button
              type="button"
              onClick={() => navigate(sidebar.homeRoute)}
              className="mt-5 inline-flex w-full items-center justify-between rounded-md border border-white/12 bg-white/10 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-white hover:text-[#071124]"
            >
              {sidebar.homeLabel}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sidebar.services.map((service, index) => {
            const active = location.pathname === service.route;

            return (
              <motion.div
                key={service.route}
                variants={itemVariants}
                whileHover={{ x: 3 }}
                className="overflow-hidden rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => navigate(service.route)}
                  className={`group relative flex min-h-[64px] w-full items-center gap-3 overflow-hidden rounded-lg border p-3 text-left transition duration-300 ${
                    active
                      ? "border-[#ffb7c0] bg-white text-[#071124] shadow-[0_18px_50px_rgba(255,63,81,0.16)]"
                      : "border-[#e9edf5] bg-white text-[#475467] shadow-[0_12px_34px_rgba(7,17,36,0.045)] hover:border-[#ffccd3] hover:text-[#071124] hover:shadow-[0_18px_50px_rgba(7,17,36,0.08)]"
                  }`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1 transition ${
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                    style={{ backgroundColor: sidebar.accent }}
                  />
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition ${
                      active
                        ? "border-[#ffd7dd] bg-[#fff0f2] text-[#ff3f51]"
                        : "border-[#edf0f6] bg-[#f8fafc] text-[#071124] group-hover:border-[#ffd7dd] group-hover:bg-[#fff0f2] group-hover:text-[#ff3f51]"
                    }`}
                  >
                    <service.icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold leading-tight">
                      {service.title}
                    </span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#98a2b3]">
                      {String(index + 1).padStart(2, "0")} / Gallery
                    </span>
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      active
                        ? "bg-[#ff3f51] text-white"
                        : "bg-[#f2f4f7] text-[#667085] group-hover:bg-[#ff3f51] group-hover:text-white"
                    }`}
                  >
                    <ArrowUpRight size={15} />
                  </span>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-6 rounded-lg border border-[#e9edf5] bg-white p-4 shadow-[0_16px_46px_rgba(7,17,36,0.055)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <p className="text-sm font-extrabold text-[#071124]">Need a custom plan?</p>
          <p className="mt-2 text-xs font-medium leading-5 text-[#667085]">
            Share your requirement and we will recommend the best service mix.
          </p>
          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#ff3f51] px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(255,63,81,0.26)] transition hover:bg-[#071124]"
          >
            Get Consultation
            <ArrowUpRight size={15} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceCategorySidebar;
