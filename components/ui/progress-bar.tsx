import { cn } from "@/lib/utils";

export function ProgressBar({
  className,
  tone = "primary",
  value
}: {
  className?: string;
  tone?: "muted" | "primary" | "secondary" | "tertiary";
  value: number;
}) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-surface-container", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-[width]",
          tone === "primary" && "bg-cta-gradient",
          tone === "secondary" && "bg-secondary",
          tone === "tertiary" && "bg-tertiary",
          tone === "muted" && "bg-surface-variant"
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
