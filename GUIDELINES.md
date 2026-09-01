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


## Discovered Guidelines
- **Unused Parameters & Code Cleanliness**: Omit unused callback parameters completely (e.g. `() => ...`) rather than keeping unused identifiers or underscore prefixes.
- **Global Formatting**: Always use `useGlobalOptionsStore` methods (`Money`, `Percent`, `Period`, `CurrencySymbol`) for currency and date formatting to ensure internationalization consistency across Debtonate and Appreciate.
- **Pinia Store Architecture**: Stores use the Setup syntax (`defineStore('name', () => { ... })`) with explicit TypeScript interfaces for State, Getters, and Actions.
- **Chart Configurations**: All charts must strictly adhere to `GraphConfig<T>` with standard D3 scales and reactive series generation.
- **Tailwind & DaisyUI Styling**: Styling uses Tailwind 3 + DaisyUI themes (`retro` and `synthwave`) with responsive utility classes and viewport composables.
