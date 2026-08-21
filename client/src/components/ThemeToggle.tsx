import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useRef } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";

  const handleToggle = () => {
    const button = buttonRef.current;
    if (!button || !toggleTheme) return;

    const root = document.documentElement;
    root.style.setProperty("--theme-origin-x", "100vw");
    root.style.setProperty("--theme-origin-y", "0px");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !document.startViewTransition) {
      toggleTheme();
      return;
    }

    document.startViewTransition(toggleTheme);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      className={`theme-toggle ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <motion.svg viewBox="0 0 240 240" fill="none" aria-hidden="true">
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ duration: 0.46, ease: [0.32, 0.72, 0, 1] }}
        >
          <path d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5" fill="#ffffff" />
          <path d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5" fill="#000000" />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.46, ease: [0.32, 0.72, 0, 1] }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="#ffffff"
        />
      </motion.svg>
    </button>
  );
}
