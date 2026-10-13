# Agent Guidelines & Standards

This workspace uses the rules and conventions established in [GUIDELINES.md](file:///Users/kyle/code/debtonate/GUIDELINES.md).

## Core Directives for Autonomous Work
1. **High Test Coverage Standard**: Maintain and elevate test coverage across all metrics:
   - Statements: >82%
   - Branches: >66%
   - Functions: >76%
   - Lines: >83%
2. **Opportunistic Coverage Expansion**: In any PR, feature, fix, or refactor, proactively look for zero-coverage or low-coverage components, views, applets, formlets, composables, or store actions touching or adjacent to the work, and add unit tests to expand coverage.
3. **AFWAP Principle (*As Far / Faithful / Full As Practicable*)**:
   - Exercise real reactive state transitions, event emissions, slot pass-throughs, and DOM interactions over artificial or shallow mocking.
   - Stub only heavy external boundaries (such as Plotly chart canvases or native `<dialog>` APIs).
4. **Zero Regressions**: All tests must run non-interactively (`npm run test:run` or `npx vitest run --coverage`), with zero lint/TypeScript errors (`npm run lint:check`), and clean builds (`npm run build`).
5. **Patterns & Cleanliness**: Follow patterns established in `GUIDELINES.md` (no emojis, explicit element IDs, `bigint` precision via `moneyfunx`, and centralized formatting via `useGlobalOptionsStore`).
