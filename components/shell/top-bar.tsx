import type { ShellChromeViewModel } from "@/lib/mappers/types";
import { BrandLockup } from "@/components/shell/brand-lockup";
import { cn } from "@/lib/utils";

function getShellTitle(pathname: string): { title: string; subtitle: string } {
  if (pathname.startsWith("/workspace")) {
    return {
      title: "DaFinitv Workspace",
      subtitle: "Geführter Arbeitsraum"
    };
  }

  if (pathname.startsWith("/_not-found")) {
    return {
      title: "DaFinitv",
      subtitle: "Minimal frame"
    };
  }

  return {
    title: "DaFinitv",
    subtitle: ""
  };
}

export function getShellChromeViewModel(
  pathname: string,
  runtimeLabel: string
): ShellChromeViewModel {
  const titles = getShellTitle(pathname);

  if (pathname.startsWith("/_not-found")) {
    return {
      shellMode: "minimal",
      title: titles.title,
      subtitle: titles.subtitle,
      utilityItems: []
    };
  }

  if (pathname.startsWith("/workspace")) {
    return {
      shellMode: "workspace_strip",
      title: titles.title,
      subtitle: titles.subtitle,
      utilityItems: [
        { label: "Laufzeit", value: runtimeLabel },
        { label: "Modus", value: "Workspace" }
      ]
    };
  }

  return {
    shellMode: "default_strip",
    title: titles.title,
    subtitle: titles.subtitle,
    utilityItems: [
      { label: "Laufzeit", value: runtimeLabel },
      { label: "Studio", value: "DaFinitv" }
    ]
  };
}

export function TopBar({
  pathname,
  runtimeLabel
}: {
  pathname: string;
  runtimeLabel: string;
}) {
  const chrome = getShellChromeViewModel(pathname, runtimeLabel);

  if (chrome.shellMode === "minimal") {
    return null;
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 md:left-72">
      <div
        className={cn(
          "border-b border-outline-variant/16 bg-surface/84 backdrop-blur-2xl",
          chrome.shellMode === "workspace_strip" && "bg-surface/92"
        )}
      >
        <div className="mx-auto flex max-w-editorial items-center justify-between gap-5 px-4 md:px-8">
          <div
            className={cn(
              "min-w-0 py-3",
              chrome.shellMode === "workspace_strip" ? "md:py-3" : "md:py-3.5"
            )}
          >
            {chrome.shellMode === "default_strip" ? (
              <BrandLockup compact showDescriptor={false} />
            ) : (
              <>
                {chrome.subtitle ? (
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.22em] text-on-surface-variant">
                    {chrome.subtitle}
                  </p>
                ) : null}
                <p
                  className={cn(
                    "truncate font-extrabold tracking-[-0.03em] text-on-surface",
                    chrome.subtitle ? "mt-1" : "",
                    chrome.shellMode === "workspace_strip"
                      ? "text-base md:text-[1.05rem]"
                      : "text-lg md:text-[1.1rem]"
                  )}
                >
                  {chrome.title}
                </p>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            {chrome.utilityItems.map((item) => (
              <div
                className="hidden rounded-full bg-surface-container-low px-3 py-2 text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant md:block"
                key={item.label}
              >
                <span className="mr-2 text-on-surface-variant/55">{item.label}</span>
                <span className="text-on-surface">{item.value}</span>
              </div>
            ))}
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
        </div>
        <div className="h-3 bg-gradient-to-b from-surface/55 via-surface/18 to-transparent" />
      </div>
    </header>
  );
}
