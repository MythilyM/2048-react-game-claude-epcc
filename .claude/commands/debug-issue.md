# Debug Issue

Debug the following issue in the 2048 React game: $ARGUMENTS

## Steps

1. **Reproduce**: Identify exactly when/how the issue occurs
2. **Locate**: Find the relevant code in `src/` (check `gameLogic.ts` for logic bugs, `App.tsx` for UI/state bugs, `useScoreHistory.ts` for persistence bugs)
3. **Diagnose**: Read the affected file(s) and trace the root cause
4. **Fix**: Apply the minimal change that resolves the issue without side effects
5. **Verify**: Run `CI=true npm test` to confirm nothing is broken

## Guidelines
- Check `gameLogic.ts` first for any tile movement or scoring bugs
- Check `useScoreHistory.ts` for any score history persistence issues
- Run `npm run build` after fixing to catch TypeScript/ESLint errors
- Do not add error handling for cases that cannot happen
- Do not refactor surrounding code — fix only what is broken
