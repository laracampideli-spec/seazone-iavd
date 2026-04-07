"use client";

import { useState } from "react";
import AppShell from "@/components/app-shell";
import ScorePreview from "@/components/score-preview";
import { defaultQuestions } from "@/data/questions";
import { GRADE_RANGES } from "@/lib/grade-utils";

// Score ↔ grade mappings (same as avaliacao page)
const gradeToScore: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };
const grades = ["A", "B", "C", "D", "E"] as const;

const gradeLabels: Record<string, string> = {
  A: "Excepcional",
  B: "Acima do esperado",
  C: "Dentro do esperado",
  D: "Abaixo do esperado",
  E: "Insuficiente",
};

const gradeColors: Record<string, string> = {
  A: "bg-primary text-white",
  B: "bg-green-500 text-white",
  C: "bg-yellow-500 text-white",
  D: "bg-orange-500 text-white",
  E: "bg-red-500 text-white",
};

const gradeColorsOutline: Record<string, string> = {
  A: "border-primary/30 text-primary hover:bg-primary/5",
  B: "border-green-300 text-green-600 hover:bg-green-50",
  C: "border-yellow-300 text-yellow-600 hover:bg-yellow-50",
  D: "border-orange-300 text-orange-600 hover:bg-orange-50",
  E: "border-red-300 text-red-600 hover:bg-red-50",
};

// Precomputed helpers
const questionIds = defaultQuestions.map((q) => q.id);
const questionLabels = Object.fromEntries(defaultQuestions.map((q) => [q.id, q.title]));

// Group questions by category
const questionsByCategory = defaultQuestions.reduce<
  Record<string, typeof defaultQuestions>
>((acc, q) => {
  if (!acc[q.category]) acc[q.category] = [];
  acc[q.category].push(q);
  return acc;
}, {});

export default function CalculadoraPage() {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    defaultQuestions.forEach((q) => {
      initial[q.id] = 3; // default: C
    });
    return initial;
  });

  function handleSelectGrade(questionId: string, grade: string) {
    setScores((prev) => ({ ...prev, [questionId]: gradeToScore[grade] }));
  }

  function handleReset() {
    const initial: Record<string, number> = {};
    defaultQuestions.forEach((q) => {
      initial[q.id] = 3;
    });
    setScores(initial);
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-32">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Calculadora de Nota Final</h1>
          <p className="text-sm text-gray-500 mt-1">
            Simule a nota consolidada ajustando os conceitos dos 13 critérios. Todos iniciam em C
            (dentro do esperado). O card lateral atualiza em tempo real.
          </p>
        </div>

        {/* Grade range reference table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-8 overflow-x-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Faixas de nota final (soma dos 13 critérios)
          </p>
          <div className="flex gap-2 min-w-max">
            {[...GRADE_RANGES].reverse().map((r) => (
              <div
                key={r.grade}
                className={`flex-1 rounded-lg px-3 py-2 ${r.bgLight} border ${r.borderColor} text-center min-w-[110px]`}
              >
                <span className={`text-lg font-black ${r.textColor}`}>{r.grade}</span>
                <p className={`text-[11px] font-medium ${r.textColor} mt-0.5`}>{r.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {r.min}–{r.max} pts
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition"
          >
            Resetar todos para C
          </button>
        </div>

        {/* Criteria cards grouped by category */}
        <div className="space-y-8">
          {Object.entries(questionsByCategory).map(([category, questions]) => (
            <div key={category}>
              {/* Category separator */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                  {category}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="space-y-4">
                {questions.map((question) => {
                  const currentScore = scores[question.id] ?? 3;
                  const currentGrade = Object.entries(gradeToScore).find(
                    ([, s]) => s === currentScore
                  )?.[0] ?? "C";

                  return (
                    <div
                      key={question.id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-900">
                          {question.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {question.description}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {grades.map((grade) => {
                          const isSelected = currentGrade === grade;
                          return (
                            <button
                              key={grade}
                              onClick={() => handleSelectGrade(question.id, grade)}
                              className={`flex-1 py-2.5 rounded-xl text-center transition border-2 ${
                                isSelected
                                  ? gradeColors[grade] + " border-transparent shadow-md scale-105"
                                  : gradeColorsOutline[grade] + " bg-white"
                              }`}
                            >
                              <span className="text-xl font-bold block">{grade}</span>
                              <span className="text-[10px] block mt-0.5 opacity-80">
                                {gradeLabels[grade]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed score preview card */}
      <ScorePreview
        scores={scores}
        questionIds={questionIds}
        questionLabels={questionLabels}
      />
    </AppShell>
  );
}
