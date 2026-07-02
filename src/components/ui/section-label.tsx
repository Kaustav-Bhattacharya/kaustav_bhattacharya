import { Reveal } from "@/components/ui/reveal";
import { KnockableWords } from "@/components/ui/knockable-words";

export function SectionLabel({ text }: { text: string }) {
  return (
    <Reveal className="mb-[22px] text-xs tracking-widest text-text-dim uppercase">
      <KnockableWords
        tokens={[{ text }]}
        wordClassName="text-xs tracking-widest text-text-dim uppercase"
      />
    </Reveal>
  );
}
