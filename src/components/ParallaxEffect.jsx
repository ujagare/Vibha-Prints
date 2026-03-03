import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxEffect = ({ children, direction = 'up', speed = 0.5, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Calculate transform based on direction and speed
  let transform;
  switch (direction) {
    case 'up':
      transform = useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 100}%`]);
      break;
    case 'down':
      transform = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
      break;
    case 'left':
      transform = useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 100}%`]);
      break;
    case 'right':
      transform = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
      break;
    default:
      transform = useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 100}%`]);
  }

  // Set the style based on direction
  const style = {};
  if (direction === 'up' || direction === 'down') {
    style.y = transform;
  } else {
    style.x = transform;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={style} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxEffect;
