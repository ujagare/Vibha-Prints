import React, { useState } from 'react';
import { FaPaintBrush, FaPrint } from 'react-icons/fa';
import logoImg1 from "../../assets/Logo/Logo_1.jpg";
import logoImg2 from "../../assets/Logo/Logo_2.jpg";
import logoImg3 from "../../assets/Logo/Logo_3.jpg";
import packagingImg1 from "../../assets/Packeging/Almond Oil Packege_1.jpg";
import packagingImg2 from "../../assets/Packeging/Behance Ad 1.jpg";
import VibhaBrochurePdf from "../../assets/Brouchers/Vibha_Printing Media.pdf";
import { submitBrochureLead } from "../../services/supabaseLeadService";

// --- Data for the image accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Logo Design',
    imageUrl: logoImg1,
  },
  {
    id: 2,
    title: 'Brand Identity',
    imageUrl: logoImg2,
  },
  {
    id: 3,
    title: 'Print Solutions',
    imageUrl: packagingImg1,
  },
  {
    id: 4,
    title: 'Graphic Design',
    imageUrl: logoImg3,
  },
  {
    id: 5,
    title: 'Packaging Design',
    imageUrl: packagingImg2,
  },
];

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onMouseEnter }) => {
  return (
    <div
      className={`
        relative h-[300px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-[250px] sm:w-[350px] md:w-[400px]' : 'w-[50px] sm:w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x450/01334C/ffffff?text=Image+Error'; }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Caption Text */}
      <span
        className={`
          absolute text-white text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 rotate-0'
              : 'w-auto text-left bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 rotate-90'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};

// --- Main Component ---
export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureForm, setBrochureForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [formError, setFormError] = useState("");

  const handleItemHover = (index) => {
    setActiveIndex(index);
  };

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
        source: "hero-accordion",
      });
    } catch (error) {
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
    <div className="bg-white font-sans overflow-x-hidden">
      <section className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12 md:py-16 lg:py-24 max-w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <p className="inline-block rounded-full border border-zinc-300 bg-white px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-600 mb-4 sm:mb-5">
              Premium Design Studio
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Convert your Dream into a Brand
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Creative graphic design and premium printing solutions to build a strong, memorable brand presence.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="/graphic-design"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[#01334C] px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-medium text-white shadow-lg transition hover:bg-[#0a4a6d] active:scale-95"
              >
                <FaPaintBrush className="text-base sm:text-lg" />
                Explore Services
              </a>
              <button
                type="button"
                onClick={() => setIsBrochureModalOpen(true)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[#DB5056] px-6 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-medium text-white transition hover:bg-[#c6454b] active:scale-95"
              >
                <FaPrint className="text-base sm:text-lg" />
                Download Brochure
              </button>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto p-2 sm:p-4 max-w-full">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brochure Modal */}
      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close brochure form"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeBrochureModal}
          />

          <div className="relative z-10 w-full max-w-lg rounded-xl sm:rounded-2xl bg-white p-5 sm:p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-[#01334C]">
              Download Vibha Printing Media
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Fill your details and brochure download will start instantly.
            </p>

            <form className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4" onSubmit={handleBrochureSubmit}>
              <div>
                <label htmlFor="brochure-name" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="brochure-name"
                  name="name"
                  type="text"
                  value={brochureForm.name}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-[#01334C] focus:ring-2 focus:ring-[#01334C]/20"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="brochure-email" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="brochure-email"
                  name="email"
                  type="email"
                  value={brochureForm.email}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-[#01334C] focus:ring-2 focus:ring-[#01334C]/20"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="brochure-phone" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="brochure-phone"
                  name="phone"
                  type="tel"
                  value={brochureForm.phone}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-[#01334C] focus:ring-2 focus:ring-[#01334C]/20"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label htmlFor="brochure-company" className="mb-1 block text-xs sm:text-sm font-medium text-gray-700">
                  Company (Optional)
                </label>
                <input
                  id="brochure-company"
                  name="company"
                  type="text"
                  value={brochureForm.company}
                  onChange={handleBrochureInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 text-sm outline-none focus:border-[#01334C] focus:ring-2 focus:ring-[#01334C]/20"
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
                  className="w-full sm:w-auto rounded-lg bg-[#01334C] px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a4a6d] active:scale-95"
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
}
