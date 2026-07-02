import content from "@/content.json";

export function Footer() {
  return (
    <footer className="border-t border-border py-[30px]">
      <div className="mx-auto flex max-w-[920px] flex-wrap items-center justify-between gap-2.5 px-[clamp(18px,5vw,28px)] text-[12.5px] text-text-dim">
        <span>{content.footer.copyright}</span>
        <span className="font-mono">{content.footer.tagline}</span>
      </div>
    </footer>
  );
}
