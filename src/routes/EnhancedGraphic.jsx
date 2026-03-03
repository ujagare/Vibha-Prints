import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EnhancedGraphic = () => {
  const services = [
    { 
      id: 'logo-design',
      title: 'Logo Design', 
      description: 'Create a unique and memorable brand identity.',
      icon: '🎨'
    },
    { 
      id: 'brochure-design',
      title: 'Brochure Design', 
      description: 'Compelling marketing materials that tell your story.',
      icon: '📚'
    },
    { 
      id: 'social-media-graphics',
      title: 'Social Media Graphics', 
      description: 'Engaging visuals for your digital platforms.',
      icon: '📱'
    },
    { 
      id: 'packaging-design',
      title: 'Packaging Design', 
      description: 'Eye-catching designs that stand out on shelves.',
      icon: '📦'
    },
    { 
      id: 'infographic-design',
      title: 'Infographic Design', 
      description: 'Transform complex data into visual stories.',
      icon: '📊'
    },
    { 
      id: 'brand-identity',
      title: 'Brand Identity', 
      description: 'Comprehensive visual branding solutions.',
      icon: '🚀'
    }
  ];

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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-full mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {services.map((service) => (
            <motion.div 
              key={service.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 w-full"
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{service.icon}</span>
                <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link 
                to={`/graphic/${service.id}`} 
                className="inline-block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Explore Service
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedGraphic;
