import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

// Create a context for Lenis
export const LenisContext = React.createContext(null);

export const LenisProvider = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis with advanced configuration
    const lenis = new Lenis({
      duration: 1.2,           // Scroll animation duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      direction: 'vertical',   // Scroll direction
      gestureDirection: 'vertical', // Gesture direction
      smooth: true,            // Enable smooth scrolling
      mouseMultiplier: 1,      // Mouse wheel sensitivity
      smoothTouch: false,      // Disable smooth scrolling on touch devices
      touchMultiplier: 2,      // Touch scroll sensitivity
      infinite: false,         // Disable infinite scrolling
      wheelEventsTarget: window, // Target for wheel events
      wrapper: window,         // Scroll wrapper
      content: document.body   // Scrollable content
    });

    // Sync Lenis with ScrollTrigger if using GSAP
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose Lenis methods
    const scrollTo = (target, options = {}) => {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options
      });
    };

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={{ scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
};

// Custom hook to use Lenis
export const useLenis = () => {
  const context = React.useContext(LenisContext);
  if (!context) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
};

export default LenisProvider;
