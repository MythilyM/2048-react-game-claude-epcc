# 2048 React Game

## Dev server
```bash
npm start      # dev server on http://localhost:3000
npm test       # run tests (CI mode: CI=true npm test)
npm run build  # production build
```

## Project conventions
- **Framework**: React 19 + TypeScript 4.9, bootstrapped with CRA (`react-scripts`)
- **Components**: Functional components with hooks only — no class components
- **Styling**: Plain CSS files imported directly (`import './Foo.css'`) — no CSS modules, no styled-components
- **State**: Game state lives in `App.tsx` via `useState`; localStorage access is isolated in `useScoreHistory.ts`
- **Game logic**: Pure functions in `gameLogic.ts` — no React imports, fully unit-testable

## File structure
```
src/
  gameLogic.ts        — pure board logic (move, merge, win/loss)
  gameLogic.test.ts   — unit tests for game logic
  useScoreHistory.ts  — custom hook: score history via localStorage
  ScoreHistory.tsx    — sidebar panel component
  ScoreHistory.css    — sidebar styles
  App.tsx             — main game shell
  App.css             — grid, tile colors, layout
  App.test.tsx        — component smoke tests
```

## Key patterns
- `gameLogic.ts` exports pure functions — keep it free of side effects
- `localStorage` access is always wrapped in try/catch (private browsing fallback)
- Arrow key events call `e.preventDefault()` to prevent page scroll during gameplay
- Score history entries: `{ score: number, result: 'win' | 'loss', date: string }`


# Team Claude Code Configuration

## Bash commands
- npm run dev: Starts the dev server
- npm run build: Build the project
- npm run test: Run unit tests with Jest
- npm run lint: Run ESLint and Prettier
- npm run typecheck: Run TypeScript compiler check

## Code style
- Use TypeScript with strict mode enabled
- Follow Airbnb style guide with Prettier formatting
- Destructure imports when possible (import { useState } from 'react')
- Use arrow functions for components and utilities
- IMPORTANT: Always include error handling in async functions

## Workflow
- Be sure to typecheck when you're done making code changes
- Prefer running single tests over the full test suite for performance
- YOU MUST write unit tests for new components and utilities
- Always update documentation when adding new features

## Repository structure
- /src/components: Reusable React components
- /src/hooks: Custom React hooks
- /src/utils: Pure utility functions
- /src/types: TypeScript type definitions

## Development server
- Always use port 3000 by default
- Allow testing from https://*.cloudfront.net/ (for example, configure server.allowedHost in Vite)


Create a new React component: $ARGUMENTS

Follow these steps:
1. Create the component file in /src/components/
2. Use TypeScript with proper prop interfaces
3. Include JSDoc comments for props
4. Add error boundaries where appropriate
5. Create a corresponding test file using React Testing Library
6. Export the component from /src/components/index.ts
7. Update the component documentation

Remember to follow our team's coding standards from CLAUDE.md.
