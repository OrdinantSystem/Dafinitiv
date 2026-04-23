import { cn } from "@/lib/utils";

export function BrandGlyph({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-[1.35rem] bg-cta-gradient text-on-primary shadow-lift",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[1px] rounded-[1.25rem] opacity-80"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.3), transparent 42%), linear-gradient(155deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 58%)"
        }}
      />
      <svg
        aria-hidden="true"
        className="relative h-[68%] w-[68%]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.85"
        viewBox="0 0 24 24"
      >
        <path d="M7 5.5v13" />
        <path d="M7 5.5h4.25c3.7 0 6.25 2.6 6.25 6.5s-2.55 6.5-6.25 6.5H7" />
        <path d="m11.6 9.15 3.8 2.85-3.8 2.85" />
        <circle cx="17.75" cy="6.25" fill="currentColor" opacity="0.9" r="0.8" stroke="none" />
      </svg>
    </span>
  );
}

export function BrandLockup({
  className,
  compact = false,
  showDescriptor = !compact
}: {
  className?: string;
  compact?: boolean;
  showDescriptor?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <BrandGlyph className={compact ? "h-11 w-11 rounded-[1.2rem]" : "h-12 w-12"} />
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-extrabold leading-none tracking-[-0.055em] text-on-surface",
            compact ? "text-[1.15rem]" : "text-[1.35rem]"
          )}
        >
          <span className="text-primary">DaF</span>initv
        </p>
        {showDescriptor ? (
          <p className="mt-1 truncate text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-on-surface-variant/72">
            Adaptive TestDaF Studio
          </p>
        ) : null}
      </div>
    </div>
  );
}
