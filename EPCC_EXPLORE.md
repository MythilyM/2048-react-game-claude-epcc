# Exploration: 2048 React Game

**Date**: 2026-03-19 | **Scope**: Medium | **Status**: ✅ Complete

## 1. Foundation (What exists)

**Tech stack**: React 19, TypeScript 4.9, react-scripts 5.0.1 (CRA), Jest + @testing-library/react
**Architecture**: Freshly scaffolded CRA TypeScript SPA — no game logic exists yet. Greenfield.
**Structure**:
- `src/index.tsx` — entry point, mounts `<App />` via `ReactDOM.createRoot`
- `src/App.tsx` — root component (default CRA placeholder, no game content)
- `src/App.css` — placeholder styles (CRA default)
- `src/index.css` — global body/font resets
- `src/App.test.tsx` — single placeholder test (`renders learn react link`)
- `src/setupTests.ts` — imports `@testing-library/jest-dom`
- `src/reportWebVitals.ts` — CRA performance utility
**CLAUDE.md instructions**: None found.

## 2. Patterns (How it's built)

**Component pattern**: Functional components (no class components in template)
**Styling pattern**: CSS modules NOT used — plain `.css` files imported directly into components (`import './App.css'`)
**Testing pattern**: `@testing-library/react` + `@testing-library/jest-dom`; test files co-located with components (`App.test.tsx`)
**TypeScript**: Enabled via tsconfig, but CRA default — no strict mode explicitly set beyond defaults
**Entry**: `index.tsx` → `<App />` with `React.StrictMode`

## 3. Constraints

**Technical**:
- `react-scripts` 5.0.1 limits webpack/babel config without ejecting
- TypeScript 4.9 (not 5.x) — some newer TS features unavailable
- No routing library installed — single-page game is fine without one
- No animation/gesture library installed — need to handle keyboard events manually

**Quality**:
- ESLint configured via `eslintConfig` in `package.json` (react-app + react-app/jest presets)
- No pre-commit hooks or lint-staged configured
- Test runner: `react-scripts test` (Jest under the hood)

**Operational**:
- Dev server: `npm start` → `react-scripts start` on port 3000
- No `.env` files present

## 4. What to Build (Greenfield)

The entire 2048 game needs to be built from scratch. Key pieces:

1. **`src/gameLogic.ts`** — pure functions for board state: init, slide/merge rows, spawn tile, win/loss detection
2. **`src/App.tsx`** — rewrite with game UI: 4×4 grid, score display, new game button, keyboard input
3. **`src/App.css`** — game styling: board, tiles with color-coded values, responsive layout

**Game mechanics to implement**:
- 4×4 board, tiles slide in 4 directions (arrow keys / WASD)
- Merge equal adjacent tiles (once per move), score += merged value
- Spawn random tile (90% `2`, 10% `4`) after each valid move
- Win condition: any tile reaches 2048
- Lose condition: no valid moves remain

**Patterns to follow**:
- Functional components + React hooks (`useState`, `useEffect`, `useCallback`)
- Plain CSS (matching existing `import './App.css'` pattern)
- Keep game state in `App.tsx` via `useState`
- Pure game logic in a separate `gameLogic.ts` (testable independently)

## 5. Handoff

**For PLAN**:
- Pure greenfield — no existing patterns to preserve beyond CRA conventions
- No routing/animation libraries; keep dependencies minimal
- CSS-only styling (no CSS modules, no styled-components)

**For CODE**:
- Test runner: `npm test`
- Dev server: `npm start`
- Linter: `npm run build` will surface TypeScript/ESLint errors
- Rewrite `App.tsx` and `App.css`; add `gameLog1ic.ts`

**For COMMIT**:
- Existing placeholder test (`renders learn react link`) will break — update it
- No coverage threshold configured
