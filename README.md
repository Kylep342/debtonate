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

Tasks to do:
 - <s>enhance the "table" view</s> replace with a true pivot interface that allows for comparison (could be good for "refinancing")

#### Refinancing

Design:

Refinancing will encapsulated as 'scenarios'. A scenario will be as follows:
 - A list of loan IDs (need to make sure deleting/loading/changing IDs does not impact [Weakness - this is the first external dependency on loan references])
 - A 'shadow' Loan object computing the interest paid at new terms
 - Any associated fees/premiums paid to refinance (optional)