# Review PR

Review the following pull request for the 2048 React game: $ARGUMENTS

## Review Checklist

### Correctness
- [ ] Game logic changes in `gameLogic.ts` are covered by unit tests in `gameLogic.test.ts`
- [ ] Move/merge behavior is correct for all 4 directions (left, right, up, down)
- [ ] Win/loss detection still works as expected
- [ ] Score accumulation is accurate

### Code Quality
- [ ] Follows project conventions: functional components, plain CSS imports, no class components
- [ ] `gameLogic.ts` remains free of React imports and side effects (pure functions only)
- [ ] `localStorage` access is wrapped in try/catch (see `useScoreHistory.ts` pattern)
- [ ] Arrow key handlers call `e.preventDefault()` if keyboard events are touched
- [ ] No unnecessary dependencies added to `package.json`

### TypeScript
- [ ] No `any` types introduced without justification
- [ ] New types/interfaces are defined in the relevant file or reuse existing ones (`ScoreEntry`, `Board`, `Direction`)
- [ ] Run `npm run build` mentally — would TypeScript/ESLint pass?

### Tests
- [ ] New components or utilities have corresponding tests
- [ ] Existing tests still pass (`CI=true npm test`)
- [ ] Edge cases covered (empty board, full board, no valid moves)

### Score History
- [ ] `addEntry()` is called correctly on win and loss
- [ ] New game resets state without corrupting history
- [ ] Clear history works without errors

## Output
Summarise findings as:
- **Approved** — no issues found
- **Approved with suggestions** — minor non-blocking feedback
- **Changes requested** — list specific issues that must be fixed before merging


Review the code changes: $ARGUMENTS

Follow this checklist:
1. Check code quality and adherence to our style guide
2. Verify all new code has appropriate tests
3. Look for security vulnerabilities and performance issues
4. Ensure proper error handling and edge case coverage
5. Validate TypeScript types and interfaces
6. Check for accessibility compliance in UI components
7. Verify documentation updates for new features

Provide specific, actionable feedback with code suggestions.
