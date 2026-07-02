"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<React.ComponentProps<typeof motion.a>, "href"> & {
  href: string;
  variant?: "primary" | "ghost";
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-block cursor-pointer touch-manipulation rounded-md px-5 py-3 text-[13.5px] transition-colors",
        variant === "primary" &&
          "border border-accent bg-accent font-medium text-[#12120f] hover:brightness-110",
        variant === "ghost" &&
          "border border-border text-text hover:border-accent-dim",
        className
      )}
      {...props}
    >
      {children}
    </motion.a>
  );
}
