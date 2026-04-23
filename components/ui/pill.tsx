import { cn } from "@/lib/utils";

export function Pill({
  children,
  className,
  size = "md",
  tone = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
  tone?: "contrast" | "neutral" | "primary" | "soft";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-extrabold uppercase tracking-[0.18em]",
        size === "sm" && "px-3 py-1 text-[0.58rem]",
        size === "md" && "px-3.5 py-1.5 text-[0.63rem]",
        tone === "primary" && "bg-primary/10 text-primary",
        tone === "neutral" && "bg-surface-container-high text-on-surface-variant",
        tone === "soft" && "bg-surface-container-lowest text-on-surface ghost-outline",
        tone === "contrast" && "bg-white/15 text-white backdrop-blur-md",
        className
      )}
    >
      {children}
    </span>
  );
}
