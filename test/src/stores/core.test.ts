import { scaleLinear, scaleTime } from "d3";
import { Loan } from "moneyfunx";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import constants from '../../../src/constants/constants';
import keys from '../../../src/constants/keys';
import useCoreStore from '../../../src/stores/core';

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
const RefinancingScenarios = (loan) => [
  new Loan(
    loan.currentBalance,
    loan.annualRate - 0.0075,
    12,
    loan.termInYears + 1,
  ),
  new Loan(
    loan.currentBalance,
    loan.annualRate + 0.0150,
    12,
    Math.max(loan.termInYears - 2, 2),
  ),
];

describe('Core Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  describe('user options', () => {
    it('styles currency', async () => {
      const coreState = useCoreStore();
      coreState.setLanguage('en-US');
      coreState.setCurrency('USD');
      expect(coreState.language).toBe('en-US');
      expect(coreState.currency).toBe('USD');
      expect(coreState.currencySymbol).toBe('$');
      expect(coreState.Money(100)).toBe('$100.00');

      coreState.setLanguage('de-DE');
      coreState.setCurrency('EUR');
      expect(coreState.language).toBe('de-DE');
      expect(coreState.currency).toBe('EUR');
      expect(coreState.currencySymbol).toBe('€');
      // not testing other currencies as they format with nasty space characters
    });

    it('styles percentages', async () => {
      const coreState = useCoreStore();
      coreState.setLanguage('en-US');
      expect(coreState.language).toBe('en-US');
      expect(coreState.Percent(40.23)).toBe('40.23%')
      coreState.setLanguage('es-MX');
      expect(coreState.Percent(40.23)).toBe('40.23%')
    });

    it('styles dates', async () => {
      const coreState = useCoreStore();
      const baseDate = new Date(coreState.baseDate)
      coreState.setLanguage('en-US');
      expect(coreState.periodsAsDates).toBe(false);
      expect(coreState.graphXScale).toBe(scaleLinear);
      expect(coreState.Time).toBe(constants.PERIOD);
      expect(coreState.Period(1, true)).toBe(1);
      expect(coreState.Period(1)).toBe(1);

      coreState.togglePeriodsAsDates();
      expect(coreState.periodsAsDates).toBe(true);
      expect(coreState.Time).toBe(constants.DATE);
      expect(coreState.graphXScale).toBe(scaleTime);
      expect(coreState.Period(1, true)).toBe(new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        baseDate.getDate(),
      ).toLocaleDateString());
      expect(coreState.Period(1)).toStrictEqual(new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        baseDate.getDate(),
      ));
    });

    it('sets rounding scale', async () => {
      const coreState = useCoreStore();
      coreState.loans = Loans();
      expect(coreState.roundingEnabled).toBe(false);
      expect(coreState.roundingScale).toBe(100);
      expect(coreState.globalMinPayment.toFixed(2)).toBe('3307.71');

      coreState.toggleRounding(300);
      expect(coreState.roundingEnabled).toBe(true);
      expect(coreState.roundingScale).toBe(300);
      expect(coreState.globalMinPayment.toFixed(2)).toBe('3600.00');
    });

    it('preserves rounding scale', async () => {
      const coreState = useCoreStore();
      expect(coreState.roundingEnabled).toBe(false);
      expect(coreState.roundingScale).toBe(100);

      coreState.toggleRounding('fish');
      expect(coreState.roundingEnabled).toBe(true);
      expect(coreState.roundingScale).toBe(100);
    });

    it('reduces payments', async () => {
      const coreState = useCoreStore();
      expect(coreState.reducePayments).toBe(false);

      coreState.toggleReducePayments();
      expect(coreState.reducePayments).toBe(true);
    })
  });

  it('has correct global values', async () => {
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
    expect(coreState.globalMaxPeriods).toBe(180);
    expect(coreState.globalMaxPeriodsPerYear).toBe(12);
    expect(coreState.globalMaxTermInYears).toBe(15);
    expect(coreState.globalMinPayment.toFixed(2)).toBe('3307.71');
    expect(coreState.globalPrincipal.toFixed(2)).toBe('351342.07');
    expect(coreState.globalCurrentBalance.toFixed(2)).toBe('343899.23');
    expect(coreState.globalEffectiveInterestRate.toFixed(4)).toBe('0.0551');
    expect(coreState.globalFees).toBe(200);
  });

  describe('with budgets', async () => {
    it('creates a budget', async () => {
      const coreState = useCoreStore();
      expect(coreState.minimumBudget.absolute.toFixed(2)).toBe('0.00');

      coreState.createBudget(100);
      expect(
        coreState.monthlyBudgets.map((budget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['100.00', '0.00']);

      coreState.loans = Loans();
      expect(coreState.minimumBudget.absolute.toFixed(2)).toBe('3307.71');

      coreState.createBudget(200);
      expect(
        coreState.monthlyBudgets.map((budget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['3507.71', '3407.71', '3307.71']);
    });

    it('deletes a budget', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      expect(
        coreState.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      const firstBudgetId = coreState.monthlyBudgets[0].id;
      const firstBudget = coreState.getBudget(firstBudgetId);
      coreState.deleteBudget(firstBudget.id);
      expect(
        coreState.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([555, 200, 0]);
    });

    it('edits a budget', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      const firstBudgetId = coreState.monthlyBudgets[0].id;
      const firstBudget = coreState.getBudget(firstBudgetId);
      expect(coreState.currentBudgetId).toBe(null);
      expect(coreState.budgetFormActive).toBe(false);

      coreState.editBudget(firstBudgetId);
      expect(coreState.currentBudgetId).toBe(firstBudgetId);
      expect(coreState.budgetFormActive).toBe(true);

      coreState.createBudget(firstBudget.relative + 100);
      expect(coreState.currentBudgetId).toBe(null);
      expect(coreState.budgetFormActive).toBe(false);
      expect(coreState.getBudget(firstBudgetId)).toBe(undefined);
    });

    it('sorts budgets', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      expect(
        coreState.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      coreState.createBudget(350);
      expect(
        coreState.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 350, 200, 0]);
    });

    it('gets budget attributes', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      const firstBudgetId = coreState.monthlyBudgets[0].id;
      expect(coreState.getBudgetIndex(constants.DEFAULT)).toBe(4);
      expect(coreState.getBudgetColor(constants.DEFAULT)).toBe(constants.COLORS[4 % constants.COLORS.length]);
      expect(coreState.getBudgetName(constants.DEFAULT)).toBe(constants.NAME_MIN_BUDGET);
      expect(coreState.getBudgetIndex(firstBudgetId)).toBe(1);
      expect(coreState.getBudgetColor(firstBudgetId)).toBe(constants.COLORS[1]);
      expect(coreState.getBudgetName(firstBudgetId)).toBe("Budget 1");
    });
  });

  describe('with loans', async () => {
    it('creates a loan', async () => {
      const coreState = useCoreStore();
      const firstLoanDummy = Loans()[0];
      coreState.createLoan(
        firstLoanDummy.principal,
        firstLoanDummy.annualRate,
        firstLoanDummy.termInYears,
        firstLoanDummy.name,
        firstLoanDummy.currentBalance,
        firstLoanDummy.fees
      );

      expect(
        coreState.loans.map((loan) => loan.name)
      ).toStrictEqual(
        ["house"]
      );

      expect(
        coreState.loansWithTotals.map((loan) => loan.name)
      ).toStrictEqual(
        [constants.NAME_TOTALS_AS_LOAN, "house"]
      );
    });

    it('deletes a loan', async () => {
      const coreState = useCoreStore();
      coreState.loans = Loans();
      const firstLoanId = coreState.loans[0].id;
      expect(coreState.loans.length).toBe(3);

      coreState.deleteLoan(firstLoanId);
      expect(coreState.loans.length).toBe(2);
      expect(coreState.loans.map((loan) => loan.name)).toStrictEqual(["e-car", "tau"]);
    });

    it('edits a loan', async () => {
      const coreState = useCoreStore();
      coreState.loans = Loans();
      const firstLoanId = coreState.loans[0].id;
      const firstLoan = coreState.getLoan(firstLoanId);
      expect(coreState.currentLoanId).toBe(null);
      expect(coreState.loanFormActive).toBe(false);

      coreState.editLoan(firstLoanId);
      expect(coreState.currentLoanId).toBe(firstLoanId);
      expect(coreState.loanFormActive).toBe(true);
      const editedLoanId = coreState.createLoan(
        firstLoan.currentBalance,
        firstLoan.annualRate * 1.1,
        firstLoan.termInYears + 1,
        'bananas'
      );
      expect(coreState.currentLoanId).toBe(null);
      expect(coreState.loanFormActive).toBe(false);
      expect(coreState.getLoan(firstLoanId)).toBe(undefined);
      expect(coreState.getLoan(editedLoanId).name).toBe('bananas');
    });

    it('sorts loans', async () => {
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

      coreState.toggleAvalancheSort();
      expect(coreState.snowballSort).toBe(false);
      expect(
        coreState.loans.map((loan) => loan.name)
      ).toStrictEqual(["e-car", "house", "tau"]);
    });

    it('gets loan attributes', async () => {
      const coreState = useCoreStore();
      coreState.loans = Loans();
      const firstLoanId = coreState.loans[0].id;
      expect(coreState.getLoanIndex(constants.TOTALS)).toBe(0);
      expect(coreState.getLoanName(constants.TOTALS)).toBe(constants.NAME_TOTALS_AS_LOAN);
      expect(coreState.getLoanIndex(firstLoanId)).toBe(1);
      expect(coreState.getLoanName(firstLoanId)).toBe("house");
      coreState.sortLoans();
      expect(coreState.getLoanIndex(firstLoanId)).toBe(2);
    });
  });

  describe('with refinancing', async () => {
    it('refinances a loan', async () => {
      const coreState = useCoreStore();
      coreState.loans = Loans();
      const firstLoanId = coreState.loans[0].id;
      const firstLoan = coreState.getLoan(firstLoanId);
      expect(Object.keys(coreState.refinancingScenarios)).toStrictEqual([]);
      expect(Object.keys(coreState.refinancingSchedules)).toStrictEqual([]);
      expect(coreState.refinancingUseHighestPayment).toBe(false);

      const [ firstDummy, secondDummy ] = RefinancingScenarios(firstLoan);

      const firstScenarioId = coreState.createRefinanceScenario(
        firstLoanId,
        firstDummy.currentBalance,
        firstDummy.annualRate,
        firstDummy.termInYears,
        'Lower Rate Longer Term',
        200
      );
      expect(Object.keys(coreState.refinancingScenarios)).toStrictEqual([firstLoanId]);
      expect(Object.keys(coreState.refinancingSchedules)).toStrictEqual([firstLoanId]);
      const firstRefinanceScenario = coreState.refinancingScenarios[firstLoanId].find((scenario) => scenario.id === firstScenarioId);
      expect(firstRefinanceScenario.name).toBe('Lower Rate Longer Term');
      expect(
        coreState.refinancingSchedules[firstLoanId][firstScenarioId].paymentAmount
      ).toBe(
        firstRefinanceScenario.minPayment
      );
      coreState.toggleRefinancingUseHighestPayment();
      expect(coreState.refinancingUseHighestPayment).toBe(true);
      expect(
        coreState.refinancingSchedules[firstLoanId][firstScenarioId].paymentAmount
      ).toBe(
        firstLoan.minPayment
      );

      const secondScenarioId = coreState.createRefinanceScenario(
        firstLoanId,
        secondDummy.currentBalance,
        secondDummy.annualRate,
        secondDummy.termInYears,
        null,
        150
      );
      expect(Object.keys(coreState.refinancingScenarios)).toStrictEqual([firstLoanId]);
      expect(Object.keys(coreState.refinancingSchedules)).toStrictEqual([firstLoanId]);
      expect(coreState.refinancingScenarios[firstLoanId].map((scenario) => scenario.id)).toStrictEqual([firstScenarioId, secondScenarioId]);
      const secondRefinanceScenario = coreState.refinancingScenarios[firstLoanId].find((scenario) => scenario.id === secondScenarioId);
      expect(secondRefinanceScenario.name).toBe('Scenario 2');

      coreState.deleteRefinancingScenario(firstLoanId, firstScenarioId);
      expect(Object.keys(coreState.refinancingScenarios)).toStrictEqual([firstLoanId]);
      expect(coreState.refinancingScenarios[firstLoanId].map((scenario) => scenario.id)).toStrictEqual([secondScenarioId]);
    });
  });

  it('handles internal state', async () => {
    const coreState = useCoreStore();
    const initialState = coreState.exportState();
    expect(Object.keys(initialState)).toStrictEqual([
      keys.LS_BUDGETS,
      keys.LS_CURRENCY,
      keys.LS_LANGUAGE,
      keys.LS_LOANS,
      keys.LS_PERIODS_AS_DATES,
      keys.LS_REDUCE_PAYMENTS,
      keys.LS_REFINANCING_USE_HIGHEST_PAYMENT,
      keys.LS_ROUNDING_ENABLED,
      keys.LS_ROUNDING_SCALE,
      keys.LS_SNOWBALL_SORT,
    ]);
    coreState.budgets = Budgets();
    coreState.loans = Loans();
    coreState.toggleRounding(200);
    coreState.setCurrency('JPY');
    coreState.setLanguage('en-GB');
    const changedState = coreState.exportState();
    coreState.saveState();
    coreState.clearState();
    expect(coreState.budgets).toStrictEqual(initialState[keys.LS_BUDGETS]);
    expect(coreState.loans.map(
      (loan) => loan.name)
    ).toStrictEqual(initialState[keys.LS_LOANS].map(
      (loan) => loan.name
    ));
    expect(coreState.roundingEnabled).toBe(initialState[keys.LS_ROUNDING_ENABLED]);
    expect(coreState.roundingScale).toBe(initialState[keys.LS_ROUNDING_SCALE]);
    expect(coreState.language).toBe(initialState[keys.LS_LANGUAGE]);
    expect(coreState.currency).toBe(initialState[keys.LS_CURRENCY]);
    coreState.loadState();
    expect(coreState.budgets).toStrictEqual(changedState[keys.LS_BUDGETS]);
    expect(coreState.loans.map(
      (loan) => loan.name
    )).toStrictEqual(changedState[keys.LS_LOANS].map(
      (loan) => loan.name
    ));
    expect(coreState.roundingEnabled).toBe(changedState[keys.LS_ROUNDING_ENABLED]);
    expect(coreState.roundingScale).toBe(changedState[keys.LS_ROUNDING_SCALE]);
    expect(coreState.language).toBe(changedState[keys.LS_LANGUAGE]);
  });

  it('manages component states', async () => {
    const coreState = useCoreStore();
    coreState.budgets = Budgets();
    // monthlyBudgets is 1-indexed as the base minimumBudget is at [0]
    const firstBudgetId = coreState.monthlyBudgets[1].id;
    coreState.loans = Loans();
    const firstLoanId = coreState.loans[0].id;

    // budgetDetailsFormActive
    expect(coreState.budgetDetailsPanelActive).toBe(false);
    coreState.viewBudget(firstBudgetId);
    expect(coreState.budgetDetailsPanelActive).toBe(true);
    expect(coreState.currentBudgetId).toBe(firstBudgetId);
    coreState.unviewBudget();
    expect(coreState.budgetDetailsPanelActive).toBe(false);
    expect(coreState.currentBudgetId).toBe(null);

    // budgetFormActive
    expect(coreState.budgetFormActive).toBe(false);
    coreState.openBudgetForm();
    expect(coreState.budgetFormActive).toBe(true);
    coreState.exitBudgetForm();
    expect(coreState.currentBudgetId).toBe(null);
    expect(coreState.budgetFormActive).toBe(false);
    coreState.editBudget(firstBudgetId);
    expect(coreState.currentBudgetId).toBe(firstBudgetId);
    expect(coreState.budgetFormActive).toBe(true);
    coreState.exitBudgetForm();
    expect(coreState.budgetFormActive).toBe(false);
    expect(coreState.currentBudgetId).toBe(null);

    // optionsFormActive
    expect(coreState.optionsFormActive).toBe(false);
    coreState.openOptionsForm();
    expect(coreState.optionsFormActive).toBe(true);
    coreState.exitOptionsForm();
    expect(coreState.optionsFormActive).toBe(false);

    // loanDetailsFormActive
    expect(coreState.loanDetailsPanelActive).toBe(false);
    coreState.viewLoan(firstLoanId);
    expect(coreState.loanDetailsPanelActive).toBe(true);
    expect(coreState.currentLoanId).toBe(firstLoanId);
    coreState.unviewLoan();
    expect(coreState.loanDetailsPanelActive).toBe(false);
    expect(coreState.currentLoanId).toBe(null);

    // loanFormActive
    expect(coreState.loanFormActive).toBe(false);
    coreState.openLoanForm();
    expect(coreState.loanFormActive).toBe(true);
    coreState.exitLoanForm();
    expect(coreState.currentLoanId).toBe(null);
    expect(coreState.loanFormActive).toBe(false);
    coreState.editLoan(firstLoanId);
    expect(coreState.currentLoanId).toBe(firstLoanId);
    expect(coreState.loanFormActive).toBe(true);
    coreState.exitLoanForm();
    expect(coreState.loanFormActive).toBe(false);
    expect(coreState.currentLoanId).toBe(null);

    // refinancingFormActive
    expect(coreState.refinancingFormActive).toBe(false);
    coreState.openRefinancingForm();
    expect(coreState.refinancingFormActive).toBe(true);
    coreState.exitRefinancingForm();
    expect(coreState.refinancingFormActive).toBe(false);
  });

  it('builds tiles', async () => {
    const coreState = useCoreStore();
    coreState.budgets = Budgets();
    coreState.loans = Loans();
    const firstBudgetId = coreState.monthlyBudgets[0].id;
    const firstLoanId = coreState.loans[0].id;

    expect(coreState.budgetFormTitle).toBe('Creating a Budget');
    expect(coreState.loanFormTitle).toBe('Creating a Loan');
    expect(coreState.refinancingFormTitle).toBe('Refinancing');
    coreState.editBudget(firstBudgetId);
    expect(coreState.budgetFormTitle).toBe('Editing Budget 1');
    expect(coreState.loanFormTitle).toBe('Creating a Loan');
    expect(coreState.refinancingFormTitle).toBe('Refinancing');
    coreState.exitBudgetForm();

    coreState.editLoan(firstLoanId);
    expect(coreState.budgetFormTitle).toBe('Creating a Budget');
    expect(coreState.loanFormTitle).toBe('Editing house');
    expect(coreState.refinancingFormTitle).toBe('Refinancing');
    coreState.exitLoanForm();
    expect(coreState.budgetFormTitle).toBe('Creating a Budget');
    expect(coreState.loanFormTitle).toBe('Creating a Loan');
    expect(coreState.refinancingFormTitle).toBe('Refinancing');

    coreState.openRefinancingForm(firstLoanId);
    expect(coreState.budgetFormTitle).toBe('Creating a Budget');
    expect(coreState.loanFormTitle).toBe('Creating a Loan');
    expect(coreState.refinancingFormTitle).toBe('Refinancing house');
    coreState.exitRefinancingForm();
    expect(coreState.budgetFormTitle).toBe('Creating a Budget');
    expect(coreState.loanFormTitle).toBe('Creating a Loan');
    expect(coreState.refinancingFormTitle).toBe('Refinancing');
  });

  it('computes payment schedules', async () => {
    const coreState = useCoreStore();
    coreState.budgets = Budgets();
    coreState.loans = Loans();

    expect(
      Object.keys(coreState.paymentSchedules)
    ).toStrictEqual(
      coreState.monthlyBudgets.map((budget) => budget.id)
    );

    coreState.monthlyBudgets.forEach((budget) => {
      expect(
        Object.keys(coreState.paymentSchedules[budget.id].paymentSchedule)
      ).toStrictEqual(
        [...coreState.loans.map((loan) => loan.id), constants.TOTALS]
      );
      expect(
        coreState.paymentSchedules[budget.id].paymentAmount
      ).toBe(
        budget.relative
      );
    });
  });

  it('collects budget totals', async () => {
    const coreState = useCoreStore();
    coreState.budgets = Budgets();
    coreState.loans = Loans();

    expect(
      Object.keys(coreState.totalsByBudget)
    ).toStrictEqual(
      coreState.monthlyBudgets.map((budget) => budget.id)
    );

    expect(
      coreState.totalsByBudget[constants.DEFAULT].lifetimeInterest
    ).toBe(
      coreState.getLifetimeInterest(constants.TOTALS, constants.DEFAULT)
    );
  });

  it('computes payment summaries', async () => {
    const coreState = useCoreStore();
    coreState.budgets = Budgets();
    coreState.loans = Loans();

    expect(
      Object.keys(coreState.paymentSummaries)
    ).toStrictEqual(
      coreState.loansWithTotals.map((loan) => loan.id)
    );

    Object.keys(coreState.paymentSummaries).forEach((loanId) => {
      expect(
        Object.keys(coreState.paymentSummaries[loanId])
      ).toStrictEqual(
        coreState.monthlyBudgets.map((budget) => budget.id)
      );
    });
  });

  describe('with graphing', () => {
    it('configures graphs', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      coreState.loans = Loans();

      expect(
        Object.keys(coreState.graphs)
      ).toStrictEqual([
        constants.GRAPH_BALANCES_OVER_TIME,
        constants.GRAPH_INTEREST_SAVED_OVER_TIME,
        constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL,
      ]);
    });

    it('computes balances over time graph inputs', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      coreState.loans = Loans();

      expect(
        Object.keys(coreState.graphs[constants.GRAPH_BALANCES_OVER_TIME].graphs)
      ).toStrictEqual(
        coreState.loansWithTotals.map((loan) => loan.id)
      );
    });

    it('computes interest saved over time graph inputs', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      coreState.loans = Loans();

      expect(
        Object.keys(coreState.graphs[constants.GRAPH_INTEREST_SAVED_OVER_TIME].graphs)
      ).toStrictEqual(
        coreState.loansWithTotals.map((loan) => loan.id)
      );
    });

    it('computes percent of payment as principal over time graph inputs', async () => {
      const coreState = useCoreStore();
      coreState.budgets = Budgets();
      coreState.loans = Loans();

      expect(
        Object.keys(coreState.graphs[constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL].graphs)
      ).toStrictEqual(
        coreState.loansWithTotals.map((loan) => loan.id)
      );
    });
  });
});
