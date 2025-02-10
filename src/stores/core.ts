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
import {
  Graph,
  GraphConfig,
  Graphs,
  Point,
} from '../types/graph';

export default defineStore('core', () => {
  const budgetDetailsPanelActive = ref<boolean>(false);
  const budgetFormActive = ref<boolean>(false);
  const budgets = ref<Array<Budget>>([]);
  const currencies = [...new Set(Object.values(constants.LOCALE_CURRENCY))];
  const currency = ref(constants.LOCALE_CURRENCY[navigator.language] || 'USD');
  const currentBudgetId = ref<string|null>(null);
  const currentLoanId = ref<string|null>(null);
  const language = ref(navigator.language);
  const languages = [...new Set(Object.keys(constants.LOCALE_CURRENCY))];
  const loanDetailsPanelActive = ref(false);
  const loanFormActive = ref<boolean>(false);
  const loans = ref<Array<moneyfunx.Loan>>([]);
  const minimumBudget: Budget = {id: constants.DEFAULT, relative: 0};
  const optionsFormActive = ref<boolean>(false);
  const periodsAsDates = ref<boolean>(false);
  const reducePayments = ref<boolean>(false);
  const refinancingFormActive = ref<boolean>(false);
  const refinancingScenarios = ref<Record<string, moneyfunx.Loan[]>>({});
  const refinancingUseHighestPayment = ref<boolean>(false);
  const roundingEnabled = ref<boolean>(false);
  const roundingScale = ref<number>(100);
  const snowballSort = ref<boolean>(false);

  // primitive computed values/methods

  const clearState = () => {
    budgetDetailsPanelActive.value = false;
    budgetFormActive.value = false;
    budgets.value = [];
    currency.value = constants.LOCALE_CURRENCY[navigator.language];
    currentBudgetId.value = null;
    currentLoanId.value = null;
    language.value = navigator.language;
    loanDetailsPanelActive.value = false;
    loanFormActive.value = false;
    loans.value = [];
    optionsFormActive.value = false;
    periodsAsDates.value = false;
    reducePayments.value = false;
    refinancingFormActive.value = false;
    refinancingScenarios.value = {};
    refinancingUseHighestPayment.value = false;
    roundingEnabled.value = false;
    roundingScale.value = 100;
    snowballSort.value = true;
  };
  const loadState = () => {
    budgets.value = JSON.parse(localStorage.getItem(keys.LS_BUDGETS)!);
    currency.value = JSON.parse(localStorage.getItem(keys.LS_CURRENCY)!);
    language.value = JSON.parse(localStorage.getItem(keys.LS_LANGUAGE)!);
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
    periodsAsDates.value = JSON.parse(
      localStorage.getItem(keys.LS_PERIODS_AS_DATES)!,
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
    localStorage.setItem(keys.LS_BUDGETS, JSON.stringify(budgets.value));
    localStorage.setItem(keys.LS_CURRENCY, JSON.stringify(currency.value));
    localStorage.setItem(keys.LS_LANGUAGE, JSON.stringify(language.value));
    localStorage.setItem(keys.LS_LOANS, JSON.stringify(loans.value));
    localStorage.setItem(
      keys.LS_PERIODS_AS_DATES,
      JSON.stringify(periodsAsDates.value),
    );
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
    [keys.LS_BUDGETS]: budgets.value,
    [keys.LS_CURRENCY]: currency.value,
    [keys.LS_LANGUAGE]: language.value,
    [keys.LS_LOANS]: loans.value,
    [keys.LS_PERIODS_AS_DATES]: periodsAsDates.value,
    [keys.LS_REDUCE_PAYMENTS]: reducePayments.value,
    [keys.LS_REFINANCING_USE_HIGHEST_PAYMENT]: refinancingUseHighestPayment.value,
    [keys.LS_ROUNDING_ENABLED]: roundingEnabled.value,
    [keys.LS_ROUNDING_SCALE]: roundingScale.value,
    [keys.LS_SNOWBALL_SORT]: snowballSort.value,
  });

  const baseDate = ref(Date.now());

  const Money = (amount: number): string => (
    Intl.NumberFormat(
      language.value,
      {
        style: 'currency',
        currency: currency.value,
      },
    ).format(amount)
  );

  const Percent = (amount: number): string => (
    Intl.NumberFormat(
      language.value,
      {
        style: 'unit',
        unit: 'percent',
        maximumFractionDigits: 2,
      },
    ).format(amount)
  );

  const Period = (period: number, asStr: boolean=false) => {
    if (periodsAsDates.value) {
      const date = new Date(baseDate.value);
      const relativeDate = new Date(
        date.getFullYear(),
        date.getMonth() + period,
        date.getDate(),
      );
      return asStr ? relativeDate.toLocaleDateString(language.value) : relativeDate;
    }
    return period;
  };

  const Time = computed(() => periodsAsDates.value ? constants.DATE : constants.PERIOD)

  const currencySymbol = computed(() => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.value,
    }).format(1);

    const match = formatted.match(/[\p{Sc}]+/u);

    return match ? match[0] : '$';
  });

  const rawGlobalMinPayment = computed(
    () => loans.value.reduce(
      (minPayment, loan) => minPayment + loan.minPayment,
      0,
    ),
  );

  const roundedGlobalMinPayment = computed(
    () => rawGlobalMinPayment.value
      + (roundingScale.value - (rawGlobalMinPayment.value % roundingScale.value)),
  );

  const globalMaxPeriods = computed(() => loans.value.reduce(
    (curMax, loan) => Math.max(curMax, loan.periodsPerYear * loan.termInYears),
    0,
  ));

  const globalMaxPeriodsPerYear = computed(
    () => loans.value.reduce((curMax, loan) => Math.max(curMax, loan.periodsPerYear), 0),
  );

  const globalMaxTermInYears = computed(
    () => loans.value.reduce((curMax, loan) => Math.max(curMax, loan.termInYears), 0),
  );

  const globalMinPayment = computed(
    () => (roundingEnabled.value ? roundedGlobalMinPayment.value : rawGlobalMinPayment.value),
  );

  const globalPrincipal = computed(() => loans.value.reduce(
    (totalPrincipal, loan) => totalPrincipal + loan.principal,
    0,
  ));

  const globalCurrentBalance = computed(() => loans.value.reduce(
    (totalBalance, loan) => totalBalance + loan.currentBalance,
    0,
  ));

  const globalEffectiveInterestRate = computed(() => loans.value.reduce(
    (weightedRate, loan) => weightedRate + loan.annualRate * (loan.currentBalance / globalCurrentBalance.value),
    0,
  ));

  const globalFees = computed(() => loans.value.reduce(
    (totalFees, loan) => totalFees + loan.fees,
    0,
  ));

  const totalsAsALoan = computed<moneyfunx.ILoan>(() => ({
    id: constants.TOTALS,
    principal: globalPrincipal.value,
    annualRate: globalEffectiveInterestRate.value,
    periodsPerYear: globalMaxPeriodsPerYear.value,
    termInYears: globalMaxTermInYears.value,
    periodicRate: globalEffectiveInterestRate.value / 12, // not implemented for Totals as a Loan (see notes.ts)
    periods: globalMaxPeriods.value,
    minPayment: globalMinPayment.value,
    name: constants.NAME_TOTALS_AS_LOAN,
    currentBalance: globalCurrentBalance.value,
    fees: globalFees.value,
  }));

  const loansWithTotals = computed<Array<moneyfunx.ILoan>>(() => [totalsAsALoan.value, ...loans.value]);

  const getLoan = (id: string): moneyfunx.ILoan|undefined => loansWithTotals.value.find((loan) => loan.id === id);

  const monthlyBudgets = computed<Array<MonthlyBudget>>(() => ([...budgets.value, minimumBudget].map((budget) => ({
      ...budget,
      absolute: budget.relative + globalMinPayment.value,
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
  const setCurrency = (newCurrency: string) => {
    currency.value = newCurrency;
  };
  const setLanguage = (newLanguage: string) => {
    language.value = newLanguage;
  };
  const setRoundingScale = (newScale: number) => {
    if (!Number.isNaN(newScale) && newScale > 0) {
      roundingScale.value = newScale;
    }
  };
  const togglePeriodsAsDates = () => {
    periodsAsDates.value = !periodsAsDates.value;
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
  const avalanche = (): Array<moneyfunx.Loan> => moneyfunx.sortLoans(
    moneyfunx.sortLoans(loans.value, moneyfunx.snowball),
    moneyfunx.avalanche,
  );
  const snowball = (): Array<moneyfunx.Loan> => moneyfunx.sortLoans(
    moneyfunx.sortLoans(loans.value, moneyfunx.avalanche),
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
    exitRefinancingForm();
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

  const sortLoans = () => {
    loans.value = snowballSort.value === true ? snowball() : avalanche();
  };
  const toggleAvalancheSort = () => {
    snowballSort.value = false;
    sortLoans();
  };
  const toggleSnowballSort = () => {
    snowballSort.value = true;
    sortLoans();
  };
  const createBudget = (proposedBudget: number) => {
    if (currentBudgetId.value && currentBudgetId.value !== constants.DEFAULT) {
      deleteBudget(currentBudgetId.value);
      currentBudgetId.value = null;
    }
    budgets.value.push({
      id: String(Math.floor(Math.random() * Date.now())),
      relative: proposedBudget
    });
    budgets.value.sort((a, b) => b.relative - a.relative);
    exitBudgetForm();
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
    }
    loans.value.push(loan);
    sortLoans();
    exitLoanForm();
    return loan.id;
  };

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
  ): string => `(${Money(loan.currentBalance)} | ${Percent(loan.annualRate * 100)} | ${Money(monthlyBudget.absolute)}/month | ${getNumPayments(loan.id, monthlyBudget.id)} Payments)`;
  const buildLoanSubtitle = (
    loan: moneyfunx.ILoan
  ): string => `(${Money(loan.currentBalance)} | ${Percent(loan.annualRate * 100)} | ${loan.termInYears * loan.periodsPerYear} Payments)`;

  // graph data

  const graphXScale = computed(() => periodsAsDates.value ? d3.scaleTime : d3.scaleLinear);

  const balancesGraphs = computed<GraphConfig>(() => {
    const config = {
      id: 'Balances',
      color: getBudgetColor,
      graphs: <Graphs>{},
      header: loanId => `Balances over Time by Budget - ${getLoanName(loanId)}`,
      lineName: getBudgetName,
      subheader: loanId => buildLoanSubtitle(getLoan(loanId)!),
      x: Period,
      xFormat: (x) => Period(x, true),
      xLabel: () => Time,
      xScale: graphXScale.value,
      y: y => y,
      yFormat: Money,
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
        getPaymentSchedule(loan.id, budget.id).amortizationSchedule.forEach((record: moneyfunx.AmortizationRecord) => {
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
      x: Period,
      xFormat: (x) => Period(x, true),
      xLabel: () => Time,
      xScale: graphXScale.value,
      y: y => y,
      yFormat: Money,
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
      id: 'PercentOfPaymentAsPrincipal',
      color: getBudgetColor,
      graphs: <Graphs>{},
      header: loanId => `Percent of Payment as Principal over Time by Budget - ${getLoanName(loanId)}`,
      lineName: getBudgetName,
      subheader: loanId => buildLoanSubtitle(getLoan(loanId)!),
      x: Period,
      xFormat: (x) => Period(x, true),
      xLabel: () => Time,
      xScale: graphXScale.value,
      y: y => y,
      yLabel: () => 'Percent to Principal',
      yFormat: Percent,
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
    baseDate,
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
    currencies,
    currency,
    currencySymbol,
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
    globalCurrentBalance,
    globalEffectiveInterestRate,
    globalFees,
    globalMaxPeriods,
    globalMaxPeriodsPerYear,
    globalMaxTermInYears,
    globalMinPayment,
    globalPrincipal,
    graphs,
    graphXScale,
    language,
    languages,
    loadState,
    loanDetailsPanelActive,
    loanFormActive,
    loanFormTitle,
    loans,
    loansWithTotals,
    Money,
    monthlyBudgets,
    openBudgetForm,
    openLoanForm,
    openOptionsForm,
    refinanceLoan,
    optionsFormActive,
    paymentScenarios,
    paymentSchedules,
    Percent,
    percentOfPaymentAsPrincaplGraphs,
    Period,
    periodsAsDates,
    rawGlobalMinPayment,
    reducePayments,
    refinancingFormActive,
    refinancingFormTitle,
    refinancingScenarios,
    refinancingSchedules,
    refinancingUseHighestPayment,
    roundedGlobalMinPayment,
    roundingEnabled,
    roundingScale,
    saveState,
    setCurrency,
    setLanguage,
    setRoundingScale,
    snowball,
    snowballSort,
    sortLoans,
    Time,
    toggleAvalancheSort,
    togglePeriodsAsDates,
    toggleReducePayments,
    toggleRefinancingUseHighestPayment,
    toggleRounding,
    toggleSnowballSort,
    totalsAsALoan,
    unviewBudget,
    unviewLoan,
    viewBudget,
    viewLoan,
  };
});
