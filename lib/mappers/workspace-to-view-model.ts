import { TESTDAF_EXERCISES, getExerciseSpec } from "@/src/domain/testdaf";
import type { SectionId } from "@/src/domain/exercise-ids";
import type {
  AgentRole,
  ExerciseInstance,
  ExerciseSpec,
  ResponseKind,
  SessionMode
} from "@/src/domain/types";

import type { DemoNotebookEntry } from "@/lib/mock-data/demo";
import type {
  ShellChromeUtilityItem,
  WorkspaceFieldViewModel,
  WorkspaceVariant,
  WorkspaceViewModel
} from "@/lib/mappers/types";
import {
  buildGrammarWorkspaceHref,
  buildWorkspaceHref,
  formatWorkspaceAgentLabel,
  formatWorkspaceSourceLabel,
  type WorkspaceLaunchContext
} from "@/lib/workspace-context";
import {
  formatResponseKind,
  formatSectionLabel,
  formatSupportLevel,
  getSectionHref
} from "@/lib/utils";

export function resolveWorkspaceVariant(input: string): WorkspaceVariant | null {
  if (input === "exercise" || input === "grammar" || input === "mistake" || input === "mock") {
    return input;
  }

  return null;
}

export function findExerciseBySlug(slug: string): ExerciseSpec | undefined {
  return TESTDAF_EXERCISES.find((exercise) => exercise.slug === slug);
}

function buildTimerLabel(spec: ExerciseSpec, mode: SessionMode): string {
  if (mode === "mock" && spec.timing.totalMinutesApprox) {
    return String(spec.timing.totalMinutesApprox) + " Min. Mock-Rahmen";
  }

  if (spec.timing.totalMinutesApprox) {
    return String(spec.timing.totalMinutesApprox) + " Min. Fokuszeit";
  }

  if (spec.timing.speakingSec) {
    return String(Math.round(spec.timing.speakingSec / 60)) + " Min. Sprechfenster";
  }

  return "Adaptiver Takt";
}

function buildResponseFields(instance: ExerciseInstance): WorkspaceFieldViewModel[] {
  if (instance.questions.length === 0) {
    return [
      {
        id: "responseText",
        label: "Ihre Antwort",
        kind: "textarea",
        placeholder: "Formulieren Sie Ihre Antwort präzise und aufgabenbezogen."
      }
    ];
  }

  if (instance.questions[0]?.options) {
    return instance.questions.map((question) => ({
      id: question.id,
      label: question.prompt,
      kind: "radio",
      options: question.options
    }));
  }

  if (instance.answerConstraints.maxWordsPerField) {
    return instance.questions.map((question) => ({
      id: question.id,
      label: question.prompt,
      kind: "text",
      placeholder: "Kurzantwort"
    }));
  }

  return [
    {
      id: "responseText",
      label: "Ihre Antwort",
      kind: "textarea",
      placeholder:
        instance.mode === "mock"
          ? "Antwort im Prüfungsstil formulieren"
          : "Antwort verfassen, dann gezielt prüfen lassen"
    }
  ];
}

function buildComposerPlaceholder(responseKind: ResponseKind | "reflection", mode: SessionMode): string {
  if (responseKind === "selection") {
    return "Auswahl prüfen oder um einen Hinweis bitten ...";
  }

  if (responseKind === "short_text") {
    return "Kurzantwort verdichten oder Rückfrage notieren ...";
  }

  if (responseKind === "reflection") {
    return "Selbstkorrektur, Transferidee oder offene Frage notieren ...";
  }

  return mode === "mock"
    ? "Prüfungsantwort verfassen und bei Bedarf letzte Notiz ergänzen ..."
    : "Antwort schreiben oder einen gezielten Hinweis anfordern ...";
}

function resolveAgentRole(
  variant: WorkspaceVariant,
  context?: WorkspaceLaunchContext
): AgentRole | undefined {
  if (context?.agentRole) {
    return context.agentRole;
  }

  if (variant === "grammar") {
    return "grammar_trainer";
  }

  if (variant === "mistake") {
    return "feedback_coach";
  }

  if (variant === "mock") {
    return "mock_exam_runner";
  }

  if (context?.sourcePage === "dashboard" || context?.sourcePage === "study_plan" || context?.sourcePage === "mock_results") {
    return "study_planner";
  }

  return "exercise_generator";
}

