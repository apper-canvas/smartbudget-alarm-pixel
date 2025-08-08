import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className,
  children,
  glass = false,
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = "rounded-xl shadow-lg border transition-all duration-200";
  const glassClasses = "bg-white/80 backdrop-blur-sm border-gray-200/50";
  const normalClasses = "bg-white border-gray-200";
  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer" : "";
  
  return (
    <div
      className={cn(
        baseClasses,
        glass ? glassClasses : normalClasses,
        hoverClasses,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;