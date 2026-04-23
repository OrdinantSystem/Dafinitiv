import { notFound } from "next/navigation";

import { TESTDAF_EXERCISES, getExerciseSpec, getExercisesBySection } from "@/src/domain/testdaf";
import type { SectionId } from "@/src/domain/exercise-ids";
import type { ExerciseSpec } from "@/src/domain/types";

import {
  mapDashboardToViewModel,
  mapGrammarLibraryToViewModel,
  mapMistakeNotebookToViewModel,
  mapMockResultsToViewModel,
  mapPendingExerciseWorkspaceToViewModel,
  mapSectionHubToViewModel,
  mapExerciseWorkspaceToViewModel,
  mapGrammarWorkspaceToViewModel,
  mapMistakeWorkspaceToViewModel,
  findExerciseBySlug,
  resolveWorkspaceVariant
} from "@/lib/mappers";
import {
  buildDemoLearnerState,
  getDemoActivity,
  getDemoNotebookEntries
} from "@/lib/mock-data/demo";
import { getWebApplicationService } from "@/lib/server/app-service";
import {
  readWorkspaceLaunchContext,
  type WorkspaceLaunchContext
} from "@/lib/workspace-context";
import { serverDebugLog } from "@/lib/server/debug-log";
import type { WorkspaceDebugViewModel } from "@/lib/mappers/types";

const SECTION_IDS: SectionId[] = ["lesen", "hoeren", "schreiben", "sprechen"];
type WorkspaceRouteSearchParams = Record<string, string | string[] | undefined>;

function getBaseUrlHost(baseUrl: string): string {
  try {
    return new URL(baseUrl).host;
  } catch {
    return baseUrl;
  }
}

function buildWorkspaceDebugInfo(input: {
  enabled: boolean;
  runtimeMode: "live" | "fallback";
  runtimeLabel: string;
  variant: "exercise" | "grammar" | "mistake" | "mock";
  slug: string;
  configuredModel: string;
  baseUrl: string;
  usesLlmOnReady: boolean;
  usesLlmOnSubmit: boolean;
}): WorkspaceDebugViewModel {
  return {
    enabled: input.enabled,
    route: `/workspace/${input.variant}/${input.slug}`,
    runtimeMode: input.runtimeMode,
    runtimeLabel: input.runtimeLabel,
    realLlmEnabled: input.runtimeMode === "live",
    debugLoggingEnabled: input.enabled,
    configuredModel: input.configuredModel,
    baseUrlHost: getBaseUrlHost(input.baseUrl),
    usesLlmOnReady: input.usesLlmOnReady,
    usesLlmOnSubmit: input.usesLlmOnSubmit
  };
}

function resolveExerciseWorkspaceConfig(input: {
  variant: "exercise" | "mock";
  slug: string;
  context: WorkspaceLaunchContext;
  learnerState: ReturnType<typeof buildDemoLearnerState>;
  service: ReturnType<typeof getWebApplicationService>["service"];
}):
  | {
      variant: "exercise" | "mock";
      slug: string;
      mode: "guided" | "mock";
      spec: ExerciseSpec;
      context: WorkspaceLaunchContext;
    }
  | null {
  if (input.variant === "exercise") {
    const exercise = resolveExerciseWorkspaceTarget({
      slug: input.slug,
      context: input.context,
      learnerState: input.learnerState,
      service: input.service
    });

    if (!exercise) {
      return null;
    }

    return {
      variant: input.variant,
      slug: input.slug,
      mode: "guided",
      spec: exercise,
      context: input.context
    };
  }

  const mockPlan = input.service.buildMockExamPlan();
  const sectionSlug =
    input.slug === "full" ? undefined : SECTION_IDS.find((sectionId) => sectionId === input.slug);
  const exerciseId = sectionSlug
    ? getExercisesBySection(sectionSlug)[0]?.id
    : mockPlan.sections[0]?.exerciseIds[0];

  if (!exerciseId) {
    return null;
  }

  return {
    variant: input.variant,
    slug: input.slug,
    mode: "mock",
    spec: getExerciseSpec(exerciseId),
    context: {
      ...input.context,
      section: input.context.section ?? sectionSlug,
      agentRole: input.context.agentRole ?? "mock_exam_runner"
    }
  };
}

