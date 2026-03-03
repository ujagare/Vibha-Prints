import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PrismFluxLoader } from "@/components/ui/prism-flux-loader";

const Loader = ({ finishLoading }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        finishLoading();
      }, 1200);
    }, 2200);

    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-brand-primary-800"
          initial={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 1, y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <PrismFluxLoader size={72} speed={5} textSize={24} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
