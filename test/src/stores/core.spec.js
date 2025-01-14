import { Loan } from "moneyfunx";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import useCoreStore from 'src/stores/core';
import constants from 'src/constants/constants';

const Loans = () => [
  new Loan(
    314159.26,
    0.0535,
    12,
    15,
    "house",
  ),
  new Loan(
    27182.81,
    0.0828,
    12,
    4,
    "e-car",
    23456.78,
    200,
  ),
  new Loan(
    10000,
    0.0342,
    12,
    10,
    "tau",
    6283.19,
  ),
];
const Budgets = () => [1200, 555, 200];

describe('Core Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('toggles dates', () => {
    const coreState = useCoreStore();
    expect(coreState.Time).toBe(constants.PERIOD);
    coreState.periodsAsDates = true;
    expect(coreState.Time).toBe(constants.DATE);
  });

  it('sets rounding scale', () => {
    const coreState = useCoreStore();
    expect(coreState.roundUp).toBe(false);
    expect(coreState.roundingScale).toBe(100);
    coreState.toggleRounding(200);
    expect(coreState.roundUp).toBe(true);
    expect(coreState.roundingScale).toBe(200);
  });

  it('preserves rounding scale', () => {
    const coreState = useCoreStore();
    expect(coreState.roundUp).toBe(false);
    expect(coreState.roundingScale).toBe(100);
    coreState.toggleRounding('fish');
    expect(coreState.roundUp).toBe(true);
    expect(coreState.roundingScale).toBe(100);
  });

  it('has correct global values', () => {
    const coreState = useCoreStore();
    coreState.budgets = Budgets();
    coreState.loans = Loans();
    coreState.sortLoans();

    expect(
      coreState.loansWithTotals.map((loan) => loan.name)
    ).toStrictEqual([constants.NAME_TOTALS_AS_LOAN, "e-car", "house", "tau"]);

    expect(
      coreState.monthlyBudgets.map((budget) => budget.relative)
    ).toStrictEqual([1200, 555, 200, 0]);

    expect(coreState.rawGlobalMinPayment.toFixed(2)).toBe('3307.71');
    expect(coreState.roundedGlobalMinPayment.toFixed(2)).toBe('3400.00');
    expect(coreState.globalFees).toBe(200);
    expect(coreState.globalMaxPeriods).toBe(180);
    expect(coreState.globalMaxPeriodsPerYear).toBe(12);
    expect(coreState.globalMaxTermInYears).toBe(15);
    expect(coreState.globalMinPayment.toFixed(2)).toBe('3307.71');
    expect(coreState.globalPrincipal.toFixed(2)).toBe('351342.07');
    expect(coreState.globalCurrentBalance.toFixed(2)).toBe('343899.23');
    expect(coreState.globalEffectiveInterestRate.toFixed(4)).toBe('0.0551');
  });

  it('creates a loan', () => {
    const coreState = useCoreStore();
    const loanDummy = Loans()[0];
    coreState.createLoan(
      loanDummy.principal,
      loanDummy.annualRate,
      loanDummy.termInYears,
      loanDummy.name,
      loanDummy.currentBalance,
      loanDummy.fees
    );

    const firstLoanId = coreState.loans[0].id;
    const firstLoan = coreState.getLoan(firstLoanId);
    expect(
      coreState.loansWithTotals.map((loan) => loan.name)
    ).toStrictEqual([constants.NAME_TOTALS_AS_LOAN, "house"]);
    expect(coreState.totalsAsALoan.principal).toBe(firstLoan.principal);
    expect(coreState.totalsAsALoan.annualRate).toBe(firstLoan.annualRate);
    expect(coreState.totalsAsALoan.globalMaxPeriodsPerYear).toBe(firstLoan.globalMaxPeriodsPerYear);
    expect(coreState.totalsAsALoan.termInYears).toBe(firstLoan.termInYears);
    expect(coreState.totalsAsALoan.periods).toBe(firstLoan.periods);
    expect(coreState.totalsAsALoan.minPayment).toBe(firstLoan.minPayment);
    expect(coreState.totalsAsALoan.currentBalance).toBe(firstLoan.currentBalance);
    expect(coreState.totalsAsALoan.fees).toBe(firstLoan.fees);
  });

  it('deletes a loan', () => {
    const coreState = useCoreStore();
    coreState.loans = Loans();
    const firstLoanId = coreState.loans[0].id;
    expect(coreState.loans.length).toBe(3);

    coreState.deleteLoan(firstLoanId);

    expect(coreState.loans.length).toBe(2);
    expect(coreState.loans.map((loan) => loan.name)).toStrictEqual(["e-car", "tau"]);
  })

  it('sorts loans', () => {
    const coreState = useCoreStore();
    coreState.loans = Loans();
    expect(coreState.snowballSort).toBe(false);

    coreState.sortLoans();
    expect(
      coreState.loans.map((loan) => loan.name)
    ).toStrictEqual(["e-car", "house", "tau"]);

    coreState.toggleSnowballSort();
    expect(coreState.snowballSort).toBe(true);
    expect(
      coreState.loans.map((loan) => loan.name)
    ).toStrictEqual(["tau", "e-car", "house"]);
  });

  it('creates a buget', () => {
    const coreState = useCoreStore();
    coreState.loans = Loans();
    expect(coreState.minimumBudget.absolute.toFixed(2)).toBe('3307.71');

    coreState.createBudget(200);
    expect(
      coreState.monthlyBudgets.map((budget) => budget.absolute.toFixed(2))
    ).toStrictEqual(['3507.71', '3307.71']);
  });

  it('deletes a budget', () => {
    const coreState = useCoreStore();
    coreState.budgets = Budgets();
    expect(
      coreState.monthlyBudgets.map((budget) => budget.relative)
    ).toStrictEqual([1200, 555, 200, 0]);

    const firstBudgetId = coreState.monthlyBudgets[0].id;
    coreState.deleteBudget(firstBudgetId);
    expect(
      coreState.monthlyBudgets.map((budget) => budget.relative)
    ).toStrictEqual([555, 200, 0]);
  });
})