import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  useEffect(() => {
    const handleLinkHover = () => setCursorVariant('link');
    const handleLinkLeave = () => setCursorVariant('default');

    // Add event listeners to all links and buttons
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: 'rgba(106, 17, 203, 0.2)',
      height: 32,
      width: 32,
      borderRadius: '50%',
      transition: {
        type: 'spring',
        mass: 0.6,
        stiffness: 700,
        damping: 30
      }
    },
    link: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      backgroundColor: 'rgba(37, 117, 252, 0.4)',
      height: 48,
      width: 48,
      borderRadius: '50%',
      mixBlendMode: 'difference',
      transition: {
        type: 'spring',
        mass: 0.6,
        stiffness: 700,
        damping: 30
      }
    }
  };

  // Only show on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <motion.div
      className="cursor-effect fixed top-0 left-0 z-[9999] pointer-events-none"
      variants={variants}
      animate={cursorVariant}
    />
  );
};

export default CursorEffect;
