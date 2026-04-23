import type { ExerciseId, SectionId } from "@/src/domain/exercise-ids";
import type { ResponseKind, SessionMode } from "@/src/domain/types";
import type { WorkspaceLaunchContext } from "@/lib/workspace-context";

export type WorkspaceVariant = "exercise" | "grammar" | "mistake" | "mock";
export type ShellChromeMode = "default_strip" | "workspace_strip" | "minimal";

export interface ShellChromeUtilityItem {
  label: string;
  value: string;
}

export interface ShellChromeViewModel {
  shellMode: ShellChromeMode;
  title: string;
  subtitle: string;
  utilityItems: ShellChromeUtilityItem[];
}

export interface SectionPerformanceViewModel {
  section: SectionId;
  label: string;
  score: number;
  tdn: string;
  href: string;
}

export interface DashboardViewModel {
  llmStatus: string;
  sections: SectionPerformanceViewModel[];
  weakSkills: Array<{
    label: string;
    level: number;
    confidence: number;
  }>;
  studyPlan: Array<{
    id: string;
    title: string;
    reason: string;
    href: string;
    mode: string;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    accent: string;
  }>;
}

export interface SectionHubViewModel {
  section: SectionId;
  title: string;
  subtitle: string;
  accentLabel: string;
  textFirstNote?: string;
  metrics: Array<{
    label: string;
    value: string;
    detail: string;
    progress: number;
    tone: "primary" | "secondary" | "tertiary";
  }>;
  focusCards: Array<{
    title: string;
    description: string;
    badge: string;
    href: string;
    ctaLabel: string;
  }>;
  exercises: Array<{
    id: ExerciseId;
    slug: string;
    label: string;
    timing: string;
    responseKind: string;
    supportNote: string;
    href: string;
    skillTags: string[];
  }>;
  challenge: {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
  };
}

export interface GrammarLibraryViewModel {
  title: string;
  subtitle: string;
  mastery: number;
  featuredRecommendation: {
    title: string;
    rationale: string;
    focusSkills: string[];
    href: string;
    durationLabel: string;
    levelLabel: string;
  };
  secondaryRecommendations: Array<{
    title: string;
    summary: string;
    href: string;
    levelLabel: string;
    statusLabel: string;
    durationLabel: string;
    accent: "paper" | "teal";
  }>;
  curriculumGroups: Array<{
    title: string;
    accent: "primary" | "secondary" | "tertiary";
    lessons: Array<{
      title: string;
      summary: string;
      href: string;
      badge: string;
      statusLabel: string;
      durationLabel: string;
      progressPercent?: number;
      emphasis?: boolean;
    }>;
  }>;
  filters: {
    statuses: Array<{
      label: string;
      count: number;
      active: boolean;
    }>;
    levels: Array<{
      label: string;
      active: boolean;
    }>;
    skills: Array<{
      label: string;
      active: boolean;
    }>;
  };
  pulse: {
    title: string;
    text: string;
    metricLabel: string;
    metricValue: string;
  };
}

export interface MistakeNotebookViewModel {
  title: string;
  subtitle: string;
  meta: {
    countLabel: string;
    updatedLabel: string;
  };
  filterChips: Array<{
    label: string;
    active: boolean;
  }>;
  featuredEntry: {
    id: string;
    title: string;
    category: string;
    mistake: string;
    correction: string;
    explanation: string;
    linkedSkill: string;
    href: string;
    statusLabel: string;
    tags: string[];
  };
  supportingEntry: {
    id: string;
    title: string;
    category: string;
    explanation: string;
    href: string;
    statusLabel: string;
    statLabel: string;
  };
  compactEntry: {
    id: string;
    title: string;
    category: string;
    mistake: string;
    correction: string;
    explanation: string;
    href: string;
  };
  roadmap: {
    title: string;
    text: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    primaryHref: string;
    secondaryHref: string;
  };
  footerStats: Array<{
    label: string;
    value: string;
    tone?: "primary" | "secondary";
  }>;
  footerPrompt: string;
}

