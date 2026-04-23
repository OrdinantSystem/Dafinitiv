export type SectionId = "lesen" | "hoeren" | "schreiben" | "sprechen";

export const EXERCISE_IDS = [
  "lesen.lueckentext_ergaenzen",
  "lesen.textabschnitte_ordnen",
  "lesen.multiple_choice",
  "lesen.sprachhandlungen_zuordnen",
  "lesen.aussagen_kategorien_zuordnen",
  "lesen.aussagen_begriffspaar_zuordnen",
  "lesen.fehler_in_zusammenfassung",
  "hoeren.uebersicht_ergaenzen",
  "hoeren.textstellen_begriffspaar",
  "hoeren.fehler_in_zusammenfassung",
  "hoeren.aussagen_personen_zuordnen",
  "hoeren.gliederungspunkte_erganzen",
  "hoeren.multiple_choice",
  "hoeren.laut_schriftbild_abgleichen",
  "schreiben.argumentativen_text_schreiben",
  "schreiben.text_und_grafik_zusammenfassen",
  "sprechen.rat_geben",
  "sprechen.optionen_abwaegen",
  "sprechen.text_zusammenfassen",
  "sprechen.informationen_abgleichen_stellung_nehmen",
  "sprechen.thema_praesentieren",
  "sprechen.argumente_wiedergeben_stellung_nehmen",
  "sprechen.massnahmen_kritisieren"
] as const;

export type ExerciseId = (typeof EXERCISE_IDS)[number];
