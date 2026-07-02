"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AppReadyContext = createContext(false);

export function useAppReady() {
  return useContext(AppReadyContext);
}

export function Loader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const start = performance.now();
    const MIN_DURATION = reduceMotion ? 0 : 450;
    let raf = 0;

    function tick() {
      setProgress((p) => Math.min(94, p + (100 - p) * 0.015 + 0.12));
      raf = requestAnimationFrame(tick);
    }
    if (!reduceMotion) raf = requestAnimationFrame(tick);

    function finish() {
      cancelAnimationFrame(raf);
      setProgress(100);
      setTimeout(() => setReady(true), reduceMotion ? 0 : 150);
    }
    function scheduleFinish() {
      const elapsed = performance.now() - start;
      setTimeout(finish, Math.max(0, MIN_DURATION - elapsed));
    }

    if (document.readyState === "complete") {
      scheduleFinish();
    } else {
      window.addEventListener("load", scheduleFinish);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", scheduleFinish);
    };
  }, []);

  return (
    <AppReadyContext.Provider value={ready}>
      <AnimatePresence>
        {!ready && (
          <motion.div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="font-mono text-[13.5px] tracking-wide text-text-dim">
                kaustav<span className="text-text">.dev</span>
              </div>
              <div className="h-[2px] w-[100px] overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-accent transition-[width] duration-200 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-0.5 font-mono text-[11px] tracking-widest text-text-dim">
                {String(Math.floor(progress)).padStart(2, "0")}
              </div>
              <span className="sr-only">Loading</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </AppReadyContext.Provider>
  );
}