export interface MockResultsViewModel {
  sessionId: string;
  headline: string;
  summary: string;
  overallAccuracy: number;
  targetDelta: string;
  heroStats: Array<{
    label: string;
    value: string;
  }>;
  bridge: {
    title: string;
    progressPercent: number;
    currentLevel: string;
    thresholdLevel: string;
    targetLevel: string;
    requiredGains: Array<{
      label: string;
      delta: string;
    }>;
    insightTitle: string;
    insightText: string;
  };
  sectionResults: SectionPerformanceViewModel[];
  roadmap: Array<{
    id: string;
    title: string;
    text: string;
    href: string;
  }>;
  cta: {
    title: string;
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
}

export interface WorkspaceFieldViewModel {
  id: string;
  label: string;
  kind: "radio" | "text" | "textarea";
  placeholder?: string;
  options?: string[];
}

export interface WorkspaceTimelineMessage {
  id: string;
  role: "assistant" | "system";
  label: string;
  content: string;
}

export interface WorkspaceDebugViewModel {
  enabled: boolean;
  route: string;
  runtimeMode: "live" | "fallback";
  runtimeLabel: string;
  realLlmEnabled: boolean;
  debugLoggingEnabled: boolean;
  configuredModel: string;
  baseUrlHost: string;
  usesLlmOnReady: boolean;
  usesLlmOnSubmit: boolean;
}

export interface WorkspaceGenerationViewModel {
  status: "pending" | "generated" | "not_applicable";
  ctaLabel?: string;
  prompt?: string;
}

export interface WorkspaceViewModel {
  variant: WorkspaceVariant;
  slug: string;
  mode: SessionMode;
  title: string;
  eyebrow: string;
  description: string;
  strictChrome: boolean;
  progressLabel: string;
  timerLabel: string;
  supportBadge: string;
  contextLabel: string;
  agentLabel: string;
  resolvedFrom: string;
  shellUtilityItems: ShellChromeUtilityItem[];
  launchContext?: WorkspaceLaunchContext;
  taskTitle: string;
  taskInstructions: string;
  workspaceMeta: Array<{
    label: string;
    value: string;
  }>;
  materialsLabel: string;
  responseLabel: string;
  composerPlaceholder: string;
  materials: Array<{
    title: string;
    kind: string;
    content: string;
  }>;
  questions: Array<{
    id: string;
    prompt: string;
    options?: string[];
    expectedResponseShape: string;
  }>;
  responseKind: ResponseKind | "reflection";
  responseFields: WorkspaceFieldViewModel[];
  submitLabel: string;
  helperText: string;
  timeline: WorkspaceTimelineMessage[];
  generation: WorkspaceGenerationViewModel;
  nextLink?: {
    label: string;
    href: string;
  };
  debug?: WorkspaceDebugViewModel;
  postSubmitOptions?: Array<{
    label: string;
    href: string;
    variant: "primary" | "secondary";
  }>;
  exerciseId?: ExerciseId;
  exerciseInstanceId?: string;
  answerKey?: string[];
  postSubmitMode: "immediate_feedback" | "deferred" | "reflection";
}

export interface WorkspaceSubmissionInput {
  variant: WorkspaceVariant;
  mode: SessionMode;
  postSubmitMode: WorkspaceViewModel["postSubmitMode"];
  responseKind: WorkspaceViewModel["responseKind"];
  exerciseId?: ExerciseId;
  exerciseInstanceId?: string;
  answerKey?: string[];
  responseText?: string;
  responseFields?: Record<string, string>;
  selectedOptions?: string[];
}

export interface WorkspaceSubmissionResult {
  mode: "evaluated" | "deferred" | "reflection";
  headline: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  nextActions: string[];
  recommendedPromptIds?: string[];
  estimatedTdn?: string;
  providerMode?: string;
}
