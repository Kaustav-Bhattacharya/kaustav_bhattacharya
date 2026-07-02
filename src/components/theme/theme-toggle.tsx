"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-border bg-surface transition-colors hover:border-accent-dim active:scale-90",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={theme}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[15px] w-[15px] stroke-text"
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {theme === "dark" ? (
            <circle cx="12" cy="12" r="4" />
          ) : (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          )}
          {theme === "dark" && (
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
