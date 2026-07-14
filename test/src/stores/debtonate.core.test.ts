import * as d3 from 'd3';
import { loan } from 'moneyfunx';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import constants from '@/apps/debtonate/constants/constants';
import keys from '@/apps/debtonate/constants/keys';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import sharedKeys from '@/apps/shared/constants/keys';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { UIDebtLoan } from '@/apps/debtonate/types/core';

function mockLoan(
  principal: number,
  annualRate: number,
  termInYears: number,
  name: string,
  currentBalance?: number,
  fees?: number
): UIDebtLoan {
  const biLoan = new loan.Loan(
    BigInt(Math.round(principal * 100)),
    BigInt(Math.round(annualRate * 1_000_000)),
    constants.PERIODS_PER_YEAR,
    termInYears,
    name,
    currentBalance !== undefined ? BigInt(Math.round(currentBalance * 100)) : undefined,
    fees !== undefined ? BigInt(Math.round(fees * 100)) : undefined
  );
  return {
    id: biLoan.id,
    name: biLoan.name,
    principal: Number(biLoan.principal) / 100,
    annualRate: Number(biLoan.annualRate) / 1_000_000,
    periodsPerYear: biLoan.periodsPerYear,
    termInYears: biLoan.termInYears,
    periodicRate: biLoan.periodicRate,
    periods: biLoan.periods,
    minPayment: Number(biLoan.minPayment) / 100,
    currentBalance: Number(biLoan.currentBalance) / 100,
    fees: Number(biLoan.fees) / 100,
  };
}

const Loans = (): UIDebtLoan[] => [
  mockLoan(314159.26, 0.0535, 15, 'house'),
  mockLoan(27182.81, 0.0828, 4, 'e-car', 23456.78, 200),
  mockLoan(10000, 0.0342, 10, 'tau', 6283.19),
];

const Budgets = (): MonthlyBudget[] => [
  { id: String(Math.floor(Math.random() * Date.now())), relative: 1200 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 555 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 200 },
];

const RefinancingScenarios = (baseLoan: UIDebtLoan): UIDebtLoan[] => [
  mockLoan(
    baseLoan.currentBalance,
    baseLoan.annualRate - 0.0075,
    baseLoan.termInYears + 1,
    'lower rate longer term'
  ),
  mockLoan(
    baseLoan.currentBalance,
    baseLoan.annualRate + 0.0150,
    Math.max(baseLoan.termInYears - 2, 2),
    'higher rate shorter term'
  ),
];