function formatFocusLabel(focusSkill?: string): string | undefined {
  if (!focusSkill) {
    return undefined;
  }

  const segments = focusSkill.split(".");
  const tail = segments[segments.length - 1] ?? focusSkill;
  return tail.replace(/_/g, " ");
}

function resolveContextLabel(input: {
  context?: WorkspaceLaunchContext;
  fallbackSection?: SectionId;
  variant: WorkspaceVariant;
  mode: SessionMode;
}): string {
  const sectionLabel = input.context?.section
    ? formatSectionLabel(input.context.section)
    : input.fallbackSection
      ? formatSectionLabel(input.fallbackSection)
      : undefined;
  const focusLabel = formatFocusLabel(input.context?.focusSkill);

  switch (input.context?.sourcePage) {
    case "dashboard":
    case "study_plan":
      return sectionLabel ? `Priorisiert · ${sectionLabel}` : "Priorisierte Session";
    case "section_hub":
      return sectionLabel ? `${sectionLabel} Hub` : "Sektion Hub";
    case "grammar_library":
      return focusLabel ? `Grammatiktransfer · ${focusLabel}` : "Grammatiktransfer";
    case "mistake_notebook":
      return focusLabel ? `Fehlermuster · ${focusLabel}` : "Fehlermuster-Transfer";
    case "mock_setup":
      return sectionLabel ? `Mock · ${sectionLabel}` : "Mock-Einstieg";
    case "mock_results":
      return sectionLabel ? `Auswertung · ${sectionLabel}` : "Auswertungstransfer";
    case "workspace":
      return sectionLabel ? `${sectionLabel} Workspace` : "Workspace";
    default:
      if (input.mode === "mock") {
        return sectionLabel ? `Prüfungsrahmen · ${sectionLabel}` : "Prüfungsrahmen";
      }

      if (input.variant === "grammar") {
        return "Grammatik-Remediation";
      }

      if (input.variant === "mistake") {
        return "Notebook-Transfer";
      }

      return sectionLabel ? `${sectionLabel} Fokus` : "Direkter Fokus";
  }
}

function buildShellUtilityItems(input: {
  contextLabel: string;
  resolvedFrom: string;
  agentLabel: string;
}): ShellChromeUtilityItem[] {
  return [
    { label: "Quelle", value: input.resolvedFrom },
    { label: "Agent", value: input.agentLabel },
    { label: "Fokus", value: input.contextLabel }
  ];
}

function buildReturnLink(input: {
  context?: WorkspaceLaunchContext;
  fallbackSection?: SectionId;
  variant: WorkspaceVariant;
}): { label: string; href: string } {
  switch (input.context?.sourcePage) {
    case "dashboard":
      return { label: "Zur Übersicht", href: "/" };
    case "study_plan":
      return { label: "Zum Lernplan", href: "/" };
    case "section_hub":
      if (input.context.section) {
        return {
          label: `Zu ${formatSectionLabel(input.context.section)}`,
          href: getSectionHref(input.context.section)
        };
      }
      break;
    case "grammar_library":
      return { label: "Zur Grammatikbibliothek", href: "/grammar-library" };
    case "mistake_notebook":
      return { label: "Zum Fehlernotizbuch", href: "/mistake-notebook" };
    case "mock_setup":
    case "mock_results":
      return { label: "Zur Mock-Übersicht", href: "/mock-test" };
  }

  if (input.variant === "grammar") {
    return { label: "Zur Grammatikbibliothek", href: "/grammar-library" };
  }

  if (input.variant === "mistake") {
    return { label: "Zum Fehlernotizbuch", href: "/mistake-notebook" };
  }

  if (input.variant === "mock") {
    return { label: "Zur Mock-Übersicht", href: "/mock-test" };
  }

  if (input.fallbackSection) {
    return {
      label: `Zu ${formatSectionLabel(input.fallbackSection)}`,
      href: getSectionHref(input.fallbackSection)
    };
  }

  return { label: "Zur Übersicht", href: "/" };
}

