import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  as: Component = motion.button,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-surface border border-border text-text-primary hover:bg-surface-hover shadow-sm",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    ghost: "hover:bg-surface-hover hover:text-text-primary text-text-secondary",
    outline: "border border-border bg-transparent hover:bg-surface-hover text-text-primary"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10"
  };

  // If using a custom component like 'Link', don't pass motion props directly unless it's a motion component.
  const isMotion = typeof Component === 'string' ? false : (Component.name?.includes('motion') || Component === motion.button);
  
  const motionProps = isMotion ? { whileTap: { scale: 0.98 } } : {};

  return (
    <Component
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...motionProps}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Component>
  );
});

Button.displayName = "Button";
