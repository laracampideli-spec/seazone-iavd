"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Evaluation } from "@/lib/types";
import { getQuestions } from "@/lib/store";
import { Question } from "@/lib/types";
import { fetchEvaluations, fetchCalibrationResult, saveCalibrationResult, CalibrationResult } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";
import { canCalibrate } from "@/lib/permissions";
import { getAllUsers, findUser } from "@/lib/org-tree";
import { User } from "@/lib/auth-types";
import { toGrade, avgToGrade, gradeToScore } from "@/lib/utils";
import { medals as allMedals } from "@/data/medals";
import { historyRecords, currentCycleRecords, allPeriods } from "@/data/history";
import AppShell from "@/components/app-shell";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Award,
  ShieldAlert,
  Scale,
  Check,
  Pencil,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────

function gradeColor(g: string) {
  if (g === "A") return "bg-green-100 text-green-700 border-green-200";
  if (g === "B") return "bg-blue-100 text-blue-700 border-blue-200";
  if (g === "C") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (g === "D") return "bg-orange-100 text-orange-700 border-orange-200";
  if (g === "E") return "bg-red-100 text-red-700 border-red-200";
  return "bg-gray-100 text-gray-400 border-gray-200";
}

function gradeFromSum(sum: number, numCriteria: number): string {
  return avgToGrade(sum / numCriteria);
}

function computeAvgScores(
  evals: Evaluation[],
  questions: Question[]
): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  for (const q of questions) {
    const scores = evals
      .flatMap((e) => e.answers)
      .filter((a) => a.questionId === q.id && a.score !== null)
      .map((a) => a.score as number);
    out[q.id] = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  }
  return out;
}

// ── main component ────────────────────────────────────────────────────

