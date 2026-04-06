# TODO — IAVD Seazone

Backlog de melhorias e correções para a plataforma de Avaliação de Desempenho com IA.

## Status

| # | Task | Status |
|---|---|---|
| 1 | Migrar LLM de Claude para Gemini | ✅ Concluído |
| 2 | Garantir visibilidade de erros para o usuário | ⬚ Pendente |
| 3 | Suportar ~250 usuários simultâneos | ⬚ Pendente |
| 4 | Validação de notas por nível hierárquico | ⬚ Pendente |
| 5 | LLM julgar justificativa por nível + critério avaliado | ⬚ Pendente |
| 6 | Feedback ao usuário sobre o que falta na justificativa | ⬚ Pendente |
| 7 | Backup seguro dos dados sem exposição indevida | ⬚ Pendente |
| 8 | Diferenciar claramente nota A (5) de B (4) | ⬚ Pendente |
| 9 | Diferenciar claramente nota D (2) de E (1) | ⬚ Pendente |
| 10 | Funcionamento do sistema de quem avalia quem | ⬚ Pendente |

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

### 6. Feedback ao usu��rio sobre o que falta na justificativa
- IA deve indicar gaps específicos: falta de exemplos, frequência, resultados
- Guiar o avaliador a complementar a justificativa de forma ótima

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
