import React, { useState } from 'react';
import { motion } from 'framer-motion';
import businessCardsImage from "../assets/Printing/Bussiness Card/image-262.webp";
import flyerImage from "../assets/Printing/Pamphlet & Poster Printing/image-302.webp";
import posterImage from "../assets/Printing/Pamphlet & Poster Printing/image-303.webp";
import brochureImage from "../assets/Printing/Broucher & Booklet/image-259.webp";
import menuImage from "../assets/Printing/Broucher & Booklet/image-260.webp";
import realEstateImage from "../assets/Printing/Pamphlet & Poster Printing/image-304.webp";
import educationImage from "../assets/Printing/Broucher & Booklet/image-258.webp";
import conferenceImage from "../assets/Printing/Corporate Stationary/image-276.webp";
import retailPromoImage from "../assets/Printing/Pamphlet & Poster Printing/image-305.webp";

const DigitalPrintingGallery = () => {
  const digitalPrintItems = [
    { 
      id: 1, 
      title: 'Business Cards', 
      category: 'Corporate', 
      imageUrl: businessCardsImage,
      description: 'Professional business card printing with high-quality finishes.'
    },
    { 
      id: 2, 
      title: 'Marketing Flyers', 
      category: 'Marketing', 
      imageUrl: flyerImage,
      description: 'Vibrant and eye-catching marketing flyers for your business.'
    },
    { 
      id: 3, 
      title: 'Event Posters', 
      category: 'Event', 
      imageUrl: posterImage,
      description: 'High-resolution event posters for maximum visual impact.'
    },
    { 
      id: 4, 
      title: 'Product Brochures', 
      category: 'Product', 
      imageUrl: brochureImage,
      description: 'Comprehensive product brochures with detailed information.'
    },
    { 
      id: 5, 
      title: 'Restaurant Menus', 
      category: 'Food', 
      imageUrl: menuImage,
      description: 'Beautifully designed restaurant menus with appetizing layouts.'
    },
    { 
      id: 6, 
      title: 'Real Estate Flyers', 
      category: 'Real Estate', 
      imageUrl: realEstateImage,
      description: 'Professional property listing and real estate marketing materials.'
    },
    { 
      id: 7, 
      title: 'Educational Handouts', 
      category: 'Education', 
      imageUrl: educationImage,
      description: 'Informative and engaging educational printed materials.'
    },
    { 
      id: 8, 
      title: 'Conference Materials', 
      category: 'Corporate', 
      imageUrl: conferenceImage,
      description: 'Professional printed materials for conferences and seminars.'
    },
    { 
      id: 9, 
      title: 'Retail Promotional Prints', 
      category: 'Retail', 
      imageUrl: retailPromoImage,
      description: 'Attractive promotional prints for retail marketing campaigns.'
    }
  ];

  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(digitalPrintItems.map(item => item.category))];

  const filteredItems = filter === 'All' 
    ? digitalPrintItems 
    : digitalPrintItems.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-12 text-gray-800"
        >
          Digital Printing Gallery
        </motion.h1>

        {/* Category Filter */}
        <div className="flex justify-center mb-12 space-x-4 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 m-2 rounded-full transition-all duration-300 ${
                filter === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Print Items Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.5 }
                }
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img decoding="async" loading="lazy" 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-2 text-sm text-blue-600 font-medium">
                  {item.category} Print
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No print items found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalPrintingGallery;
