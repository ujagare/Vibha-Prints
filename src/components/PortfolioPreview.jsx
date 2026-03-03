import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const PortfolioPreview = () => {
  // Portfolio items
  const portfolioItems = [
    {
      id: 1,
      title: "Corporate Branding",
      category: "Brand Identity",
      image:
        "https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80",
      link: "/logo-design-gallery",
    },
    {
      id: 2,
      title: "Product Packaging",
      category: "Packaging Design",
      image:
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80",
      link: "/graphic-design",
    },
    {
      id: 3,
      title: "Marketing Materials",
      category: "Print Design",
      image:
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80",
      link: "/printing",
    },
    {
      id: 4,
      title: "Event Collateral",
      category: "Print & Digital",
      image:
        "https://images.unsplash.com/photo-1540397106260-e24a507a08ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600&q=80",
      link: "/graphic-design",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Recent Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Explore our portfolio of successful projects that showcase our
              creativity and expertise.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Link
              to="/graphic-design"
              className="inline-flex items-center text-brand-primary-600 font-medium hover:text-brand-primary-700 transition-colors"
            >
              View All Projects <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: item.id * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={item.link}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className="text-sm font-medium text-brand-primary-300 block mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-brand-primary-300 transition-colors">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View Project <FaArrowRight className="ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
