import { updateLearnerStateFromEvaluation } from "@/src/agents/skill-profiler";
import { estimateTdn, toBand15 } from "@/src/domain/evaluation";
import { buildLearnerState } from "@/src/domain/skills";
import { getExerciseSpec } from "@/src/domain/testdaf";
import type { ExerciseId, SectionId } from "@/src/domain/exercise-ids";
import type {
  CriterionScore,
  EvaluationReport,
  LearnerState
} from "@/src/domain/types";

export interface DemoNotebookEntry {
  id: string;
  title: string;
  category: string;
  mistake: string;
  correction: string;
  explanation: string;
  linkedSkill: string;
  href: string;
}

export interface DemoActivityItem {
  id: string;
  title: string;
  description: string;
  href: string;
  accent: SectionId | "grammar";
}

function buildCriterionScores(exerciseId: ExerciseId, overallScore01: number): CriterionScore[] {
  const spec = getExerciseSpec(exerciseId);

  return spec.rubricCriteria.map((criterion, index) => ({
    criterion,
    score01: overallScore01,
    band15: toBand15(overallScore01),
    rationale: "Demo evidence for " + criterion + ".",
    evidence: [],
    skillTags: spec.skillTags.slice(index, index + 2)
  }));
}

function buildReport(
  exerciseId: ExerciseId,
  overallScore01: number,
  strengths: string[],
  weaknesses: string[],
  recurringErrors: string[],
  nextActions: string[],
  confidence = 0.74
): EvaluationReport {
  const spec = getExerciseSpec(exerciseId);

  return {
    attemptId: "attempt-" + spec.slug,
    exerciseId,
    section: spec.section,
    overallScore01,
    estimatedTdn: estimateTdn(overallScore01),
    confidence,
    criterionScores: buildCriterionScores(exerciseId, overallScore01),
    strengths,
    weaknesses,
    recurringErrors,
    nextActions,
    summary: "Demo evaluation for " + spec.officialLabel + ".",
    providerTrace: {
      mode: "structured_llm",
      providerId: "demo-seed",
      model: "MiniMax-M2.5"
    }
  };
}

const DEMO_REPORTS: EvaluationReport[] = [
  buildReport(
    "lesen.multiple_choice",
    0.79,
    ["Gute globale Orientierung im Text.", "Schlüsselbegriffe wurden schnell erkannt."],
    ["Details aus zwei Distraktoren wurden vermischt."],
    ["Zu schnelles Entscheiden bei ähnlich klingenden Optionen."],
    ["Noch eine Aufgabe zu Globalverständnis starten."]
  ),
  buildReport(
    "hoeren.gliederungspunkte_erganzen",
    0.61,
    ["Die Hauptstruktur des Vortrags wurde erfasst."],
    ["Zu wenig Präzision bei den Ergänzungen."],
    ["Nominalisierungen aus dem Vortrag wurden zu ungenau notiert."],
    ["Eine text-first Hörstrategie mit Stichwortketten üben."]
  ),
  buildReport(
    "schreiben.text_und_grafik_zusammenfassen",
    0.57,
    ["Die Kernaussage der Grafik ist erkennbar."],
    ["Die Verknüpfung zwischen Lesetext und Grafik bleibt stellenweise zu lose."],
    ["Quellenbezug wurde mehrfach nur paraphrasiert, nicht verdichtet."],
    ["Eine Synthesis-Aufgabe mit stärkerem Fokus auf source mediation wiederholen."]
  ),
  buildReport(
    "sprechen.argumente_wiedergeben_stellung_nehmen",
    0.67,
    ["Die Position ist klar und nachvollziehbar."],
    ["Die Wiedergabe fremder Argumente braucht mehr sprachliche Distanzmarker."],
    ["Direkte Übernahme der Argumentstruktur ohne eigene Gewichtung."],
    ["Noch eine strukturierte Stellungnahme mit Kontrastsignalen üben."]
  ),
  buildReport(
    "schreiben.argumentativen_text_schreiben",
    0.73,
    ["Gute Leserführung und klare Abschnitte."],
    ["Einzelne Satzverbindungen wirken zu ähnlich."],
    ["Wiederholte Muster bei Konnektoren im Hauptteil."],
    ["Eine Grammatik-Remediation zu Nebensatzstruktur anschließen."]
  )
];

const DEMO_NOTEBOOK: DemoNotebookEntry[] = [
  {
    id: "subordinate-clause-order",
    title: "Nebensatzwortstellung",
    category: "Grammatik / Syntax",
    mistake: "..., weil ich habe keine Zeit gehabt.",
    correction: "... , weil ich keine Zeit gehabt habe.",
    explanation: "Im Nebensatz steht die finite Verbform am Ende. Unter Zeitdruck rutscht sie oft zu früh nach vorne.",
    linkedSkill: "grammar.word_order",
    href: "/workspace/mistake/subordinate-clause-order"
  },
  {
    id: "source-mediation-density",
    title: "Quellen verdichten",
    category: "Aufgabenbewältigung",
    mistake: "Der Text sagt viele Dinge über die Grafik, aber ich wiederhole fast alles.",
    correction: "Die Grafik bestätigt den im Text beschriebenen Trend, besonders beim Anstieg seit 2022.",
    explanation: "Bei Schreiben 2 zählt die Auswahl und Verdichtung relevanter Informationen mehr als eine lineare Nacherzählung.",
    linkedSkill: "task.source_mediation",
    href: "/workspace/mistake/source-mediation-density"
  },
  {
    id: "connector-variety",
    title: "Konnektoren variieren",
    category: "Kohäsion",
    mistake: "Außerdem ... außerdem ... außerdem ...",
    correction: "Darüber hinaus ... zugleich ... dennoch ...",
    explanation: "Wiederholte Konnektoren machen den Text berechenbar. Eine breitere Auswahl verbessert den akademischen Registereindruck.",
    linkedSkill: "discourse.cohesion",
    href: "/workspace/mistake/connector-variety"
  }
];

const DEMO_ACTIVITY: DemoActivityItem[] = [
  {
    id: "activity-lesen",
    title: "Lesen 3 abgeschlossen",
    description: "Globalverständnis stabil, Detailabgleich noch unter Druck.",
    href: "/workspace/exercise/03-multiple-choice",
    accent: "lesen"
  },
  {
    id: "activity-schreiben",
    title: "Schreiben 2 Feedback erhalten",
    description: "Quellenintegration verbessert, Verdichtung noch ausbaufähig.",
    href: "/workspace/exercise/02-text-und-grafik-zusammenfassen",
    accent: "schreiben"
  },
  {
    id: "activity-grammar",
    title: "Grammatikpfad empfohlen",
    description: "Nebensatzstruktur und Konnektoren sind die aktuellen Hebel.",
    href: "/workspace/grammar/grammar-focus",
    accent: "grammar"
  }
];

export function getDemoReports(): EvaluationReport[] {
  return DEMO_REPORTS;
}

export function getDemoNotebookEntries(): DemoNotebookEntry[] {
  return DEMO_NOTEBOOK;
}

export function getDemoActivity(): DemoActivityItem[] {
  return DEMO_ACTIVITY;
}

export function buildDemoLearnerState(userId = "demo-lerner"): LearnerState {
  return DEMO_REPORTS.reduce((learnerState, report) => {
    return updateLearnerStateFromEvaluation(learnerState, report);
  }, buildLearnerState(userId));
}
