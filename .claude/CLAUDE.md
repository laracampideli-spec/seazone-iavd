# IAVD — Avaliação de Desempenho com IA (Seazone)

## Projeto

Plataforma de avaliação de desempenho 360 com IA. A IA investiga justificativas dos avaliadores com ceticismo saudável, sugere notas de 1-5 (A-E), e o RH calibra antes de liberar.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **LLM**: Google Gemini 2.5 Flash (`src/lib/gemini.ts`)
- **Banco**: Supabase (`src/lib/supabase.ts`, `src/lib/db.ts`)
- **Auth**: NextAuth v5 + Google OAuth (`src/lib/auth.ts`)
- **UI**: Tailwind CSS 4 + Lucide Icons

## Arquitetura de IA

3 rotas de IA, todas usando o helper centralizado `callGemini()`:

| Rota | Arquivo | Função |
|---|---|---|
| `/api/chat` | `src/app/api/chat/route.ts` | Avaliação principal (5 modos: discuss, score, contest, challenge, holistic) |
| `/api/chat-diretoria` | `src/app/api/chat-diretoria/route.ts` | Calibração com diretores (explore, summarize) |
| `/api/chat-help` | `src/app/api/chat-help/route.ts` | FAQ para colaboradores |

Todas as rotas têm fallback rule-based quando a API Gemini está indisponível.

## Documento de Calibração do CEO

Arquivo base: `Calibracao-IA-CEO-Preenchido FP docx.docx` (local do CEO).
Define para cada um dos 13 critérios: significado, expectativas por nível (Estágio→C-Level), exemplos por nota, erros da IA.
Regras gerais: distribuição 5/10/60/20/5%, autoavaliação inflada, pares peso menor, expressões de alerta.
**Ainda não integrado nos prompts** — tasks 4, 5, 6, 8, 9 do backlog.

## Backlog e Coworking

### TODO.md é o backlog central

O arquivo `TODO.md` na raiz do projeto é a fonte de verdade do backlog. Toda sessão deve:

1. **Ao iniciar**: ler `TODO.md` para entender o estado atual
2. **Antes de trabalhar numa task**: marcar como `🔄 Em andamento` no TODO.md
3. **Ao concluir**: marcar como `✅ Concluído` no TODO.md com descrição breve do que foi feito
4. **Se criar subtasks ou descobrir trabalho novo**: adicionar ao TODO.md

### Regras de coworking

- **Não começar task que outro já marcou como em andamento** — evitar conflito
- **Commitar frequentemente** com mensagens descritivas (conventional commits)
- **Não modificar prompts de IA sem testar** os 5 modos do chat principal
- **Testes**: rodar `npm test` antes de commitar. Novos testes são bem-vindos.

## Variáveis de Ambiente

```
GEMINI_API_KEY          # Google Gemini API key
NEXT_PUBLIC_SUPABASE_URL       # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Anon key do Supabase
GOOGLE_CLIENT_ID        # Google OAuth (NextAuth)
GOOGLE_CLIENT_SECRET    # Google OAuth (NextAuth)
```

## Testes

```bash
npm test          # Vitest — roda todos os testes
npm run test:watch  # modo watch
```

## Convenções

- Código, variáveis e comentários em inglês
- Respostas e prompts de IA em pt-BR
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`
- Nunca force push em master
