import React from 'react';
import { cn } from '../../lib/utils';

export const Avatar = React.forwardRef(({ className, src, alt, fallback, size = "md", ...props }, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-surface-hover border border-border items-center justify-center font-medium",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="text-text-muted">{fallback || alt?.charAt(0) || "?"}</span>
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";
