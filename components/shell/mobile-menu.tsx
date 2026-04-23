"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { BrandLockup } from "@/components/shell/brand-lockup";
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

const MOBILE_ITEMS: Array<{ href: string; icon: IconName; label: string; match?: RegExp }> = [
  { href: "/", icon: "home", label: "Home", match: /^\/$/ },
  { href: "/lesen", icon: "book", label: "Lesen" },
  { href: "/hoeren", icon: "headphones", label: "Hören" },
  { href: "/schreiben", icon: "pencil", label: "Schreiben" },
  { href: "/sprechen", icon: "mic", label: "Sprechen" },
  { href: "/grammar-library", icon: "layers", label: "Grammatik" },
  { href: "/mistake-notebook", icon: "notebook", label: "Notebook" },
  { href: "/chat-exercises", icon: "sparkles", label: "Chat Exercises" },
  { href: PRACTICE_HREF, icon: "sparkles", label: "Üben", match: /^\/workspace/ },
  { href: "/llm-test", icon: "rocket", label: "LLM Test" },
  { href: "/mock-test", icon: "target", label: "Mock-Test" },
  { href: "/trial", icon: "settings", label: "Trial" }
];

function isActive(pathname: string, href: string, match?: RegExp): boolean {
  if (match) {
    return match.test(pathname);
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const activeLabel = useMemo(
    () => MOBILE_ITEMS.find((item) => isActive(pathname, item.href, item.match))?.label ?? "Menu",
    [pathname]
  );
  const drawer = open ? (
    <>
      <div
        aria-hidden={false}
        className="fixed inset-0 z-50 bg-surface/72 backdrop-blur-sm transition-opacity duration-200 md:hidden"
        onClick={() => setOpen(false)}
      />

      <aside
        aria-modal={true}
        className="fixed inset-y-0 right-0 z-[60] flex h-dvh w-[min(88vw,24rem)] max-w-full flex-col bg-surface-container-lowest shadow-2xl transition-transform duration-200 md:hidden translate-x-0"
        id="mobile-navigation-drawer"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-3 border-b border-outline-variant/20 px-4 py-4">
          <BrandLockup compact showDescriptor={false} />
          <button
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface shadow-soft ghost-outline transition-colors hover:bg-surface-container-high"
            onClick={() => setOpen(false)}
            type="button"
          >
            <AppIcon className="h-4 w-4" name="x" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <nav className="flex flex-col gap-1.5">
            {MOBILE_ITEMS.map((item) => {
              const active = isActive(pathname, item.href, item.match);

              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-[1.35rem] px-4 py-3 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      active ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"
                    )}
                  >
                    <AppIcon className="h-4 w-4" name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  ) : null;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        aria-controls="mobile-navigation-drawer"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-on-surface shadow-soft ghost-outline transition-colors hover:bg-surface-container md:hidden"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <AppIcon className="h-4 w-4" name={open ? "x" : "menu"} />
        <span className="max-w-[6rem] truncate">{open ? "Close" : activeLabel}</span>
      </button>

      {open && typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </>
  );
}
