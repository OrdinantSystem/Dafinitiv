"use client";

import { usePathname } from "next/navigation";

import { SidebarNav } from "@/components/shell/sidebar-nav";
import { TopBar, getShellChromeViewModel } from "@/components/shell/top-bar";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  runtimeLabel
}: {
  children: React.ReactNode;
  runtimeLabel: string;
}) {
  const pathname = usePathname();
  const workspaceLike = pathname.startsWith("/workspace");
  const shellChrome = getShellChromeViewModel(pathname, runtimeLabel);
  const topPaddingClass =
    shellChrome.shellMode === "workspace_strip"
      ? "pt-[4.75rem] md:pt-[5rem]"
      : shellChrome.shellMode === "minimal"
        ? "pt-0"
        : "pt-[5.75rem] md:pt-[6rem]";

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SidebarNav pathname={pathname} />
      <TopBar pathname={pathname} runtimeLabel={runtimeLabel} />
      <main
        className={cn(
          "relative z-0 pb-10 md:ml-72 md:pb-12",
          topPaddingClass,
          workspaceLike ? "px-0 md:px-0" : "px-4 md:px-8"
        )}
      >
        {children}
      </main>
    </div>
  );
}
