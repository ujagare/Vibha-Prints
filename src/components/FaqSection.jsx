import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  {
    question: "What design services do you provide?",
    answer:
      "We provide logo design, brand identity, business card design, brochure design, social media creatives, and packaging design.",
  },
  {
    question: "What is the minimum order quantity for printing?",
    answer:
      "The minimum order quantity depends on the product type. Low-quantity options are available for items like business cards and flyers, while bulk orders get better pricing.",
  },
  {
    question: "How long does it take to complete an order?",
    answer:
      "The design and printing timeline depends on project complexity and quantity. Basic jobs are usually completed in 2-4 days, while larger custom projects may take longer.",
  },
  {
    question: "Do you offer custom sizes and custom print finishes?",
    answer:
      "Yes, we offer custom sizes, lamination, matte/gloss options, texture finishes, and packaging-based custom print solutions.",
  },
  {
    question: "How does brochure download and quote request work?",
    answer:
      "Click the brochure button and submit the form to start the download. For a quote, you can share your requirements through the contact form or WhatsApp.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-brand-white-100 py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-secondary-500">
              Frequently Asked Questions
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-primary-800 md:text-4xl">
              Frequently Ask Question
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-xl border border-brand-primary-100 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-brand-primary-800 md:text-lg">
                      {item.question}
                    </span>
                    <span className="text-xl font-bold text-brand-secondary-500">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t border-brand-primary-100 px-5 py-4 text-sm leading-relaxed text-brand-primary-700 md:text-base">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
