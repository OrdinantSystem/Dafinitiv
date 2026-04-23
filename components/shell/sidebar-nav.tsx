import Link from "next/link";

import { BrandLockup } from "@/components/shell/brand-lockup";
import { ButtonLink } from "@/components/ui/button";
import { AppIcon, type IconName } from "@/components/ui/icon";
import { buildWorkspaceHref } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{ href: string; icon: IconName; label: string }> = [
  { href: "/", icon: "home", label: "Übersicht" },
  { href: "/lesen", icon: "book", label: "Lesen" },
  { href: "/hoeren", icon: "headphones", label: "Hören" },
  { href: "/schreiben", icon: "pencil", label: "Schreiben" },
  { href: "/sprechen", icon: "mic", label: "Sprechen" },
  { href: "/grammar-library", icon: "layers", label: "Grammatik" },
  { href: "/mistake-notebook", icon: "notebook", label: "Notebook" },
  { href: "/llm-test", icon: "rocket", label: "LLM Test" },
  { href: "/mock-test", icon: "target", label: "Mock-Test" },
  { href: "/trial", icon: "settings", label: "Trial" }
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(href + "/");
}

export function SidebarNav({ pathname }: { pathname: string }) {
  const startPracticeHref = buildWorkspaceHref({
    variant: "exercise",
    slug: "adaptive",
    context: {
      sourcePage: "dashboard",
      agentRole: "study_planner"
    }
  });

  return (
    <aside className="hidden min-h-screen w-72 flex-col bg-surface-container/95 px-5 py-7 md:fixed md:inset-y-0 md:flex">
      <div className="mb-8 rounded-[2rem] bg-surface-container-lowest/80 px-5 py-5 shadow-soft ghost-outline">
        <BrandLockup />
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              className={cn(
                "group flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200",
                active
                  ? "translate-x-1 bg-surface-container-lowest text-primary shadow-paper ghost-outline"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
              href={item.href}
              key={item.href}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "bg-transparent text-on-surface-variant group-hover:bg-surface-container-lowest group-hover:text-primary"
                )}
              >
                <AppIcon name={item.icon} />
              </span>
              <span className="tracking-[-0.01em]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="panel-stack mt-8">
        <div className="night-panel px-5 py-6">
          <p className="editorial-kicker-contrast">Heute priorisiert</p>
          <p className="mt-4 text-lg font-bold leading-8 tracking-[-0.02em] text-white">
            Verdichtung, Hörpräzision und stabile Nebensatzstruktur.
          </p>
          <p className="mt-3 text-sm leading-7 text-white/68">
            Arbeite zuerst eine geführte Kernaufgabe und überführe das Feedback direkt in
            Grammatik oder Notebook.
          </p>
        </div>

        <div className="rounded-[2rem] bg-surface-container-lowest px-5 py-5 shadow-soft ghost-outline">
          <ButtonLink className="w-full" href={startPracticeHref} size="lg">
            Start Practice
          </ButtonLink>
          <div className="mt-5 space-y-1.5">
            <Link
              className="flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
              href="/grammar-library"
            >
              <AppIcon className="h-4 w-4" name="layers" />
              Kuratierte Library
            </Link>
            <Link
              className="flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
              href="/mock-test"
            >
              <AppIcon className="h-4 w-4" name="target" />
              Prüfungssimulation
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
