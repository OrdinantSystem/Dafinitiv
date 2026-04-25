import test from "node:test";
import assert from "node:assert/strict";

import { generateStudyPlan } from "../src/agents/study-planner";
import { getExercisesBySection } from "../src/domain/testdaf";
import { buildGrammarTrainingBrief } from "../src/agents/grammar-trainer";
import { buildDemoLearnerState, getDemoActivity, getDemoNotebookEntries } from "../lib/mock-data/demo";
import {
  mapDashboardToViewModel,
  mapGrammarLibraryToViewModel,
  mapSectionHubToViewModel,
  mapMistakeNotebookToViewModel
} from "../lib/mappers";

test("dashboard mapper exposes section cards, study plan and activity", () => {
  const learnerState = buildDemoLearnerState("user-1");
  const viewModel = mapDashboardToViewModel({
    learnerState,
    studyPlan: generateStudyPlan(learnerState),
    recentActivity: getDemoActivity(),
    llmStatus: "Demo-Fallback"
  });

  assert.equal(viewModel.sections.length, 4);
  assert.equal(viewModel.studyPlan.length > 0, true);
  assert.equal(viewModel.recentActivity.length > 0, true);
});

test("grammar and notebook mappers surface focused routes", () => {
  const learnerState = buildDemoLearnerState("user-2");
  const grammarViewModel = mapGrammarLibraryToViewModel({
    learnerState,
    brief: buildGrammarTrainingBrief(learnerState)
  });
  const notebookViewModel = mapMistakeNotebookToViewModel({
    entries: getDemoNotebookEntries()
  });

  assert.equal(grammarViewModel.featuredRecommendation.href.startsWith("/workspace/grammar/"), true);
  assert.equal(notebookViewModel.featuredEntry.href.startsWith("/workspace/mistake/"), true);
  assert.equal(grammarViewModel.title, "Grammatikbibliothek");
  assert.equal(grammarViewModel.secondaryRecommendations[0]?.statusLabel, "Fortsetzen");
  assert.equal(
    grammarViewModel.filters.statuses.map((status) => status.label).join(", "),
    "Nicht begonnen, In Arbeit, Abgeschlossen"
  );
  assert.equal(grammarViewModel.filters.skills[2]?.label, "Akademisches Lesen");
  assert.equal(grammarViewModel.pulse.title, "Lernimpuls");
});

test("section hub task cards always expose concrete timing labels", () => {
  const learnerState = buildDemoLearnerState("user-3");
  const hoerenViewModel = mapSectionHubToViewModel({
    section: "hoeren",
    exercises: getExercisesBySection("hoeren"),
    learnerState
  });
  const schreibenViewModel = mapSectionHubToViewModel({
    section: "schreiben",
    exercises: getExercisesBySection("schreiben"),
    learnerState
  });
  const sprechenViewModel = mapSectionHubToViewModel({
    section: "sprechen",
    exercises: getExercisesBySection("sprechen"),
    learnerState
  });

  assert.equal(hoerenViewModel.exercises.some((exercise) => exercise.timing === "Sequenziert"), false);
  assert.equal(hoerenViewModel.exercises.some((exercise) => exercise.timing.includes(":")), false);
  assert.equal(hoerenViewModel.exercises[0]?.timing, "1 Min.");
  assert.equal(hoerenViewModel.exercises[1]?.timing, "3 Min.");
  assert.equal(schreibenViewModel.exercises[0]?.timing, "30 Min.");
  assert.equal(sprechenViewModel.exercises.some((exercise) => exercise.timing.includes(":")), false);
  assert.equal(sprechenViewModel.exercises[0]?.timing, "1 Min.");
  assert.equal(sprechenViewModel.exercises[3]?.timing, "4 Min.");
});
