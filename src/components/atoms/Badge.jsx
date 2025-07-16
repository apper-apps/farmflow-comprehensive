import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Badge = React.forwardRef(({ 
  children, 
  variant = "default", 
  size = "md", 
  icon = null,
  className = "",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    planted: "bg-blue-100 text-blue-700",
    growing: "bg-green-100 text-green-700",
    ready: "bg-harvest-100 text-harvest-700",
    harvested: "bg-gray-100 text-gray-700",
    high: "bg-red-100 text-red-700",
    medium: "bg-harvest-100 text-harvest-700",
low: "bg-green-100 text-green-700",
    income: "bg-green-100 text-green-700",
    expense: "bg-red-100 text-red-700",
    urgent: "bg-red-100 text-red-700 ring-2 ring-red-200",
    warning: "bg-harvest-100 text-harvest-700 ring-2 ring-harvest-200",
    info: "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const baseClasses = "inline-flex items-center gap-1 rounded-full font-medium";

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={size === "sm" ? 12 : size === "md" ? 14 : 16} />}
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;