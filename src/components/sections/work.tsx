"use client";

import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { PinnedNote } from "@/components/ui/pinned-note";
import { PencilQuote } from "@/components/ui/pencil-quote";

export function Work() {
  const constraintsRef = useRef<HTMLElement>(null);

  return (
    <section
      id="work"
      ref={constraintsRef}
      className="flex min-h-[clamp(220px,28vh,300px)] items-center justify-center overflow-hidden border-t border-b border-border py-[clamp(24px,4vw,40px)]"
    >
      <Reveal>
        <div className="relative w-[230px]">
          <PencilQuote />
          <PinnedNote constraintsRef={constraintsRef} />
        </div>
      </Reveal>
    </section>
  );
}
