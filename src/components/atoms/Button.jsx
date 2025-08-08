import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className,
  variant = "primary",
  size = "default",
  children,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-primary/20",
    secondary: "bg-gradient-to-r from-secondary to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-secondary/20",
    ghost: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:ring-gray-200",
    success: "bg-gradient-to-r from-success to-green-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-success/20",
    danger: "bg-gradient-to-r from-error to-red-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-error/20",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-2.5",
    lg: "px-8 py-3 text-lg",
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;