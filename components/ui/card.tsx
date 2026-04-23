import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padding = "default",
  tone = "default"
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "compact" | "default" | "spacious" | "none";
  tone?: "default" | "muted" | "accent" | "glass" | "inset" | "night";
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem]",
        padding === "compact" && "p-5 md:p-6",
        padding === "default" && "p-6 md:p-8",
        padding === "spacious" && "p-8 md:p-10",
        padding === "none" && "p-0",
        tone === "default" && "bg-surface-container-lowest shadow-paper ghost-outline",
        tone === "muted" && "bg-surface-container-low shadow-soft",
        tone === "inset" && "bg-surface-container shadow-soft",
        tone === "glass" && "glass-panel ghost-outline shadow-soft",
        tone === "accent" && "bg-cta-gradient text-white shadow-ambient-lg",
        tone === "night" && "night-panel",
        className
      )}
    >
      {children}
    </section>
  );
}
