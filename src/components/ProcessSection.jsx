import React from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaPencilAlt, FaDesktop, FaCheck } from "react-icons/fa";

const ProcessSection = () => {
  // Process steps
  const processSteps = [
    {
      id: 1,
      icon: <FaLightbulb />,
      title: "Discovery",
      description:
        "We start by understanding your business, goals, and target audience to create a strategic foundation.",
    },
    {
      id: 2,
      icon: <FaPencilAlt />,
      title: "Design Concept",
      description:
        "Our creative team develops design concepts that align with your brand identity and objectives.",
    },
    {
      id: 3,
      icon: <FaDesktop />,
      title: "Development",
      description:
        "We refine the chosen concept, incorporating your feedback until the design is perfected.",
    },
    {
      id: 4,
      icon: <FaCheck />,
      title: "Delivery",
      description:
        "The final designs are prepared for print or digital use, ensuring the highest quality output.",
    },
  ];

  return (
    <section className="pt-32 pb-24 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-primary-200"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-brand-secondary-200"></div>
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-brand-accent-200"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block mb-4">
            <span className="inline-block px-4 py-1 bg-[#E65056]/10 text-[#E65056] rounded-full text-sm font-medium tracking-wide">
              OUR APPROACH
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-[#01334C]">Design </span>
            <span className="text-[#E65056]">Process</span>
          </h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a proven methodology to ensure every project delivers
              exceptional results that meet your objectives.
            </p>
          </motion.div>
        </motion.div>

        <div className="relative">
          {/* Process Connection Line with animation */}
          <motion.div
            className="hidden md:block absolute top-[4.5rem] left-0 right-0 h-2 bg-gradient-to-r from-[#E65056]/30 via-[#E65056]/60 to-[#E65056]/80 z-0 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          ></motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 lg:gap-10 relative z-10">
            {processSteps.map((step) => (
              <motion.div
                key={step.id}
                className="bg-white rounded-xl p-8 shadow-lg relative border border-gray-100 backdrop-blur-sm bg-white/90 overflow-hidden group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: step.id * 0.15 }}
                whileHover={{
                  y: -12,
                  boxShadow: "0 20px 40px rgba(230, 80, 86, 0.15)",
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
              >
                {/* Step Number - Inside the card at the top */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#01334C] text-[#E65056] flex items-center justify-center font-bold text-3xl shadow-lg">
                    {step.id}
                  </div>
                </div>

                {/* Decorative Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#E65056]/5 rounded-bl-3xl -mt-4 -mr-4 z-0 group-hover:bg-[#E65056]/10 transition-colors duration-300"></div>

                {/* Icon with Animation - Now smaller and below the number */}
                <motion.div
                  className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#E65056]/10 flex items-center justify-center text-[#E65056] text-2xl relative z-10 border border-[#E65056]/20 shadow-sm"
                  whileHover={{
                    rotate: 5,
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(230, 80, 86, 0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {step.icon}
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center relative z-10 leading-relaxed">
                  {step.description}
                </p>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#E65056] group-hover:w-1/2 transition-all duration-300 rounded-t-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
