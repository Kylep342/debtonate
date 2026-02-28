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

Shared idea: "(focused) time travel view" - show cards 'at period X' in addtion to present value
 - visual table with selectable 'at period X'
 - essentially (maybe?) permanent HoverTemplate

 flag to always meet annual maximums across instruments (i.e. set minimum budget to 0 or instruments.reduce((instrument, accumulator) => instrument.annualLimit + accumulator, 0))


Want to have a comparison/summary page

e.g. for X (Instrument) show effects of each Y (Budget) side-by-side

HoverHelp - menu-togglable context on terms/values
