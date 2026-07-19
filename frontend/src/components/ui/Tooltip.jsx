import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Tooltip = ({ content, children, side = "top", className }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  const initialAnimation = {
    top: { opacity: 0, y: 5 },
    bottom: { opacity: 0, y: -5 },
    left: { opacity: 0, x: 5 },
    right: { opacity: 0, x: -5 }
  };

  const animateTo = {
    top: { opacity: 1, y: 0 },
    bottom: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 }
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={initialAnimation[side]}
            animate={animateTo[side]}
            exit={initialAnimation[side]}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 whitespace-nowrap rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground font-medium shadow-md pointer-events-none",
              positionStyles[side],
              className
            )}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
