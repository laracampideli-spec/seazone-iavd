// Grade ranges for final score calculation
export const GRADE_RANGES = [
  { grade: "E", label: "Desligamento", min: 13, max: 31, color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-50", borderColor: "border-red-200" },
  { grade: "D", label: "Plano de reversão", min: 32, max: 38, color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-50", borderColor: "border-orange-200" },
  { grade: "C", label: "Dentro do esperado", min: 39, max: 41, color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-50", borderColor: "border-blue-200" },
  { grade: "B", label: "Acima do esperado", min: 42, max: 44, color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-50", borderColor: "border-green-200" },
  { grade: "A", label: "Muito acima do esperado", min: 45, max: 65, color: "bg-primary", textColor: "text-primary", bgLight: "bg-primary/5", borderColor: "border-primary/20" },
] as const;

export type FinalGrade = typeof GRADE_RANGES[number]["grade"];

export interface GradeResult {
  total: number;
  maxTotal: number;
  filledCount: number;     // criteria explicitly set (not null)
  alteredCount: number;    // criteria with score != 3
  totalCriteria: number;
  grade: FinalGrade;
  label: string;
  range: typeof GRADE_RANGES[number];
}

// Default score for unfilled criteria: C (3)
const DEFAULT_SCORE = 3;
const TOTAL_CRITERIA = 13;

/**
 * Calculates the final grade from a map of scores.
 * Missing criteria default to C (3).
 * filledCount tracks criteria whose score differs from the default C (3).
 *
 * @param scores - Record<questionId, score (1-5) | null>
 * @param questionIds - ordered list of the 13 criteria IDs
 */
export function calculateFinalGrade(
  scores: Record<string, number | null>,
  questionIds: string[]
): GradeResult {
  let total = 0;
  let filledCount = 0;
  let alteredCount = 0;

  for (const id of questionIds) {
    const score = scores[id];
    const effectiveScore = score ?? DEFAULT_SCORE;
    total += effectiveScore;
    if (score != null) filledCount++;
    if (effectiveScore !== DEFAULT_SCORE) alteredCount++;
  }

  const range = GRADE_RANGES.find(r => total >= r.min && total <= r.max) ?? GRADE_RANGES[0];

  return {
    total,
    maxTotal: TOTAL_CRITERIA * 5,
    filledCount,
    alteredCount,
    totalCriteria: TOTAL_CRITERIA,
    grade: range.grade,
    label: range.label,
    range,
  };
}
