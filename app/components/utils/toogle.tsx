"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; // 👈 Importing Feather sun and moon icons
import { FaMoon } from "react-icons/fa";
export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting until the component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // While loading, render a subtle empty space or layout placeholder matching the icon box size
  if (!mounted) {
    return <div className="w-10 h-10 rounded-lg bg-gray-200/50 dark:bg-gray-800/50 animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-1.5 rounded-[50%] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        // When theme is dark, display the Sun icon to switch to light mode
        <FiSun className="w-4 h-4 text-yellow-500 transition-transform duration-200 hover:rotate-45" />
      ) : (
        // When theme is light, display the Moon icon to switch to dark mode
        <FaMoon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}