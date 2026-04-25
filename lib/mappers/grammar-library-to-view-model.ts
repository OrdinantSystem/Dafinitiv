import { rankWeakSkills } from "@/src/domain/skills";
import type { LearnerState, SkillNode } from "@/src/domain/types";

import type { GrammarLibraryViewModel } from "@/lib/mappers/types";
import { buildGrammarWorkspaceHref } from "@/lib/workspace-context";
import { average } from "@/lib/utils";

const GRAMMAR_SKILL_TITLES: Record<string, string> = {
  "grammar.word_order": "Wortstellung in Haupt- und Nebensätzen",
  "grammar.verb_position": "Verbposition und Satzklammer",
  "grammar.case_and_articles": "Kasus, Artikel und Genusabgleich",
  "grammar.prepositions": "Präpositionen und Kasuswahl",
  "grammar.connectors_and_subordination": "Konnektoren, Unterordnung und logische Beziehungen",
  "grammar.adjective_endings": "Adjektivendungen und Nominalgruppenflexion"
};

const GRAMMAR_BADGES: Record<string, string> = {
  "grammar.word_order": "SATZBAU",
  "grammar.verb_position": "VERBPOSITION",
  "grammar.case_and_articles": "KASUS & ARTIKEL",
  "grammar.prepositions": "PRÄPOSITIONEN",
  "grammar.connectors_and_subordination": "KONNEKTOREN",
  "grammar.adjective_endings": "ADJEKTIVE"
};

function localizeGrammarSkillTitle(skill: SkillNode): string {
  return GRAMMAR_SKILL_TITLES[skill.id] ?? skill.label;
}

function toBadgeLabel(skill: SkillNode): string {
  return GRAMMAR_BADGES[skill.id] ?? (skill.id.split(".")[1]?.replace(/_/g, " ").toUpperCase() ?? "GRAMMATIK");
}

function toLevelLabel(level: number): string {
  if (level >= 4) {
    return "C1-NIVEAU";
  }

  if (level === 3) {
    return "B2+-NIVEAU";
  }

  return "B2-NIVEAU";
}

function toStatusLabel(skill: SkillNode, index: number): string {
  if (skill.level >= 4) {
    return "Abgeschlossen";
  }

  return index % 2 === 0 ? "In Arbeit" : "Nicht begonnen";
}

function toLesson(skill: SkillNode, index: number) {
  return {
    title: localizeGrammarSkillTitle(skill),
    summary:
      "Aktuelles Niveau " +
      String(skill.level) +
      "/5 bei Vertrauen " +
      skill.confidence.toFixed(2) +
      ".",
    href: buildGrammarWorkspaceHref(skill.id.replace(/\./g, "-"), {
      sourcePage: "grammar_library",
      focusSkill: skill.id,
      agentRole: "grammar_trainer"
    }),
    badge: toBadgeLabel(skill),
    statusLabel: toStatusLabel(skill, index),
    durationLabel: String(15 + index * 5) + " Min • " + toLevelLabel(skill.level).replace("-NIVEAU", ""),
    progressPercent: Math.min(100, skill.level * 20),
    emphasis: index === 1
  };
}

