import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const ProgressBar = React.forwardRef(({ value = 0, max = 100, className, indicatorClassName, ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-surface-hover border border-border", className)}
      {...props}
    >
      <motion.div
        className={cn("h-full w-full flex-1 bg-accent transition-all", indicatorClassName)}
        initial={{ x: "-100%" }}
        animate={{ x: `-${100 - percentage}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
});
ProgressBar.displayName = "ProgressBar";
