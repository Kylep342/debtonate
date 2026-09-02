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


### Upcoming

1. "Time-Travel" Period Scrubbing (from README.md:26-28):
    • Interactive timeline slider across both apps allowing users to scrub to "Period X"
    (or Month/Year).
    • Dynamically updates card values to show remaining balance, cumulative interest
    paid/earned, and principal paid down at that chosen period.
    • A comparative matrix view comparing Snowball vs. Avalanche strategies, or
    comparing Budget A vs. Budget B side-by-side (showing payoff date delta, total
    interest delta, and monthly cash flow freed).
2. The "Debt-to-Wealth" Pipeline (Debtonate → Appreciate Rollover):
    • Action to seamlessly transition debt payoffs into investment contributions: once
    debts in Debtonate are paid off, allow rolling that freed-up monthly cash flow
    directly into Appreciate as an automated investment budget.
3. Side-by-Side Strategy & Budget Comparison Matrix (from README.md:33-35):
4. Annual Limits Contribution Optimizer (from README.md:30):
    • For Appreciate: an auto-allocate toggle that fills tax-advantaged accounts (401k,
    IRA, HSA) up to statutory annual limits before allocating remaining budget to
    taxable accounts.
5. Contextual Financial Glossaries (HoverHelp) (from README.md:37):
    • A togglable contextual help mode explaining financial metrics throughout the UI
    (e.g., Effective APR, Amortization, Purchasing Power / Inflation Deflation, Snowball
    vs. Avalanche).
6. Plan Sharing & Exporting:
    • Export amortization schedules to CSV/JSON.
    • Enable plan sharing via encoded URL state or compressed URL hash so users can
    share or bookmark their payoff/investment plans.
