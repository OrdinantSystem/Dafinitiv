import type { CriterionScore, EstimatedTdn } from "./types";

export function clampScore01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function toBand15(score01: number): 1 | 2 | 3 | 4 | 5 {
  if (score01 >= 0.85) {
    return 5;
  }
  if (score01 >= 0.65) {
    return 4;
  }
  if (score01 >= 0.45) {
    return 3;
  }
  if (score01 >= 0.25) {
    return 2;
  }
  return 1;
}

export function averageCriterionScore(criterionScores: CriterionScore[]): number {
  if (criterionScores.length === 0) {
    return 0;
  }

  const total = criterionScores.reduce((sum, criterion) => sum + criterion.score01, 0);
  return clampScore01(total / criterionScores.length);
}

export function estimateTdn(overallScore01: number): EstimatedTdn {
  if (overallScore01 >= 0.8) {
    return "tdn_5";
  }
  if (overallScore01 >= 0.5) {
    return "tdn_4";
  }
  if (overallScore01 >= 0.25) {
    return "tdn_3";
  }
  return "under_tdn_3";
}
