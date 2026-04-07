"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Calculator } from "lucide-react";
import { calculateFinalGrade } from "@/lib/grade-utils";

interface ScorePreviewProps {
  scores: Record<string, number | null>;
  questionIds: string[];
  questionLabels: Record<string, string>;
}

// Maps score (1-5) to grade letter
const scoreToGrade: Record<number, string> = { 5: "A", 4: "B", 3: "C", 2: "D", 1: "E" };

// Text color for each grade letter in the criteria list
function getCriterionGradeClass(score: number | null): string {
  if (score === null) return "text-gray-300"; // not filled yet
  if (score === 5) return "text-primary font-bold";
  if (score === 4) return "text-green-600 font-bold";
  if (score === 3) return "text-yellow-600 font-bold";
  if (score === 2) return "text-orange-600 font-bold";
  if (score === 1) return "text-red-600 font-bold";
  return "text-gray-400";
}

export default function ScorePreview({ scores, questionIds, questionLabels }: ScorePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const result = useMemo(
    () => calculateFinalGrade(scores, questionIds),
    [scores, questionIds]
  );

  const progressPct = Math.round((result.total / result.maxTotal) * 100);

  // Minimized pill
  if (!isExpanded) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className={`w-14 h-14 rounded-full ${result.range.color} shadow-xl flex items-center justify-center text-white text-xl font-bold hover:scale-105 transition-transform`}
          title="Expandir calculadora"
        >
          {result.grade}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className={`${result.range.color} px-4 py-3 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black leading-none">{result.grade}</span>
              <div>
                <p className="text-sm font-semibold leading-tight">{result.label}</p>
                <p className="text-xs text-white/80 mt-0.5">
                  {result.total}/{result.maxTotal} pontos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calculator className="w-4 h-4 text-white/70" />
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition"
                title="Minimizar"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-white/30 rounded-full h-1.5">
            <div
              className="bg-white h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Criteria list */}
        <div className="px-4 py-3 max-h-72 overflow-y-auto">
          <div className="space-y-1.5">
            {questionIds.map((id) => {
              const score = scores[id] ?? 3;
              const grade = scoreToGrade[score] ?? "C";
              const gradeClass = getCriterionGradeClass(scores[id]);
              const label = questionLabels[id] ?? id;

              return (
                <div key={id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-600 truncate flex-1">{label}</span>
                  <span className={`text-xs w-5 text-right shrink-0 ${gradeClass}`}>{grade}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer summary */}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <p className="text-[11px] text-gray-500 text-center">
            {result.filledCount === 0
              ? "Nenhum critério preenchido"
              : result.filledCount < result.totalCriteria
                ? `${result.filledCount} de ${result.totalCriteria} critérios preenchidos`
                : result.alteredCount === 0
                  ? "Todos os critérios em C (padrão)"
                  : `${result.alteredCount} de ${result.totalCriteria} critérios alterados`}
          </p>
        </div>
      </div>
    </div>
  );
}
