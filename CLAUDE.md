# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (port 8080)
npm run build      # Production build
npm run lint       # ESLint check
npm test           # Run tests (Vitest)
npm run test:watch # Run tests in watch mode
npm run preview    # Preview production build
```

## Architecture

React 18 + TypeScript SPA built with Vite. UI uses shadcn-ui (Radix UI primitives) with Tailwind CSS. Routing via React Router 6, forms via React Hook Form + Zod.

**Layout:** `DashboardLayout` wraps all pages with `AppSidebar` (desktop) and `MobileBottomNav` (mobile). Routes are defined in `src/App.tsx`.

**Pages** (`src/pages/`): Dashboard, Expenses, Income, DebtManager, Investments, BudgetPlanner, AIAdvisor, Reports, Settings — each is a self-contained feature page.

**Data:** All data is mock (`src/lib/mock-data.ts`). No backend. Currency is INR (₹). TanStack React Query is configured but not actively used for API calls yet.

**AI:** AIAdvisor page integrates with a local Ollama instance. The Settings page configures the Ollama API URL and model (default: llama3).

**Crisis Planning Whiteboard** (`/crisis`): Canvas-based decision-support tool at `src/pages/CrisisPlanning.tsx`. Domain types in `src/lib/crisis/types.ts`. Services in `src/lib/crisis/` (storage, providers, newsService, mockData, promptTemplates). UI components in `src/components/crisis/`. All data persists to `localStorage` under key `crisis-planning-store`. AI providers are abstracted via `src/lib/crisis/providers/index.ts` — add new providers by implementing `AIProviderAdapter`. See `docs/crisis-planning-api-guide.md` for future backend spec.

**Styling:** Dark mode by default. Global CSS vars in `src/index.css`. Custom Tailwind utilities include `glass` (glass morphism), `gradient-*` classes, and sidebar color tokens. shadcn components are in `src/components/ui/`.

**Path alias:** `@/` maps to `src/`.
