import type { DemoNotebookEntry } from "@/lib/mock-data/demo";
import type { MistakeNotebookViewModel } from "@/lib/mappers/types";
import { buildMistakeWorkspaceHref } from "@/lib/workspace-context";

function buildNotebookHref(entry: DemoNotebookEntry): string {
  return buildMistakeWorkspaceHref(entry.id, {
    sourcePage: "mistake_notebook",
    focusSkill: entry.linkedSkill,
    agentRole: "feedback_coach"
  });
}

export function mapMistakeNotebookToViewModel(input: {
  entries: DemoNotebookEntry[];
}): MistakeNotebookViewModel {
  const featured = input.entries[0];
  const supporting = input.entries[1] ?? featured;
  const compact = input.entries[2] ?? supporting ?? featured;

  return {
    title: "Mistake Notebook",
    subtitle:
      "Wiederkehrende Muster aus Schreiben, Sprechen und Remediation werden hier in konkrete nächste Schritte übersetzt.",
    meta: {
      countLabel: `${input.entries.length} recurring patterns identified`,
      updatedLabel: "Zuletzt aktualisiert heute, 10:24 Uhr"
    },
    filterChips: [
      { label: "All Observations", active: true },
      { label: "Grammar", active: false },
      { label: "Syntax", active: false },
      { label: "Lexical", active: false },
      { label: "Prepositions", active: false }
    ],
    featuredEntry: {
      ...featured,
      href: buildNotebookHref(featured),
      statusLabel: "Improving",
      tags: ["Writing", "Speaking"]
    },
    supportingEntry: {
      id: supporting.id,
      title: supporting.title,
      category: supporting.category,
      explanation: supporting.explanation,
      href: buildNotebookHref(supporting),
      statusLabel: "Persistent",
      statLabel: "6 errors this week"
    },
    compactEntry: {
      ...compact,
      href: buildNotebookHref(compact)
    },
    roadmap: {
      title: "Targeted Remediation Roadmap",
      text:
        "Verbinde heute ein Fehlermuster aus dem Notebook mit einer passenden Workspace-Session und schließe mit Transfer in freierer Produktion ab.",
      primaryCtaLabel: "Start 15min Drill",
      secondaryCtaLabel: "View Full Schedule",
      primaryHref:
        featured
          ? buildNotebookHref(featured)
          : buildMistakeWorkspaceHref("subordinate-clause-order", {
              sourcePage: "mistake_notebook",
              focusSkill: "grammar.word_order",
              agentRole: "feedback_coach"
            }),
      secondaryHref: "/grammar-library"
    },
    footerStats: [
      { label: "Global Accuracy", value: "92.4%" },
      { label: "Resolved Issues", value: "142" },
      { label: "Weekly Streak", value: "12 Days", tone: "secondary" }
    ],
    footerPrompt: "Bereit, weitere Muster zu klären?"
  };
}