function inferSectionFromSkill(focusSkill?: string): SectionId | undefined {
  if (!focusSkill) {
    return undefined;
  }

  if (focusSkill.startsWith("reading.")) {
    return "lesen";
  }

  if (focusSkill.startsWith("listening.")) {
    return "hoeren";
  }

  if (focusSkill.startsWith("speaking.")) {
    return "sprechen";
  }

  if (
    focusSkill.startsWith("grammar.") ||
    focusSkill.startsWith("discourse.") ||
    focusSkill.startsWith("lexicon.") ||
    focusSkill.startsWith("task.")
  ) {
    return "schreiben";
  }

  return undefined;
}

function inferSectionFromNotebookEntry(entry: DemoNotebookEntry): SectionId {
  return inferSectionFromSkill(entry.linkedSkill) ?? "schreiben";
}

function buildAdaptiveFollowUpHref(input: {
  context?: WorkspaceLaunchContext;
  fallbackSection?: SectionId;
  focusSkill?: string;
  agentRole?: AgentRole;
}): string {
  return buildWorkspaceHref({
    variant: "exercise",
    slug: "adaptive",
    context: {
      sourcePage: input.context?.sourcePage ?? "workspace",
      section: input.context?.section ?? input.fallbackSection,
      focusSkill: input.focusSkill ?? input.context?.focusSkill,
      agentRole: input.agentRole ?? "exercise_generator",
      exerciseHint: input.context?.exerciseHint
    }
  });
}

function buildExerciseDescription(
  spec: ExerciseSpec,
  context: WorkspaceLaunchContext | undefined,
  isMock: boolean
): string {
  if (isMock) {
    return "Strenger Prüfungsrahmen mit verzögertem Feedback, ruhiger Sequenzlogik und klarer Taktung.";
  }

  switch (context?.sourcePage) {
    case "dashboard":
    case "study_plan":
      return `Diese Session wurde aus deinem aktuellen Profil priorisiert und öffnet ${spec.officialLabel} direkt im geführten Arbeitsraum.`;
    case "section_hub":
      return `Direkter Sprung aus dem ${formatSectionLabel(context.section ?? spec.section)}-Hub in eine Aufgabenansicht mit klarerem Material-, Antwort- und Feedback-Rhythmus.`;
    case "mock_results":
      return "Die Aufgabe knüpft an die jüngste Mock-Auswertung an und übersetzt den größten Hebel direkt in eine fokussierte Session.";
    default:
      return "Strukturierte Übungsansicht mit direktem Übergang von Aufgabe zu Evaluation und Coaching.";
  }
}

function buildExerciseHelperText(
  context: WorkspaceLaunchContext | undefined,
  mode: SessionMode
): string {
  if (mode === "mock") {
    return "Die Antwort wird aufgenommen, die Rückmeldung bleibt bis zum Ende des Mock-Blocks zurückgehalten.";
  }

  switch (context?.sourcePage) {
    case "dashboard":
    case "study_plan":
      return "Der Lernpfad hat diese Aufgabe priorisiert. Nach dem Absenden bleibt der Transfer in Grammatik oder die nächste Session direkt anschlussfähig.";
    case "mock_results":
      return "Diese Session stammt aus deiner Auswertung. Nach dem Absenden bleibt der Rückweg in die Remediation bewusst kurz.";
    default:
      return "Nach dem Absenden erzeugt das Backend eine strukturierte Evaluation mit Coaching-Feedback.";
  }
}

function buildExerciseIntro(
  spec: ExerciseSpec,
  context: WorkspaceLaunchContext | undefined,
  isMock: boolean
): string {
  if (isMock) {
    return `Heute bearbeiten wir ${spec.officialLabel} im Mock-Rahmen. Arbeite ruhig, halte die Taktung und sichere deine Antwort erst am Ende.`;
  }

  switch (context?.sourcePage) {
    case "dashboard":
    case "study_plan":
      return `Der Lernpfad priorisiert heute ${spec.officialLabel}. Arbeite Material und Hinweise nacheinander durch und halte den Fokus auf den aktuellen Hebel.`;
    case "section_hub":
      return `Du kommst direkt aus dem ${formatSectionLabel(context.section ?? spec.section)}-Hub. Nutze die Session, um genau diese Aufgabenform sauber zu festigen.`;
    case "mock_results":
      return `Diese Aufgabe wurde aus deiner letzten Mock-Auswertung abgeleitet. Ziel ist kein Neustart, sondern gezielte Präzisionsarbeit am größten Hebel.`;
    default:
      return `Heute bearbeiten wir ${spec.officialLabel}. Lies Material und Hinweise aufmerksam, dann formuliere deine Antwort im passenden Register.`;
  }
}

