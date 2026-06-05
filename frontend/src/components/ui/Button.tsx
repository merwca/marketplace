import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseClass = "font-medium rounded transition-colors";

  const variantClass = {
    primary: "bg-primary text-white hover:bg-accent",
    secondary: "border border-gray-300 text-gray-900 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];

  const sizeClass = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }[size];

  return (
    <button className={`${baseClass} ${variantClass} ${sizeClass} ${className}`} {...props} />
  );
}
