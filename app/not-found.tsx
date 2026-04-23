import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/icon";
import { Pill } from "@/components/ui/pill";
import { buildWorkspaceHref } from "@/lib/workspace-context";

export default function NotFound() {
  const recoveryHref = buildWorkspaceHref({
    variant: "exercise",
    slug: "adaptive",
    context: {
      sourcePage: "study_plan",
      agentRole: "study_planner"
    }
  });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 md:px-8">
      <Card className="relative w-full overflow-hidden" tone="night">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Pill tone="contrast">404 • Nicht gefunden</Pill>
          <h1 className="text-[3rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-white md:text-[4rem]">
            Diese Seite gehört nicht mehr zum kuratierten Pfad.
          </h1>
          <p className="text-base leading-8 text-white/74">
            Der angeforderte Raum konnte nicht geladen werden. Wechsle zurück zur Übersicht oder
            öffne direkt den nächsten priorisierten Workspace.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/" size="lg">
              Zur Übersicht
            </ButtonLink>
            <ButtonLink href={recoveryHref} size="lg" variant="inverse">
              Workspace öffnen
            </ButtonLink>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-8 -right-8 text-white/12">
          <AppIcon className="h-40 w-40" name="sparkles" strokeWidth={1.4} />
        </div>
      </Card>
    </div>
  );
}