function buildGrammarIntro(context: WorkspaceLaunchContext | undefined): string {
  switch (context?.sourcePage) {
    case "dashboard":
    case "study_plan":
      return "Der Lernpfad verschiebt den Fokus heute kurz auf Grammatik, damit der Transfer in die nächste Kernaufgabe stabiler wird.";
    case "mock_results":
      return "Wir sichern genau die Muster, die in der letzten Auswertung den größten Abstand zu TDN 5 erzeugt haben.";
    default:
      return "Wir fokussieren heute die Muster, die in deinen letzten Aufgaben am häufigsten instabil waren.";
  }
}

function buildMistakeIntro(context: WorkspaceLaunchContext | undefined): string {
  switch (context?.sourcePage) {
    case "dashboard":
    case "study_plan":
      return "Der Lernpfad greift ein wiederkehrendes Fehlermuster direkt auf, damit es vor der nächsten Kernaufgabe bewusst gesichert wird.";
    case "mock_results":
      return "Dieses Muster tauchte in der letzten Auswertung erneut auf. Heute sichern wir es aktiv ab, bevor es sich weiter verfestigt.";
    default:
      return "Dieses Muster tauchte mehrfach in deinen letzten Evaluationen auf. Heute sichern wir es aktiv ab.";
  }
}

export function mapExerciseWorkspaceToViewModel(input: {
  variant: "exercise" | "mock";
  slug: string;
  mode: SessionMode;
  instance: ExerciseInstance;
  context?: WorkspaceLaunchContext;
}): WorkspaceViewModel {
  const spec = getExerciseSpec(input.instance.exerciseId);
  const responseFields = buildResponseFields(input.instance);
  const isMock = input.variant === "mock";
  const agentRole = resolveAgentRole(input.variant, input.context);
  const agentLabel = formatWorkspaceAgentLabel(agentRole);
  const resolvedFrom = formatWorkspaceSourceLabel(input.context?.sourcePage);
  const contextLabel = resolveContextLabel({
    context: input.context,
    fallbackSection: spec.section,
    variant: input.variant,
    mode: input.mode
  });
  const nextLink = buildReturnLink({
    context: input.context,
    fallbackSection: spec.section,
    variant: input.variant
  });

  return {
    variant: input.variant,
    slug: input.slug,
    mode: input.mode,
    title: spec.officialLabel,
    eyebrow: isMock ? "Mock Workspace" : formatSectionLabel(spec.section) + " Workspace",
    description: buildExerciseDescription(spec, input.context, isMock),
    strictChrome: isMock,
    progressLabel:
      input.mode === "mock"
        ? "Mock-Modus · " + formatSectionLabel(spec.section)
        : "Geführte Sitzung · " + formatSectionLabel(spec.section),
    timerLabel: buildTimerLabel(spec, input.mode),
    supportBadge: formatSupportLevel(spec.supportLevel),
    contextLabel,
    agentLabel,
    resolvedFrom,
    shellUtilityItems: buildShellUtilityItems({
      contextLabel,
      resolvedFrom,
      agentLabel
    }),
    launchContext: input.context,
    taskTitle: input.instance.title,
    taskInstructions: input.instance.instructions,
    workspaceMeta: [
      { label: "Sektion", value: formatSectionLabel(spec.section) },
      { label: "Antwortformat", value: formatResponseKind(spec.responseKind) },
      { label: "Timing", value: buildTimerLabel(spec, input.mode) }
    ],
    materialsLabel: input.instance.materials.length > 1 ? "Arbeitsmaterialien" : "Arbeitsmaterial",
    responseLabel: isMock ? "Prüfungsantwort" : "Antwortbereich",
    composerPlaceholder: buildComposerPlaceholder(spec.responseKind, input.mode),
    materials: input.instance.materials.map((material) => ({
      title: material.title,
      kind: material.kind,
      content: material.content
    })),
    questions: input.instance.questions,
    responseKind: spec.responseKind,
    responseFields,
    submitLabel: isMock ? "Antwort sichern" : "Antwort auswerten",
    helperText: buildExerciseHelperText(input.context, input.mode),
    timeline: [
      {
        id: "assistant-intro",
        role: "assistant",
        label: isMock ? "Mock-Regie" : agentLabel,
        content: buildExerciseIntro(spec, input.context, isMock)
      },
      {
        id: "system-context",
        role: "system",
        label: "Systemhinweis",
        content: `Skill-Fokus: ${spec.skillTags.slice(0, 3).join(", ")}.`
      }
    ],
    generation: {
      status: "generated",
      ctaLabel: "Ready"
    },
    nextLink,
    postSubmitOptions: isMock
      ? [
          { label: "Zur Mock-Übersicht", href: "/mock-test", variant: "secondary" },
          { label: "Nächste Sequenz öffnen", href: "/mock-test", variant: "primary" }
        ]
      : [
          { label: nextLink.label, href: nextLink.href, variant: "secondary" },
          {
            label: "Grammatik-Transfer",
            href: buildGrammarWorkspaceHref("grammar-focus", {
              sourcePage: input.context?.sourcePage ?? "workspace",
              section: spec.section,
              focusSkill: input.context?.focusSkill ?? spec.skillTags[0],
              agentRole: "grammar_trainer"
            }),
            variant: "primary"
          }
        ],
    exerciseId: input.instance.exerciseId,
    exerciseInstanceId: input.instance.instanceId,
    answerKey: input.instance.answerKey,
    postSubmitMode: isMock ? "deferred" : "immediate_feedback"
  };
}

