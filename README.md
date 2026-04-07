# IAVD — Avaliação de Desempenho com IA

> **Repositório migrado para a organização Seazone:** [seazone-tech/seazone-iavd](https://github.com/seazone-tech/seazone-iavd)

Plataforma de avaliação de desempenho 360 com IA da Seazone.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **LLM**: Google Gemini 2.5 Flash
- **Banco**: Supabase (PostgreSQL)
- **Auth**: NextAuth v5 (Google OAuth)
- **UI**: Tailwind CSS 4 + Lucide Icons

## Setup

```bash
npm install
cp .env.example .env.local  # configurar variáveis
npm run dev
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `GEMINI_API_KEY` | API key do Google Gemini |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |

## Testes

```bash
npm test          # rodar testes
npm run test:watch  # modo watch
```

## TODO

O backlog de melhorias está em [TODO.md](./TODO.md).
