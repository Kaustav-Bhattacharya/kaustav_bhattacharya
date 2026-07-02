import { cn } from "@/lib/utils";

export function TerminalCard({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface font-mono shadow-[0_18px_30px_-14px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-[--terminal-bar] px-3.5 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] ring-1 ring-black/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] ring-1 ring-black/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] ring-1 ring-black/20" />
        <span className="ml-1.5 text-[11px] tracking-wide text-text-dim/70">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
