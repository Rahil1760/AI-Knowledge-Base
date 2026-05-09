// src/components/ui/button.jsx
import React from "react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(({ className, variant = "default", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-primary bg-transparent text-primary hover:bg-primary/10",
  }[variant];
  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  }[size];
  return (
    <button
      className={cn(baseStyles, variantStyles, sizeStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
