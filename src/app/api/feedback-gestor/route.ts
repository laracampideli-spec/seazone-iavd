import { NextRequest, NextResponse } from "next/server";

interface AnswerInput {
  questionId: string;
  questionTitle: string;
  category: string;
  gestorScore: number;
  autoScore: number | null;
  justification: string;
}

interface FeedbackRequest {
  employeeName: string;
  employeeCargo: string;
  evaluatorName: string;
  answers: AnswerInput[];
}

const scoreToGrade: Record<number, string> = { 5: "A", 4: "B", 3: "C", 2: "D", 1: "E" };

export async function POST(req: NextRequest) {
  const body: FeedbackRequest = await req.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "sua-chave-aqui") {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const { employeeName, employeeCargo, evaluatorName, answers } = body;

  // Debug: log answers with justifications
  const withJustification = answers.filter(a => a.justification && a.justification.trim().length > 0);
  console.log("Answers with justification:", JSON.stringify(withJustification, null, 2));

  // Build divergences list
  const divergences = answers.filter(
    (a) => a.autoScore !== null && Math.abs(a.gestorScore - a.autoScore) >= 2
  );

  const answersText = answers
    .map((a) => {
      const gestorGrade = scoreToGrade[a.gestorScore] || a.gestorScore;
      const autoGrade = a.autoScore !== null ? (scoreToGrade[a.autoScore] || a.autoScore) : "não realizada";
      const diff = a.autoScore !== null ? Math.abs(a.gestorScore - a.autoScore) : 0;
      const divergenceNote = diff >= 2
        ? ` [DIVERGÊNCIA: autoavaliação ${autoGrade} vs gestor ${gestorGrade}]`
        : "";
      return `- ${a.questionTitle} (${a.category}): Gestor=${gestorGrade}, Auto=${autoGrade}${divergenceNote}
  Justificativa: ${a.justification || "(sem justificativa)"}`;
    })
    .join("\n");

  const prompt = `Você é um especialista em gestão de pessoas e desenvolvimento de carreira na empresa Seazone.
Você vai preparar uma sugestão de feedback de desempenho para ${evaluatorName} usar na conversa com ${employeeName} (${employeeCargo}).

Segue a avaliação completa (escala A a E: A=Excepcional, B=Acima do esperado, C=Dentro do esperado, D=Abaixo do esperado, E=Insuficiente).
As justificativas foram escritas pelo próprio gestor e contêm situações reais observadas:

${answersText}

INSTRUÇÕES CRÍTICAS:
1. Leia cada justificativa com atenção. Elas contêm exemplos concretos, situações reais e comportamentos observados.
2. Use o conteúdo das justificativas para embasar cada ponto do feedback — cite ou parafraseie situações específicas mencionadas.
3. NUNCA escreva frases genéricas como "precisa melhorar", "não foi suficiente", "deve se dedicar mais". Sempre explique o QUÊ concreto, baseado no que foi descrito.
4. Se a justificativa for vazia ou ausente em um critério C, não force um comentário — pule esse critério.

Gere o feedback em JSON:
{
  "pontos_fortes": ["ponto 1", "ponto 2", ...],
  "pontos_melhoria": ["ponto 1", "ponto 2", ...],
  "divergencias": ["divergência 1", ...],
  "como_conduzir": "orientação para o líder"
}

Regras por campo:
- pontos_fortes: para cada critério com nota A ou B, escreva um item. SE houver justificativa, OBRIGATORIAMENTE cite ou parafraseie o conteúdo dela para explicar o que foi observado e seu impacto. SE não houver justificativa, mencione o critério de forma positiva. Máx 4 itens.
- pontos_melhoria: para cada critério com nota D ou E, escreva um item. SE houver justificativa, OBRIGATORIAMENTE use o conteúdo dela para descrever o comportamento observado e sugira uma ação concreta de melhoria. SE não houver justificativa, indique o critério e sugira uma ação prática. Nunca escreva frases vagas. Máx 4 itens.
- divergencias: para cada critério com diferença ≥ 2 pontos entre auto e gestor, oriente o líder em como apresentar sua percepção usando exemplos concretos da justificativa e como conduzir essa conversa. Array vazio se não houver divergências.
- como_conduzir: 3-5 frases práticas sobre como abrir a conversa, mencione o nome da pessoa, considere o perfil geral da avaliação.
- Tom: direto, respeitoso, construtivo. Fale em terceira pessoa sobre ${employeeName}.
- IMPORTANTE: se a justificativa de um critério B ou A tiver conteúdo (mesmo que curto), você DEVE mencionar esse conteúdo explicitamente no ponto forte correspondente.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    return NextResponse.json({ error: "AI request failed", status: response.status, body: errBody }, { status: 500 });
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || "";

  try {
    const clean = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response", raw: content }, { status: 500 });
  }
}
