import type { Metadata } from "next";

import { AppShell } from "@/components/shell/app-shell";
import { getWebApplicationService } from "@/lib/server/app-service";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "TestDaF / Dafinitiv",
  description: "AI-first TestDaF preparation studio"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { runtime } = getWebApplicationService();

  return (
    <html lang="de">
      <body>
        <AppShell runtimeLabel={runtime.label}>{children}</AppShell>
      </body>
    </html>
  );
}
