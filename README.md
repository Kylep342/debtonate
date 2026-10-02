# Debtonate

![Deploy](https://github.com/Kylep342/debtonate/actions/workflows/deploy.yml/badge.svg)
![Tests](https://github.com/Kylep342/debtonate/actions/workflows/tests.yml/badge.svg)


Debtonate is a simple, visual, data-rich financial calculator for budgeting repayment of debt

## Running locally
Requires Node && NPM

In a shell of your choice, from project root:
```bash
./dev.sh
```

View the app [in your browser](http://localhost:5173)

** If the link above does not work, localhost:5173 is already in use **

** Check process logs to see where vite serves the app **


### Next Up

1. **"Time-Travel" Period Scrubbing**:
    * Interactive timeline slider across both apps (in analysis header / `GraphsFrame`) allowing users to scrub from Period 0 to Max Period (Month/Year).
    * Dynamic Stat Ribbon:
        * **Debtonate**: Remaining balance at Period X (% debt eradicated), cumulative interest paid, principal paid off to date, and loans completely eliminated by that period.
        * **Appreciate**: Portfolio balance at Period X, cumulative contributions vs. compound growth split, and projected passive income at that milestone.
    * Chart Integration: Vertical cursor/marker across D3 line charts tracking the active scrubber position.
    * Quick controls: Step forward/backward buttons (`-1`, `+1`) and "Reset" to current/final view.

2. **Printable Summary & PDF Export (`@media print`)**:
    * Presentation-ready 1–2 page executive financial report designed for personal reviews, partners, or financial advisors.
    * Trigger: Dedicated "Print / Save as PDF" button inside `ShareExportModal` and HeaderBar.
    * Print stylesheet formatting (`@media print`):
        * Strips out web app chrome (navbar, drawer menus, modal overlays, theme backgrounds, interactive edit buttons).
        * High-contrast, black-and-white-friendly layout with crisp typography.
        * Plan Header: Title, generation timestamp, active currency.
        * Core Metric Ribbon: Total debt / total invested, projected debt-free / retirement milestone date, total lifetime interest / compound growth, monthly budget commitments.
        * Entity Inventory Table: Clean tabular breakdown of all loans or investment accounts (rates, balances, monthly payments / annual limits).
        * Annual Amortization & Milestone Summary: Year-by-year schedule highlighting remaining principal, annual interest, and account elimination milestones.