function buildWorkspaceDebugState(input: {
  env: ReturnType<typeof getWebApplicationService>["env"];
  runtime: ReturnType<typeof getWebApplicationService>["runtime"];
  variant: "exercise" | "grammar" | "mistake" | "mock";
  slug: string;
  usesLlmOnReady: boolean;
  usesLlmOnSubmit: boolean;
}): WorkspaceDebugViewModel {
  return buildWorkspaceDebugInfo({
    enabled: input.env.APP_ENABLE_DEBUG_LOGS,
    runtimeMode: input.runtime.mode,
    runtimeLabel: input.runtime.label,
    variant: input.variant,
    slug: input.slug,
    configuredModel: input.env.OPENAI_MODEL,
    baseUrl: input.env.OPENAI_BASE_URL,
    usesLlmOnReady: input.usesLlmOnReady,
    usesLlmOnSubmit: input.usesLlmOnSubmit
  });
}

function findExerciseByHint(hint?: string): ExerciseSpec | undefined {
  if (!hint) {
    return undefined;
  }

  return TESTDAF_EXERCISES.find((exercise) => exercise.id === hint || exercise.slug === hint);
}

function resolveAdaptiveExercise(input: {
  context: WorkspaceLaunchContext;
  learnerState: ReturnType<typeof buildDemoLearnerState>;
  service: ReturnType<typeof getWebApplicationService>["service"];
}): ExerciseSpec | undefined {
  const hintedExercise = findExerciseByHint(input.context.exerciseHint);
  if (hintedExercise) {
    return hintedExercise;
  }

  if (input.context.section) {
    const sectionExercises = getExercisesBySection(input.context.section);
    const skillMatchedExercise = input.context.focusSkill
      ? sectionExercises.find((exercise) => exercise.skillTags.includes(input.context.focusSkill as never))
      : undefined;

    return skillMatchedExercise ?? sectionExercises[0];
  }

  if (
    input.context.sourcePage === "dashboard" ||
    input.context.sourcePage === "study_plan" ||
    input.context.sourcePage === "mock_results"
  ) {
    const studyPlan = input.service.generateStudyPlan(input.learnerState);
    const prioritizedExerciseId = studyPlan.flatMap((item) => item.exerciseIds)[0];

    if (prioritizedExerciseId) {
      return getExerciseSpec(prioritizedExerciseId);
    }

    const focusSkill = studyPlan[0]?.focusSkills[0];
    if (focusSkill) {
      return TESTDAF_EXERCISES.find((exercise) => exercise.skillTags.includes(focusSkill));
    }
  }

  if (input.context.focusSkill) {
    const focusMatchedExercise = TESTDAF_EXERCISES.find((exercise) =>
      exercise.skillTags.includes(input.context.focusSkill as never)
    );

    if (focusMatchedExercise) {
      return focusMatchedExercise;
    }
  }

  return TESTDAF_EXERCISES[0];
}

function resolveExerciseWorkspaceTarget(input: {
  slug: string;
  context: WorkspaceLaunchContext;
  learnerState: ReturnType<typeof buildDemoLearnerState>;
  service: ReturnType<typeof getWebApplicationService>["service"];
}): ExerciseSpec | undefined {
  if (input.slug !== "adaptive") {
    return findExerciseBySlug(input.slug);
  }

  return resolveAdaptiveExercise({
    context: input.context,
    learnerState: input.learnerState,
    service: input.service
  });
}

export function getDashboardViewModel() {
  const { env, runtime, service } = getWebApplicationService();
  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);
  const studyPlan = service.generateStudyPlan(learnerState);

  return mapDashboardToViewModel({
    learnerState,
    studyPlan,
    recentActivity: getDemoActivity(),
    llmStatus: runtime.label
  });
}

export function getSectionHubViewModel(section: SectionId) {
  const { env } = getWebApplicationService();
  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);

  return mapSectionHubToViewModel({
    section,
    exercises: getExercisesBySection(section),
    learnerState
  });
}

export function getGrammarLibraryViewModel() {
  const { env, service } = getWebApplicationService();
  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);
  const brief = service.buildGrammarTrainingBrief(learnerState);

  return mapGrammarLibraryToViewModel({
    learnerState,
    brief
  });
}

export function getMistakeNotebookViewModel() {
  return mapMistakeNotebookToViewModel({
    entries: getDemoNotebookEntries()
  });
}

export function getMockSetupData() {
  const { env, runtime, service } = getWebApplicationService();
  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);

  return {
    runtime,
    learnerState,
    mockPlan: service.buildMockExamPlan()
  };
}

export function getMockResultsViewModel(sessionId: string) {
  const { env, service } = getWebApplicationService();
  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);
  const studyPlan = service.generateStudyPlan(learnerState);

  return mapMockResultsToViewModel({
    sessionId,
    learnerState,
    mockPlan: service.buildMockExamPlan(),
    studyPlan
  });
}

