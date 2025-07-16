import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg hover:from-forest-700 hover:to-forest-800 hover:shadow-xl",
    secondary: "bg-white text-forest-700 border-2 border-forest-600 hover:bg-forest-50 hover:border-forest-700",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-forest-500 hover:text-forest-600",
    ghost: "text-gray-600 hover:text-forest-600 hover:bg-forest-50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;