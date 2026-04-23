import { TESTDAF_EXERCISES } from "@/src/domain/testdaf";
import type { ExerciseId, SectionId } from "@/src/domain/exercise-ids";
import type { EstimatedTdn, ExerciseTiming, ResponseKind, SupportLevel } from "@/src/domain/types";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatSectionLabel(section: SectionId): string {
  switch (section) {
    case "lesen":
      return "Lesen";
    case "hoeren":
      return "Hören";
    case "schreiben":
      return "Schreiben";
    case "sprechen":
      return "Sprechen";
  }
}

export function formatEstimatedTdn(value: EstimatedTdn): string {
  switch (value) {
    case "tdn_5":
      return "TDN 5";
    case "tdn_4":
      return "TDN 4";
    case "tdn_3":
      return "TDN 3";
    default:
      return "Unter TDN 3";
  }
}

export function formatResponseKind(kind: ResponseKind): string {
  switch (kind) {
    case "selection":
      return "Auswahl";
    case "short_text":
      return "Kurzantwort";
    case "essay":
      return "Langer Text";
    case "speech":
      return "Mündliche Antwort";
    case "integrated":
      return "Integrierte Aufgabe";
  }
}

export function formatSupportLevel(level: SupportLevel): string {
  switch (level) {
    case "fully_supported":
      return "Textgestützt";
    case "strategy_first":
      return "Strategie-First";
    case "voice_ready":
      return "Audio bereit";
  }
}

function formatTimingMinutes(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));

  return String(minutes) + " Min.";
}

function getKnownTimingSeconds(timing: ExerciseTiming): number | null {
  if (timing.taskTimeSec) {
    return timing.taskTimeSec;
  }

  if (timing.phases?.length) {
    return timing.phases.reduce((sum, phase) => sum + phase.seconds, 0);
  }

  const totalSeconds =
    (timing.previewSec ?? 0) +
    (timing.reviewSec ?? 0) +
    (timing.readingSec ?? 0) +
    (timing.preparationSec ?? 0) +
    (timing.speakingSec ?? 0);

  return totalSeconds > 0 ? totalSeconds : null;
}

export function formatExerciseTimingLabel(timing: ExerciseTiming): string {
  if (timing.totalMinutesApprox) {
    return String(timing.totalMinutesApprox) + " Min.";
  }

  const knownSeconds = getKnownTimingSeconds(timing);

  if (knownSeconds === null) {
    return "Adaptiver Takt";
  }

  return formatTimingMinutes(knownSeconds);
}

export function toPercent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

export function getExerciseSlug(exerciseId: ExerciseId): string {
  const match = TESTDAF_EXERCISES.find((exercise) => exercise.id === exerciseId);
  if (!match) {
    throw new Error("Unknown exercise id: " + exerciseId);
  }
  return match.slug;
}

export function getExerciseHref(exerciseId: ExerciseId): string {
  return "/workspace/exercise/" + getExerciseSlug(exerciseId);
}

export function getSectionHref(section: SectionId): string {
  return "/" + section;
}

export function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
