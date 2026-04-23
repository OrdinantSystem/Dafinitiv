import Link from "next/link";

import { AppIcon, type IconName } from "@/components/ui/icon";
import { buildWorkspaceHref } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";

const PRACTICE_HREF = buildWorkspaceHref({
  variant: "exercise",
  slug: "adaptive",
  context: {
    sourcePage: "dashboard",
    agentRole: "study_planner"
  }
});

const MOBILE_ITEMS: Array<{ href: string; icon: IconName; label: string }> = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/lesen", icon: "book", label: "Lesen" },
  { href: "/trial", icon: "settings", label: "Trial" },
  { href: PRACTICE_HREF, icon: "sparkles", label: "Üben" },
  { href: "/llm-test", icon: "rocket", label: "LLM" },
  { href: "/mock-test", icon: "target", label: "Mock" }
];

export function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full bg-surface-container-lowest/95 px-3 py-2 shadow-ambient ghost-outline backdrop-blur-xl md:hidden">
      {MOBILE_ITEMS.map((item) => {
        const active =
          item.label === "Üben"
            ? pathname.startsWith("/workspace")
            : item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

        return (
          <Link
            className={cn(
              "flex min-w-[68px] flex-col items-center gap-1 rounded-full px-3 py-2 text-[0.58rem] font-extrabold uppercase tracking-[0.16em] transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-on-surface-variant hover:bg-surface-container-low"
            )}
            href={item.href}
            key={item.href}
          >
            <AppIcon className="h-4 w-4" name={item.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
