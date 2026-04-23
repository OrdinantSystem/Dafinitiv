const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const projectRoot = path.resolve(__dirname, '..');
const lib = require(path.join(projectRoot, 'dist', 'index.js'));

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listFiles(fullPath);
    }
    return [fullPath];
  });
}

test('official exercise catalog covers 23 digital TestDaF tasks', () => {
  assert.equal(lib.TESTDAF_EXERCISES.length, 23);
  assert.equal(lib.getOfficialExerciseSequence().length, 23);
});

test('prompt library contains shared, testdaf, and training packs', () => {
  const promptFiles = listFiles(path.join(projectRoot, 'prompts'));
  const testdafPromptFiles = promptFiles.filter((file) => file.includes(path.join('prompts', 'testdaf')));
  const sharedPromptFiles = promptFiles.filter((file) => file.includes(path.join('prompts', 'shared')));
  const trainingPromptFiles = promptFiles.filter((file) => file.includes(path.join('prompts', 'training')));
  const trainingChatPromptFiles = promptFiles.filter((file) =>
    file.includes(path.join('prompts', 'training', 'chat'))
  );

  assert.equal(testdafPromptFiles.length, 23);
  assert.equal(sharedPromptFiles.length, 7);
  assert.equal(trainingPromptFiles.length, 9);
  assert.equal(trainingChatPromptFiles.length, 5);
  assert.equal(lib.TESTDAF_PROMPT_PACKS.length, 23);
  assert.equal(lib.TRAINING_PROMPT_PACKS.length, 9);
});

test('mock exam plan preserves section order and total duration', () => {
  const mockPlan = lib.buildMockExamPlan();
  assert.deepEqual(mockPlan.sections.map((section) => section.section), [
    'lesen',
    'hoeren',
    'schreiben',
    'sprechen'
  ]);
  assert.equal(mockPlan.totalMinutesApprox, 190);
  assert.equal(mockPlan.sections[0].exerciseIds.length, 7);
  assert.equal(mockPlan.sections[1].exerciseIds.length, 7);
  assert.equal(mockPlan.sections[2].exerciseIds.length, 2);
  assert.equal(mockPlan.sections[3].exerciseIds.length, 7);
});

test('skill profiler updates learner state from structured evaluation', () => {
  const learnerState = lib.buildLearnerState('user-1');
  const evaluation = {
    attemptId: 'attempt-1',
    exerciseId: 'schreiben.argumentativen_text_schreiben',
    section: 'schreiben',
    overallScore01: 0.7,
    estimatedTdn: 'tdn_4',
    confidence: 0.8,
    criterionScores: [
      {
        criterion: 'task_relevance',
        score01: 0.8,
        band15: 4,
        rationale: 'Good coverage.',
        evidence: [],
        skillTags: ['task.task_fulfillment', 'task.argumentation']
      },
      {
        criterion: 'linguistic_range_and_precision',
        score01: 0.65,
        band15: 4,
        rationale: 'Solid control.',
        evidence: [],
        skillTags: ['writing.written_production', 'lexicon.academic_vocabulary']
      }
    ],
    strengths: ['Clear position.'],
    weaknesses: ['Needs more lexical variety.'],
    recurringErrors: [],
    nextActions: ['Practice one more argumentation task.'],
    summary: 'Strong draft.',
    providerTrace: {
      mode: 'structured_llm',
      providerId: 'mock',
      model: 'mock-model'
    }
  };

  const nextState = lib.updateLearnerStateFromEvaluation(learnerState, evaluation);
  const taskNode = nextState.skillGraph.find((node) => node.id === 'task.task_fulfillment');
  assert.ok(taskNode);
  assert.equal(nextState.recentEvaluations.length, 1);
  assert.equal(taskNode.evidenceCount > 0, true);
});
