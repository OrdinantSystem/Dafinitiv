import type { SectionId } from "./exercise-ids";
import type { ExerciseSpec } from "./types";

export const OFFICIAL_SOURCES = [
  "https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/",
  "https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/vorbereitung-auf-den-digitalen-testdaf/beispielaufgaben-zum-digitalen-testdaf/",
  "https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/auswertung-des-digitalen-testdaf/",
  "https://www.testdaf.de/de/forschung/forschung-bei-gast/standard-setting-zum-digitalen-testdaf/"
] as const;

const comprehensionRubric = [
  "task_relevance",
  "content_accuracy",
  "detail_coverage",
  "response_format_control"
];

const productiveRubric = [
  "task_relevance",
  "instruction_coverage",
  "source_use_or_information_accuracy",
  "linguistic_range_and_precision",
  "comprehensibility"
];

const spokenRubric = [
  "task_relevance",
  "instruction_coverage",
  "source_use_or_information_accuracy",
  "fluency_and_delivery",
  "linguistic_range_and_precision",
  "comprehensibility"
];

export const TESTDAF_EXERCISES: ExerciseSpec[] = [
  {
    id: "lesen.lueckentext_ergaenzen",
    section: "lesen",
    order: 1,
    officialLabel: "Lueckentext ergaenzen",
    slug: "01-lueckentext-ergaenzen",
    promptPath: "prompts/testdaf/lesen/01-lueckentext-ergaenzen.md",
    responseKind: "selection",
    inputModality: ["text"],
    supportLevel: "fully_supported",
    itemCount: 5,
    timing: { taskTimeSec: 240, totalMinutesApprox: 4 },
    communicativeGoal: "Complete a short academic-style text using context and lexical precision.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "reading.detail_comprehension",
      "lexicon.academic_vocabulary",
      "lexicon.collocations",
      "grammar.case_and_articles"
    ],
    sourceNotes: ["Official demo: 5 gaps, 4 minutes."]
  },
  {
    id: "lesen.textabschnitte_ordnen",
    section: "lesen",
    order: 2,
    officialLabel: "Textabschnitte ordnen",
    slug: "02-textabschnitte-ordnen",
    promptPath: "prompts/testdaf/lesen/02-textabschnitte-ordnen.md",
    responseKind: "selection",
    inputModality: ["text"],
    supportLevel: "fully_supported",
    itemCount: 4,
    timing: { taskTimeSec: 300, totalMinutesApprox: 5 },
    communicativeGoal: "Restore paragraph order and text logic in a coherent passage.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "reading.global_comprehension",
      "discourse.cohesion",
      "grammar.connectors_and_subordination"
    ],
    sourceNotes: ["Official demo: 4 movable sections, 5 minutes."]
  },
  {
    id: "lesen.multiple_choice",
    section: "lesen",
    order: 3,
    officialLabel: "Multiple Choice",
    slug: "03-multiple-choice",
    promptPath: "prompts/testdaf/lesen/03-multiple-choice.md",
    responseKind: "selection",
    inputModality: ["text"],
    supportLevel: "fully_supported",
    itemCount: 7,
    timing: { taskTimeSec: 900, totalMinutesApprox: 15 },
    communicativeGoal: "Answer global and detailed comprehension questions about an informational text.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "reading.global_comprehension",
      "reading.detail_comprehension",
      "lexicon.academic_vocabulary"
    ],
    sourceNotes: ["Official demo: 7 questions, 15 minutes."]
  },
  {
    id: "lesen.sprachhandlungen_zuordnen",
    section: "lesen",
    order: 4,
    officialLabel: "Sprachhandlungen zuordnen",
    slug: "04-sprachhandlungen-zuordnen",
    promptPath: "prompts/testdaf/lesen/04-sprachhandlungen-zuordnen.md",
    responseKind: "selection",
    inputModality: ["text"],
    supportLevel: "fully_supported",
    itemCount: 4,
    timing: { taskTimeSec: 360, totalMinutesApprox: 6 },
    communicativeGoal: "Identify communicative intent and rhetorical action in short text segments.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "reading.detail_comprehension",
      "task.argumentation",
      "discourse.register"
    ],
    sourceNotes: ["Official demo: 4 items, 6 minutes."]
  },
  {
    id: "lesen.aussagen_kategorien_zuordnen",
    section: "lesen",
    order: 5,
    officialLabel: "Aussagen Kategorien zuordnen",
    slug: "05-aussagen-kategorien-zuordnen",
    promptPath: "prompts/testdaf/lesen/05-aussagen-kategorien-zuordnen.md",
    responseKind: "selection",
    inputModality: ["text"],
    supportLevel: "fully_supported",
    itemCount: 7,
    timing: { taskTimeSec: 540, totalMinutesApprox: 9 },
    communicativeGoal: "Map statements to categories by scanning a text for distributed evidence.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "reading.global_comprehension",
      "reading.detail_comprehension",
      "task.task_fulfillment"
    ],
    sourceNotes: ["Official demo: 7 items, 9 minutes."]
  },
  {
    id: "lesen.aussagen_begriffspaar_zuordnen",
    section: "lesen",
    order: 6,
    officialLabel: "Aussagen einem Begriffspaar zuordnen",
    slug: "06-aussagen-begriffspaar-zuordnen",
    promptPath: "prompts/testdaf/lesen/06-aussagen-begriffspaar-zuordnen.md",
    responseKind: "selection",
    inputModality: ["text"],
    supportLevel: "fully_supported",
    itemCount: 4,
    timing: { taskTimeSec: 420, totalMinutesApprox: 7 },
    communicativeGoal: "Assign statements to the correct conceptual pair or category contrast.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "reading.detail_comprehension",
      "task.argumentation",
      "lexicon.academic_vocabulary"
    ],
    sourceNotes: ["Official demo: 4 assignments, 7 minutes."]
  },
  {
    id: "lesen.fehler_in_zusammenfassung",
    section: "lesen",
    order: 7,
    officialLabel: "Fehler in Zusammenfassung erkennen",
    slug: "07-fehler-in-zusammenfassung",
    promptPath: "prompts/testdaf/lesen/07-fehler-in-zusammenfassung.md",
    responseKind: "selection",
    inputModality: ["text", "graphic"],
    supportLevel: "fully_supported",
    itemCount: 3,
    timing: { taskTimeSec: 420, totalMinutesApprox: 7 },
    communicativeGoal: "Compare source text and graphic against a summary and detect false claims.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "reading.detail_comprehension",
      "task.source_mediation",
      "task.task_fulfillment"
    ],
    sourceNotes: ["Official demo: 3 wrong statements, 7 minutes."]
  },
  {
    id: "hoeren.uebersicht_ergaenzen",
    section: "hoeren",
    order: 1,
    officialLabel: "Kurzantwort: Uebersicht ergaenzen",
    slug: "01-uebersicht-ergaenzen",
    promptPath: "prompts/testdaf/hoeren/01-uebersicht-ergaenzen.md",
    responseKind: "short_text",
    inputModality: ["audio"],
    supportLevel: "strategy_first",
    itemCount: 5,
    timing: {
      previewSec: 15,
      reviewSec: 20,
      notes: "Audio length varies; official demo shows 15 seconds preview and 20 seconds review."
    },
    communicativeGoal: "Listen once and complete a structured overview with short answers.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "listening.detail_comprehension",
      "lexicon.academic_vocabulary",
      "task.task_fulfillment"
    ],
    sourceNotes: ["Official demo: 5 fields, max 2 words per field."]
  },
  {
    id: "hoeren.textstellen_begriffspaar",
    section: "hoeren",
    order: 2,
    officialLabel: "Kurzantwort: Textstellen zu Begriffspaar notieren",
    slug: "02-textstellen-begriffspaar",
    promptPath: "prompts/testdaf/hoeren/02-textstellen-begriffspaar.md",
    responseKind: "short_text",
    inputModality: ["audio"],
    supportLevel: "strategy_first",
    itemCount: 4,
    timing: {
      reviewSec: 180,
      notes: "Audio length varies; official demo shows 3 minutes post-listening review."
    },
    communicativeGoal: "Capture claims and supporting arguments in linked note form.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "listening.detail_comprehension",
      "task.source_mediation",
      "task.argumentation"
    ],
    sourceNotes: ["Official demo: 4 linked note pairs."]
  },
  {
    id: "hoeren.fehler_in_zusammenfassung",
    section: "hoeren",
    order: 3,
    officialLabel: "Fehler in Zusammenfassung erkennen",
    slug: "03-fehler-in-zusammenfassung",
    promptPath: "prompts/testdaf/hoeren/03-fehler-in-zusammenfassung.md",
    responseKind: "selection",
    inputModality: ["audio", "text"],
    supportLevel: "strategy_first",
    itemCount: 2,
    timing: {
      reviewSec: 150,
      notes: "Audio length varies; official demo shows 2 minutes 30 seconds review after listening."
    },
    communicativeGoal: "Compare an audio source with a written summary and detect false statements.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "listening.detail_comprehension",
      "task.source_mediation",
      "reading.detail_comprehension"
    ],
    sourceNotes: ["Official demo: 2 wrong statements."]
  },
  {
    id: "hoeren.aussagen_personen_zuordnen",
    section: "hoeren",
    order: 4,
    officialLabel: "Aussagen Personen zuordnen",
    slug: "04-aussagen-personen-zuordnen",
    promptPath: "prompts/testdaf/hoeren/04-aussagen-personen-zuordnen.md",
    responseKind: "selection",
    inputModality: ["video"],
    supportLevel: "strategy_first",
    itemCount: 6,
    timing: {
      previewSec: 45,
      reviewSec: 45,
      notes: "Video length varies; official demo shows 45 seconds preview and 45 seconds review."
    },
    communicativeGoal: "Assign statements to speakers after a panel discussion.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "listening.global_comprehension",
      "listening.detail_comprehension",
      "task.argumentation"
    ],
    sourceNotes: ["Official demo: 6 statements."]
  },
  {
    id: "hoeren.gliederungspunkte_erganzen",
    section: "hoeren",
    order: 5,
    officialLabel: "Kurzantwort: Gliederungspunkte zu Vortrag ergaenzen",
    slug: "05-gliederungspunkte-ergaenzen",
    promptPath: "prompts/testdaf/hoeren/05-gliederungspunkte-ergaenzen.md",
    responseKind: "short_text",
    inputModality: ["video"],
    supportLevel: "strategy_first",
    itemCount: 4,
    timing: {
      previewSec: 10,
      reviewSec: 180,
      notes: "Video length varies; official demo shows 10 seconds preview and 3 minutes review."
    },
    communicativeGoal: "Complete a lecture outline from a short video input.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "listening.detail_comprehension",
      "task.source_mediation",
      "lexicon.academic_vocabulary"
    ],
    sourceNotes: ["Official demo: 4 outline fields."]
  },
  {
    id: "hoeren.multiple_choice",
    section: "hoeren",
    order: 6,
    officialLabel: "Multiple Choice",
    slug: "06-multiple-choice",
    promptPath: "prompts/testdaf/hoeren/06-multiple-choice.md",
    responseKind: "selection",
    inputModality: ["audio"],
    supportLevel: "strategy_first",
    itemCount: 5,
    timing: {
      previewSec: 90,
      reviewSec: 90,
      notes: "Audio length varies; official demo shows 90 seconds preview and 90 seconds review."
    },
    communicativeGoal: "Answer global and detailed listening questions about a lecture excerpt.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "listening.global_comprehension",
      "listening.detail_comprehension"
    ],
    sourceNotes: ["Official demo: 5 questions."]
  },
  {
    id: "hoeren.laut_schriftbild_abgleichen",
    section: "hoeren",
    order: 7,
    officialLabel: "Laut- und Schriftbild abgleichen",
    slug: "07-laut-schriftbild-abgleichen",
    promptPath: "prompts/testdaf/hoeren/07-laut-schriftbild-abgleichen.md",
    responseKind: "selection",
    inputModality: ["audio", "text"],
    supportLevel: "strategy_first",
    itemCount: 4,
    timing: {
      reviewSec: 20,
      notes: "Audio length varies; official demo shows 20 seconds review after listening."
    },
    communicativeGoal: "Spot words that differ between spoken and written versions of the same text.",
    rubricCriteria: comprehensionRubric,
    skillTags: [
      "listening.detail_comprehension",
      "reading.detail_comprehension",
      "lexicon.collocations"
    ],
    sourceNotes: ["Official demo: 4 mismatches."]
  },
  {
    id: "schreiben.argumentativen_text_schreiben",
    section: "schreiben",
    order: 1,
    officialLabel: "Argumentativen Text schreiben",
    slug: "01-argumentativen-text-schreiben",
    promptPath: "prompts/testdaf/schreiben/01-argumentativen-text-schreiben.md",
    responseKind: "essay",
    inputModality: ["text"],
    supportLevel: "fully_supported",
    wordCount: { min: 200 },
    timing: { taskTimeSec: 1800, totalMinutesApprox: 30 },
    communicativeGoal: "Write a short argumentative contribution for an academic discussion context.",
    rubricCriteria: productiveRubric,
    skillTags: [
      "writing.written_production",
      "task.argumentation",
      "task.task_fulfillment",
      "discourse.cohesion",
      "discourse.register",
      "grammar.word_order",
      "lexicon.academic_vocabulary"
    ],
    sourceNotes: ["Official demo: minimum 200 words, 30 minutes."]
  },
  {
    id: "schreiben.text_und_grafik_zusammenfassen",
    section: "schreiben",
    order: 2,
    officialLabel: "Informationen aus Lesetext und Grafik zusammenfassen",
    slug: "02-text-und-grafik-zusammenfassen",
    promptPath: "prompts/testdaf/schreiben/02-text-und-grafik-zusammenfassen.md",
    responseKind: "integrated",
    inputModality: ["text", "graphic"],
    supportLevel: "fully_supported",
    wordCount: { targetMin: 100, targetMax: 150 },
    timing: { taskTimeSec: 1800, totalMinutesApprox: 30 },
    communicativeGoal: "Summarize relevant information from a text and a graphic in your own words.",
    rubricCriteria: productiveRubric,
    skillTags: [
      "writing.written_production",
      "task.source_mediation",
      "task.task_fulfillment",
      "reading.detail_comprehension",
      "discourse.cohesion"
    ],
    sourceNotes: ["Official demo: about 100 to 150 words, 30 minutes."]
  },
  {
    id: "sprechen.rat_geben",
    section: "sprechen",
    order: 1,
    officialLabel: "Rat geben",
    slug: "01-rat-geben",
    promptPath: "prompts/testdaf/sprechen/01-rat-geben.md",
    responseKind: "speech",
    inputModality: ["text", "audio"],
    supportLevel: "strategy_first",
    timing: {
      preparationSec: 30,
      speakingSec: 45,
      phases: [
        { label: "prepare", seconds: 30 },
        { label: "speak", seconds: 45 }
      ]
    },
    communicativeGoal: "Give concise advice in a university-related everyday situation.",
    rubricCriteria: spokenRubric,
    skillTags: [
      "speaking.spoken_production",
      "task.task_fulfillment",
      "discourse.register",
      "task.argumentation"
    ],
    sourceNotes: ["Official demo: 30 seconds preparation, 45 seconds speaking."]
  },
  {
    id: "sprechen.optionen_abwaegen",
    section: "sprechen",
    order: 2,
    officialLabel: "Optionen abwaegen",
    slug: "02-optionen-abwaegen",
    promptPath: "prompts/testdaf/sprechen/02-optionen-abwaegen.md",
    responseKind: "speech",
    inputModality: ["text", "audio"],
    supportLevel: "strategy_first",
    timing: {
      preparationSec: 45,
      speakingSec: 90,
      phases: [
        { label: "prepare", seconds: 45 },
        { label: "speak", seconds: 90 }
      ]
    },
    communicativeGoal: "Balance options, compare them, and justify a choice.",
    rubricCriteria: spokenRubric,
    skillTags: [
      "speaking.spoken_production",
      "task.argumentation",
      "discourse.cohesion",
      "discourse.register"
    ],
    sourceNotes: ["Official demo: 45 seconds preparation, 90 seconds speaking."]
  },
  {
    id: "sprechen.text_zusammenfassen",
    section: "sprechen",
    order: 3,
    officialLabel: "Text zusammenfassen",
    slug: "03-text-zusammenfassen",
    promptPath: "prompts/testdaf/sprechen/03-text-zusammenfassen.md",
    responseKind: "integrated",
    inputModality: ["text"],
    supportLevel: "strategy_first",
    timing: {
      readingSec: 240,
      speakingSec: 120,
      phases: [
        { label: "read_source", seconds: 240 },
        { label: "speak", seconds: 120 }
      ]
    },
    communicativeGoal: "Read a short text and orally summarize the essential information.",
    rubricCriteria: spokenRubric,
    skillTags: [
      "reading.global_comprehension",
      "task.source_mediation",
      "speaking.spoken_production",
      "task.task_fulfillment"
    ],
    sourceNotes: ["Official demo: 4 minutes reading, 2 minutes speaking."]
  },
  {
    id: "sprechen.informationen_abgleichen_stellung_nehmen",
    section: "sprechen",
    order: 4,
    officialLabel: "Informationen abgleichen, Stellung nehmen",
    slug: "04-informationen-abgleichen-stellung-nehmen",
    promptPath: "prompts/testdaf/sprechen/04-informationen-abgleichen-stellung-nehmen.md",
    responseKind: "integrated",
    inputModality: ["audio", "graphic"],
    supportLevel: "strategy_first",
    timing: {
      phases: [
        { label: "inspect_graphic", seconds: 30 },
        { label: "listen_peer", seconds: 20 },
        { label: "prepare", seconds: 90 },
        { label: "speak", seconds: 90 }
      ]
    },
    communicativeGoal: "Compare spoken information with a graphic and state your own position.",
    rubricCriteria: spokenRubric,
    skillTags: [
      "listening.detail_comprehension",
      "task.source_mediation",
      "task.argumentation",
      "speaking.spoken_production"
    ],
    sourceNotes: ["Official demo: graphic plus peer input, 90 seconds speaking."]
  },
  {
    id: "sprechen.thema_praesentieren",
    section: "sprechen",
    order: 5,
    officialLabel: "Thema praesentieren",
    slug: "05-thema-praesentieren",
    promptPath: "prompts/testdaf/sprechen/05-thema-praesentieren.md",
    responseKind: "speech",
    inputModality: ["text"],
    supportLevel: "strategy_first",
    timing: {
      preparationSec: 120,
      speakingSec: 150,
      phases: [
        { label: "prepare", seconds: 120 },
        { label: "speak", seconds: 150 }
      ]
    },
    communicativeGoal: "Deliver a short structured presentation with signposting.",
    rubricCriteria: spokenRubric,
    skillTags: [
      "speaking.spoken_production",
      "discourse.cohesion",
      "task.task_fulfillment",
      "lexicon.academic_vocabulary"
    ],
    sourceNotes: ["Official demo: 2 minutes preparation, 2 minutes 30 seconds speaking."]
  },
  {
    id: "sprechen.argumente_wiedergeben_stellung_nehmen",
    section: "sprechen",
    order: 6,
    officialLabel: "Argumente wiedergeben, Stellung nehmen",
    slug: "06-argumente-wiedergeben-stellung-nehmen",
    promptPath: "prompts/testdaf/sprechen/06-argumente-wiedergeben-stellung-nehmen.md",
    responseKind: "integrated",
    inputModality: ["audio"],
    supportLevel: "strategy_first",
    timing: {
      phases: [
        { label: "listen_peer", seconds: 58 },
        { label: "prepare", seconds: 90 },
        { label: "speak", seconds: 120 }
      ]
    },
    communicativeGoal: "Restate a peer's arguments, evaluate them, and add your own stance.",
    rubricCriteria: spokenRubric,
    skillTags: [
      "listening.detail_comprehension",
      "task.source_mediation",
      "task.argumentation",
      "speaking.spoken_production"
    ],
    sourceNotes: ["Official demo: listen, prepare 90 seconds, speak 2 minutes."]
  },
  {
    id: "sprechen.massnahmen_kritisieren",
    section: "sprechen",
    order: 7,
    officialLabel: "Massnahmen kritisieren",
    slug: "07-massnahmen-kritisieren",
    promptPath: "prompts/testdaf/sprechen/07-massnahmen-kritisieren.md",
    responseKind: "speech",
    inputModality: ["text"],
    supportLevel: "strategy_first",
    timing: {
      preparationSec: 90,
      speakingSec: 90,
      phases: [
        { label: "prepare", seconds: 90 },
        { label: "speak", seconds: 90 }
      ]
    },
    communicativeGoal: "Criticize a proposed measure and suggest a better alternative.",
    rubricCriteria: spokenRubric,
    skillTags: [
      "speaking.spoken_production",
      "task.argumentation",
      "discourse.register",
      "task.task_fulfillment"
    ],
    sourceNotes: ["Official demo: 90 seconds preparation and 90 seconds speaking."]
  }
];

export const SECTION_DURATIONS: Record<SectionId, number> = {
  lesen: 55,
  hoeren: 40,
  schreiben: 60,
  sprechen: 35
};

export function getExerciseSpec(exerciseId: ExerciseSpec["id"]): ExerciseSpec {
  const match = TESTDAF_EXERCISES.find((exercise) => exercise.id === exerciseId);

  if (!match) {
    throw new Error(`Unknown exercise id: ${exerciseId}`);
  }

  return match;
}

export function getExercisesBySection(section: SectionId): ExerciseSpec[] {
  return TESTDAF_EXERCISES.filter((exercise) => exercise.section === section)
    .sort((left, right) => left.order - right.order);
}

export function getOfficialExerciseSequence(): ExerciseSpec[] {
  const sectionOrder: SectionId[] = ["lesen", "hoeren", "schreiben", "sprechen"];
  return sectionOrder.flatMap((section) => getExercisesBySection(section));
}
