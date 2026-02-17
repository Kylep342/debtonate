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
 - (TODO: Hi germini, thanks for your help! Please replace this comment with our first guideline :D)

---

# 3.0 - Endless hypotheticals
We get more apps!:
 - debtonate
  - repatriate -> loan refinancing analysis
 - appreciate
  - investigate -> investment retirement analysis

now that moneyfunx has drawdown analyses
all new phases come with more graphs, tables, and an enhanced calculator view showing split debtonate|repatriate && appreciate|investigate

## Project Guidelines - AI
 - The implementation should have the following structure:
  - Debtonate (project)
    - debtonate (app)
      - debtonate (applet)
      - repatriate (applet)
    - appreciate (app)
      - appreciate (applet)
      - investigate (applet)
 - Each app should have a View containing child apps and the necessary toggles between them, like is currently implemented in appreciate
 - Each app should have the components as represented currently with in the project for Debtonate and Appreciate
  - *There sould be substantial changes to the current structure of the apppreciate applet, as the beginnings of investigate are implemented in it (compare current git state to main to see changes)
 - Another big feature of this update should be component tests. I've never written any, but would like to learn to. Look at the test setup and determine the easiest way to add them

## App designs

### Debtonate
### Appreciate

## Applet designs

 ### debtonate
  Debtonate will be largely unchanged. Refinancing will move to its own applet
 ### repatriate
  Refinacning moves to repatriate. Repatiriate will show users the ability to refinance any and all of their loans, in addition to potential debt consolidation. It will again show the variety of budgets but will contain tabular and graphical components comparing only within a loan and it's refinancing scenarios
 ### appreciate
  Appreciate (applet) will shed the nascent investigate. Appreciate will gain some tabular analysis (example of data):

| Metric | Scenario 1 | Scenario 2 | Scenario 3 | Scenario 4 | Scenario 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Principal** | $10,800.00 | $831,000.00 | $1,077,000.00 | $1,220,500.00 | $1,425,500.00 |
| **Interest** | $1,337,654.68 | $2,798,369.85 | $3,480,941.64 | $3,879,108.52 | $4,447,918.35 |
| **Interest/Principal Ratio** | 123.8569 | 3.3675 | 3.2321 | 3.1783 | 3.1203 |
| **Share of Balance at retirement as Principal** | 0.80% | 22.90% | 23.63% | 23.93% | 24.27% |
| **Effective Avg Saved/yr of work** | $32,889.14 | $88,521.22 | $111,169.31 | $124,380.70 | $143,254.11 |
| **Growth Factor from present** | 73.0949 | 48.9661 | 56.8889 | 60.9855 | 66.2764 |
| **Age of > $1M saved** | 61 | 47 | 44 | 43 | 42 |

 ### investigate
 Investigate will get some tabular analysis (example of data):
| Metric | Budget 1 | Budget 2 | Budget 3 | Budget 4 | Budget 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Initial Balance** | $1,348,454.68 | $3,629,369.85 | $4,557,941.64 | $5,099,608.52 | $5,873,418.35 |
| **Growth** | $11,603,811.70 | $10,467,649.77 | $19,453,050.39 | $24,694,534.09 | $32,182,367.95 |
| **Growth/Initial Ratio** | 8.6053 | 2.8842 | 4.2679 | 4.8424 | 5.4793 |
| **Share of value retirement end as growth** | 113.15% | 74.25% | 81.02% | 82.88% | 84.57% |
| **Effective Avg Saved/yr** | $322,328.10 | $290,768.05 | $540,362.51 | $685,959.28 | $893,954.67 |
| **Growth Factor from retirement start** | 10.7583 | 2.7029 | 3.8826 | 4.3523 | 4.8600 |
| **Age of > $10M saved** | - | 94 | 85 | 81 | 77 |
