import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import type { LlmTestSystemPromptOption } from "@/lib/llm-test/types";

const MARKDOWN_FILE_PATTERN = /\.mdx?$/i;

const CATEGORY_ORDER: Record<string, number> = {
  shared: 1,
  agents: 2,
  "training/grammar": 3,
  "training/skills": 4,
  "testdaf/lesen": 5,
  "testdaf/hoeren": 6,
  "testdaf/schreiben": 7,
  "testdaf/sprechen": 8,
  ".": 98,
  other: 99
};

const CATEGORY_LABELS: Record<string, string> = {
  shared: "Shared Blocks",
  agents: "Agents",
  "training/grammar": "Training · Grammar",
  "training/skills": "Training · Skills",
  "testdaf/lesen": "TestDaF · Lesen",
  "testdaf/hoeren": "TestDaF · Hoeren",
  "testdaf/schreiben": "TestDaF · Schreiben",
  "testdaf/sprechen": "TestDaF · Sprechen",
  ".": "Prompt Root"
};

interface PromptCatalogSource {
  workspaceRoot?: string;
  promptsRoot?: string;
}

interface PromptCatalogEntry {
  categoryKey: string;
  option: LlmTestSystemPromptOption;
}

function compareNatural(left: string, right: string): number {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base"
  });
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function humanizeSlug(value: string): string {
  return toTitleCase(
    value
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function getPromptCatalogRoots(source: PromptCatalogSource = {}): {
  workspaceRoot: string;
  promptsRoot: string;
} {
  const workspaceRoot = source.workspaceRoot ?? process.cwd();
  const promptsRoot = source.promptsRoot ?? path.join(workspaceRoot, "prompts");

  return {
    workspaceRoot,
    promptsRoot
  };
}

function listPromptFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = readdirSync(directory, {
    withFileTypes: true
  }).sort((left, right) => compareNatural(left.name, right.name));

  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listPromptFiles(fullPath));
      continue;
    }

    if (entry.isFile() && MARKDOWN_FILE_PATTERN.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeExcerpt(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function extractPromptTitle(content: string): string | null {
  const match = content.match(/^\s*#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

function extractPromptPurpose(content: string): string | null {
  const purposeMatch = content.match(/^##\s+Purpose\s*\n+([\s\S]*?)(?:\n##\s+|\n#\s+|$)/im);

  if (purposeMatch) {
    const purpose = normalizeExcerpt(purposeMatch[1] ?? "");
    if (purpose.length > 0) {
      return purpose;
    }
  }

  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => normalizeExcerpt(block))
    .filter(Boolean);

  for (const block of blocks) {
    if (/^#{1,6}\s/.test(block)) {
      continue;
    }

    return block;
  }

  return null;
}

function getCategoryKey(relativeDirectory: string): string {
  const normalizedDirectory = toPosixPath(relativeDirectory);
  return normalizedDirectory.length > 0 ? normalizedDirectory : ".";
}

function getCategoryLabel(categoryKey: string): string {
  const knownLabel = CATEGORY_LABELS[categoryKey];

  if (knownLabel) {
    return knownLabel;
  }

  if (categoryKey === ".") {
    return CATEGORY_LABELS["."];
  }

  return categoryKey
    .split("/")
    .filter(Boolean)
    .map(humanizeSlug)
    .join(" · ");
}

function createPromptEntry(
  absolutePromptPath: string,
  roots: { workspaceRoot: string; promptsRoot: string }
): PromptCatalogEntry {
  const content = readFileSync(absolutePromptPath, "utf8").trim();
  const promptPath = toPosixPath(path.relative(roots.workspaceRoot, absolutePromptPath));
  const categoryKey = getCategoryKey(path.relative(roots.promptsRoot, path.dirname(absolutePromptPath)));
  const label =
    extractPromptTitle(content) ??
    humanizeSlug(path.basename(absolutePromptPath, path.extname(absolutePromptPath)));
  const purpose =
    extractPromptPurpose(content) ?? `Prompt loaded from ${promptPath}.`;

  return {
    categoryKey,
    option: {
      id: promptPath,
      label,
      purpose,
      category: getCategoryLabel(categoryKey),
      content,
      promptPath
    }
  };
}

function comparePromptEntries(left: PromptCatalogEntry, right: PromptCatalogEntry): number {
  const categoryDiff =
    (CATEGORY_ORDER[left.categoryKey] ?? CATEGORY_ORDER.other) -
    (CATEGORY_ORDER[right.categoryKey] ?? CATEGORY_ORDER.other);

  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return compareNatural(left.option.label, right.option.label);
}

export function listLlmTestSystemPromptOptions(
  source: PromptCatalogSource = {}
): LlmTestSystemPromptOption[] {
  const roots = getPromptCatalogRoots(source);
  const promptEntries = listPromptFiles(roots.promptsRoot)
    .map((absolutePromptPath) => createPromptEntry(absolutePromptPath, roots))
    .sort(comparePromptEntries)
    .map((entry) => entry.option);

  return [
    {
      id: "none",
      label: "No system prompt",
      purpose: "Send the conversation without any extra system instruction.",
      category: "Setup",
      content: ""
    },
    ...promptEntries
  ];
}

export function getLlmTestSystemPromptOption(
  promptId: string | null | undefined,
  source: PromptCatalogSource = {}
): LlmTestSystemPromptOption | null {
  if (!promptId || promptId === "none") {
    return null;
  }

  return listLlmTestSystemPromptOptions(source).find((option) => option.id === promptId) ?? null;
}
