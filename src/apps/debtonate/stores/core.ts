import * as d3 from 'd3';
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import constants from '../constants/constants';
import keys from '../constants/keys';
import {
  Budget,
  MonthlyBudget,
  PaymentScenario,
} from '../types/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import {
  Graph,
  GraphConfig,
  Graphs,
  Point,
} from '@/apps/shared/types/graph';

export default defineStore('debtonateCore', () => {
  // dependent stores

  const globalOptions = useGlobalOptionsStore();

  // 'debtonateCore' primitive state

  const budgetDetailsPanelActive = ref<boolean>(false);
  const budgetFormActive = ref<boolean>(false);
  const budgets = ref<Array<Budget>>([]);
  const currentBudgetId = ref<string|null>(null);
  const currentLoanId = ref<string|null>(null);
  const loanDetailsPanelActive = ref(false);
  const loanFormActive = ref<boolean>(false);
  const loans = ref<Array<moneyfunx.Loan>>([]);
  const minimumBudget: Budget = {id: constants.DEFAULT, relative: 0};
  const optionsFormActive = ref<boolean>(false);
  const reducePayments = ref<boolean>(true);
  const refinancingFormActive = ref<boolean>(false);
  const refinancingScenarios = ref<Record<string, moneyfunx.Loan[]>>({});
  const refinancingUseHighestPayment = ref<boolean>(false);
  const roundingEnabled = ref<boolean>(false);
  const roundingScale = ref<number>(100);
  const snowballSort = ref<boolean>(false);

  // independent functions/computed values

  const clearState = () => {
    globalOptions.clearState();

    budgetDetailsPanelActive.value = false;
    budgetFormActive.value = false;
    budgets.value = [];
    currentBudgetId.value = null;
    currentLoanId.value = null;
    loanDetailsPanelActive.value = false;
    loanFormActive.value = false;
    loans.value = [];
    optionsFormActive.value = false;
    reducePayments.value = true;
    refinancingFormActive.value = false;
    refinancingScenarios.value = {};
    refinancingUseHighestPayment.value = false;
    roundingEnabled.value = false;
    roundingScale.value = 100;
    snowballSort.value = true;
  };

  const loadState = () => {
    globalOptions.loadState();

    budgets.value = JSON.parse(localStorage.getItem(keys.LS_BUDGETS)!);
    loans.value = JSON.parse(localStorage.getItem(keys.LS_LOANS)!).map(
      (loan) => new moneyfunx.Loan(
        loan.principal,
        loan.annualRate,
        12,
        loan.termInYears,
        loan.name,
        loan.currentBalance,
        loan.fees,
      ),
    );
    reducePayments.value = JSON.parse(
      localStorage.getItem(keys.LS_REDUCE_PAYMENTS)!,
    );
    refinancingUseHighestPayment.value = JSON.parse(
      localStorage.getItem(keys.LS_REFINANCING_USE_HIGHEST_PAYMENT)!,
    );
    roundingEnabled.value = JSON.parse(localStorage.getItem(keys.LS_ROUNDING_ENABLED)!);
    roundingScale.value = JSON.parse(localStorage.getItem(keys.LS_ROUNDING_SCALE)!);
    snowballSort.value = JSON.parse(
      localStorage.getItem(keys.LS_SNOWBALL_SORT)!,
    );
  };

  const saveState = () => {
    globalOptions.saveState();

    localStorage.setItem(keys.LS_BUDGETS, JSON.stringify(budgets.value));
    localStorage.setItem(keys.LS_LOANS, JSON.stringify(loans.value));
    localStorage.setItem(
      keys.LS_REDUCE_PAYMENTS,
      JSON.stringify(reducePayments.value),
    );
    localStorage.setItem(
      keys.LS_REFINANCING_USE_HIGHEST_PAYMENT,
      JSON.stringify(refinancingUseHighestPayment.value),
    );
    localStorage.setItem(keys.LS_ROUNDING_ENABLED, JSON.stringify(roundingEnabled.value));
    localStorage.setItem(keys.LS_ROUNDING_SCALE, JSON.stringify(roundingScale.value));
    localStorage.setItem(
      keys.LS_SNOWBALL_SORT,
      JSON.stringify(snowballSort.value),
    );
  };

  const exportState = () => ({
    ...globalOptions.exportState(),

    [keys.LS_BUDGETS]: budgets.value,
    [keys.LS_LOANS]: loans.value,
    [keys.LS_REDUCE_PAYMENTS]: reducePayments.value,
    [keys.LS_REFINANCING_USE_HIGHEST_PAYMENT]: refinancingUseHighestPayment.value,
    [keys.LS_ROUNDING_ENABLED]: roundingEnabled.value,
    [keys.LS_ROUNDING_SCALE]: roundingScale.value,
    [keys.LS_SNOWBALL_SORT]: snowballSort.value,
  });


  /** dependent computed options/functions */

  // total values across all instruments

  const rawTotalMinPayment = computed(
    () => loans.value.reduce(
      (minPayment, loan) => minPayment + loan.minPayment,
      0,
    ),
  );

  const roundedTotalMinPayment = computed(
    () => rawTotalMinPayment.value
      + (roundingScale.value - (rawTotalMinPayment.value % roundingScale.value)),
  );

  const totalMaxPeriods = computed(() => loans.value.reduce(
    (curMax, loan) => Math.max(curMax, loan.periodsPerYear * loan.termInYears),
    0,
  ));

  const totalMaxPeriodsPerYear = computed(
    () => loans.value.reduce((curMax, loan) => Math.max(curMax, loan.periodsPerYear), 0),
  );

  const totalMaxTermInYears = computed(
    () => loans.value.reduce((curMax, loan) => Math.max(curMax, loan.termInYears), 0),
  );

  const totalMinPayment = computed(
    () => (roundingEnabled.value ? roundedTotalMinPayment.value : rawTotalMinPayment.value),
  );

  const totalPrincipal = computed(() => loans.value.reduce(
    (totalPrincipal, loan) => totalPrincipal + loan.principal,
    0,
  ));

  const totalCurrentBalance = computed(() => loans.value.reduce(
    (totalBalance, loan) => totalBalance + loan.currentBalance,
    0,
  ));

  const totalEffectiveInterestRate = computed(() => loans.value.reduce(
    (weightedRate, loan) => weightedRate + loan.annualRate * (loan.currentBalance / totalCurrentBalance.value),
    0,
  ));

  const totalFees = computed(() => loans.value.reduce(
    (totalFees, loan) => totalFees + loan.fees,
    0,
  ));

  //

  const totalsAsALoan = computed<moneyfunx.ILoan>(() => ({
    id: constants.TOTALS,
    principal: totalPrincipal.value,
    annualRate: totalEffectiveInterestRate.value,
    periodsPerYear: totalMaxPeriodsPerYear.value,
    termInYears: totalMaxTermInYears.value,
    periodicRate: totalEffectiveInterestRate.value / 12, // not implemented for Totals as a Loan (see notes.ts)
    periods: totalMaxPeriods.value,
    minPayment: totalMinPayment.value,
    name: constants.NAME_TOTALS_AS_LOAN,
    currentBalance: totalCurrentBalance.value,
    fees: totalFees.value,
  }));

  const loansWithTotals = computed<Array<moneyfunx.ILoan>>(() => [totalsAsALoan.value, ...loans.value]);

  const getLoan = (id: string): moneyfunx.ILoan|undefined => loansWithTotals.value.find((loan) => loan.id === id);

  const monthlyBudgets = computed<Array<MonthlyBudget>>(() => ([...budgets.value, minimumBudget].map((budget) => ({
      ...budget,
      absolute: budget.relative + totalMinPayment.value,
    }))));

  const getBudget = (id: string): Budget|undefined => monthlyBudgets.value.find((budget) => budget.id === id);

  const openBudgetForm = () => {
    budgetFormActive.value = true;
  };
  const openLoanForm = () => {
    loanFormActive.value = true;
  };
  const openOptionsForm = () => {
    optionsFormActive.value = true;
  };
  const refinanceLoan = (id: string) => {
    currentLoanId.value = id;
    refinancingFormActive.value = true;
  }
  const exitBudgetForm = () => {
    budgetFormActive.value = false;
    currentBudgetId.value = null;
  };
  const exitLoanForm = () => {
    loanFormActive.value = false;
    currentLoanId.value = null;
  };
  const exitOptionsForm = () => {
    optionsFormActive.value = false;
  };
  const exitRefinancingForm = () => {
    refinancingFormActive.value = false;
    currentLoanId.value = null;
  };
  const setRoundingScale = (newScale: number) => {
    if (!Number.isNaN(newScale) && newScale > 0) {
      roundingScale.value = newScale;
    }
  };
  const toggleReducePayments = () => {
    reducePayments.value = !reducePayments.value;
  };
  const toggleRefinancingUseHighestPayment = () => {
    refinancingUseHighestPayment.value = !refinancingUseHighestPayment.value;
  };
  const toggleRounding = (scale: number) => {
    roundingEnabled.value = !roundingEnabled.value;
    if (roundingEnabled.value) {
      setRoundingScale(scale);
    }
  };
  const avalanche = (): Array<moneyfunx.Loan> => moneyfunx.sortWith(
    moneyfunx.sortWith(loans.value, moneyfunx.snowball),
    moneyfunx.avalanche,
  );
  const snowball = (): Array<moneyfunx.Loan> => moneyfunx.sortWith(
    moneyfunx.sortWith(loans.value, moneyfunx.avalanche),
    moneyfunx.snowball,
  );

  const deleteLoan = (id: string) => {
    loans.value = loans.value.filter((loan) => loan.id !== id);
  };
  const editLoan = (id: string) => {
    currentLoanId.value = id;
    openLoanForm();
  };
  const getLoanIndex = (id: string): number => loansWithTotals.value.findIndex((loan) => loan.id === id);
  const getLoanName = (id: string): string => getLoan(id)!.name
  const unviewLoan = () => {
    loanDetailsPanelActive.value = false;
    currentLoanId.value = null;
  };
  const viewLoan = (id: string) => {
    currentLoanId.value = id;
    loanDetailsPanelActive.value = true;
  };

  const refinancingScenarioPayment = (
    parentLoan: moneyfunx.ILoan,
    loan: moneyfunx.ILoan
  ): number => refinancingUseHighestPayment.value ? Math.max(loan.minPayment, parentLoan.minPayment) : loan.minPayment;

  const refinancingScenarioName = (
    parentLoanId: string,
    name: string
  ): string => name || `Scenario ${refinancingScenarios.value[parentLoanId]?.length + 1 || 1}`;

  const createRefinanceScenario = (
    parentLoanId: string,
    principal: number,
    interestRate: number,
    termInYears: number,
    name: string,
    fees: number
  ): string => {
    const loan = new moneyfunx.Loan(principal, interestRate, 12, termInYears, refinancingScenarioName(parentLoanId, name), undefined, fees);
    if (refinancingScenarios.value[parentLoanId]) {
      refinancingScenarios.value[parentLoanId].push(loan);
    } else {
      refinancingScenarios.value[parentLoanId] = [loan];
    }
    return loan.id;
  };

  const deleteRefinancingScenario = (parentLoanId: string, scenarioId: string) => {
    refinancingScenarios.value[parentLoanId] = refinancingScenarios.value[parentLoanId].filter((scenario) => scenario.id !== scenarioId)
  };

  const refinancingSchedules = computed(() => {
    const schedules = {}
    Object.entries(refinancingScenarios.value).forEach(([parentLoanId, scenarios]) => {
      const parentLoan = getLoan(parentLoanId)!;
      schedules[parentLoanId] = {};
      scenarios.forEach((scenario) => {
        const payment = refinancingScenarioPayment(parentLoan, scenario)
        const paymentSchedule = moneyfunx.payLoans(
          [scenario],
          payment,
          false,
        );
        schedules[parentLoanId][scenario.id] = { paymentAmount: payment, paymentSchedule: paymentSchedule[scenario.id] };
      });
    });
    return schedules
  });

  const deleteBudget = (id: string) => {
    budgets.value = budgets.value.filter(
      (budget) => budget.id !== id && budget.id !== constants.DEFAULT,
    );
  };
  const editBudget = (id: string) => {
    currentBudgetId.value = id;
    openBudgetForm();
  };
  const getBudgetColor = (id: string): string => constants.COLORS[getBudgetIndex(id) % constants.COLORS.length];
  const getBudgetIndex = (id: string): number => monthlyBudgets.value.findIndex((budget) => budget.id === id) + 1;
  const getBudgetName = (id: string): string => (
    id === constants.DEFAULT
      ? constants.NAME_MIN_BUDGET
      : `${constants.BUDGET} ${getBudgetIndex(id)}`
  );
  const unviewBudget = () => {
    budgetDetailsPanelActive.value = false;
    currentBudgetId.value = null;
  };
  const viewBudget = (id: string) => {
    currentBudgetId.value = id;
    budgetDetailsPanelActive.value = true;
  };

  // dependent computed values/methods

  const budgetFormTitle = computed(() => (currentBudgetId.value && budgetFormActive.value
    ? `Editing ${getBudgetName(currentBudgetId.value)}`
    : 'Creating a Budget'));

  const loanFormTitle = computed(() => (currentLoanId.value && loanFormActive.value
    ? `Editing ${getLoanName(currentLoanId.value)}`
    : 'Creating a Loan'));

  const refinancingFormTitle = computed(() => (currentLoanId.value && refinancingFormActive.value
    ? `Refinancing ${getLoanName(currentLoanId.value)}`
    : 'Refinancing'));

  const paymentScenarios = computed<Record<string, PaymentScenario>>(() => {
    const scenarios: Record<string, PaymentScenario> = {};
    monthlyBudgets.value.forEach((budget) => {
      scenarios[budget.id] = {
        paymentAmount: budget.relative,
        paymentSchedule: moneyfunx.payLoans(
          loans.value,
          budget.absolute,
          reducePayments.value,
        ),
      }
    });
    return scenarios;
  });

  const paymentSchedules = computed<Record<string, Record<string, moneyfunx.PaymentSchedule>>>(() => {
    const schedules: Record<string, Record<string, moneyfunx.PaymentSchedule>> = {};

    loansWithTotals.value.forEach((loan) => {
      schedules[loan.id] = {};
    });

    Object.keys(schedules).forEach((loanId) => {
      Object.keys(paymentScenarios.value).forEach((budgetId) => {
        const schedule = paymentScenarios.value[budgetId];
        schedules[loanId][budgetId] = {...schedule.paymentSchedule[loanId]}});
      });
    return schedules;
  });

  // dependent methods

  const sortWith = () => {
    loans.value = snowballSort.value === true ? snowball() : avalanche();
  };

  const toggleAvalancheSort = () => {
    snowballSort.value = false;
    sortWith();
  };

  const toggleSnowballSort = () => {
    snowballSort.value = true;
    sortWith();
  };

  const createBudget = (proposedBudget: number): string => {
    const budget = {
      id: String(Math.floor(Math.random() * Date.now())),
      relative: proposedBudget
    };
    if (currentBudgetId.value && currentBudgetId.value !== constants.DEFAULT) {
      deleteBudget(currentBudgetId.value);
      currentBudgetId.value = null;
    };
    budgets.value.push(budget);
    budgets.value.sort((a, b) => b.relative - a.relative);
    return budget.id
  };

  const createLoan = (
    principal: number,
    interestRate: number,
    termInYears: number,
    name: string,
    currentBalance: number,
    fees: number
  ): string => {
    const loan = new moneyfunx.Loan(principal, interestRate, 12, termInYears, name, currentBalance, fees);
    if (currentLoanId.value && currentLoanId.value !== constants.TOTALS) {
      deleteLoan(currentLoanId.value);
      currentLoanId.value = null;
    };
    loans.value.push(loan);
    sortWith();
    return loan.id;
  };

  // ease-of-use getters over computed values

  const getPaymentSchedule = (loanId: string, budgetId: string) => paymentSchedules.value[loanId][budgetId];

  const getNumPayments = (
    loanId: string,
    budgetId: string
  ): number => getPaymentSchedule(loanId, budgetId).amortizationSchedule.length;

  const getLifetimeInterest = (
    loanId: string,
    budgetId: string
  ): number => getPaymentSchedule(loanId, budgetId).lifetimeInterest;

  const getInterestUpToPeriod = (
    loanId: string,
    budgetId: string,
    period: number
  ): number => getPaymentSchedule(
    loanId,
    budgetId
  ).amortizationSchedule.slice(
    0,
    period
  ).reduce(
    (acc, record) => acc + record.interest,
    0
  );

  // title building functions

  const buildAmortizationTableTitle = (
    loan: moneyfunx.ILoan,
    monthlyBudget: MonthlyBudget
  ): string => `Amortization Table - ${getLoanName(loan.id)} | ${getBudgetName(monthlyBudget.id)}`;
  const buildAmortizationTableSubtitle = (
    loan: moneyfunx.ILoan,
    monthlyBudget: MonthlyBudget
  ): string => `(${globalOptions.Money(loan.currentBalance)} | ${globalOptions.Percent(loan.annualRate * 100)} | ${globalOptions.Money(monthlyBudget.absolute)}/month | ${getNumPayments(loan.id, monthlyBudget.id)} Payments)`;
  const buildLoanSubtitle = (
    loan: moneyfunx.ILoan
  ): string => `(${globalOptions.Money(loan.currentBalance)} | ${globalOptions.Percent(loan.annualRate * 100)} | ${loan.termInYears * loan.periodsPerYear} Payments)`;

  /** Graphing */

  const graphXScale = computed(() => globalOptions.periodsAsDates ? d3.scaleTime : d3.scaleLinear);

  // graph data

  const balancesGraphs = computed<GraphConfig>(() => {
    const config = {
      id: 'Balances',
      color: getBudgetColor,
      graphs: <Graphs>{},
      header: loanId => `Balances over Time by Budget - ${getLoanName(loanId)}`,
      lineName: getBudgetName,
      subheader: loanId => buildLoanSubtitle(getLoan(loanId)!),
      x: globalOptions.Period,
      xFormat: (x) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: y => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Balance',
      yScale: d3.scaleLinear,
    };

    loansWithTotals.value.forEach((loan) => {
      config.graphs[loan.id] = {
        config: {
          maxX: getNumPayments(loan.id, constants.DEFAULT),
          maxY: getLoan(loan.id)!.currentBalance,
        },
        lines: <Record<string, Point[]>>{},
      };
      monthlyBudgets.value.forEach((budget) => {
        const line: Point[] = [];
        getPaymentSchedule(loan.id, budget.id).amortizationSchedule.forEach((record: moneyfunx.PaymentRecord) => {
          line.push({ x: record.period, y: record.principalRemaining });
        });
        config.graphs[loan.id].lines[budget.id] = line;
      });
    });
    return config;
  });

  const interestSavedGraphs = computed<GraphConfig>(() => {
    const config = {
      id: 'InterestSaved',
      color: getBudgetColor,
      graphs: <Graphs>{},
      header: loanId => `Interest Saved over Time by Budget - ${getLoanName(loanId)}`,
      lineName: getBudgetName,
      subheader: loanId => buildLoanSubtitle(getLoan(loanId)!),
      x: globalOptions.Period,
      xFormat: (x) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: y => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Interest Saved',
      yScale: d3.scaleLinear,
    };

    loansWithTotals.value.forEach((loan) => {
      config.graphs[loan.id] = {
        config: {
          maxX: getNumPayments(loan.id, constants.DEFAULT),
          maxY: getLifetimeInterest(loan.id, constants.DEFAULT),
        },
        lines: <Record<string, Point[]>>{},
      }
      monthlyBudgets.value.forEach((budget) => {
        const line: Point[] = [];
        getPaymentSchedule(loan.id, constants.DEFAULT).amortizationSchedule.forEach((record, index) => {
          line.push({
            x: record.period,
            y: getInterestUpToPeriod(loan.id, constants.DEFAULT, index) -
              getInterestUpToPeriod(loan.id, budget.id, index)
          });
        });
        config.graphs[loan.id].lines[budget.id] = line;
      });
    });
    return config;
  });

  const percentOfPaymentAsPrincaplGraphs = computed<GraphConfig>(() => {
    const config = {
      id: 'globalOptions.PercentOfPaymentAsPrincipal',
      color: getBudgetColor,
      graphs: <Graphs>{},
      header: loanId => `globalOptions.Percent of Payment as Principal over Time by Budget - ${getLoanName(loanId)}`,
      lineName: getBudgetName,
      subheader: loanId => buildLoanSubtitle(getLoan(loanId)!),
      x: globalOptions.Period,
      xFormat: (x) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: y => y,
      yLabel: () => 'globalOptions.Percent to Principal',
      yFormat: globalOptions.Percent,
      yScale: d3.scaleLinear,
    };

    loansWithTotals.value.forEach((loan) => {
      config.graphs[loan.id] = <Graph>{
        config: {
          maxX: getNumPayments(loan.id, constants.DEFAULT),
          maxY: 100,
        },
        lines: <Record<string, Point[]>>{},
      }
      monthlyBudgets.value.forEach((budget) => {
        const line: Point[] = [];
        getPaymentSchedule(loan.id, budget.id).amortizationSchedule.forEach((record) => {
          line.push({ x: record.period, y: (record.principal * 100) / (record.principal + record.interest) });
        });
        config.graphs[loan.id].lines[budget.id] = line;
      });
    });
    return config;
  });

  const graphs = computed(() => ({
    [constants.GRAPH_BALANCES_OVER_TIME]: balancesGraphs.value,
    [constants.GRAPH_INTEREST_SAVED_OVER_TIME]: interestSavedGraphs.value,
    [constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL]: percentOfPaymentAsPrincaplGraphs.value,
  }));

  return {
    avalanche,
    budgetDetailsPanelActive,
    budgetFormActive,
    budgetFormTitle,
    budgets,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildLoanSubtitle,
    clearState,
    createBudget,
    createLoan,
    createRefinanceScenario,
    currentBudgetId,
    currentLoanId,
    deleteBudget,
    deleteLoan,
    deleteRefinancingScenario,
    editBudget,
    editLoan,
    exitBudgetForm,
    exitLoanForm,
    exitOptionsForm,
    exitRefinancingForm,
    exportState,
    getBudget,
    getBudgetColor,
    getBudgetIndex,
    getBudgetName,
    getLifetimeInterest,
    getLoan,
    getLoanIndex,
    getLoanName,
    getNumPayments,
    getPaymentSchedule,
    graphs,
    graphXScale,
    loadState,
    loanDetailsPanelActive,
    loanFormActive,
    loanFormTitle,
    loans,
    loansWithTotals,
    monthlyBudgets,
    openBudgetForm,
    openLoanForm,
    openOptionsForm,
    refinanceLoan,
    optionsFormActive,
    paymentScenarios,
    paymentSchedules,
    percentOfPaymentAsPrincaplGraphs,
    rawTotalMinPayment,
    reducePayments,
    refinancingFormActive,
    refinancingFormTitle,
    refinancingScenarios,
    refinancingSchedules,
    refinancingUseHighestPayment,
    roundedTotalMinPayment,
    roundingEnabled,
    roundingScale,
    saveState,
    setRoundingScale,
    snowball,
    snowballSort,
    sortWith,
    toggleAvalancheSort,
    toggleReducePayments,
    toggleRefinancingUseHighestPayment,
    toggleRounding,
    toggleSnowballSort,
    totalCurrentBalance,
    totalEffectiveInterestRate,
    totalFees,
    totalMaxPeriods,
    totalMaxPeriodsPerYear,
    totalMaxTermInYears,
    totalMinPayment,
    totalPrincipal,
    totalsAsALoan,
    unviewBudget,
    unviewLoan,
    viewBudget,
    viewLoan,
  };
});