export function mapPendingExerciseWorkspaceToViewModel(input: {
  variant: "exercise" | "mock";
  slug: string;
  mode: SessionMode;
  spec: ExerciseSpec;
  context?: WorkspaceLaunchContext;
}): WorkspaceViewModel {
  const isMock = input.variant === "mock";
  const agentRole = resolveAgentRole(input.variant, input.context);
  const agentLabel = formatWorkspaceAgentLabel(agentRole);
  const resolvedFrom = formatWorkspaceSourceLabel(input.context?.sourcePage);
  const contextLabel = resolveContextLabel({
    context: input.context,
    fallbackSection: input.spec.section,
    variant: input.variant,
    mode: input.mode
  });
  const nextLink = buildReturnLink({
    context: input.context,
    fallbackSection: input.spec.section,
    variant: input.variant
  });

  return {
    variant: input.variant,
    slug: input.slug,
    mode: input.mode,
    title: input.spec.officialLabel,
    eyebrow: isMock ? "Mock Workspace" : formatSectionLabel(input.spec.section) + " Workspace",
    description: buildExerciseDescription(input.spec, input.context, isMock),
    strictChrome: isMock,
    progressLabel:
      input.mode === "mock"
        ? "Mock-Modus · " + formatSectionLabel(input.spec.section)
        : "Geführte Sitzung · " + formatSectionLabel(input.spec.section),
    timerLabel: buildTimerLabel(input.spec, input.mode),
    supportBadge: formatSupportLevel(input.spec.supportLevel),
    contextLabel,
    agentLabel,
    resolvedFrom,
    shellUtilityItems: buildShellUtilityItems({
      contextLabel,
      resolvedFrom,
      agentLabel
    }),
    launchContext: input.context,
    taskTitle: input.spec.officialLabel,
    taskInstructions: isMock
      ? "Keine automatische Generierung. Sobald du auf Ready klickst, wird die Mock-Aufgabe vorbereitet."
      : "Keine automatische Generierung. Sobald du auf Ready klickst, wird eine frische Aufgabeninstanz erzeugt.",
    workspaceMeta: [
      { label: "Sektion", value: formatSectionLabel(input.spec.section) },
      { label: "Antwortformat", value: formatResponseKind(input.spec.responseKind) },
      { label: "Timing", value: buildTimerLabel(input.spec, input.mode) }
    ],
    materialsLabel: "Bereitstellung",
    responseLabel: isMock ? "Prüfungsantwort" : "Antwortbereich",
    composerPlaceholder: "Die Aufgabe erscheint erst nach Klick auf Ready.",
    materials: [],
    questions: [],
    responseKind: input.spec.responseKind,
    responseFields: [],
    submitLabel: "Ready",
    helperText: isMock
      ? "Der Mock bleibt bis zum Ready-Klick vollständig ruhig. Erst dann wird die Sequenz generiert."
      : "Die Aufgabe wird nicht mehr beim Laden erstellt. Erst dein Ready-Klick startet die Generierung.",
    timeline: [
      {
        id: "assistant-intro",
        role: "assistant",
        label: isMock ? "Mock-Regie" : agentLabel,
        content: isMock
          ? "Sobald du bereit bist, starte ich eine frische Mock-Sequenz. Vorher bleibt die Seite bewusst still."
          : "Sobald du bereit bist, generiere ich eine frische Aufgabe. Vorher bleibt die Seite bewusst ohne automatische KI-Aktion."
      },
      {
        id: "system-context",
        role: "system",
        label: "Systemhinweis",
        content: `Skill-Fokus: ${input.spec.skillTags.slice(0, 3).join(", ")}.`
      }
    ],
    generation: {
      status: "pending",
      ctaLabel: "Ready",
      prompt: isMock
        ? "Erst mit Ready wird die Mock-Aufgabe aufgebaut."
        : "Erst mit Ready wird diese Aufgabe generiert."
    },
    nextLink,
    postSubmitOptions: undefined,
    exerciseId: input.spec.id,
    postSubmitMode: isMock ? "deferred" : "immediate_feedback"
  };
}