export function mapGrammarLibraryToViewModel(input: {
  learnerState: LearnerState;
  brief: {
    promptId: string;
    focusSkills: string[];
    rationale: string;
  };
}): GrammarLibraryViewModel {
  const grammarSkills = input.learnerState.skillGraph.filter((skill) => skill.category === "grammar");
  const mastery = Math.round(average(grammarSkills.map((skill) => skill.level / 5)) * 100);
  const rankedGrammar = rankWeakSkills(grammarSkills);
  const weakGrammar = rankedGrammar.slice(0, Math.max(6, Math.min(rankedGrammar.length, 6)));
  const fallbackSkill = weakGrammar[0] ?? grammarSkills[0];
  const lessonSource = weakGrammar.length > 0 ? weakGrammar : grammarSkills.slice(0, 6);
  const firstSecondary = lessonSource[1] ?? fallbackSkill;
  const secondSecondary = lessonSource[2] ?? lessonSource[1] ?? fallbackSkill;

  return {
    title: "Grammatikbibliothek",
    subtitle:
      "Kuratiertes Förderboard für grammatische Muster, die deinen nächsten TestDaF-Schritt am stärksten beeinflussen.",
    mastery,
    featuredRecommendation: {
      title: fallbackSkill ? localizeGrammarSkillTitle(fallbackSkill) : "Gezielte Grammatik-Sequenz",
      rationale: input.brief.rationale,
      focusSkills: input.brief.focusSkills.map((skillId) =>
        GRAMMAR_SKILL_TITLES[skillId] ?? skillId.replace(/^grammar\./, "").replace(/_/g, " ")
      ),
      href: buildGrammarWorkspaceHref("grammar-focus", {
        sourcePage: "grammar_library",
        focusSkill: input.brief.focusSkills[0],
        agentRole: "grammar_trainer"
      }),
      durationLabel: "45 Min",
      levelLabel: toLevelLabel(fallbackSkill?.level ?? 4)
    },
    secondaryRecommendations: [
      {
        title: firstSecondary ? localizeGrammarSkillTitle(firstSecondary) : "Passiv-Ersatzformen",
        summary: "Kurze Sequenz zur Absicherung akademischer Präzision und Satzsteuerung.",
        href: buildGrammarWorkspaceHref(
          (firstSecondary?.id ?? "grammar.word_order").replace(/\./g, "-"),
          {
            sourcePage: "grammar_library",
            focusSkill: firstSecondary?.id ?? "grammar.word_order",
            agentRole: "grammar_trainer"
          }
        ),
        levelLabel: toLevelLabel(firstSecondary?.level ?? 3),
        statusLabel: "Fortsetzen",
        durationLabel: "Noch 12 Min",
        accent: "teal"
      },
      {
        title: secondSecondary ? localizeGrammarSkillTitle(secondSecondary) : "Nominalisierung",
        summary: "Formale akademische Verdichtung mit stärkerem Registergefühl.",
        href: buildGrammarWorkspaceHref(
          (secondSecondary?.id ?? "grammar.register").replace(/\./g, "-"),
          {
            sourcePage: "grammar_library",
            focusSkill: secondSecondary?.id ?? "grammar.register",
            agentRole: "grammar_trainer"
          }
        ),
        levelLabel: toLevelLabel(secondSecondary?.level ?? 4),
        statusLabel: "2/3 gesichert",
        durationLabel: "20 Min",
        accent: "paper"
      }
    ],
    curriculumGroups: [
      {
        title: "Wortstellung & Satzstruktur",
        accent: "primary",
        lessons: lessonSource.slice(0, 3).map(toLesson)
      },
      {
        title: "Verbbeherrschung & akademisches Register",
        accent: "secondary",
        lessons: lessonSource.slice(3, 6).map((skill, index) => toLesson(skill, index + 3))
      }
    ],
    filters: {
      statuses: [
        { label: "Nicht begonnen", count: Math.max(3, Math.round(grammarSkills.length * 0.45)), active: false },
        { label: "In Arbeit", count: Math.max(2, Math.round(grammarSkills.length * 0.18)), active: true },
        { label: "Abgeschlossen", count: Math.max(2, Math.round(grammarSkills.length * 0.28)), active: false }
      ],
      levels: [
        { label: "B2", active: false },
        { label: "C1", active: true },
        { label: "C2", active: false }
      ],
      skills: [
        { label: "Schreiben", active: false },
        { label: "Sprechen", active: false },
        { label: "Akademisches Lesen", active: true },
        { label: "Hören", active: false }
      ]
    },
    pulse: {
      title: "Lernimpuls",
      text:
        "Du hältst aktuell ein ruhiges, aber konstantes Grammatiktempo. In diesem Rhythmus ist der C1-Kernpfad gut stabilisierbar.",
      metricLabel: "Konsistenz",
      metricValue: mastery >= 70 ? "4 Lektionen/Woche" : "3 Lektionen/Woche"
    }
  };
}
