import {
  criterionCalibrations,
  CeoLevel,
  EVALUATION_TYPE_WEIGHT,
  GENERAL_ALERT_EXPRESSIONS,
} from "@/data/calibration";

export function resolveCeoLevel(cargo: string, role: string): CeoLevel {
  if (/estagiário|estágio|jovem.?aprendiz|jovem.?talento/i.test(cargo)) return "Estágio";
  if (/especialista/i.test(cargo)) return "Especialista";
  if (/gerente/i.test(cargo)) return "Gerente";
  if (/coordenador/i.test(cargo)) return "Coordenador";
  if (/diretor/i.test(cargo)) return "Diretor";
  if (/analista/i.test(cargo)) return "Analista";

  switch (role) {
    case "coordenador": return "Coordenador";
    case "diretor":     return "Diretor";
    case "c_level":     return "C-Level";
    case "rh":          return "Analista";
    case "colaborador": return "Analista";
    default:            return "Analista";
  }
}

export function buildLevelCalibrationContext(criterionId: string, ceoLevel: CeoLevel): string {
  const criterion = criterionCalibrations.find((c) => c.criterionId === criterionId);
  if (!criterion) return "";

  const levelExp = criterion.levelExpectations.find((l) => l.level === ceoLevel);
  if (!levelExp) return "";

  const { expectation, gradeExamples } = levelExp;

  return [
    `CALIBRAGEM — ${criterion.criterionTitle} para ${ceoLevel}:`,
    `- O que é esperado (nota 3): ${expectation}`,
    `- Nota 5 (excepcional): ${gradeExamples.grade5}`,
    `- Nota 4 (acima): ${gradeExamples.grade4}`,
    `- Nota 2 (abaixo): ${gradeExamples.grade2}`,
    `- Nota 1 (insuficiente): ${gradeExamples.grade1}`,
    `Erros da IA a evitar: ${criterion.commonAIErrors.join("; ")}`,
  ].join("\n");
}

export function buildHolisticLevelContext(
  ceoLevel: CeoLevel,
  answers: Array<{ questionId: string; score: number; justification: string }>,
): string {
  const parts: string[] = [`\nCALIBRAGEM POR NÍVEL — Avaliado é ${ceoLevel}:`];

  for (const ans of answers) {
    const block = buildLevelCalibrationContext(ans.questionId, ceoLevel);
    if (block) parts.push(block);
  }

  const alertList = Object.keys(GENERAL_ALERT_EXPRESSIONS).join("; ");

  parts.push(
    "Distribuição esperada: 5%=nota 1, 10%=nota 2, 60%=nota 3, 20%=nota 4, 5%=nota 5",
    `Expressões de alerta: ${alertList}`,
  );

  return parts.join("\n");
}

export function buildEvaluationTypeContext(evaluationType: string): string {
  return EVALUATION_TYPE_WEIGHT[evaluationType] ?? "";
}