export async function getWorkspaceViewModel(
  variantParam: string,
  slug: string,
  searchParams?: WorkspaceRouteSearchParams
) {
  const { env, runtime, service } = getWebApplicationService();
  const variant = resolveWorkspaceVariant(variantParam);

  if (!variant) {
    notFound();
  }

  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);
  const context = readWorkspaceLaunchContext(searchParams);

  serverDebugLog("workspace-page", "route.opened", {
    variant,
    slug,
    sourcePage: context.sourcePage ?? null,
    runtimeMode: runtime.mode,
    realLlmEnabled: runtime.enabled
  });

  if (variant === "exercise") {
    const config = resolveExerciseWorkspaceConfig({
      variant,
      slug,
      context,
      learnerState,
      service
    });
    if (!config) {
      notFound();
    }

    serverDebugLog("workspace-page", "generation.awaiting_ready", {
      variant,
      slug,
      exerciseId: config.spec.id,
      mode: config.mode
    });

    return {
      ...mapPendingExerciseWorkspaceToViewModel({
        variant: config.variant,
        slug: config.slug,
        mode: config.mode,
        spec: config.spec,
        context: config.context
      }),
      debug: buildWorkspaceDebugState({
        env,
        runtime,
        variant,
        slug,
        usesLlmOnReady: true,
        usesLlmOnSubmit: true
      })
    };
  }

  if (variant === "mock") {
    const config = resolveExerciseWorkspaceConfig({
      variant,
      slug,
      context,
      learnerState,
      service
    });
    if (!config) {
      notFound();
    }

    serverDebugLog("workspace-page", "generation.awaiting_ready", {
      variant,
      slug,
      exerciseId: config.spec.id,
      mode: config.mode
    });

    return {
      ...mapPendingExerciseWorkspaceToViewModel({
        variant: config.variant,
        slug: config.slug,
        mode: config.mode,
        spec: config.spec,
        context: config.context
      }),
      debug: buildWorkspaceDebugState({
        env,
        runtime,
        variant,
        slug,
        usesLlmOnReady: true,
        usesLlmOnSubmit: false
      })
    };
  }

  if (variant === "grammar") {
    const brief = service.buildGrammarTrainingBrief(learnerState);

    return {
      ...mapGrammarWorkspaceToViewModel({
        slug,
        rationale: brief.rationale,
        focusSkills: brief.focusSkills,
        context
      }),
      debug: buildWorkspaceDebugState({
        env,
        runtime,
        variant,
        slug,
        usesLlmOnReady: false,
        usesLlmOnSubmit: false
      })
    };
  }

  const notebookEntries = getDemoNotebookEntries();
  const entry = notebookEntries.find((item) => item.id === slug) ?? notebookEntries[0];

  return {
    ...mapMistakeWorkspaceToViewModel({
      slug,
      entry,
      context
    }),
    debug: buildWorkspaceDebugState({
      env,
      runtime,
      variant,
      slug,
      usesLlmOnReady: false,
      usesLlmOnSubmit: false
    })
  };
}

export async function generateWorkspaceExerciseViewModel(input: {
  variant: "exercise" | "mock";
  slug: string;
  context?: WorkspaceLaunchContext;
}) {
  const { env, runtime, service } = getWebApplicationService();
  const learnerState = buildDemoLearnerState(env.APP_DEMO_USER_ID);
  const context = input.context ?? {};
  const config = resolveExerciseWorkspaceConfig({
    variant: input.variant,
    slug: input.slug,
    context,
    learnerState,
    service
  });

  if (!config) {
    throw new Error("Unable to resolve workspace exercise for manual generation.");
  }

  serverDebugLog("workspace-page", "generation.start", {
    variant: config.variant,
    slug: config.slug,
    exerciseId: config.spec.id,
    mode: config.mode
  });

  const instance = await service.generateExercise({
    exerciseId: config.spec.id,
    mode: config.mode,
    learnerState
  });

  serverDebugLog("workspace-page", "generation.complete", {
    variant: config.variant,
    slug: config.slug,
    exerciseId: config.spec.id,
    instanceId: instance.instanceId,
    mode: config.mode
  });

  return {
    ...mapExerciseWorkspaceToViewModel({
      variant: config.variant,
      slug: config.slug,
      mode: config.mode,
      instance,
      context: config.context
    }),
    debug: buildWorkspaceDebugState({
      env,
      runtime,
      variant: config.variant,
      slug: config.slug,
      usesLlmOnReady: true,
      usesLlmOnSubmit: config.variant === "exercise"
    })
  };
}
