export interface ChatExerciseDefinition {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  trainingGoal: string;
  promptPath: string;
  starterPrompts: string[];
  initialAssistantMessage: string;
  focusAreas: string[];
}

export const CHAT_EXERCISES: ChatExerciseDefinition[] = [
  {
    slug: "grammar-repair-studio",
    title: "Grammar Repair Studio",
    eyebrow: "Chat Exercise",
    summary:
      "Send flawed German sentences and get guided repair, contrastive explanations, and one follow-up transformation task.",
    trainingGoal:
      "Automate correction patterns for word order, articles, agreement, and case selection without drifting away from TestDaF-relevant German.",
    promptPath: "prompts/training/chat/grammar-repair-studio.md",
    starterPrompts: [
      "Bitte korrigiere diesen Satz und erkläre mir nur den wichtigsten Fehler: Wegen die neue Regel haben viele Studenten weniger Zeit.",
      "Gib mir drei Mini-Drills zu Nebensätzen mit obwohl, damit und während.",
      "Ich schreibe dir fünf fehlerhafte Sätze. Bitte korrigiere sie Schritt für Schritt."
    ],
    initialAssistantMessage:
      "Willkommen im Grammar Repair Studio. Schick mir einen fehlerhaften Satz, einen kurzen Absatz oder einen Grammatikfokus, und ich führe dich durch gezielte Reparatur und Transfer.",
    focusAreas: ["grammar.word_order", "grammar.case_and_articles", "grammar.connectors_and_subordination"]
  },
  {
    slug: "argument-builder",
    title: "Argument Builder",
    eyebrow: "Chat Exercise",
    summary:
      "Train claim-reason-example logic for TestDaF writing and speaking with compact argumentative exchanges.",
    trainingGoal:
      "Strengthen argument structure, comparison language, and justification so the learner can produce clearer positions under exam pressure.",
    promptPath: "prompts/training/chat/argument-builder.md",
    starterPrompts: [
      "Hilf mir, ein starkes Pro- und Contra-Argument zum Thema Pflichtpraktikum zu entwickeln.",
      "Stell mir eine TestDaF-ähnliche Behauptung vor und lass mich sie in drei Schritten begründen.",
      "Prüfe mein Argument: Online-Unterricht ist für alle Studierenden effizienter als Präsenzunterricht."
    ],
    initialAssistantMessage:
      "Willkommen im Argument Builder. Ich helfe dir, aus einer Meinung eine tragfähige Argumentation mit Begründung, Beispiel und sprachlich sauberem Abschluss zu machen.",
    focusAreas: ["task.argumentation", "discourse.cohesion", "speaking.spoken_production"]
  },
  {
    slug: "source-synthesis-coach",
    title: "Source Synthesis Coach",
    eyebrow: "Chat Exercise",
    summary:
      "Practice combining short source snippets into clean TestDaF-style summaries and mediated responses.",
    trainingGoal:
      "Improve mediation from text/graphic evidence into concise academic German without copying source language.",
    promptPath: "prompts/training/chat/source-synthesis-coach.md",
    starterPrompts: [
      "Ich gebe dir gleich einen kurzen Text und eine Grafikbeschreibung. Hilf mir, eine 120-Wörter-Zusammenfassung zu bauen.",
      "Zeig mir, wie ich Informationen aus zwei Quellen bündele, ohne nur abzuschreiben.",
      "Bewerte diese Zusammenfassung auf Informationsauswahl und sprachliche Verdichtung."
    ],
    initialAssistantMessage:
      "Willkommen beim Source Synthesis Coach. Gib mir Quellenmaterial oder eine Zusammenfassung, und ich trainiere mit dir Auswahl, Verdichtung und saubere Umformulierung.",
    focusAreas: ["task.source_mediation", "writing.written_production", "reading.detail_comprehension"]
  },
  {
    slug: "speaking-outline-coach",
    title: "Speaking Outline Coach",
    eyebrow: "Chat Exercise",
    summary:
      "Build short speaking plans for TestDaF oral tasks before turning them into spoken responses.",
    trainingGoal:
      "Make spoken answers faster to organize by training compact outlines, transitions, and time-aware structure.",
    promptPath: "prompts/training/chat/speaking-outline-coach.md",
    starterPrompts: [
      "Gib mir eine Sprechaufgabe und hilf mir zuerst nur mit einem 4-Punkte-Outline.",
      "Ich muss Optionen abwägen. Zeig mir eine gute Struktur für 90 Sekunden Sprechen.",
      "Hier ist mein Plan für eine mündliche Antwort. Wo fehlt noch Logik oder sprachliche Verbindung?"
    ],
    initialAssistantMessage:
      "Willkommen beim Speaking Outline Coach. Ich helfe dir, aus einer Aufgabe schnell einen tragfähigen Sprechplan mit Einstieg, Kernpunkten und Abschluss zu bauen.",
    focusAreas: ["speaking.spoken_production", "task.task_fulfillment", "discourse.cohesion"]
  },
  {
    slug: "register-rewrite-lab",
    title: "Register Rewrite Lab",
    eyebrow: "Chat Exercise",
    summary:
      "Rewrite informal or clumsy German into calmer academic TestDaF-ready register with targeted commentary.",
    trainingGoal:
      "Train exam-appropriate register, lexical precision, and stylistic control for written and spoken academic contexts.",
    promptPath: "prompts/training/chat/register-rewrite-lab.md",
    starterPrompts: [
      "Bitte formuliere diesen Absatz akademischer und natürlicher um.",
      "Zeig mir drei bessere Versionen dieses Satzes in formellem Deutsch.",
      "Ich klinge zu umgangssprachlich. Bitte markiere die problematischen Stellen und verbessere sie."
    ],
    initialAssistantMessage:
      "Willkommen im Register Rewrite Lab. Schick mir informelle, holprige oder zu direkte Formulierungen, und ich überführe sie mit dir in präziseres akademisches Deutsch.",
    focusAreas: ["discourse.register", "lexicon.academic_vocabulary", "writing.written_production"]
  }
];

export function getChatExerciseBySlug(slug: string): ChatExerciseDefinition | undefined {
  return CHAT_EXERCISES.find((exercise) => exercise.slug === slug);
}
