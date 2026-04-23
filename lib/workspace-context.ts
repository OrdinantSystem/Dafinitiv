import type { ExerciseId, SectionId } from "@/src/domain/exercise-ids";
import type { AgentRole } from "@/src/domain/types";

import { getExerciseSlug } from "@/lib/utils";

export type WorkspaceSourcePage =
  | "dashboard"
  | "section_hub"
  | "grammar_library"
  | "mistake_notebook"
  | "mock_setup"
  | "mock_results"
  | "study_plan"
  | "workspace";

export interface WorkspaceLaunchContext {
  sourcePage?: WorkspaceSourcePage;
  section?: SectionId;
  focusSkill?: string;
  agentRole?: AgentRole;
  exerciseHint?: string;
}

type WorkspaceHrefVariant = "exercise" | "grammar" | "mistake" | "mock";
type WorkspaceSearchParams =
  | Record<string, string | string[] | undefined>
  | URLSearchParams
  | undefined;

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buildQueryString(context?: WorkspaceLaunchContext): string {
  if (!context) {
    return "";
  }

  const params = new URLSearchParams();

  if (context.sourcePage) {
    params.set("from", context.sourcePage);
  }

  if (context.section) {
    params.set("section", context.section);
  }

  if (context.focusSkill) {
    params.set("focus", context.focusSkill);
  }

  if (context.agentRole) {
    params.set("agent", context.agentRole);
  }

  if (context.exerciseHint) {
    params.set("hint", context.exerciseHint);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function buildWorkspaceHref(input: {
  variant: WorkspaceHrefVariant;
  slug: string;
  context?: WorkspaceLaunchContext;
}): string {
  return `/workspace/${input.variant}/${input.slug}${buildQueryString(input.context)}`;
}

export function buildExerciseWorkspaceHref(
  exerciseId: ExerciseId,
  context?: WorkspaceLaunchContext
): string {
  return buildWorkspaceHref({
    variant: "exercise",
    slug: getExerciseSlug(exerciseId),
    context: {
      ...context,
      exerciseHint: context?.exerciseHint ?? exerciseId
    }
  });
}

export function buildGrammarWorkspaceHref(
  slug: string,
  context?: WorkspaceLaunchContext
): string {
  return buildWorkspaceHref({
    variant: "grammar",
    slug,
    context
  });
}

export function buildMistakeWorkspaceHref(
  slug: string,
  context?: WorkspaceLaunchContext
): string {
  return buildWorkspaceHref({
    variant: "mistake",
    slug,
    context
  });
}

export function buildMockWorkspaceHref(
  slug: string,
  context?: WorkspaceLaunchContext
): string {
  return buildWorkspaceHref({
    variant: "mock",
    slug,
    context
  });
}

export function readWorkspaceLaunchContext(
  searchParams?: WorkspaceSearchParams
): WorkspaceLaunchContext {
  if (!searchParams) {
    return {};
  }

  if (searchParams instanceof URLSearchParams) {
    return {
      sourcePage: (searchParams.get("from") as WorkspaceSourcePage | null) ?? undefined,
      section: (searchParams.get("section") as SectionId | null) ?? undefined,
      focusSkill: searchParams.get("focus") ?? undefined,
      agentRole: (searchParams.get("agent") as AgentRole | null) ?? undefined,
      exerciseHint: searchParams.get("hint") ?? undefined
    };
  }

  return {
    sourcePage: firstValue(searchParams.from) as WorkspaceSourcePage | undefined,
    section: firstValue(searchParams.section) as SectionId | undefined,
    focusSkill: firstValue(searchParams.focus),
    agentRole: firstValue(searchParams.agent) as AgentRole | undefined,
    exerciseHint: firstValue(searchParams.hint)
  };
}

export function formatWorkspaceSourceLabel(sourcePage?: WorkspaceSourcePage): string {
  switch (sourcePage) {
    case "dashboard":
      return "Übersicht";
    case "section_hub":
      return "Sektion Hub";
    case "grammar_library":
      return "Grammatikbibliothek";
    case "mistake_notebook":
      return "Fehlernotizbuch";
    case "mock_setup":
      return "Mock-Start";
    case "mock_results":
      return "Mock-Auswertung";
    case "study_plan":
      return "Lernplan";
    case "workspace":
      return "Workspace";
    default:
      return "Direkter Einstieg";
  }
}

export function formatWorkspaceAgentLabel(agentRole?: AgentRole): string {
  switch (agentRole) {
    case "study_planner":
      return "Lernpfad-Agent";
    case "exercise_generator":
      return "Aufgaben-Agent";
    case "grammar_trainer":
      return "Grammatik-Coach";
    case "feedback_coach":
      return "Feedback-Coach";
    case "mock_exam_runner":
      return "Mock-Regie";
    case "session_orchestrator":
      return "Session-Orchestrator";
    default:
      return "KI-Tutor";
  }
}
