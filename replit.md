# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Fazenda Brasil — Safra Inteligente (Sebrae Games 2026)
- Path: `artifacts/fazenda-brasil` · Preview: `/`
- React + Vite + TypeScript, 2D browser farm simulator
- **Game loop**: Plantar → Estratégia (Orgânico/Químico) → Regar → Colher → Vender → Aprender
- **Systems**: XP/Level (1–10), Conquistas (5), Missões diárias, Tutorial interativo (7 passos), Eventos aleatórios, Ficha do Produtor educativa
- **UI**: AnimatedBackground, SidePanel, HUD, ShopModal, StrategyModal, EventModal, FichaModal, LevelUpModal, AchievementBanner, TutorialOverlay, MarketScreen
- **Key files**: `src/game/types.ts`, `src/game/FazendaGame.tsx`, `src/game/FarmGrid.tsx`, `src/game/MainMenu.tsx`, `src/App.tsx`
- **Crops**: Milho, Soja, Café (Nível 2), Cana (Nível 3), Mandioca — com dados reais do agronegócio brasileiro
- **Edital criteria mapped**: Excelência Técnica (tutorial, UX, progressão), Potencial de Mercado (tela de pitch, monetização, retenção), Relevância Cultural (fichas educativas, identidade BR)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
