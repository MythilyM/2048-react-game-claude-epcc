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

---

# Plan: Enhancement Features (Phase 2)

**Created**: 2026-03-20 | **Effort**: ~6h | **Complexity**: Medium

## 1. Objective
**Goal**: Enhance the 2048 game with modern visuals, animations, best score tracking, richer history, and touch/keyboard support.
**Why**: The base game is functional but lacks polish, mobile support, and meaningful game statistics.
**Success**:
- Tiles animate on spawn and merge
- Best score persists and highlights when a new record is set
- Score history shows timestamp, move count, and highest tile per game
- Game is fully playable via touch swipe on mobile

## 2. Approach

**Constraints from existing codebase**:
- Plain CSS only — no animation or gesture libraries
- `localStorage` access stays isolated in `useScoreHistory.ts`
- Pure functions stay in `gameLogic.ts`; no React imports there
- Touch swipe logic extracted as a pure utility for testability

**Files changed**:
```
src/
  useScoreHistory.ts  — add bestScore state + localStorage key; extend ScoreEntry type
  App.tsx             — move counter, highestTile tracking, touch handlers, 'n' shortcut
  App.css             — animation keyframes, new record flash, refined tile colors/shadows
  ScoreHistory.tsx    — display timestamp, moves, highestTile per entry
  ScoreHistory.css    — updated layout for richer entry display
  swipeUtils.ts       — pure swipe direction detector (testable)
  swipeUtils.test.ts  — unit tests for swipe detection
```

**Trade-offs**:
- Full tile slide path animations require tracking previous positions (complex, fragile); spawn/merge CSS keyframes deliver 80% visual impact at 20% complexity — chosen approach
- Best score stored as a separate localStorage key (`'2048-best-score'`) rather than derived from history, for O(1) read on load
- Old `ScoreEntry` records missing `moves`/`highestTile` render as "—" — no migration needed

## 3. Tasks

**Phase 1: Visual design + animations** (~2h)
1. `App.css` — refined tile colors, box shadows, border radius, typography improvements (0.75h) | Deps: None | Risk: L
2. `App.css` — `@keyframes pop-in` for tile spawn, `@keyframes merge-burst` for merge scale pulse, overlay fade-in (0.75h) | Deps: Task 1 | Risk: L
3. `App.tsx` — add `key` prop strategy to trigger spawn animation on new tiles; add `merging` class on merged tiles, remove via `onAnimationEnd` (0.5h) | Deps: Task 2 | Risk: M

**Phase 2: Best score tracker** (~1h)
4. `useScoreHistory.ts` — add `bestScore` (loaded from `'2048-best-score'` localStorage key), update on `addEntry` when score exceeds best (0.5h) | Deps: None | Risk: L
5. `App.tsx` + `App.css` — add `BEST` score box to header; flash/highlight animation when new record set (0.5h) | Deps: Task 4 | Risk: L

**Phase 3: Enhanced score history** (~1.5h)
6. `useScoreHistory.ts` — extend `ScoreEntry` type: add `moves: number`, `highestTile: number`, change `date` to ISO timestamp string (0.5h) | Deps: None | Risk: L
7. `App.tsx` — add `moveCount` state (increment on valid move), capture `highestTile` at game end, pass to `addEntry()` (0.5h) | Deps: Task 6 | Risk: L
8. `ScoreHistory.tsx` + `ScoreHistory.css` — display formatted time ("Today at 3:42 PM"), moves, highest tile; graceful fallback for old entries (0.5h) | Deps: Tasks 6, 7 | Risk: L

**Phase 4: Touch gestures + keyboard shortcut** (~1.5h)
9. `swipeUtils.ts` — pure `detectSwipe(startX, startY, endX, endY, threshold): Direction | null` function (0.25h) | Deps: None | Risk: L
10. `swipeUtils.test.ts` — unit tests for all 4 directions, below-threshold no-op, diagonal resolves to dominant axis (0.25h) | Deps: Task 9 | Risk: L
11. `App.tsx` — attach `onTouchStart`/`onTouchEnd` to board div, call `handleMove()` on detected swipe; add `'n'` key shortcut for new game; `e.preventDefault()` on touchmove during active swipe (1h) | Deps: Tasks 9, 3 | Risk: M

**Total**: ~6h

## 4. Quality Strategy
**Tests**:
- `swipeUtils.test.ts`: all 4 swipe directions, below-threshold returns null, diagonal resolves to dominant axis
- `App.test.tsx`: update smoke tests to include BEST score box, touch handler presence
- Existing `gameLogic.test.ts`: no changes needed

**Validation**:
- Tiles visually animate on spawn and merge
- BEST box updates and flashes when current score exceeds stored best
- History entries show time, moves, and highest tile after each game
- Swiping on the board moves tiles on mobile (test in browser DevTools mobile mode)
- `n` key triggers new game

## 5. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Merge animation triggers on wrong tiles | M | Scope CSS class to specific tile, remove class after animation ends via `onAnimationEnd` |
| Touch swipe conflicts with page scroll | M | `e.preventDefault()` on `touchmove` while swipe in progress |
| Old `ScoreEntry` records break rendering | L | Optional chaining + fallback "—" for `moves` and `highestTile` |
| `bestScore` localStorage key conflicts with history key | L | Use distinct key `'2048-best-score'` vs `'2048-score-history'` |

**Assumptions**: No third-party animation or gesture libraries; CSS-only animations are sufficient.
**Out of scope**: Full tile slide path animations, undo move, online leaderboard, PWA/offline support.
