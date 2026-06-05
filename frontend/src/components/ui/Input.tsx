import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        className={`w-full px-3 py-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
