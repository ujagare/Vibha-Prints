import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DigitalPrint = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceTitle) => {
    window.open(`/digital-print?service=${encodeURIComponent(serviceTitle)}`, '_blank');
  };

  const handleDigitalPrintGalleryClick = () => {
    navigate('/digital-printing-gallery');
  };

  const digitalPrintServices = [
    { 
      title: 'Business Cards', 
      description: 'Professional, high-quality business cards that make a lasting impression.',
      details: [
        'Multiple paper stocks',
        'Full-color printing',
        'Custom designs',
        'Matte and glossy finishes'
      ]
    },
    { 
      title: 'Flyers & Brochures', 
      description: 'Vibrant marketing materials that effectively communicate your message.',
      details: [
        'A4 and A5 sizes',
        'Full-color printing',
        'Various paper weights',
        'Folding options'
      ]
    },
    { 
      title: 'Posters', 
      description: 'Eye-catching posters for events, promotions, and displays.',
      details: [
        'Multiple sizes available',
        'High-resolution printing',
        'Glossy and matte finishes',
        'Indoor and outdoor options'
      ]
    },
    { 
      title: 'Banners', 
      description: 'Large format digital prints for maximum visibility.',
      details: [
        'Vinyl and fabric options',
        'Indoor and outdoor use',
        'Custom sizes',
        'High-durability printing'
      ]
    },
    { 
      title: 'Stickers & Labels', 
      description: 'Custom stickers and labels for various applications.',
      details: [
        'Die-cut options',
        'Waterproof materials',
        'Full-color printing',
        'Various shapes and sizes'
      ]
    },
    { 
      title: 'Booklets & Catalogs', 
      description: 'Professional booklets and catalogs for comprehensive presentations.',
      details: [
        'Multiple page options',
        'Saddle-stitch binding',
        'Full-color interior',
        'Custom cover designs'
      ]
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
    <div className="min-h-screen bg-white py-16 px-4">
      <motion.div 
        className="container mx-auto max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-5xl font-bold text-center mb-12 text-gray-800"
          variants={itemVariants}
        >
          Digital Printing Services
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {digitalPrintServices.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleServiceClick(service.title)}
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{service.title}</h2>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                {service.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Digital Printing Gallery Button */}
        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button 
            onClick={handleDigitalPrintGalleryClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            View Our Digital Printing Gallery
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DigitalPrint;
