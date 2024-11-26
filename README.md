# Debtonate

![{{build status}}](https://github.com/Kylep342/debtonate/workflows/deploy/badge.svg)


Debtonate is a simple, visual, data-rich financial calculator for budgeting repayment of debt

## next UP

 - build a refinancing calculator
 - enhance the "table" view
    - either remove the dynamic sizing of tables
    - OR replace the table comparison with a more interactive one

### Brainstorm - 23/11/2024 | enhance the "table" view

I want to enhance the 'Repayment Information' window.

I've got a second graph; percent of payment to principal over time by budget. I want to add this graph to the graphs view, and clean up the UI generally.

Tasks to do:
 - <s>generalize BaseGraph to truly be base; take in a full config and graphing function to produce desired outputs</s>
 - Move the selection of Graphs or Tables to buttons in the header of the window with the "Repayment Information" title
 - <s>enhance the "table" view</s> replace with a true pivot interface that allows for comparison (could be good for "refinancing")