export function mapGrammarWorkspaceToViewModel(input: {
  slug: string;
  rationale: string;
  focusSkills: string[];
  context?: WorkspaceLaunchContext;
}): WorkspaceViewModel {
  const agentRole = resolveAgentRole("grammar", input.context);
  const agentLabel = formatWorkspaceAgentLabel(agentRole);
  const resolvedFrom = formatWorkspaceSourceLabel(input.context?.sourcePage);
  const inferredSection = input.context?.section ?? inferSectionFromSkill(input.focusSkills[0]);
  const contextLabel = resolveContextLabel({
    context: input.context,
    fallbackSection: inferredSection,
    variant: "grammar",
    mode: "guided"
  });
  const nextLink = buildReturnLink({
    context: input.context,
    fallbackSection: inferredSection,
    variant: "grammar"
  });

  return {
    variant: "grammar",
    slug: input.slug,
    mode: "guided",
    title: "Grammar Remediation Studio",
    eyebrow: "Grammar Workspace",
    description: "Kurzer Drill, Modellkorrektur und Transfer bleiben in einem gemeinsamen Arbeitsraum gebündelt.",
    strictChrome: false,
    progressLabel: "Geführte Remediation",
    timerLabel: "25 Min. Fokuszeit",
    supportBadge: "Grammar Coach",
    contextLabel,
    agentLabel,
    resolvedFrom,
    shellUtilityItems: buildShellUtilityItems({
      contextLabel,
      resolvedFrom,
      agentLabel
    }),
    launchContext: input.context,
    taskTitle: "Zielmuster reaktivieren",
    taskInstructions:
      "Arbeite die Grammatikstruktur bewusst nach: erkennen, formulieren, dann in einen akademischen Kontext übertragen.",
    workspaceMeta: [
      { label: "Modus", value: "Geführte Remediation" },
      { label: "Antwortformat", value: "Reflexion" },
      { label: "Timing", value: "25 Min. Fokuszeit" }
    ],
    materialsLabel: "Kuratiertes Briefing",
    responseLabel: "Transferantwort",
    composerPlaceholder: buildComposerPlaceholder("reflection", "guided"),
    materials: [
      {
        title: "Remediation-Brief",
        kind: "bullet_list",
        content: input.rationale
      },
      {
        title: "Fokusskills",
        kind: "text",
        content: input.focusSkills.join(", ")
      }
    ],
    questions: [
      {
        id: "grammar-transfer",
        prompt: "Formuliere zwei eigene Beispielsätze mit dem Zielmuster.",
        expectedResponseShape: "reflection"
      }
    ],
    responseKind: "reflection",
    responseFields: [
      {
        id: "responseText",
        label: "Ihre Transferantwort",
        kind: "textarea",
        placeholder: "Zwei präzise Beispielsätze plus kurze Reflexion eingeben."
      }
    ],
    submitLabel: "Reflexion speichern",
    helperText:
      "Die Grammatik-Remediation bleibt im gemeinsamen Workspace, damit der Übergang in Transferaufgaben und Feedback bewusst kurz bleibt.",
    timeline: [
      {
        id: "grammar-intro",
        role: "assistant",
        label: agentLabel,
        content: buildGrammarIntro(input.context)
      }
    ],
    generation: {
      status: "not_applicable"
    },
    nextLink,
    postSubmitOptions: [
      { label: nextLink.label, href: nextLink.href, variant: "secondary" },
      {
        label: "Passende Aufgabe öffnen",
        href: buildAdaptiveFollowUpHref({
          context: input.context,
          fallbackSection: inferredSection,
          focusSkill: input.focusSkills[0],
          agentRole: "exercise_generator"
        }),
        variant: "primary"
      }
    ],
    postSubmitMode: "reflection"
  };
}

