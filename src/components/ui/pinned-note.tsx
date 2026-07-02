"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";

export function PinnedNote({
  constraintsRef,
}: {
  constraintsRef: RefObject<HTMLElement | null>;
}) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.15}
      dragMomentum={false}
      initial={{ rotate: -6 }}
      whileHover={{ rotate: -9, scale: 1.02 }}
      whileDrag={{ scale: 1.06, rotate: -2, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 320, damping: 9 }}
      className="relative z-10 w-full shrink-0 cursor-grab touch-none select-none"
    >
      {/* thumbtack, pinned to the note itself — sits outside the clipped paper so it never gets cut off */}
      <span className="absolute -top-2 left-1/2 z-20 -translate-x-1/2">
        <span className="block h-4 w-4 rounded-full bg-gradient-to-br from-accent via-accent to-accent-dim shadow-[0_2px_3px_rgba(0,0,0,0.45)] ring-1 ring-black/25" />
        <span className="absolute top-[3px] left-[4px] h-1 w-1 rounded-full bg-white/70 blur-[0.3px]" />
      </span>

      <div className="paper-note relative bg-surface px-7 py-10 text-center">
        <div className="mb-3 font-mono text-[11px] tracking-widest text-accent">
          SELECTED WORK
        </div>
        <div className="mb-1 font-hand text-3xl leading-none text-text">
          Coming soon
        </div>
        <div className="font-hand text-lg leading-snug text-text-dim">
          Case studies landing Q1 2026.
        </div>
      </div>
    </motion.div>
  );
}
