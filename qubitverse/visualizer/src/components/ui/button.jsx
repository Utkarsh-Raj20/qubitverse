import React from "react";

export const Button = ({
  variant = "default",
  onClick,
  children,
  className = "",
}) => {
  // Define button styles based on the variant
  const baseStyles =
    "px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ease-in-out";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline:
      "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    // Add more variants as needed
  };

  return (
    <button
      className={`${baseStyles} ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
