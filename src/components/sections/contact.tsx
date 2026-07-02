import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalCard } from "@/components/ui/terminal-card";
import { cn } from "@/lib/utils";
import content from "@/content.json";

const rowClass =
  "flex items-center justify-between gap-3.5 border-b border-border px-4 py-2 text-text-dim transition-[background-color,padding-left] duration-200 last:border-b-0";

const CONTACT_LINKS = content.contact.links;

function ContactRow({
  label,
  value,
  href,
  download,
}: {
  label: string;
  value: string;
  href?: string;
  download?: string;
}) {
  const external = href?.startsWith("http");
  const Tag = href ? "a" : "div";

  return (
    <Tag
      {...(href
        ? {
            href,
            download,
            target: external ? "_blank" : undefined,
            rel: external ? "noopener" : undefined,
          }
        : {})}
      className={cn(
        rowClass,
        href
          ? "hover:bg-surface-hover hover:pl-5 active:bg-surface-hover"
          : "cursor-default"
      )}
    >
      <span className="shrink-0 text-accent">{label}</span>
      <span className="text-right break-words text-text">{value}</span>
    </Tag>
  );
}

export function Contact() {
  return (
    <section id="contact" className="border-t border-border pt-5 pb-[90px]">
      <div className="mx-auto max-w-[920px] px-[clamp(18px,5vw,28px)]">
        <SectionLabel text={content.contact.sectionLabel} />

        <Reveal className="grid grid-cols-1 items-start gap-7 md:grid-cols-[0.65fr_1.35fr] md:gap-12">
          <div className="flex flex-col gap-4">
            <div className="max-w-[20ch] font-display text-[clamp(22px,3vw,30px)] leading-[1.2] font-medium tracking-[-0.01em]">
              {content.contact.heading}
            </div>
            <div className="max-w-[44ch] text-[15px] leading-[1.65] text-text-dim">
              {content.contact.subtext}
            </div>
          </div>

          <TerminalCard
            title={content.contact.terminalTitle}
            className="w-full -rotate-2 text-[13px] transition-transform duration-300 hover:rotate-0"
          >
            <div className="flex flex-col">
              {CONTACT_LINKS.map((link) => (
                <ContactRow
                  key={link.key}
                  label={link.key}
                  value={link.val}
                  href={link.href}
                />
              ))}
              <ContactRow label="location" value={content.contact.location} />
              <ContactRow
                label={content.contact.resume.label}
                value={content.contact.resume.val}
                href={content.contact.resume.href}
                download={content.contact.resume.filename}
              />
            </div>
          </TerminalCard>
        </Reveal>
      </div>
    </section>
  );
}
