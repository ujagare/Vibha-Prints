import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight as FaArrowRight,
  Headset as FaHeadset,
  Plus as FaPlus,
} from "lucide-react";

const faqItems = [
  {
    question: "What services do you offer?",
    answer:
      "We offer graphic design, logo design, branding, printing services, website development, and digital marketing creatives.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Most basic design projects take 3-5 working days. Larger branding, website, or bulk printing projects depend on scope and quantity.",
  },
  {
    question: "Do you offer custom packages?",
    answer:
      "Yes, we create custom packages based on your brand goals, print quantity, timeline, and design requirements.",
  },
  {
    question: "Can you work with our team?",
    answer:
      "Yes, we can collaborate with your team for brand guidelines, marketing campaigns, print-ready files, and ongoing creative support.",
  },
  {
    question: "How do we get started?",
    answer:
      "Share your requirement through the contact page or WhatsApp. We will review the scope and send you the next steps with a quote.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-white py-14 sm:py-16">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center rounded-full border border-[#d6dce8] bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#071124]">
            FAQs
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#071124] sm:text-4xl">
            Frequently Asked <span className="text-[#ff525d]">Questions</span>
          </h2>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-lg border border-[#e3e7ef] bg-white shadow-sm"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-bold text-[#071124] sm:text-base">
                      {item.question}
                    </span>
                    <FaPlus
                      className={`shrink-0 text-sm text-[#071124] transition duration-300 ${
                        isOpen ? "rotate-45 text-[#ff525d]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: "easeInOut" }}
                      >
                        <div className="border-t border-[#e3e7ef] px-6 py-4 text-sm leading-7 text-[#536176]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-xl bg-[#071124] p-8 text-white shadow-xl shadow-slate-300/70 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,82,93,0.24),transparent_35%)]" />
            <div className="absolute -right-10 -bottom-12 text-[190px] text-white/12">
              <FaHeadset />
            </div>
            <div className="relative z-10 flex min-h-[200px] flex-col justify-center">
              <h3 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
                Still have questions?
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-7 text-white/78">
                We're here to help you with design, printing, and branding
                requirements.
              </p>
              <Link
                to="/contact"
                className="mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-[#ff525d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff6871]"
              >
                Contact Us <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
