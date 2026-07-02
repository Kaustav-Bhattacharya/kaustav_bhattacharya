"use client";

import { useEffect, useRef } from "react";
import { setOverlayElement } from "@/lib/word-physics";

export function PhysicsOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOverlayElement(ref.current);
    return () => setOverlayElement(null);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-[60] w-full font-display"
    />
  );
}
