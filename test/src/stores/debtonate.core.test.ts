import { Loan } from "moneyfunx";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import constants from '@/apps/debtonate/constants/constants';
import keys from '@/apps/debtonate/constants/keys';
import sharedKeys from '@/apps/shared/constants/keys';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

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
const Budgets = () => [
  { id: String(Math.floor(Math.random() * Date.now())), relative: 1200 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 555 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 200 },
];
const RefinancingScenarios = (loan) => [
  new Loan(
    loan.currentBalance,
    loan.annualRate - 0.0075,
    12,
    loan.termInYears + 1,
    "lower rate longer term",
  ),
  new Loan(
    loan.currentBalance,
    loan.annualRate + 0.0150,
    12,
    Math.max(loan.termInYears - 2, 2),
    "higher rate shorter term",
  ),
];

describe('Debtonate Core Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has correct total values', async () => {
    const state = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();
    state.sortLoans();

    expect(
      state.loansWithTotals.map((loan) => loan.name)
    ).toStrictEqual([constants.NAME_TOTALS_AS_LOAN, "e-car", "house", "tau"]);

    expect(
      state.monthlyBudgets.map((budget) => budget.relative)
    ).toStrictEqual([1200, 555, 200, 0]);

    expect(state.rawTotalMinPayment.toFixed(2)).toBe('3307.71');
    expect(state.roundedTotalMinPayment.toFixed(2)).toBe('3400.00');
    expect(state.totalMaxPeriods).toBe(180);
    expect(state.totalMaxPeriodsPerYear).toBe(12);
    expect(state.totalMaxTermInYears).toBe(15);
    expect(state.totalMinPayment.toFixed(2)).toBe('3307.71');
    expect(state.totalPrincipal.toFixed(2)).toBe('351342.07');
    expect(state.totalCurrentBalance.toFixed(2)).toBe('343899.23');
    expect(state.totalEffectiveInterestRate.toFixed(4)).toBe('0.0551');
    expect(state.totalFees).toBe(200);
  });

  describe('with budgets', async () => {
    it('creates a budget', async () => {
      const state = useDebtonateCoreStore();
      state.createBudget(100);
      expect(
        state.monthlyBudgets.map((budget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['100.00', '0.00']);

      state.loans = Loans();
      expect(state.getBudget(constants.DEFAULT).absolute.toFixed(2)).toBe('3307.71');

      state.createBudget(200);
      expect(
        state.monthlyBudgets.map((budget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['3507.71', '3407.71', '3307.71']);
    });

    it('deletes a budget', async () => {
      const state = useDebtonateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      const firstBudgetId = state.monthlyBudgets[0].id;
      const firstBudget = state.getBudget(firstBudgetId);
      state.deleteBudget(firstBudget.id);
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([555, 200, 0]);
    });

    it('edits a budget', async () => {
      const state = useDebtonateCoreStore();
      state.budgets = Budgets();
      const firstBudgetId = state.monthlyBudgets[0].id;
      const firstBudget = state.getBudget(firstBudgetId);
      expect(state.currentBudgetId).toBe(null);
      expect(state.budgetFormActive).toBe(false);

      state.editBudget(firstBudgetId);
      expect(state.currentBudgetId).toBe(firstBudgetId);
      expect(state.budgetFormActive).toBe(true);

      state.createBudget(firstBudget.relative + 100);
      state.exitBudgetForm();
      expect(state.currentBudgetId).toBe(null);
      expect(state.budgetFormActive).toBe(false);
      expect(state.getBudget(firstBudgetId)).toBe(undefined);
    });

    it('sorts budgets', async () => {
      const state = useDebtonateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      state.createBudget(350);
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 350, 200, 0]);
    });

    it('gets budget attributes', async () => {
      const state = useDebtonateCoreStore();
      state.budgets = Budgets();
      const firstBudgetId = state.monthlyBudgets[0].id;
      expect(state.getBudgetIndex(constants.DEFAULT)).toBe(4);
      expect(state.getBudgetColor(constants.DEFAULT)).toBe(constants.COLORS[4 % constants.COLORS.length]);
      expect(state.getBudgetName(constants.DEFAULT)).toBe(constants.NAME_MIN_BUDGET);
      expect(state.getBudgetIndex(firstBudgetId)).toBe(1);
      expect(state.getBudgetColor(firstBudgetId)).toBe(constants.COLORS[1]);
      expect(state.getBudgetName(firstBudgetId)).toBe("Budget 1");
    });
  });

  describe('with loans', async () => {
    it('creates a loan', async () => {
      const state = useDebtonateCoreStore();
      const firstLoanDummy = Loans()[0];
      state.createLoan(
        firstLoanDummy.principal,
        firstLoanDummy.annualRate,
        firstLoanDummy.termInYears,
        firstLoanDummy.name,
        firstLoanDummy.currentBalance,
        firstLoanDummy.fees
      );

      expect(
        state.loans.map((loan) => loan.name)
      ).toStrictEqual(
        ["house"]
      );

      expect(
        state.loansWithTotals.map((loan) => loan.name)
      ).toStrictEqual(
        [constants.NAME_TOTALS_AS_LOAN, "house"]
      );
    });

    it('deletes a loan', async () => {
      const state = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoanId = state.loans[0].id;
      expect(state.loans.length).toBe(3);

      state.deleteLoan(firstLoanId);
      expect(state.loans.length).toBe(2);
      expect(state.loans.map((loan) => loan.name)).toStrictEqual(["e-car", "tau"]);
    });

    it('edits a loan', async () => {
      const state = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoanId = state.loans[0].id;
      const firstLoan = state.getLoan(firstLoanId);
      expect(state.currentLoanId).toBe(null);
      expect(state.loanFormActive).toBe(false);

      state.editLoan(firstLoanId);
      expect(state.currentLoanId).toBe(firstLoanId);
      expect(state.loanFormActive).toBe(true);
      const editedLoanId = state.createLoan(
        firstLoan.currentBalance,
        firstLoan.annualRate * 1.1,
        firstLoan.termInYears + 1,
        'bananas'
      );
      state.exitLoanForm();
      expect(state.currentLoanId).toBe(null);
      expect(state.loanFormActive).toBe(false);
      expect(state.getLoan(firstLoanId)).toBe(undefined);
      expect(state.getLoan(editedLoanId).name).toBe('bananas');
    });

    it('sorts loans', async () => {
      const state = useDebtonateCoreStore();
      state.loans = Loans();
      expect(state.snowballSort).toBe(false);

      state.sortLoans();
      expect(
        state.loans.map((loan) => loan.name)
      ).toStrictEqual(["e-car", "house", "tau"]);

      state.toggleSnowballSort();
      expect(state.snowballSort).toBe(true);
      expect(
        state.loans.map((loan) => loan.name)
      ).toStrictEqual(["tau", "e-car", "house"]);

      state.toggleAvalancheSort();
      expect(state.snowballSort).toBe(false);
      expect(
        state.loans.map((loan) => loan.name)
      ).toStrictEqual(["e-car", "house", "tau"]);
    });

    it('gets loan attributes', async () => {
      const state = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoanId = state.loans[0].id;
      expect(state.getLoanIndex(constants.TOTALS)).toBe(0);
      expect(state.getLoanName(constants.TOTALS)).toBe(constants.NAME_TOTALS_AS_LOAN);
      expect(state.getLoanIndex(firstLoanId)).toBe(1);
      expect(state.getLoanName(firstLoanId)).toBe("house");
      state.sortLoans();
      expect(state.getLoanIndex(firstLoanId)).toBe(2);
    });
  });

  describe('with refinancing', async () => {
    it('refinances a loan', async () => {
      const state = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoanId = state.loans[0].id;
      const firstLoan = state.getLoan(firstLoanId);
      expect(Object.keys(state.refinancingScenarios)).toStrictEqual([]);
      expect(Object.keys(state.refinancingSchedules)).toStrictEqual([]);
      expect(state.refinancingUseHighestPayment).toBe(false);

      const [firstDummy, secondDummy] = RefinancingScenarios(firstLoan);

      const firstScenarioId = state.createRefinanceScenario(
        firstLoanId,
        firstDummy.currentBalance,
        firstDummy.annualRate,
        firstDummy.termInYears,
        'Lower Rate Longer Term',
        200
      );
      expect(Object.keys(state.refinancingScenarios)).toStrictEqual([firstLoanId]);
      expect(Object.keys(state.refinancingSchedules)).toStrictEqual([firstLoanId]);
      const firstRefinanceScenario = state.refinancingScenarios[firstLoanId].find((scenario) => scenario.id === firstScenarioId);
      expect(firstRefinanceScenario.name).toBe('Lower Rate Longer Term');
      expect(
        state.refinancingSchedules[firstLoanId][firstScenarioId].paymentAmount
      ).toBe(
        firstRefinanceScenario.minPayment
      );
      state.toggleRefinancingUseHighestPayment();
      expect(state.refinancingUseHighestPayment).toBe(true);
      expect(
        state.refinancingSchedules[firstLoanId][firstScenarioId].paymentAmount
      ).toBe(
        firstLoan.minPayment
      );

      const secondScenarioId = state.createRefinanceScenario(
        firstLoanId,
        secondDummy.currentBalance,
        secondDummy.annualRate,
        secondDummy.termInYears,
        null,
        150
      );
      expect(Object.keys(state.refinancingScenarios)).toStrictEqual([firstLoanId]);
      expect(Object.keys(state.refinancingSchedules)).toStrictEqual([firstLoanId]);
      expect(state.refinancingScenarios[firstLoanId].map((scenario) => scenario.id)).toStrictEqual([firstScenarioId, secondScenarioId]);
      const secondRefinanceScenario = state.refinancingScenarios[firstLoanId].find((scenario) => scenario.id === secondScenarioId);
      expect(secondRefinanceScenario.name).toBe('Scenario 2');

      state.deleteRefinancingScenario(firstLoanId, firstScenarioId);
      expect(Object.keys(state.refinancingScenarios)).toStrictEqual([firstLoanId]);
      expect(state.refinancingScenarios[firstLoanId].map((scenario) => scenario.id)).toStrictEqual([secondScenarioId]);
    });
  });

  it('handles internal state', async () => {
    const state = useDebtonateCoreStore();
    const globalOptions = useGlobalOptionsStore();
    const initialState = state.exportState();
    expect(Object.keys(initialState)).toStrictEqual([
      sharedKeys.LS_CURRENCY,
      sharedKeys.LS_LANGUAGE,
      sharedKeys.LS_PERIODS_AS_DATES,
      keys.LS_BUDGETS,
      keys.LS_LOANS,
      keys.LS_REDUCE_PAYMENTS,
      keys.LS_REFINANCING_USE_HIGHEST_PAYMENT,
      keys.LS_ROUNDING_ENABLED,
      keys.LS_ROUNDING_SCALE,
      keys.LS_SNOWBALL_SORT,
    ]);
    state.budgets = Budgets();
    state.loans = Loans();
    state.toggleRounding(200);
    state.toggleReducePayments();
    globalOptions.setCurrency('JPY');
    globalOptions.setLanguage('en-GB');
    const changedState = state.exportState();
    state.saveState();
    state.clearState();
    expect(state.budgets).toStrictEqual(initialState[keys.LS_BUDGETS]);
    expect(state.loans.map(
      (loan) => loan.name)
    ).toStrictEqual(initialState[keys.LS_LOANS].map(
      (loan) => loan.name
    ));
    expect(state.reducePayments).toBe(initialState[keys.LS_REDUCE_PAYMENTS]);
    expect(state.roundingEnabled).toBe(initialState[keys.LS_ROUNDING_ENABLED]);
    expect(state.roundingScale).toBe(initialState[keys.LS_ROUNDING_SCALE]);
    expect(globalOptions.language).toBe(initialState[sharedKeys.LS_LANGUAGE]);
    expect(globalOptions.currency).toBe(initialState[sharedKeys.LS_CURRENCY]);
    state.loadState();
    expect(state.budgets).toStrictEqual(changedState[keys.LS_BUDGETS]);
    expect(state.loans.map(
      (loan) => loan.name
    )).toStrictEqual(changedState[keys.LS_LOANS].map(
      (loan) => loan.name
    ));
    expect(state.roundingEnabled).toBe(changedState[keys.LS_ROUNDING_ENABLED]);
    expect(state.roundingScale).toBe(changedState[keys.LS_ROUNDING_SCALE]);
    expect(state.language).toBe(changedState[keys.LS_LANGUAGE]);
  });

  it('manages component states', async () => {
    const state = useDebtonateCoreStore();
    state.budgets = Budgets();
    // monthlyBudgets is 1-indexed as the base minimumBudget is at [0]
    const firstBudgetId = state.monthlyBudgets[1].id;
    state.loans = Loans();
    const firstLoanId = state.loans[0].id;

    // budgetDetailsFormActive
    expect(state.budgetDetailsPanelActive).toBe(false);
    state.viewBudget(firstBudgetId);
    expect(state.budgetDetailsPanelActive).toBe(true);
    expect(state.currentBudgetId).toBe(firstBudgetId);
    state.unviewBudget();
    expect(state.budgetDetailsPanelActive).toBe(false);
    expect(state.currentBudgetId).toBe(null);

    // budgetFormActive
    expect(state.budgetFormActive).toBe(false);
    state.openBudgetForm();
    expect(state.budgetFormActive).toBe(true);
    state.exitBudgetForm();
    expect(state.currentBudgetId).toBe(null);
    expect(state.budgetFormActive).toBe(false);
    state.editBudget(firstBudgetId);
    expect(state.currentBudgetId).toBe(firstBudgetId);
    expect(state.budgetFormActive).toBe(true);
    state.exitBudgetForm();
    expect(state.budgetFormActive).toBe(false);
    expect(state.currentBudgetId).toBe(null);

    // optionsFormActive
    expect(state.optionsFormActive).toBe(false);
    state.openOptionsForm();
    expect(state.optionsFormActive).toBe(true);
    state.exitOptionsForm();
    expect(state.optionsFormActive).toBe(false);

    // loanDetailsFormActive
    expect(state.loanDetailsPanelActive).toBe(false);
    state.viewLoan(firstLoanId);
    expect(state.loanDetailsPanelActive).toBe(true);
    expect(state.currentLoanId).toBe(firstLoanId);
    state.unviewLoan();
    expect(state.loanDetailsPanelActive).toBe(false);
    expect(state.currentLoanId).toBe(null);

    // loanFormActive
    expect(state.loanFormActive).toBe(false);
    state.openLoanForm();
    expect(state.loanFormActive).toBe(true);
    state.exitLoanForm();
    expect(state.currentLoanId).toBe(null);
    expect(state.loanFormActive).toBe(false);
    state.editLoan(firstLoanId);
    expect(state.currentLoanId).toBe(firstLoanId);
    expect(state.loanFormActive).toBe(true);
    state.exitLoanForm();
    expect(state.loanFormActive).toBe(false);
    expect(state.currentLoanId).toBe(null);

    // refinancingFormActive
    expect(state.refinancingFormActive).toBe(false);
    state.refinanceLoan();
    expect(state.refinancingFormActive).toBe(true);
    state.exitRefinancingForm();
    expect(state.refinancingFormActive).toBe(false);
  });

  it('builds titles', async () => {
    const state = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();
    const firstBudgetId = state.monthlyBudgets[0].id;
    const firstLoanId = state.loans[0].id;
    expect(state.buildLoanSubtitle(state.getLoan(firstLoanId))).toBe(
      '($314,159.26 | 5.35% | 180 Payments)'
    );

    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.loanFormTitle).toBe('Creating a Loan');
    expect(state.refinancingFormTitle).toBe('Refinancing');
    state.editBudget(firstBudgetId);
    expect(state.budgetFormTitle).toBe('Editing Budget 1');
    expect(state.loanFormTitle).toBe('Creating a Loan');
    expect(state.refinancingFormTitle).toBe('Refinancing');
    state.exitBudgetForm();

    state.editLoan(firstLoanId);
    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.loanFormTitle).toBe('Editing house');
    expect(state.refinancingFormTitle).toBe('Refinancing');
    state.exitLoanForm();
    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.loanFormTitle).toBe('Creating a Loan');
    expect(state.refinancingFormTitle).toBe('Refinancing');

    state.refinanceLoan(firstLoanId);
    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.loanFormTitle).toBe('Creating a Loan');
    expect(state.refinancingFormTitle).toBe('Refinancing house');
    state.exitRefinancingForm();
    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.loanFormTitle).toBe('Creating a Loan');
    expect(state.refinancingFormTitle).toBe('Refinancing');

    expect(
      state.buildAmortizationTableSubtitle(
        state.getLoan(firstLoanId),
        state.getBudget(firstBudgetId)
      )
    ).toBe('($314,159.26 | 5.35% | $4,507.71/month | 106 Payments)');
    expect(
      state.buildAmortizationTableTitle(
        state.getLoan(firstLoanId),
        state.getBudget(firstBudgetId)
      )
    ).toBe('Amortization Table - house | Budget 1');
  });

  it('computes payment schedules', async () => {
    const state = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();

    expect(
      Object.keys(state.paymentScenarios)
    ).toStrictEqual(
      state.monthlyBudgets.map((budget) => budget.id)
    );

    state.monthlyBudgets.forEach((budget) => {
      expect(
        Object.keys(state.paymentScenarios[budget.id].paymentSchedule)
      ).toStrictEqual(
        [...state.loans.map((loan) => loan.id), constants.TOTALS]
      );
      expect(
        state.paymentScenarios[budget.id].paymentAmount
      ).toBe(
        budget.relative
      );
    });
  });

  it('computes payment summaries', async () => {
    const state = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();

    expect(
      Object.keys(state.paymentSchedules)
    ).toStrictEqual(
      state.loansWithTotals.map((loan) => loan.id)
    );

    Object.keys(state.paymentSchedules).forEach((loanId) => {
      expect(
        Object.keys(state.paymentSchedules[loanId])
      ).toStrictEqual(
        state.monthlyBudgets.map((budget) => budget.id)
      );
    });
  });

  describe('with graphing', () => {
    it('configures graphs', async () => {
      const state = useDebtonateCoreStore();
      const globalOptions = useGlobalOptionsStore();
      state.budgets = Budgets();
      state.loans = Loans();

      expect(
        Object.keys(state.graphs)
      ).toStrictEqual([
        constants.GRAPH_BALANCES_OVER_TIME,
        constants.GRAPH_INTEREST_SAVED_OVER_TIME,
        constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL,
      ]);
    });

    it('computes balances over time graph inputs', async () => {
      const state = useDebtonateCoreStore();
      state.budgets = Budgets();
      state.loans = Loans();

      expect(
        Object.keys(state.graphs[constants.GRAPH_BALANCES_OVER_TIME].graphs)
      ).toStrictEqual(
        state.loansWithTotals.map((loan) => loan.id)
      );
    });

    it('computes interest saved over time graph inputs', async () => {
      const state = useDebtonateCoreStore();
      state.budgets = Budgets();
      state.loans = Loans();

      expect(
        Object.keys(state.graphs[constants.GRAPH_INTEREST_SAVED_OVER_TIME].graphs)
      ).toStrictEqual(
        state.loansWithTotals.map((loan) => loan.id)
      );
    });

    it('computes percent of payment as principal over time graph inputs', async () => {
      const state = useDebtonateCoreStore();
      state.budgets = Budgets();
      state.loans = Loans();

      expect(
        Object.keys(state.graphs[constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL].graphs)
      ).toStrictEqual(
        state.loansWithTotals.map((loan) => loan.id)
      );
    });
  });
});
