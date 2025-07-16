import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  options = [], 
  className = "", 
  placeholder = "Select an option",
  error = false,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 bg-white";
  const normalClasses = "border-gray-200 focus:border-forest-500";
  const errorClasses = "border-red-500 focus:border-red-500";

  return (
    <select
      ref={ref}
      className={cn(
        baseClasses,
        error ? errorClasses : normalClasses,
        className
      )}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = "Select";

export default Select;