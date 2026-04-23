import { getExercisesBySection, SECTION_DURATIONS } from "../domain/testdaf";
import type { MockExamPlan } from "../domain/types";

export function buildMockExamPlan(): MockExamPlan {
  return {
    mode: "mock",
    sections: [
      {
        section: "lesen",
        approximateMinutes: SECTION_DURATIONS.lesen,
        exerciseIds: getExercisesBySection("lesen").map((exercise) => exercise.id)
      },
      {
        section: "hoeren",
        approximateMinutes: SECTION_DURATIONS.hoeren,
        exerciseIds: getExercisesBySection("hoeren").map((exercise) => exercise.id)
      },
      {
        section: "schreiben",
        approximateMinutes: SECTION_DURATIONS.schreiben,
        exerciseIds: getExercisesBySection("schreiben").map((exercise) => exercise.id)
      },
      {
        section: "sprechen",
        approximateMinutes: SECTION_DURATIONS.sprechen,
        exerciseIds: getExercisesBySection("sprechen").map((exercise) => exercise.id)
      }
    ],
    totalMinutesApprox: 190,
    rules: [
      "Keep the official order Lesen -> Hoeren -> Schreiben -> Sprechen.",
      "Disallow backtracking inside a section.",
      "Delay feedback until the end of the mock.",
      "Use original material only; never reuse official demo content."
    ]
  };
}
