import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalCard } from "@/components/ui/terminal-card";
import content from "@/content.json";

const STACK = content.about.stack;
const { before, strong, after } = content.about.bio;

export function About() {
  return (
    <section id="about" className="border-t border-border py-2.5 pb-[90px]">
      <div className="mx-auto max-w-[920px] px-[clamp(18px,5vw,28px)]">
        <SectionLabel text={content.about.sectionLabel} />

        <Reveal className="grid grid-cols-1 items-start gap-7 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
          <p className="max-w-[46ch] text-[15px] leading-[1.75] text-text-dim">
            {before}
            <strong className="font-medium text-text">{strong}</strong>
            {after}
          </p>

          <TerminalCard title={content.about.terminalTitle} className="text-[12.5px] w-full">
            <div className="flex flex-col gap-2.5 px-4 py-3.5">
              {STACK.map((row) => (
                <div key={row.key} className="flex gap-2.5">
                  <span className="w-[84px] shrink-0 text-accent">
                    {row.key}
                  </span>
                  <span className="text-text-dim">{row.val}</span>
                </div>
              ))}
            </div>
          </TerminalCard>
        </Reveal>
      </div>
    </section>
  );
}
