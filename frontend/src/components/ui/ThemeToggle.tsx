"use client";

import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-1.414-1.414a2 2 0 10-2.828 0l-1.414 1.414a8 8 0 1011.314-11.314l-1.414 1.414a6 6 0 10-8.485 8.485zm2.828-10.364l1.414-1.414a8 8 0 11-11.314 11.314l1.414-1.414a6 6 0 108.485-8.485z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
