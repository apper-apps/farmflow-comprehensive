import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  type = "text", 
  className = "", 
  placeholder = "",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200";
  const normalClasses = "border-gray-200 focus:border-forest-500";
  const errorClasses = "border-red-500 focus:border-red-500";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        error ? errorClasses : normalClasses,
        className
      )}
      placeholder={placeholder}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;