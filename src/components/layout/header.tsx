"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { KnockableWords } from "@/components/ui/knockable-words";
import { cn } from "@/lib/utils";
import content from "@/content.json";

const NAV_LINKS = content.header.navLinks;

export function Header() {
  const active = useActiveSection(NAV_LINKS.map((link) => link.id));

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-[920px] items-center justify-between gap-3 px-[clamp(18px,5vw,28px)]">
        <div className="flex cursor-default items-center gap-0.5 font-mono text-sm tracking-wide text-text-dim">
          <KnockableWords
            tokens={[
              { text: content.header.logoText },
              { text: content.header.logoSuffix, className: "text-text", join: true },
            ]}
            wordClassName="font-mono text-sm tracking-wide text-text-dim"
          />
          <span className="animate-caret ml-1 inline-block h-3.5 w-[7px] bg-accent" />
        </div>

        <nav className="flex items-center gap-[clamp(14px,3vw,28px)]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={cn(
                "relative pb-0.5 text-[13px] text-text-dim transition-colors hover:text-text",
                "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100",
                active === link.id &&
                  "text-text after:origin-left after:scale-x-100"
              )}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
