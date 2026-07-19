import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Alert = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-surface border-border text-text-primary",
    destructive: "bg-destructive/10 border-destructive/20 text-destructive",
    success: "bg-success/10 border-success/20 text-success",
    warning: "bg-warning/10 border-warning/20 text-warning",
    info: "bg-accent/10 border-accent/20 text-accent",
  };

  const icons = {
    default: <Info className="h-4 w-4" />,
    destructive: <AlertCircle className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current",
        variants[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      {children}
    </div>
  );
});
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
