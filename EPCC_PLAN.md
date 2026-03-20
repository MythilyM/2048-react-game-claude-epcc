# Plan: 2048 Game + Score History Feature

**Created**: 2026-03-19 | **Effort**: ~5h | **Complexity**: Medium

## 1. Objective
**Goal**: Build a fully playable 2048 game with a persistent score history sidebar.
**Why**: The project is greenfield CRA boilerplate — the game and history feature must be built from scratch.
**Success**:
- 4×4 board slides/merges correctly in all 4 directions
- Score history persists across page refreshes via `localStorage`
- Sidebar displays past games (score, result, date) with a clear button

## 2. Approach

**From EPCC_EXPLORE.md**: Functional components + hooks, plain CSS imports, no third-party UI or animation libraries.

**File structure**:
```
src/
  gameLogic.ts        — pure functions: board init, slide/merge, move, win/loss
  useScoreHistory.ts  — custom hook: localStorage read/write, addEntry, clearHistory
  ScoreHistory.tsx    — sidebar panel component
  ScoreHistory.css    — sidebar styles
  App.tsx             — game shell: state, keyboard handler, layout
  App.css             — grid, tile colors (11 tiers), score display, responsive layout
```

**Layout**: flexbox row — game on left, sidebar on right. Stacks vertically on narrow screens.

**Score entry shape**:
```ts
{ score: number, result: 'win' | 'loss', date: string }
```

**Trade-offs**:
- localStorage over in-memory: history only useful if it survives refresh
- Plain CSS over CSS modules: matches existing CRA pattern, no config changes needed

## 3. Tasks

**Phase 1: Game logic** (~1.5h)
1. `gameLogic.ts` — board init, `slideRow()`, `move()` for 4 directions, `isGameOver()`, `hasWon()` (1h) | Deps: None | Risk: L
2. `gameLogic.test.ts` — unit tests for slide, merge, move, win/loss (0.5h) | Deps: Task 1 | Risk: L

**Phase 2: Game UI** (~2h)
3. `App.tsx` — `useState` for board/score, `useEffect` keyboard handler, New Game button, win/loss overlay (1h) | Deps: Task 1 | Risk: L
4. `App.css` — 4×4 grid, 11 tile color tiers, score display, responsive layout (1h) | Deps: Task 3 | Risk: L

**Phase 3: Score history** (~1.5h)
5. `useScoreHistory.ts` — load from localStorage, `addEntry()`, `clearHistory()`, try/catch fallback (0.5h) | Deps: None | Risk: L
6. `ScoreHistory.tsx` + `ScoreHistory.css` — ordered list, clear button, empty state (0.5h) | Deps: Task 5 | Risk: L
7. Wire into `App.tsx`: call `addEntry()` on game end; update `App.test.tsx` (0.5h) | Deps: Tasks 3, 6 | Risk: L

**Total**: ~5h

## 4. Quality Strategy
**Tests**: Unit tests for `gameLogic.ts` (slide, merge, edge cases, win/loss detection); update `App.test.tsx` to reflect new UI.
**Validation**: Game plays correctly end-to-end; history entries appear after each game; history survives page reload; clear button empties list.

## 5. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `localStorage` unavailable (private browsing) | L | try/catch in `useScoreHistory`, fall back to in-memory |
| Arrow keys scroll page during gameplay | L | `event.preventDefault()` on arrow key events |

**Assumptions**: No mobile touch support required (keyboard-only controls).
**Out of scope**: Animations, touch/swipe gestures, best-score persistence, leaderboard.