export function mapMistakeWorkspaceToViewModel(input: {
  slug: string;
  entry: DemoNotebookEntry;
  context?: WorkspaceLaunchContext;
}): WorkspaceViewModel {
  const agentRole = resolveAgentRole("mistake", input.context);
  const agentLabel = formatWorkspaceAgentLabel(agentRole);
  const resolvedFrom = formatWorkspaceSourceLabel(input.context?.sourcePage);
  const fallbackSection = input.context?.section ?? inferSectionFromNotebookEntry(input.entry);
  const contextLabel = resolveContextLabel({
    context: input.context,
    fallbackSection,
    variant: "mistake",
    mode: "guided"
  });
  const nextLink = buildReturnLink({
    context: input.context,
    fallbackSection,
    variant: "mistake"
  });

  return {
    variant: "mistake",
    slug: input.slug,
    mode: "guided",
    title: input.entry.title,
    eyebrow: "Mistake Pattern",
    description: "Ein wiederkehrendes Fehlermuster wird direkt in Anwendung, Korrektur und neue Produktion übersetzt.",
    strictChrome: false,
    progressLabel: "Notebook · gezielte Korrektur",
    timerLabel: "15 Min. Review",
    supportBadge: "Error Pattern",
    contextLabel,
    agentLabel,
    resolvedFrom,
    shellUtilityItems: buildShellUtilityItems({
      contextLabel,
      resolvedFrom,
      agentLabel
    }),
    launchContext: input.context,
    taskTitle: input.entry.title,
    taskInstructions:
      "Vergleiche Fehler und Korrektur. Nutze das Muster danach in einer eigenen, präzisen Beispielsituation.",
    workspaceMeta: [
      { label: "Modus", value: "Notebook Transfer" },
      { label: "Antwortformat", value: "Reflexion" },
      { label: "Timing", value: "15 Min. Review" }
    ],
    materialsLabel: "Notebook Material",
    responseLabel: "Neue Version",
    composerPlaceholder: buildComposerPlaceholder("reflection", "guided"),
    materials: [
      {
        title: "Fehler",
        kind: "text",
        content: input.entry.mistake
      },
      {
        title: "Korrektur",
        kind: "text",
        content: input.entry.correction
      },
      {
        title: "Warum das wichtig ist",
        kind: "text",
        content: input.entry.explanation
      }
    ],
    questions: [
      {
        id: "mistake-transfer",
        prompt: "Schreibe einen neuen Beispielsatz, der das Muster korrekt verwendet.",
        expectedResponseShape: "reflection"
      }
    ],
    responseKind: "reflection",
    responseFields: [
      {
        id: "responseText",
        label: "Neue Version",
        kind: "textarea",
        placeholder: "Neues Beispiel plus kurze Selbstkontrolle"
      }
    ],
    submitLabel: "Notiz aktualisieren",
    helperText:
      "Das Fehlernotizbuch bleibt eng an die Workspace-Logik gekoppelt, damit Wiederholung und Transfer in einer Ansicht passieren.",
    timeline: [
      {
        id: "mistake-intro",
        role: "assistant",
        label: agentLabel,
        content: buildMistakeIntro(input.context)
      }
    ],
    generation: {
      status: "not_applicable"
    },
    nextLink,
    postSubmitOptions: [
      { label: nextLink.label, href: nextLink.href, variant: "secondary" },
      {
        label: "Passende Aufgabe öffnen",
        href: buildAdaptiveFollowUpHref({
          context: input.context,
          fallbackSection,
          focusSkill: input.entry.linkedSkill,
          agentRole: "exercise_generator"
        }),
        variant: "primary"
      }
    ],
    postSubmitMode: "reflection"
  };
}
