# AI Guidelines

## Vision
 - The product vision is an intuitive, data-dense financial calculator that helps people understand what they can have with smart money choices coupled to the unstoppable power of time and good habits.

## Code Philosophy
 - The codebase is full of patterns. USE THEM
 - Small operations that are general, shareable, and composable are preferred whenever possible
    - We should refactor often; as we uncover a pattern, extend it as far as is sensible
 - Assume in our back and forth changes I give you are intentional and incorporate them. If you think I make a mistake, ask a clarifying question before changing my changes

## Development
 - All code should be linted and covered by unit tests
 - Everything Javascript is Typescript
 - Standard verification commands:
   - `npm run lint`: Single-pass pipeline that runs ESLint auto-fix followed by `vue-tsc --noEmit` type checking.
   - `npm run test:run`: Executes all Vitest unit tests non-interactively.


## Discovered Guidelines
- **Unused Parameters & Code Cleanliness**: Omit unused callback parameters completely (e.g. `() => ...`) rather than keeping unused identifiers or underscore prefixes.
- **Global Formatting**: Always use `useGlobalOptionsStore` methods (`Money`, `Percent`, `Period`, `CurrencySymbol`) for currency and date formatting to ensure internationalization consistency across Debtonate and Appreciate.
- **Pinia Store Architecture**: Stores use the Setup syntax (`defineStore('name', () => { ... })`) with explicit TypeScript interfaces for State, Getters, and Actions.
- **Chart Configurations**: All charts must strictly adhere to `GraphConfig<T>` with standard D3 scales and reactive series generation.
- **Tailwind & DaisyUI Styling**: Styling uses Tailwind 3 + DaisyUI themes (`retro` and `synthwave`) with responsive utility classes and viewport composables.
- **Financial Glossary & Reference**: Financial definitions and calculation formulas live in `src/apps/shared/constants/glossary.ts` and are surfaced via the on-demand `<GlossaryModal>` controlled by `globalOptionsStore.isGlossaryActive`. This keeps primary calculation cards and tables clean and distraction-free.
- **No Emojis**: Do not use emojis anywhere in the codebase (UI templates, button labels, icons, notifications, fixtures, or tests). Use clean text, standard characters (e.g. `x`), or SVG icons.
- **Explicit Element IDs**: Interactive UI components, modal triggers, tabs, action buttons, and form inputs should define and bind dedicated, typed IDs from `src/apps/shared/constants/elementIds.ts` for clean, reliable DOM querying in tests and automation.
- **Plan Sharing & Exporting**: Plan states are shared client-side via compressed URL hashes (`#plan=cz:...` using native deflate Web Streams or UTF-8 base64url fallback) or backed up to JSON files. Amortization and distribution schedules export to RFC 4180-compliant CSV and JSON directly from data tables.
