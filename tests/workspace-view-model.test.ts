import test from "node:test";
import assert from "node:assert/strict";

import { buildExerciseGenerationRequest } from "../src/agents/exercise-generator";
import { buildDemoLearnerState, getDemoNotebookEntries } from "../lib/mock-data/demo";
import {
  mapExerciseWorkspaceToViewModel,
  mapPendingExerciseWorkspaceToViewModel,
  mapGrammarWorkspaceToViewModel,
  mapMistakeWorkspaceToViewModel,
  resolveWorkspaceVariant
} from "../lib/mappers";
import { getExerciseSpec } from "../src/domain/testdaf";

test("workspace variant resolution accepts only supported routes", () => {
  assert.equal(resolveWorkspaceVariant("exercise"), "exercise");
  assert.equal(resolveWorkspaceVariant("grammar"), "grammar");
  assert.equal(resolveWorkspaceVariant("mistake"), "mistake");
  assert.equal(resolveWorkspaceVariant("mock"), "mock");
  assert.equal(resolveWorkspaceVariant("feedback"), null);
});

test("exercise workspace mapper creates radio fields for selection tasks", () => {
  const learnerState = buildDemoLearnerState("user-3");
  const request = buildExerciseGenerationRequest({
    exerciseId: "lesen.multiple_choice",
    mode: "guided",
    learnerState
  });
  const viewModel = mapExerciseWorkspaceToViewModel({
    variant: "exercise",
    slug: "03-multiple-choice",
    mode: "guided",
    instance: request.fallback
  });

  assert.equal(viewModel.responseFields.some((field) => field.kind === "radio"), true);
  assert.equal(viewModel.postSubmitMode, "immediate_feedback");
  assert.equal(viewModel.generation.status, "generated");
});

test("pending exercise workspace waits for an explicit ready click", () => {
  const viewModel = mapPendingExerciseWorkspaceToViewModel({
    variant: "exercise",
    slug: "03-multiple-choice",
    mode: "guided",
    spec: getExerciseSpec("lesen.multiple_choice")
  });

  assert.equal(viewModel.generation.status, "pending");
  assert.equal(viewModel.responseFields.length, 0);
  assert.equal(viewModel.submitLabel, "Ready");
});

test("grammar and mistake workspaces stay in reflection mode", () => {
  const grammarViewModel = mapGrammarWorkspaceToViewModel({
    slug: "grammar-focus",
    rationale: "Select the weakest grammar nodes and turn them into short adaptive drills.",
    focusSkills: ["grammar.word_order"]
  });
  const mistakeViewModel = mapMistakeWorkspaceToViewModel({
    slug: "subordinate-clause-order",
    entry: getDemoNotebookEntries()[0]
  });

  assert.equal(grammarViewModel.postSubmitMode, "reflection");
  assert.equal(mistakeViewModel.postSubmitMode, "reflection");
  assert.equal(grammarViewModel.generation.status, "not_applicable");
  assert.equal(mistakeViewModel.generation.status, "not_applicable");
});