export default function SessaoCalibracaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [allEvals, setAllEvals] = useState<Evaluation[]>([]);
  const [allPeople, setAllPeople] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Per-criterion calibration
  const [calibGrades, setCalibGrades] = useState<Record<string, string>>({});
  const [calibNotes, setCalibNotes] = useState("");
  const [savedResult, setSavedResult] = useState<CalibrationResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Floating grade picker
  const [editingCriterion, setEditingCriterion] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  const questions = getQuestions();

  useEffect(() => {
    async function load() {
      const [evals, people, result] = await Promise.all([
        fetchEvaluations(),
        Promise.resolve(getAllUsers()),
        fetchCalibrationResult(id),
      ]);
      setAllEvals(evals);
      setAllPeople(people.sort((a, b) => a.name.localeCompare(b.name)));
      if (result) {
        setSavedResult(result);
        setCalibGrades(result.criteriaGrades || {});
        setCalibNotes(result.notes || "");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // Close popover on outside click
  const closePopover = useCallback(() => {
    setEditingCriterion(null);
    setPopoverPos(null);
  }, []);

  useEffect(() => {
    if (!editingCriterion) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-calibpicker]") && !target.closest("[data-calibcell]")) {
        closePopover();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [editingCriterion, closePopover]);

  if (!currentUser) return null;

  if (!canCalibrate(currentUser)) {
    return (
      <AppShell>
        <div className="text-center py-16">
          <ShieldAlert className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">Sem permissão</h2>
          <p className="text-gray-500 mt-1">Apenas RH e C-Levels podem acessar a sessão de calibração.</p>
        </div>
      </AppShell>
    );
  }

  const person = findUser(id);
  const manager = person?.managerId ? findUser(person.managerId) : null;

  const evals = allEvals.filter(
    (e) => e.employeeId === id && (e.status === "concluida" || e.status === "calibrada")
  );

  const gestorEval = evals.find((e) => e.evaluationType === "gestor");
  const autoEval = evals.find((e) => e.evaluationType === "auto");
  const parEvals = evals.filter((e) => e.evaluationType === "par");
  const lideradoEvals = evals.filter((e) => e.evaluationType === "liderado");

  function gestorScore(qId: string): number | null {
    if (!gestorEval) return null;
    const calibrated = gestorEval.calibration?.entries[qId]?.calibratedScore;
    if (calibrated !== undefined) return calibrated;
    return gestorEval.answers.find((a) => a.questionId === qId)?.score ?? null;
  }
  function autoScore(qId: string): number | null {
    return autoEval?.answers.find((a) => a.questionId === qId)?.score ?? null;
  }
  const parAvgScores = computeAvgScores(parEvals, questions);
  const lidAvgScores = computeAvgScores(lideradoEvals, questions);

  // Weighted average (before calibration override): gestor 60% + auto 20% + pares 20%
  function computedFinalScore(qId: string): number | null {
    const g = gestorScore(qId);
    const a = autoScore(qId);
    const p = parAvgScores[qId];
    if (g === null) return null;
    const parts: number[] = [g * 0.6];
    if (a !== null) parts.push(a * 0.2);
    if (p !== null) parts.push(p * 0.2);
    return parts.reduce((x, y) => x + y, 0);
  }

  // Final score per criterion: calibration override takes priority
  function finalScore(qId: string): number | null {
    const override = calibGrades[qId];
    if (override) return gradeToScore[override] ?? null;
    return computedFinalScore(qId);
  }

  function rowAvg(scores: (number | null)[]): number | null {
    const valid = scores.filter((s): s is number => s !== null);
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  }

  const gestorScores = questions.map((q) => gestorScore(q.id));
  const autoScores = questions.map((q) => autoScore(q.id));
  const parScores = questions.map((q) => parAvgScores[q.id] ?? null);
  const lidScores = questions.map((q) => lidAvgScores[q.id] ?? null);

  // Calibration row: numeric scores for each calibrated criterion (null = not calibrated)
  const calibScores = questions.map((q) => {
    const g = calibGrades[q.id];
    return g ? (gradeToScore[g] ?? null) : null;
  });
  const calibSetCount = calibScores.filter((s) => s !== null).length;

  // Per-criterion final: calibrated value takes priority over computed
  const finalScores = questions.map((q) => finalScore(q.id));

  const gestorAvg = rowAvg(gestorScores);
  const autoAvg = rowAvg(autoScores);
  const parAvg = rowAvg(parScores);
  const lidAvg = rowAvg(lidScores);

  // Overall final grade:
  // - When calibrations exist → average of ONLY the calibrated criteria (direct committee decision)
  // - When no calibrations → average of all computed criteria (weighted formula)
  const finalAvg = calibSetCount > 0 ? rowAvg(calibScores) : rowAvg(finalScores);
  const finalGrade = avgToGrade(finalAvg);

  // Historical grades
  const personHistory = historyRecords.filter((r) => r.employeeId === id);
  const personCurrentCycle = currentCycleRecords.filter((r) => r.employeeId === id);

  const historyEntries: { period: string; grade: string }[] = [];

  if (evals.length > 0 && finalAvg !== null) {
    historyEntries.push({ period: "2H2025", grade: finalGrade });
  }

  for (const r of personCurrentCycle) {
    if (!historyEntries.find((e) => e.period === r.periodo)) {
      historyEntries.push({ period: r.periodo, grade: r.conceito });
    }
  }

  const sortedPeriods = [...allPeriods].sort((a, b) => {
    const ya = parseInt(a.slice(1));
    const yb = parseInt(b.slice(1));
    return yb !== ya ? yb - ya : b[0].localeCompare(a[0]);
  });

  for (const period of sortedPeriods) {
    if (historyEntries.find((e) => e.period === period)) continue;
    const rec = personHistory.find((r) => r.periodo === period);
    if (rec) {
      const n = Object.keys(rec.gestorScores).length || 20;
      historyEntries.push({ period, grade: gradeFromSum(rec.gestorSoma, n) });
    }
  }

  const personMedals = allMedals.filter(
    (m) => m.employeeId === id || m.employeeName.toLowerCase().startsWith(person?.name.toLowerCase().split(" ")[0] || "")
  );

  const peerEvaluators = parEvals.map((e) => {
    const ev = findUser(e.evaluatorId);
    const comments = e.answers
      .filter((a) => a.justification?.trim())
      .map((a) => ({ questionId: a.questionId, text: a.justification }));
    return { name: ev?.name || e.evaluatorId, comments };
  });

  // Calibration cell click → open floating picker
  function handleCellClick(qId: string, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setEditingCriterion(qId);
    setPopoverPos({ x: rect.left, y: rect.bottom + 6 });
  }

  function pickGrade(g: string | null) {
    if (!editingCriterion) return;
    setCalibGrades((prev) => {
      const next = { ...prev };
      if (g === null) delete next[editingCriterion];
      else next[editingCriterion] = g;
      return next;
    });
    closePopover();
  }

  async function handleSave() {
    if (!currentUser) return;
    setSaving(true);
    try {
      const result: CalibrationResult = {
        criteriaGrades: calibGrades,
        notes: calibNotes,
        calibratedBy: currentUser.name,
        calibratedAt: new Date().toISOString(),
      };
      await saveCalibrationResult(id, result);
      setSavedResult(result);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  // ── sub-components ────────────────────────────────────────────────

  function ScoreCell({ score }: { score: number | null }) {
    if (score === null) return <td className="px-1.5 py-2 text-center text-gray-300 text-sm">—</td>;
    const g = toGrade(score);
    return (
      <td className="px-1.5 py-2 text-center">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border ${gradeColor(g)}`}>
          {g}
        </span>
      </td>
    );
  }

  function TotalCell({ avg, grade }: { avg: number | null; grade?: string }) {
    const g = grade ?? avgToGrade(avg);
    return (
      <td className="px-2 py-2 text-center border-l border-gray-200">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border ${gradeColor(g)}`}>
          {g}
        </span>
      </td>
    );
  }

  type RowDef = {
    label: string;
    key: string;
    scores: (number | null)[];
    avg: number | null;
    justifications?: { qId: string; label: string; text: string }[];
  };

  function buildJustifications(evs: Evaluation[], label: string) {
    return questions.flatMap((q) => {
      const texts = evs
        .map((e) => e.answers.find((a) => a.questionId === q.id)?.justification)
        .filter((t): t is string => !!t?.trim());
      return texts.map((text) => ({ qId: q.id, label, text }));
    });
  }

  const gestorJusts = gestorEval
    ? questions
        .map((q) => {
          const a = gestorEval.answers.find((x) => x.questionId === q.id);
          return a?.justification?.trim() ? { qId: q.id, label: "Gestor", text: a.justification } : null;
        })
        .filter((x): x is { qId: string; label: string; text: string } => x !== null)
    : [];

  const inputRows: RowDef[] = [
    {
      label: "Gestor",
      key: "gestor",
      scores: gestorScores,
      avg: gestorAvg,
      justifications: gestorJusts,
    },
    {
      label: "Liderados",
      key: "liderado",
      scores: lidScores,
      avg: lidAvg,
      justifications: buildJustifications(lideradoEvals, "Liderado"),
    },
    {
      label: "Autoavaliação",
      key: "auto",
      scores: autoScores,
      avg: autoAvg,
    },
    {
      label: "Pares",
      key: "par",
      scores: parScores,
      avg: parAvg,
      justifications: peerEvaluators.flatMap((pe) =>
        pe.comments.map((c) => ({ qId: c.questionId, label: pe.name.split(" ")[0], text: c.text }))
      ),
    },
  ];

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!person) {
    return (
      <AppShell>
        <div className="text-center py-16 text-gray-400">Pessoa não encontrada.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* ── Floating grade picker ─────────────────────────────────── */}
      {editingCriterion && popoverPos && (
        <div
          data-calibpicker
          style={{ position: "fixed", top: popoverPos.y, left: popoverPos.x, zIndex: 100 }}
          className="bg-white rounded-lg shadow-xl border border-gray-200 p-1.5 flex gap-1"
        >
          {["A", "B", "C", "D", "E"].map((g) => (
            <button
              key={g}
              onClick={() => pickGrade(g)}
              className={`w-8 h-8 rounded text-xs font-bold border transition-all hover:scale-110 ${
                calibGrades[editingCriterion] === g
                  ? gradeColor(g)
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {g}
            </button>
          ))}
          {calibGrades[editingCriterion] && (
            <button
              onClick={() => pickGrade(null)}
              className="w-8 h-8 rounded text-xs font-bold border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-400 hover:border-red-200"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <button
          onClick={() => router.push("/calibracao")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Calibração
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Scale className="w-5 h-5 text-primary shrink-0" />
          <select
            value={id}
            onChange={(e) => router.push(`/sessao/${e.target.value}`)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-xs"
          >
            {allPeople.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {calibSetCount > 0 && rowAvg(finalScores) !== null && (
            <span className={`text-base font-medium px-2.5 py-1 rounded-lg border opacity-50 line-through ${gradeColor(avgToGrade(rowAvg(finalScores)))}`}>
              {avgToGrade(rowAvg(finalScores))}
            </span>
          )}
          {finalAvg !== null && (
            <span className={`text-lg font-bold px-3 py-1.5 rounded-lg border ${gradeColor(finalGrade)}`}>
              {calibSetCount > 0 ? "Calibrada: " : "Nota Final: "}{finalGrade}
              {calibSetCount > 0 && (
                <span className="ml-1.5 text-xs font-medium opacity-60">({calibSetCount}/{questions.length})</span>
              )}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
        {/* ── Left Panel ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Dados Principais */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              {person.photoUrl ? (
                <img src={person.photoUrl} alt={person.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
                  {person.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
              )}
              <div>
                <h2 className="font-bold text-gray-900">{person.name}</h2>
                <p className="text-xs text-gray-500">{person.cargo}</p>
              </div>
            </div>

            <dl className="space-y-2 text-sm">
              {[
                ["Setor", person.sector],
                ["Área", person.department],
                ["Gestor", manager?.name || "—"],
                ["Nível", { c_level: "C-Level", rh: "RH", diretor: "Diretor(a)", coordenador: "Coordenador(a)", colaborador: "Colaborador(a)" }[person.role]],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex gap-2">
                  <dt className="text-gray-400 w-20 shrink-0">{label}</dt>
                  <dd className="font-medium text-gray-800 break-words">{String(value ?? "—")}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Histórico */}
          {historyEntries.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Histórico de Avaliações</h3>
              <div className="space-y-1.5">
                {historyEntries.slice(0, 12).map(({ period, grade }) => (
                  <div key={period} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{period}</span>
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border ${gradeColor(grade)}`}>
                      {grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medalhas */}
          {personMedals.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-secondary" />
                Medalhas ({personMedals.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {personMedals.map((m, i) => (
                  <div key={i} className="bg-secondary/5 border border-secondary/10 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-secondary">{m.habilidade}</span>
                      <span className="text-[10px] text-gray-400">{m.data}</span>
                    </div>
                    <p className="text-xs text-gray-500">{m.quemEnviou}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{m.justificativa}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movimentações stub */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 opacity-60">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Movimentações Salariais</h3>
            <p className="text-xs text-gray-400 italic">Integração Convenia pendente.</p>
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Score Matrix */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notas por Critério</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Pencil className="w-3 h-3" />
                Clique na linha Calibração para ajustar
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 w-32 sticky left-0 bg-gray-50">
                      Avaliador
                    </th>
                    {questions.map((q) => (
                      <th key={q.id} className="px-1.5 py-2.5 text-center">
                        <div
                          className="text-[10px] font-medium text-gray-500 max-w-[52px] leading-tight"
                          title={q.title}
                        >
                          {q.title.length > 10 ? q.title.slice(0, 10) + "…" : q.title}
                        </div>
                      </th>
                    ))}
                    <th className="px-2 py-2.5 text-center text-xs font-semibold text-gray-700 border-l border-gray-200 w-16">
                      Nota
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Input rows: Gestor, Liderados, Auto, Pares */}
                  {inputRows.map((row) => {
                    const hasJusts = (row.justifications?.length ?? 0) > 0;
                    const isExpanded = expandedRow === row.key;

                    return (
                      <>
                        <tr
                          key={row.key}
                          className={`border-b border-gray-50 ${hasJusts ? "cursor-pointer hover:bg-gray-50" : ""}`}
                          onClick={() => hasJusts && setExpandedRow(isExpanded ? null : row.key)}
                        >
                          <td className="px-4 py-2 sticky left-0 bg-white">
                            <div className="flex items-center gap-1.5">
                              {hasJusts && (
                                isExpanded
                                  ? <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
                                  : <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                              )}
                              <span className="text-sm text-gray-700">{row.label}</span>
                              {row.key === "par" && parEvals.length > 1 && (
                                <span className="text-[10px] text-gray-400">({parEvals.length})</span>
                              )}
                            </div>
                          </td>
                          {row.scores.map((s, i) => (
                            <ScoreCell key={i} score={s} />
                          ))}
                          <TotalCell avg={row.avg} />
                        </tr>

                        {isExpanded && hasJusts && (
                          <tr key={`${row.key}-justs`} className="border-b border-gray-100 bg-blue-50/30">
                            <td colSpan={questions.length + 2} className="px-4 py-3">
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {row.justifications!.map((j, i) => {
                                  const q = questions.find((q) => q.id === j.qId);
                                  return (
                                    <div key={i} className="flex gap-3 text-xs">
                                      <span className="shrink-0 text-gray-400 w-20 font-medium">
                                        {q?.title.slice(0, 12) ?? j.qId}
                                      </span>
                                      <span className="text-[10px] text-primary font-medium shrink-0 w-16">
                                        {j.label}
                                      </span>
                                      <p className="text-gray-600 leading-relaxed">{j.text}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}

                  {/* Separator */}
                  <tr>
                    <td colSpan={questions.length + 2} className="h-px bg-primary/10" />
                  </tr>

                  {/* Calibração row — editable */}
                  <tr className="border-b border-primary/10 bg-primary/[0.03]">
                    <td className="px-4 py-2 sticky left-0 bg-primary/[0.03]">
                      <div className="flex items-center gap-1.5">
                        <Pencil className="w-3 h-3 text-primary" />
                        <span className="text-sm font-semibold text-primary">Calibração</span>
                        {calibSetCount > 0 && (
                          <span className="text-[10px] text-primary/60">({calibSetCount})</span>
                        )}
                      </div>
                    </td>
                    {questions.map((q) => {
                      const grade = calibGrades[q.id];
                      return (
                        <td key={q.id} className="px-1.5 py-2 text-center">
                          <button
                            data-calibcell
                            onClick={(e) => handleCellClick(q.id, e)}
                            title="Clique para definir nota calibrada"
                            className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border transition-all hover:scale-110 ${
                              grade
                                ? gradeColor(grade)
                                : "border-dashed border-gray-300 text-gray-300 hover:border-primary/40 hover:text-primary/50"
                            }`}
                          >
                            {grade || "+"}
                          </button>
                        </td>
                      );
                    })}
                    {/* Total cell for calibration: avg of only calibrated cells, or overall final */}
                    <td className="px-2 py-2 text-center border-l border-gray-200">
                      {calibSetCount > 0 ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border ${gradeColor(finalGrade)}`}>
                          {finalGrade}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border border-dashed border-gray-200 text-gray-300">
                          —
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Final row — reflects calibration */}
                  <tr className="bg-gray-50/80 font-semibold border-b border-gray-100">
                    <td className="px-4 py-2.5 sticky left-0 bg-gray-50">
                      <span className="text-sm font-bold text-gray-900">Final</span>
                    </td>
                    {finalScores.map((s, i) => {
                      const qId = questions[i].id;
                      const isOverridden = !!calibGrades[qId];
                      const g = s !== null ? toGrade(s) : null;
                      return (
                        <td key={i} className="px-1.5 py-2.5 text-center">
                          {g ? (
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border ${gradeColor(g)} ${isOverridden ? "ring-2 ring-primary/30" : ""}`}>
                              {g}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-sm">—</span>
                          )}
                        </td>
                      );
                    })}
                    <TotalCell avg={finalAvg} grade={finalGrade} />
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Save bar */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-3 flex-wrap">
              <textarea
                value={calibNotes}
                onChange={(e) => setCalibNotes(e.target.value)}
                placeholder="Observações do comitê de calibração..."
                rows={1}
                className="flex-1 min-w-[200px] text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 placeholder-gray-300 bg-white"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  saveSuccess
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {saveSuccess ? (
                  <><Check className="w-4 h-4" /> Salvo!</>
                ) : saving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  "Salvar calibração"
                )}
              </button>
              {savedResult && (
                <p className="text-xs text-gray-400 shrink-0">
                  por {savedResult.calibratedBy.split(" ")[0]} em {new Date(savedResult.calibratedAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          </div>

          {/* Peer comments */}
          {peerEvaluators.some((p) => p.comments.length > 0) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">
                Comentários dos Pares
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {peerEvaluators.length} par{peerEvaluators.length !== 1 ? "es" : ""}
                </span>
              </h3>
              <div className="space-y-4">
                {peerEvaluators.map((pe, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-gray-500 mb-2">{pe.name}</p>
                    <div className="space-y-1.5 pl-3 border-l-2 border-gray-100">
                      {pe.comments.map((c, j) => {
                        const q = questions.find((q) => q.id === c.questionId);
                        return (
                          <div key={j} className="text-sm">
                            {q && (
                              <span className="text-[10px] font-semibold text-primary uppercase mr-2">
                                {q.title}
                              </span>
                            )}
                            <span className="text-gray-600">{c.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
