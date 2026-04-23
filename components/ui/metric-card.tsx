import { Card } from "@/components/ui/card";
import { AppIcon, type IconName } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

export function MetricCard({
  badge,
  className,
  detail,
  icon,
  label,
  progress,
  tone = "default",
  value
}: {
  badge?: string;
  className?: string;
  detail: string;
  icon?: IconName;
  label: string;
  progress: number;
  tone?: "default" | "muted" | "night";
  value: string;
}) {
  const dark = tone === "night";

  return (
    <Card
      className={cn("flex h-full flex-col gap-5", className)}
      tone={tone === "default" ? "default" : tone === "muted" ? "muted" : "night"}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p
            className={cn(
              "text-[0.68rem] font-extrabold uppercase tracking-[0.2em]",
              dark ? "text-white/65" : "text-on-surface-variant"
            )}
          >
            {label}
          </p>
          <p className={cn("text-4xl font-extrabold tracking-[-0.04em]", dark ? "text-white" : "text-on-surface")}>
            {value}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {badge ? (
            <Pill size="sm" tone={dark ? "contrast" : "soft"}>
              {badge}
            </Pill>
          ) : null}
          {icon ? (
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full",
                dark ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
              )}
            >
              <AppIcon className="h-5 w-5" name={icon} strokeWidth={2.1} />
            </div>
          ) : null}
        </div>
      </div>
      <ProgressBar tone={dark ? "muted" : "primary"} value={progress} />
      <p className={cn("text-sm leading-7", dark ? "text-white/72" : "text-on-surface-variant")}>
        {detail}
      </p>
    </Card>
  );
}
