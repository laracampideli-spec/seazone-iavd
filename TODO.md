# TODO — IAVD Seazone

Backlog de melhorias e correções para a plataforma de Avaliação de Desempenho com IA.

## Status

| # | Task | Status |
|---|---|---|
| 1 | Migrar LLM de Claude para Gemini | ✅ Concluído |
| 2 | Garantir visibilidade de erros para o usuário | ⬚ Pendente |
| 3 | Suportar ~250 usuários simultâneos | ⬚ Pendente |
| 4 | Validação de notas por nível hierárquico | ✅ Concluído |
| 5 | LLM julgar justificativa por nível + critério avaliado | ✅ Concluído |
| 6 | Feedback ao usuário sobre o que falta na justificativa | ✅ Concluído |
| 7 | Backup seguro dos dados sem exposição indevida | ⬚ Pendente |
| 8 | Diferenciar claramente nota A (5) de B (4) | ✅ Concluído |
| 9 | Diferenciar claramente nota D (2) de E (1) | ✅ Concluído |
| 10 | Funcionamento do sistema de quem avalia quem | ⬚ Pendente |
| 11 | Visualização de histórico para observar evolução | ⬚ Pendente |
| 12 | Acompanhar liderados que finalizaram avaliações (gestão de preenchimento) | ⬚ Pendente |
| 13 | Calculadora de nota final ponderada por critério | ✅ Concluído |

## Detalhes

### 1. ✅ Migrar LLM de Claude para Gemini
- Substituídas todas as chamadas à API Anthropic por Google Gemini (gemini-2.5-flash)
- Helper centralizado em `src/lib/gemini.ts`
- 3 rotas migradas: `chat`, `chat-diretoria`, `chat-help`
- Dead code removido de `help-chat.tsx`
- **Env var**: trocar `ANTHROPIC_API_KEY` por `GEMINI_API_KEY` no deploy

### 2. Garantir visibilidade de erros para o usuário
- Implementar toasts/notificações de erro em toda a aplicação
- Erros de API, banco e rede devem ser visíveis ao usuário
- Atualmente erros caem silenciosamente em fallback

### 3. Suportar ~250 usuários simult��neos
- Avaliar rate limits da API Gemini
- Otimizar conexões Supabase
- Considerar filas/streaming para chamadas à LLM
- Performance do Next.js em produção

### 4. Validação de notas por nível hierárquico
- IA deve dar respostas diferentes por nível (Estágio → C-Level)
- Integrar documento de calibração do CEO
- Campo `evaluateeCargo` já existe mas é subutilizado

### 5. LLM julgar justificativa por nível + critério avaliado
- Cruzar nível hierárquico com critério específico nos prompts
- Integrar seções 1.2 a 13.2 do documento de calibração do CEO
- Cada critério tem expectativas diferentes por nível

### 6. Feedback ao usuário sobre o que falta na justificativa
- IA deve indicar gaps específicos: falta de exemplos, frequência, resultados
- Guiar o avaliador a complementar a justificativa de forma ótima
- **Bugs encontrados que devem ser corrigidos nesta task:**
  - Feedback da IA é apenas sugestivo — usuário confirma sem ser obrigado a ajustar (`[id]/page.tsx:267-280`)
  - Falha silenciosa de parse JSON → UI mostra "IA não encontrou problemas" (falso positivo) (`[id]/page.tsx:225-233`)
  - Erros de API caem em fallback silencioso — usuário não sabe se recebeu IA real ou rule-based (`route.ts:540-543`)
  - Modos `discuss`, `challenge`, `score`, `contest` existem na API mas nenhum componente do frontend os usa

### 7. Backup seguro dos dados sem exposição indevida
- Estratégia de backup no Supabase
- Garantir que backups não exponham avaliações
- Avaliar RLS policies, criptografia e controle de acesso

### 8. Diferenciar claramente nota A (5) de B (4)
- A (excepcional, 5%) vs B (acima do esperado, 20%)
- Incorporar exemplos e critérios do CEO por competência
- Nota 5 exige transformação/impacto extraordinário

### 9. Diferenciar claramente nota D (2) de E (1)
- D (abaixo, tenta mas depende) vs E (insuficiente, ausência)
- Incorporar sinais e exemplos do CEO
- Nota 1 é passividade/ausência total

### 10. Funcionamento do sistema de quem avalia quem
- Revisar peer-assignment.ts e org-tree.ts
- Garantir que avaliações 360 chegam às pessoas certas
- Validar todos os tipos: gestor, auto, par, liderado

### 11. Visualização de histórico para observar evolução
- Armazenar histórico de avaliações ao longo de múltiplos ciclos
- Mostrar evolução de notas por critério ao longo do tempo
- Visualizações de tendência (gráficos de linha, progressão)
- Comparar desempenho entre ciclos

### 12. Acompanhar liderados que finalizaram avaliações
- Dashboard para gestor ver quais liderados já finalizaram suas AVDs
- Permitir cobrar preenchimento de quem ainda não completou
- Visibilidade do progresso: quantos de N liderados já finalizaram
- Possível integração com notificações (Slack/email)

### 13. Calculadora de nota final ponderada por critério
- Calcular nota final ponderada a partir das notas de cada critério
- Definir pesos por critério (se aplicável) ou média simples
- Visualização da nota consolidada para o avaliado
- Considerar pesos diferentes por tipo de avaliador (gestor > par > auto)
