// import React from 'react';
// import { motion } from 'framer-motion';

// const Gallery = () => {
//   return (
//     <div className="min-h-screen bg-white py-16 px-4">
//       <motion.div 
//         className="container mx-auto max-w-6xl text-center"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-5xl font-bold mb-8 text-gray-800">
//           Gallery
//         </h1>
//         <p className="text-xl text-gray-600 mb-12">
//           Coming soon! We are preparing an exciting collection of our work.
//         </p>
//       </motion.div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPrint, 
  FaDesktop, 
  FaImage, 
  FaSearchPlus 
} from 'react-icons/fa';

const PrintingShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('digital');
  const [selectedProject, setSelectedProject] = useState(null);

  const printingCategories = {
    digital: {
      title: 'Digital Printing',
      description: 'High-quality digital printing solutions for various needs',
      icon: FaPrint,
      color: 'from-blue-600 to-cyan-500',
      projects: [
        {
          id: 1,
          name: 'Corporate Brochures',
          client: 'Tech Innovations Inc.',
          description: 'Professionally designed and printed corporate marketing materials',
          image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          tags: ['Brochure', 'Digital Print', 'Marketing']
        },
        {
          id: 2,
          name: 'Event Posters',
          client: 'Global Conference 2024',
          description: 'Vibrant and eye-catching event promotional materials',
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f5f29295?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          tags: ['Poster', 'Large Format', 'Event Marketing']
        }
      ]
    },
    offset: {
      title: 'Offset Printing',
      description: 'Professional offset printing for high-volume and precise print jobs',
      icon: FaDesktop,
      color: 'from-green-600 to-teal-500',
      projects: [
        {
          id: 3,
          name: 'Annual Report',
          client: 'Global Innovations Inc.',
          description: 'Comprehensive annual report with high-quality offset printing',
          image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          tags: ['Annual Report', 'Offset Print', 'Corporate']
        },
        {
          id: 4,
          name: 'Magazine Production',
          client: 'Creative Quarterly',
          description: 'High-quality magazine printing with precise color reproduction',
          image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
          tags: ['Magazine', 'Offset Print', 'Publishing']
        }
      ]
    },
    large: {
      title: 'Large Format Printing',
      description: 'Oversized printing solutions for banners, signage, and displays',
      icon: FaImage,
      color: 'from-purple-600 to-pink-500',
      projects: [
        {
          id: 5,
          name: 'Trade Show Banners',
          client: 'Tech Summit 2024',
          description: 'Massive, high-resolution banners for professional events',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1372&q=80',
          tags: ['Banner', 'Large Format', 'Event Signage']
        },
        {
          id: 6,
          name: 'Outdoor Advertising',
          client: 'City Marketing Board',
          description: 'Durable and vibrant large-format prints for outdoor campaigns',
          image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
          tags: ['Billboard', 'Large Format', 'Outdoor Advertising']
        }
      ]
    }
  };

  // Add style to hide scrollbar
  const scrollbarStyle = {
    scrollbarWidth: 'none', // For Firefox
    msOverflowStyle: 'none', // For Internet Explorer and Edge
    '&::-webkit-scrollbar': {
      display: 'none' // For Chrome, Safari, and Opera
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" style={scrollbarStyle}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-center mb-16 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Printing Services Showcase
        </motion.h1>

        {/* Category Selector */}
        <div className="flex justify-center mb-12 space-x-4">
          {Object.keys(printingCategories).map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-6 py-3 rounded-full font-bold transition-all
                ${activeCategory === category 
                  ? `bg-gradient-to-r ${printingCategories[category].color} text-white` 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}
              `}
            >
              {printingCategories[category].title}
            </motion.button>
          ))}
        </div>

        {/* Category Description */}
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xl text-gray-600">
            {printingCategories[activeCategory].description}
          </p>
        </motion.div>

        {/* Projects Container */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
            WebkitScrollbar: 'none' // Chrome, Safari, Opera
          }}
        >
          {printingCategories[activeCategory].projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <FaSearchPlus className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{project.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid md:grid-cols-2">
                  <div>
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">{selectedProject.name}</h2>
                    <p className="text-xl text-gray-600 mb-6">{selectedProject.client}</p>
                    <p className="text-gray-700 mb-6">{selectedProject.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PrintingShowcase;
