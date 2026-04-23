import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  getLlmTestSystemPromptOption,
  listLlmTestSystemPromptOptions
} from "../lib/server/llm-test-prompts";

function createWorkspace(): string {
  return mkdtempSync(path.join(os.tmpdir(), "daf-focus-prompts-"));
}

function writePrompt(workspaceRoot: string, relativePromptPath: string, content: string): void {
  const absolutePromptPath = path.join(workspaceRoot, relativePromptPath);
  mkdirSync(path.dirname(absolutePromptPath), {
    recursive: true
  });
  writeFileSync(absolutePromptPath, content);
}

test("system prompt catalog scans folders from the prompts directory", () => {
  const workspaceRoot = createWorkspace();

  try {
    writePrompt(
      workspaceRoot,
      "prompts/shared/tutor-core.md",
      `# Tutor Core

## Purpose
Provide the shared coaching voice.

## Prompt Block
Stay learner-first.
`
    );
    writePrompt(
      workspaceRoot,
      "prompts/training/grammar/grammar-remediation.md",
      `# Grammar Remediation

## Purpose
Generate grammar drills from weak skills.
`
    );
    writePrompt(
      workspaceRoot,
      "prompts/agents/german-coach.md",
      `You are a German tutor, language coach, and conversation partner.`
    );

    const options = listLlmTestSystemPromptOptions({
      workspaceRoot
    });

    assert.equal(options[0]?.id, "none");

    const sharedPrompt = options.find((option) => option.promptPath === "prompts/shared/tutor-core.md");
    const grammarPrompt = options.find(
      (option) => option.promptPath === "prompts/training/grammar/grammar-remediation.md"
    );
    const agentPrompt = options.find((option) => option.promptPath === "prompts/agents/german-coach.md");

    assert.ok(sharedPrompt);
    assert.equal(sharedPrompt.category, "Shared Blocks");
    assert.equal(sharedPrompt.label, "Tutor Core");
    assert.equal(sharedPrompt.purpose, "Provide the shared coaching voice.");

    assert.ok(grammarPrompt);
    assert.equal(grammarPrompt.category, "Training · Grammar");
    assert.equal(grammarPrompt.label, "Grammar Remediation");

    assert.ok(agentPrompt);
    assert.equal(agentPrompt.category, "Agents");
    assert.equal(
      agentPrompt.purpose,
      "You are a German tutor, language coach, and conversation partner."
    );
  } finally {
    rmSync(workspaceRoot, {
      recursive: true,
      force: true
    });
  }
});

test("system prompt catalog reflects prompt file edits on the next read", () => {
  const workspaceRoot = createWorkspace();
  const promptPath = "prompts/shared/tutor-core.md";

  try {
    writePrompt(
      workspaceRoot,
      promptPath,
      `# Tutor Core

## Purpose
First version.
`
    );

    const firstRead = getLlmTestSystemPromptOption(promptPath, {
      workspaceRoot
    });
    assert.equal(firstRead?.purpose, "First version.");

    writePrompt(
      workspaceRoot,
      promptPath,
      `# Tutor Core

## Purpose
Updated version from disk.
`
    );

    const secondRead = getLlmTestSystemPromptOption(promptPath, {
      workspaceRoot
    });
    assert.equal(secondRead?.purpose, "Updated version from disk.");
    assert.match(secondRead?.content ?? "", /Updated version from disk\./);
  } finally {
    rmSync(workspaceRoot, {
      recursive: true,
      force: true
    });
  }
});
