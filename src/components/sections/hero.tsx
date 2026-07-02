"use client";

import { motion, type Variants } from "framer-motion";
import { useAppReady } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { KnockableWords, type KnockableToken } from "@/components/ui/knockable-words";
import content from "@/content.json";

const HEADLINE_TOKENS: KnockableToken[] = content.hero.headlineTokens.map((token) =>
  "break" in token
    ? { break: true }
    : { text: token.text, className: token.dim ? "font-normal text-text-dim" : undefined }
);

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function Hero() {
  const ready = useAppReady();

  return (
    <section className="py-[clamp(64px,14vw,120px)] pb-[clamp(56px,10vw,100px)]">
      <motion.div
        className="mx-auto max-w-[920px] px-[clamp(18px,5vw,28px)]"
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        variants={container}
      >
        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-2 font-mono text-[12.5px] tracking-wide text-accent"
        >
          <span className="animate-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {content.hero.badge}
        </motion.div>

        <motion.div variants={item}>
          <KnockableWords
            as="h1"
            tokens={HEADLINE_TOKENS}
            className="mt-[18px] font-display text-[clamp(32px,6.4vw,52px)] leading-[1.12] font-semibold tracking-[-0.01em]"
            wordClassName="font-display text-[clamp(32px,6.4vw,52px)] font-semibold tracking-[-0.01em] text-text"
          />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 max-w-[480px] text-[clamp(14.5px,2vw,16px)] leading-[1.6] text-text-dim"
        >
          {content.hero.subtext}
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
          {content.hero.buttons.map((btn) => (
            <Button key={btn.label} href={btn.href} variant={btn.variant as "primary" | "ghost"}>
              {btn.label}
            </Button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