describe('Debtonate Core Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has correct total values', async () => {
    const state: DebtonateCoreStore = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();
    state.sortLoans();

    expect(
      state.loansWithTotals.map((loan: UIDebtLoan) => loan.name)
    ).toStrictEqual([constants.NAME_TOTALS_AS_LOAN, 'e-car', 'house', 'tau']);

    expect(
      state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
    ).toStrictEqual([1200, 555, 200, 0]);

    expect(state.rawTotalMinPayment.toFixed(2)).toBe('3312.63');
    expect(state.roundedTotalMinPayment.toFixed(2)).toBe('3400.00');
    expect(state.totalMaxPeriods).toBe(180);
    expect(state.totalMaxPeriodsPerYear).toBe(constants.PERIODS_PER_YEAR);
    expect(state.totalMaxTermInYears).toBe(15);
    expect(state.totalMinPayment.toFixed(2)).toBe('3312.63');
    expect(state.totalPrincipal.toFixed(2)).toBe('351342.07');
    expect(state.totalCurrentBalance.toFixed(2)).toBe('343899.23');
    expect(state.totalEffectiveInterestRate.toFixed(4)).toBe('0.0551');
    expect(state.totalFees).toBe(200);
  });

  describe('with budgets', async () => {
    it('creates a budget', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.createBudget(100);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['100.00', '0.00']);

      state.loans = Loans();
      expect(state.getBudget(constants.DEFAULT)!.absolute.toFixed(2)).toBe('3312.63');

      state.createBudget(200);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['3512.63', '3412.63', '3312.63']);
    });

    it('deletes a budget', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      const firstBudgetId = state.monthlyBudgets[0].id;
      const firstBudget = state.getBudget(firstBudgetId)!;
      state.deleteBudget(firstBudget.id);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([555, 200, 0]);
    });

    it('edits a budget', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.budgets = Budgets();
      const firstBudgetId = state.monthlyBudgets[0].id;
      const firstBudget = state.getBudget(firstBudgetId)!;
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
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      state.createBudget(350);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([1200, 555, 350, 200, 0]);
    });

    it('gets budget attributes', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
      state.budgets = Budgets();
      const firstBudgetId = state.monthlyBudgets[0].id;
      expect(state.getBudgetIndex(constants.DEFAULT)).toBe(4);
      expect(state.getBudgetColor(constants.DEFAULT)).toBe(globalOptions.colorPalate[4 % globalOptions.colorPalate.length]);
      expect(state.getBudgetName(constants.DEFAULT)).toBe(constants.NAME_MIN_BUDGET);
      expect(state.getBudgetIndex(firstBudgetId)).toBe(1);
      expect(state.getBudgetColor(firstBudgetId)).toBe(globalOptions.colorPalate[1]);
      expect(state.getBudgetName(firstBudgetId)).toBe('Budget 1');
    });
  });

  describe('with loans', async () => {
    it('creates a loan', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
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
        state.loans.map((loan: UIDebtLoan) => loan.name)
      ).toStrictEqual(
        ['house']
      );

      expect(
        state.loansWithTotals.map((loan: UIDebtLoan) => loan.name)
      ).toStrictEqual(
        [constants.NAME_TOTALS_AS_LOAN, 'house']
      );
    });

    it('deletes a loan', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoanId = state.loans[0].id;
      expect(
        state.loans.map((loan: UIDebtLoan) => loan.id)
      ).toContain(
        firstLoanId
      );

      state.deleteLoan(firstLoanId);
      expect(
        state.loans.map((loan: UIDebtLoan) => loan.id)
      ).not.toContain(
        firstLoanId
      );
    });

    it('edits a loan', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoan = state.loans[0];
      const firstLoanId = firstLoan.id;
      expect(state.currentLoanId).toBe(null);
      expect(state.loanFormActive).toBe(false);

      state.editLoan(firstLoanId);
      expect(state.currentLoanId).toBe(firstLoanId);
      expect(state.loanFormActive).toBe(true);

      state.createLoan(
        firstLoan.principal + 100,
        firstLoan.annualRate,
        firstLoan.termInYears,
        firstLoan.name,
        firstLoan.currentBalance + 100,
        firstLoan.fees
      );
      state.exitLoanForm();
      expect(state.currentLoanId).toBe(null);
      expect(state.loanFormActive).toBe(false);
      expect(state.getLoan(firstLoanId)).toBe(undefined);
    });

    it('sorts loans', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.loans = Loans();
      expect(state.snowballSort).toBe(false);

      state.sortLoans();
      expect(
        state.loans.map((loan: UIDebtLoan) => loan.name)
      ).toStrictEqual(['e-car', 'house', 'tau']);

      state.toggleSnowballSort();
      expect(state.snowballSort).toBe(true);
      expect(
        state.loans.map((loan: UIDebtLoan) => loan.name)
      ).toStrictEqual(['tau', 'e-car', 'house']);

      state.toggleAvalancheSort();
      expect(state.snowballSort).toBe(false);
      expect(
        state.loans.map((loan: UIDebtLoan) => loan.name)
      ).toStrictEqual(['e-car', 'house', 'tau']);
    });

    it('gets loan attributes', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoanId = state.loans[0].id;
      expect(state.getLoanIndex(constants.TOTALS)).toBe(0);
      expect(state.getLoanIndex(firstLoanId)).toBe(1);
      expect(state.getLoanName(firstLoanId)).toBe(state.loans[0].name);
    });
  });

  describe('with refinancing scenarios', async () => {
    it('creates refinancing scenarios', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoan = state.loans[0];
      const firstLoanId = firstLoan.id;

      expect(state.refinancingScenarios[firstLoanId]).toBe(undefined);

      const scenariosDummy = RefinancingScenarios(firstLoan);
      const firstScenarioId = state.createRefinanceScenario(
        firstLoanId,
        scenariosDummy[0].principal,
        scenariosDummy[0].annualRate,
        scenariosDummy[0].termInYears,
        scenariosDummy[0].name,
        scenariosDummy[0].fees
      );

      expect(state.refinancingScenarios[firstLoanId].map((scenario: UIDebtLoan) => scenario.id)).toStrictEqual([firstScenarioId]);
      const firstRefinanceScenario = state.refinancingScenarios[firstLoanId].find((scenario: UIDebtLoan) => scenario.id === firstScenarioId)!;
      expect(firstRefinanceScenario.name).toBe(scenariosDummy[0].name);
      expect(firstRefinanceScenario.termInYears).toBe(scenariosDummy[0].termInYears);
      expect(firstRefinanceScenario.annualRate).toBe(scenariosDummy[0].annualRate);

      const secondScenarioId = state.createRefinanceScenario(
        firstLoanId,
        scenariosDummy[1].principal,
        scenariosDummy[1].annualRate,
        scenariosDummy[1].termInYears,
        scenariosDummy[1].name,
        scenariosDummy[1].fees
      );

      expect(state.refinancingScenarios[firstLoanId].map((scenario: UIDebtLoan) => scenario.id)).toStrictEqual([firstScenarioId, secondScenarioId]);
      const secondRefinanceScenario = state.refinancingScenarios[firstLoanId].find((scenario: UIDebtLoan) => scenario.id === secondScenarioId)!;
      expect(secondRefinanceScenario.name).toBe(scenariosDummy[1].name);
      expect(secondRefinanceScenario.termInYears).toBe(scenariosDummy[1].termInYears);
      expect(secondRefinanceScenario.annualRate).toBe(scenariosDummy[1].annualRate);
    });

    it('deletes refinancing scenarios', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.loans = Loans();
      const firstLoan = state.loans[0];
      const firstLoanId = firstLoan.id;

      const scenariosDummy = RefinancingScenarios(firstLoan);
      const firstScenarioId = state.createRefinanceScenario(
        firstLoanId,
        scenariosDummy[0].principal,
        scenariosDummy[0].annualRate,
        scenariosDummy[0].termInYears,
        scenariosDummy[0].name,
        scenariosDummy[0].fees
      );

      const secondScenarioId = state.createRefinanceScenario(
        firstLoanId,
        scenariosDummy[1].principal,
        scenariosDummy[1].annualRate,
        scenariosDummy[1].termInYears,
        scenariosDummy[1].name,
        scenariosDummy[1].fees
      );

      expect(Object.keys(state.refinancingScenarios)).toStrictEqual([firstLoanId]);
      state.deleteRefinancingScenario(firstLoanId, firstScenarioId);
      expect(Object.keys(state.refinancingScenarios)).toStrictEqual([firstLoanId]);
      expect(state.refinancingScenarios[firstLoanId].map((scenario: UIDebtLoan) => scenario.id)).toStrictEqual([secondScenarioId]);
    });
  });

  it('handles internal state', async () => {
    const state: DebtonateCoreStore = useDebtonateCoreStore();
    const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

    const initialState = state.exportState();
    expect(Object.keys(initialState)).toStrictEqual([
      sharedKeys.LS_CURRENCY,
      sharedKeys.LS_LANGUAGE,
      sharedKeys.LS_PERIODS_AS_DATES,
      keys.LS_BUDGETS,
      keys.LS_LOANS,
      keys.LS_REDUCE_PAYMENTS,
      keys.LS_REFINANCING_SCENARIOS,
      keys.LS_REFINANCING_USE_HIGHEST_PAYMENT,
      keys.LS_ROUNDING_ENABLED,
      keys.LS_ROUNDING_SCALE,
      keys.LS_SNOWBALL_SORT,
      keys.LS_VIEW_PHASE,
    ]);

    state.budgets = Budgets();
    state.loans = Loans();

    expect(state.totalMinPayment).toBe(state.rawTotalMinPayment);

    state.toggleRounding(200);

    expect(state.totalMinPayment).toBe(state.roundedTotalMinPayment);

    state.toggleReducePayments();
    globalOptions.setCurrency('JPY');
    globalOptions.setLanguage('en-GB');

    const changedState = state.exportState();
    state.saveState();
    state.clearState();

    expect(state.budgets).toStrictEqual(initialState[keys.LS_BUDGETS]);
    expect(state.loans.map(
      (loan: UIDebtLoan) => loan.name)
    ).toStrictEqual(initialState[keys.LS_LOANS].map(
      (loan: any) => loan.name
    ));
    expect(state.reducePayments).toBe(initialState[keys.LS_REDUCE_PAYMENTS]);
    expect(state.roundingEnabled).toBe(initialState[keys.LS_ROUNDING_ENABLED]);
    expect(state.roundingScale).toBe(initialState[keys.LS_ROUNDING_SCALE]);
    expect(globalOptions.language).toBe(initialState[sharedKeys.LS_LANGUAGE]);
    expect(globalOptions.currency).toBe(initialState[sharedKeys.LS_CURRENCY]);

    state.loadState();
    expect(state.budgets).toStrictEqual(changedState[keys.LS_BUDGETS]);
    expect(state.loans.map(
      (loan: UIDebtLoan) => loan.name
    )).toStrictEqual(changedState[keys.LS_LOANS].map(
      (loan: any) => loan.name
    ));
    expect(state.roundingEnabled).toBe(changedState[keys.LS_ROUNDING_ENABLED]);
    expect(state.roundingScale).toBe(changedState[keys.LS_ROUNDING_SCALE]);
    expect(globalOptions.language).toBe(changedState[sharedKeys.LS_LANGUAGE]);
    expect(globalOptions.currency).toBe(changedState[sharedKeys.LS_CURRENCY]);
  });

  it('manages component states', async () => {
    const state: DebtonateCoreStore = useDebtonateCoreStore();
    state.budgets = Budgets();
    const firstBudgetId = state.budgets[0].id;
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
    state.refinanceLoan(firstLoanId);
    expect(state.refinancingFormActive).toBe(true);
    state.exitRefinancingForm();
    expect(state.refinancingFormActive).toBe(false);
  });

  it('builds titles', async () => {
    const state: DebtonateCoreStore = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();
    const firstBudgetId = state.monthlyBudgets[0].id;
    const firstLoanId = state.loans[0].id;
    expect(state.buildLoanSubtitle(state.getLoan(firstLoanId)!)).toBe(
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
        state.getLoan(firstLoanId)!,
        state.getBudget(firstBudgetId)!
      )
    ).toBe('($314,159.26 | 5.35% | $4,512.63/month | 106 Payments)');
    expect(
      state.buildAmortizationTableTitle(
        state.getLoan(firstLoanId)!,
        state.getBudget(firstBudgetId)!
      )
    ).toBe('Amortization Table - house | Budget 1');
  });

  it('computes payment schedules', async () => {
    const state: DebtonateCoreStore = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();

    expect(
      Object.keys(state.paymentScenarios)
    ).toStrictEqual(
      state.monthlyBudgets.map((budget: MonthlyBudget) => budget.id)
    );

    state.monthlyBudgets.forEach((budget: MonthlyBudget) => {
      expect(
        Object.keys(state.paymentScenarios[budget.id].paymentSchedule)
      ).toStrictEqual(
        [...state.loans.map((loan: UIDebtLoan) => loan.id), constants.TOTALS]
      );
      expect(
        state.paymentScenarios[budget.id].paymentAmount
      ).toBe(
        budget.relative
      );
    });
  });

  it('computes payment summaries', async () => {
    const state: DebtonateCoreStore = useDebtonateCoreStore();
    state.budgets = Budgets();
    state.loans = Loans();

    expect(
      Object.keys(state.paymentSchedules)
    ).toStrictEqual(
      state.loansWithTotals.map((loan: UIDebtLoan) => loan.id)
    );

    Object.keys(state.paymentSchedules).forEach((loanId) => {
      expect(
        Object.keys(state.paymentSchedules[loanId])
      ).toStrictEqual(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.id)
      );
    });
  });

  describe('with graphing', () => {
    it('configures graphs', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

      expect(state.graphXScale).toStrictEqual(d3.scaleLinear);

      state.budgets = Budgets();
      state.loans = Loans();

      const firstBudgetId = state.budgets[0].id;
      const firstLoanId = state.loans[0].id;

      expect(
        Object.keys(state.graphs)
      ).toStrictEqual([
        constants.GRAPH_BALANCES_OVER_TIME,
        constants.GRAPH_INTEREST_SAVED_OVER_TIME,
        constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL,
      ]);

      globalOptions.togglePeriodsAsDates();
      expect(state.graphXScale).toStrictEqual(d3.scaleTime);

      const l1B1Interest = state.cardGraphs[firstLoanId][firstBudgetId][0];
      const l1B1Principal = state.cardGraphs[firstLoanId][firstBudgetId][1];

      expect(Object.keys(l1B1Interest)).toStrictEqual([
        'label',
        'value',
        'color',
      ]);

      expect(Object.keys(l1B1Principal)).toStrictEqual([
        'label',
        'value',
        'color',
      ]);

      [
        state.budgetCardGraphConfig,
        state.loanCardGraphConfig,
      ].forEach((config) => expect(Object.keys(config)).toStrictEqual([
        'id',
        'type',
        'color',
        'header',
        'lineName',
        'subheader',
        'x',
        'xFormat',
        'xLabel',
        'xScale',
        'y',
        'yFormat',
        'yLabel',
        'yScale',
      ]));
    });

    it('computes balances over time graph content', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.budgets = Budgets();
      state.loans = Loans();

      expect(
        Object.keys(state.graphs[constants.GRAPH_BALANCES_OVER_TIME].graphs).sort()
      ).toStrictEqual(
        state.loansWithTotals.map((loan: UIDebtLoan) => loan.id).sort()
      );
    });

    it('computes interest saved over time graph content', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.budgets = Budgets();
      state.loans = Loans();

      expect(
        Object.keys(state.graphs[constants.GRAPH_INTEREST_SAVED_OVER_TIME].graphs).sort()
      ).toStrictEqual(
        state.loansWithTotals.map((loan: UIDebtLoan) => loan.id).sort()
      );
    });

    it('computes percent of payment as principal over time graph content', async () => {
      const state: DebtonateCoreStore = useDebtonateCoreStore();
      state.budgets = Budgets();
      state.loans = Loans();

      expect(
        Object.keys(state.graphs[constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL].graphs).sort()
      ).toStrictEqual(
        state.loansWithTotals.map((loan: UIDebtLoan) => loan.id).sort()
      );
    });
  });
});
