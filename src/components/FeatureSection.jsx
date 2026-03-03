import React from 'react';
import { motion } from 'framer-motion';
import { FaPalette, FaPrint, FaLaptop, FaRocket, FaChartLine, FaHandshake } from 'react-icons/fa';
import ParallaxEffect from './ParallaxEffect';

const FeatureSection = () => {
  // Features data
  const features = [
    {
      icon: <FaPalette />,
      title: 'Creative Design',
      description: 'Our expert designers create stunning visuals that capture your brand essence and resonate with your audience.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: <FaPrint />,
      title: 'Premium Printing',
      description: 'High-quality printing services using state-of-the-art technology for exceptional results every time.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <FaLaptop />,
      title: 'Digital Solutions',
      description: 'Comprehensive digital design services for websites, social media, and online marketing materials.',
      color: 'from-teal-500 to-green-600'
    },
    {
      icon: <FaRocket />,
      title: 'Fast Turnaround',
      description: 'Quick delivery without compromising on quality, meeting your deadlines with professional results.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <FaChartLine />,
      title: 'Brand Strategy',
      description: 'Strategic approach to design that aligns with your business goals and enhances brand recognition.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: <FaHandshake />,
      title: 'Dedicated Support',
      description: 'Personalized customer service and support throughout your project from concept to completion.',
      color: 'from-amber-500 to-yellow-600'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-brand-primary-50 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-secondary-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine creativity, expertise, and cutting-edge technology to deliver exceptional design and printing solutions.
          </p>
        </motion.div>

        <ParallaxEffect direction="up" speed={0.1}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                
                {/* Icon with Gradient Background */}
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white bg-gradient-to-r ${feature.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-brand-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Decorative Element */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-gray-100 to-transparent rounded-tl-3xl opacity-50"></div>
              </motion.div>
            ))}
          </motion.div>
        </ParallaxEffect>
      </div>
    </section>
  );
};

export default FeatureSection;
