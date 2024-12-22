import * as d3 from 'd3';
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import constants from '../constants/constants';
import keys from '../constants/keys';

export default defineStore('core', () => {
  const budgetDetailsPanelActive = ref(false);
  const budgets = ref([]);
  const budgetFormActive = ref(false);
  const loanFormActive = ref(false);
  const currencies = ref([...new Set(Object.values(constants.LOCALE_CURRENCY))]);
  const currency = ref(constants.LOCALE_CURRENCY[navigator.language] || 'USD');
  const currentBudgetId = ref(null);
  const currentLoanId = ref(null);
  const language = ref(navigator.language);
  const languages = ref([...new Set(Object.keys(constants.LOCALE_CURRENCY))]);
  const loanDetailsPanelActive = ref(false);
  const loans = ref([]);
  const optionsFormActive = ref(false);
  const periodsAsDates = ref(false);
  const reducePayments = ref(false);
  const refinancingFormActive = ref(false);
  const refinancingScenarios = ref({});
  const roundingScale = ref(100);
  const roundUp = ref(false);
  const snowballSort = ref(false);

  // primitive computed values/methods

  const baseDate = computed(() => Date.now());

  const Money = (amount) => (
    Intl.NumberFormat(
      language.value,
      {
        style: 'currency',
        currency: currency.value,
      },
    ).format(amount)
  );

  const Percent = (value) => (
    Intl.NumberFormat(
      language.value,
      {
        style: 'unit',
        unit: 'percent',
        maximumFractionDigits: 2,
      },
    ).format(value)
  );

  const Period = (period, asStr = false) => {
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
  }
  );

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
    () => (roundUp.value ? roundedGlobalMinPayment.value : rawGlobalMinPayment.value),
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

  const totalsAsALoan = computed(() => ({
    id: constants.TOTALS,
    principal: globalPrincipal.value,
    annualRate: globalEffectiveInterestRate.value,
    periodsPerYear: globalMaxPeriodsPerYear.value,
    termInYears: globalMaxTermInYears.value,
    periodicRate: null, // not implemented for Totals as a Loan (see notes.ts)
    periods: globalMaxPeriods.value,
    minPayment: globalMinPayment.value,
    name: constants.NAME_TOTALS_AS_LOAN,
    currentBalance: globalCurrentBalance.value,
  }));

  const loansWithTotals = computed(() => [totalsAsALoan.value, ...loans.value]);

  const getLoan = (id) => loansWithTotals.value.find((loan) => loan.id === id);

  const minimumBudget = computed(() => ({
    id: constants.DEFAULT,
    relative: 0,
    absolute: globalMinPayment.value,
  }));

  const monthlyBudgets = computed(() => {
    const budgetsArray = budgets.value.map((budget) => ({
      id: String(Math.floor(Math.random() * Date.now())),
      relative: budget,
      absolute: budget + globalMinPayment.value,
    }));

    budgetsArray.push(minimumBudget.value);

    return budgetsArray;
  });

  const getBudget = (id) => monthlyBudgets.value.find((budget) => budget.id === id);

  const openBudgetForm = () => {
    budgetFormActive.value = true;
  };
  const openLoanForm = () => {
    loanFormActive.value = true;
  };
  const openOptionsForm = () => {
    optionsFormActive.value = true;
  };
  const openRefinancingForm = (id) => {
    currentLoanId.value = id;
    refinancingFormActive.value = true;
  };
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
  const setCurrency = (newValue) => {
    currency.value = newValue;
  };
  const setLanguage = (newValue) => {
    language.value = newValue;
  };
  const setRoundingScale = (newValue) => {
    if (Number.isNaN(newValue) && newValue > 0) {
      roundingScale.value = newValue;
    }
  };
  const togglePeriodsAsDates = () => {
    periodsAsDates.value = !periodsAsDates.value;
  };
  const toggleReducePayments = () => {
    reducePayments.value = !reducePayments.value;
  };
  const toggleRounding = (scale) => {
    roundUp.value = !roundUp.value;
    if (roundUp.value) {
      setRoundingScale(scale);
    }
  };
  const avalanche = () => moneyfunx.sortLoans(
    moneyfunx.sortLoans(loans.value, moneyfunx.snowball),
    moneyfunx.avalanche,
  );
  const snowball = () => moneyfunx.sortLoans(
    moneyfunx.sortLoans(loans.value, moneyfunx.avalanche),
    moneyfunx.snowball,
  );

  const deleteLoan = (id) => {
    loans.value = loans.value.filter((loan) => loan.id !== id);
  };
  const editLoan = (id) => {
    currentLoanId.value = id;
    openLoanForm();
  };
  const getLoanIndex = (id) => loansWithTotals.value.findIndex((loan) => loan.id === id);
  const getLoanName = (id) => (
    getLoan(id).name || `${constants.LOAN} ${getLoanIndex(id)}`
  );
  const loanRefinanceScenarioName = (id) => `${getLoanName(id)} - Refinance Scenario ${refinancingScenarios[id]?.length + 1 || 1}`;
  const viewLoan = (id) => {
    currentLoanId.value = id;
    loanDetailsPanelActive.value = true;
  };
  const refinanceLoan = (loanId, principal, interestRate, termInYears, fees) => {
    const refinancedLoan = new moneyfunx.Loan(principal, interestRate, 12, termInYears, loanRefinanceScenarioName(loanId));
    exitRefinancingForm();
  };
  const unviewLoan = () => {
    loanDetailsPanelActive.value = false;
    currentLoanId.value = null;
  };

  const deleteBudget = (id) => {
    const monthlyBudget = monthlyBudgets.value.find((budget) => budget.id === id);
    budgets.value = budgets.value.filter(
      (budget) => budget !== monthlyBudget.relative,
    );
  };
  const editBudget = (id) => {
    currentBudgetId.value = id;
    openBudgetForm();
  };
  const getBudgetIndex = (id) => monthlyBudgets.value.findIndex((budget) => budget.id === id) + 1;
  const getBudgetName = (id) => (
    id === constants.DEFAULT
      ? constants.NAME_MIN_BUDGET
      : `${constants.BUDGET} ${getBudgetIndex(id)}`
  );
  const viewBudget = (id) => {
    currentBudgetId.value = id;
    budgetDetailsPanelActive.value = true;
  };
  const unviewBudget = () => {
    budgetDetailsPanelActive.value = false;
    currentBudgetId.value = null;
  };

  const clearState = () => {
    budgets.value = [];
    budgetFormActive.value = false;
    loanFormActive.value = false;
    currency.value = constants.LOCALE_CURRENCY[navigator.language];
    currentBudgetId.value = null;
    currentLoanId.value = null;
    language.value = navigator.language;
    loans.value = [];
    periodsAsDates.value = false;
    reducePayments.value = false;
    roundUp.value = false;
    budgetDetailsPanelActive.value = false;
    loanDetailsPanelActive.value = false;
    snowballSort.value = true;
  };
  const loadState = () => {
    budgets.value = JSON.parse(localStorage.getItem(keys.LS_BUDGETS));
    currency.value = JSON.parse(localStorage.getItem(keys.LS_CURRENCY));
    language.value = JSON.parse(localStorage.getItem(keys.LS_LANGUAGE));
    loans.value = JSON.parse(localStorage.getItem(keys.LS_LOANS)).map(
      (loan) => new moneyfunx.Loan(
        loan.principal,
        loan.annualRate,
        12,
        loan.termInYears,
        loan.name,
        loan.currentBalance,
      ),
    );
    periodsAsDates.value = JSON.parse(
      localStorage.getItem(keys.LS_PERIODS_AS_DATES),
    );
    reducePayments.value = JSON.parse(
      localStorage.getItem(keys.LS_REDUCE_PAYMENTS),
    );
    roundUp.value = JSON.parse(localStorage.getItem(keys.LS_ROUND_UP));
    roundingScale.value = JSON.parse(localStorage.getItem(keys.LS_ROUNDING_SCALE));
    snowballSort.value = JSON.parse(
      localStorage.getItem(keys.LS_SNOWBALL_SORT),
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
    localStorage.setItem(keys.LS_ROUND_UP, JSON.stringify(roundUp.value));
    localStorage.setItem(keys.LS_ROUNDING_SCALE, JSON.stringify(roundingScale.value));
    localStorage.setItem(
      keys.LS_SNOWBALL_SORT,
      JSON.stringify(snowballSort.value),
    );
  };
  const exportState = () => {
    saveState();
    navigator.clipboard
      .writeText(
        JSON.stringify(
          {
            [keys.LS_BUDGETS]: budgets.value,
            [keys.LS_CURRENCY]: currency.value,
            [keys.LS_LANGUAGE]: language.value,
            [keys.LS_LOANS]: loans.value,
            [keys.LS_PERIODS_AS_DATES]: periodsAsDates.value,
            [keys.LS_REDUCE_PAYMENTS]: reducePayments.value,
            [keys.LS_ROUND_UP]: roundUp.value,
            [keys.LS_ROUNDING_SCALE]: roundingScale.value,
            [keys.LS_SNOWBALL_SORT]: snowballSort.value,
          }
        )
      )
    }

  // dependent computed values/methods
  const budgetFormTitle = computed(() => (currentBudgetId.value
    ? `Editing ${getBudgetName(currentBudgetId.value)}`
    : 'Creating a Budget'));

  const loanFormTitle = computed(() => (currentLoanId.value
    ? `Editing ${getLoanName(currentLoanId.value)}`
    : 'Creating a Loan'));

  const refinancingFormTitle = computed(() => (currentLoanId.value
    ? `Refinancing ${getLoanName(currentLoanId.value)}`
    : 'Refinancing'));

  const createBudgetButtonText = computed(() => (
    currentBudgetId.value
      ? constants.BTN_SAVE
      : constants.BTN_CREATE
  ));

  const createLoanButtonText = computed(
    () => (currentLoanId.value ? constants.BTN_SAVE : constants.BTN_CREATE),
  );


  const paymentSchedules = computed(() => {
    const schedules = {};
    monthlyBudgets.value.forEach((budget) => {
      schedules[budget.id] = {
        paymentAmount: budget.relative,
        paymentSchedule: moneyfunx.payLoans(
          loans.value,
          budget.absolute,
          reducePayments.value,
        ),
        label:
          budget.id === constants.DEFAULT
            ? `${Money(globalMinPayment.value)}/month`
            : `${Money(budget.absolute)}/month (+${Money(budget.relative)}/month)`,
      }
    });
    return schedules;
  });

  const totalsByBudget = computed(() => {
    const totals = {};
    monthlyBudgets.value.forEach((budget) => {
      totals[budget.id] = paymentSchedules.value[budget.id].paymentSchedule.totals;
    });
    return totals;
  });

  const paymentSummaries = computed(() => {
    const summaries = {};

    loansWithTotals.value.forEach((loan) => {
      summaries[loan.id] = {};
    });

    Object.keys(summaries).forEach((loanId) => {
      Object.keys(paymentSchedules.value).forEach((budgetId) => {
        const schedule = paymentSchedules.value[budgetId];
        summaries[loanId][budgetId] = {
          label: schedule.label,
          amortizationSchedule:
            schedule.paymentSchedule[loanId].amortizationSchedule,
          totalPrincipalPaid: schedule.paymentSchedule[loanId].lifetimePrincipal,
          totalInterestPaid: schedule.paymentSchedule[loanId].lifetimeInterest,
          totalPayments: schedule.paymentSchedule[loanId].amortizationSchedule.length,
        }});
      });
    return summaries;
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
  const createBudget = (proposedBudget) => {
    if (currentBudgetId.value && currentBudgetId.value !== constants.DEFAULT) {
      deleteBudget(currentBudgetId.value);
      currentBudgetId.value = null;
    }
    budgets.value.push(proposedBudget);
    budgets.value.sort((a, b) => b - a);
    exitBudgetForm();
  };
  const createLoan = (principal, interestRate, termInYears, name, currentBalance) => {
    const newLoan = new moneyfunx.Loan(principal, interestRate, 12, termInYears, name, currentBalance);
    if (currentLoanId.value && currentLoanId.value !== constants.TOTALS) {
      deleteLoan(currentLoanId.value);
      currentLoanId.value = null;
    }
    loans.value.push(newLoan);
    sortLoans();
    exitLoanForm();
  };

  const getPaymentSummary = (loanId, budgetId) => paymentSummaries.value[loanId][budgetId];
  const getNumPayments = (loanId, budgetId) => getPaymentSummary(loanId, budgetId).totalPayments;
  const getLifetimeInterest = (loanId, budgetId) => getPaymentSummary(loanId, budgetId).totalInterestPaid;
  const getInterestUpToPeriod = (loanId, budgetId, period) => getPaymentSummary(loanId, budgetId).amortizationSchedule.slice(0, period).reduce((acc, record) => acc + record.interest, 0);

  // title building functions

  const buildBudgetDetailsTitle = (monthlyBudget) => `Budget Details - ${getBudgetName(monthlyBudget.id)} | `
    + `${Money(monthlyBudget.absolute)}/month `
    + `(+${Money(monthlyBudget.relative)}/month)`;
  const buildLoanDetailsTitle = (loan) => `Loan Details - ${getLoanName(loan.id)} | `
    + `(${Money(loan.currentBalance)} `
    + `@ ${Percent(loan.annualRate * 100)})`;

  const buildAmortizationTableTitle = (loan, monthlyBudget) => `Amortization Table - ${getLoanName(loan.id)} | ${getBudgetName(monthlyBudget.id)}`;
  const buildAmortizationTableSubtitle = (loan, monthlyBudget) => `(${Money(loan.currentBalance)} | ${Percent(loan.annualRate * 100)} | ${Money(monthlyBudget.absolute)}/month | ${getNumPayments(loan.id, monthlyBudget.id)} Payments)`;
  const buildInterestTableTitle = (loan) => `Interest Table - ${getLoanName(loan.id)}`;
  const buildLoanSubtitle = (loan) => `(${Money(loan.currentBalance)} | ${Percent(loan.annualRate * 100)})`;

  // graph data

  const balancesGraphs = computed(() => {
    const config = {
      id: 'Balances',
      graphs: {},
      x: Period,
      xScale: periodsAsDates.value ? d3.scaleTime : d3.scaleLinear,
      y: y => y,
      yFormat: Money,
      yLabel: 'Balance',
      yScale: d3.scaleLinear,
      lineLabel: constants.BUDGET,
      lineName: getBudgetName,
    };

    loansWithTotals.value.forEach((loan) => {
      config.graphs[loan.id] = {
        config: {
          maxX: getNumPayments(loan.id, constants.DEFAULT),
          maxY: getLoan(loan.id).currentBalance,
          header: `Balances Over Time By Budget - ${getLoanName(loan.id)}`,
          subheader: buildLoanSubtitle(loan),
        },
        lines: {},
      };
    });

    Object.keys(config.graphs).forEach((loanId) => {
      Object.entries(paymentSchedules.value).forEach(([budgetId, schedule]) => {
        console.log(`Budget ID ${budgetId}`);
        console.log(`Schedule ${schedule}`);
        const line = [];
        schedule.paymentSchedule[loanId].amortizationSchedule.forEach((record) => {
          line.push({ x: record.period, y: record.principalRemaining });
        });
        config.graphs[loanId].lines[budgetId] = line;
      });
    });
    return config;
  });

  const percentOfPaymentAsPrincaplGraphs = computed(() => {
    const config = {
      id: 'PercentOfPaymentAsPrincipal',
      graphs: {},
      x: Period,
      xScale: periodsAsDates.value ? d3.scaleTime : d3.scaleLinear,
      y: y => y,
      yLabel: 'Percent to Principal',
      yFormat: Percent,
      yScale: d3.scaleLinear,
      lineLabel: constants.BUDGET,
      lineName: getBudgetName,
    };

    loansWithTotals.value.forEach((loan) => {
      config.graphs[loan.id] = {
        config: {
          maxX: getNumPayments(loan.id, constants.DEFAULT),
          maxY: 100,
          header: `Percent of Payment As Principal Over Time By Budget - ${getLoanName(loan.id)}`,
          subheader: buildLoanSubtitle(loan),
        },
        lines: {},
      }
    });

    Object.keys(config.graphs).forEach((loanId) => {
      Object.entries(paymentSchedules.value).forEach(([budgetId, schedule]) => {
        const line = [];
        schedule.paymentSchedule[loanId].amortizationSchedule.forEach((record) => {
          line.push({ x: record.period, y: (record.principal * 100) / (record.principal + record.interest) });
        });
        config.graphs[loanId].lines[budgetId] = line;
      });
    });
    return config;
  });

  const interestSavedGraphs = computed(() => {
    const config = {
      id: 'InterestSaved',
      graphs: {},
      x: Period,
      xScale: periodsAsDates.value ? d3.scaleTime : d3.scaleLinear,
      y: y => y,
      yFormat: Money,
      yLabel: 'Interest Saved',
      yScale: d3.scaleLinear,
      lineLabel: constants.BUDGET,
      lineName: getBudgetName,
    };

    loansWithTotals.value.forEach((loan) => {
      config.graphs[loan.id] = {
        config: {
          maxX: getNumPayments(loan.id, constants.DEFAULT),
          maxY: getLifetimeInterest(loan.id, constants.DEFAULT),
          header: `Interest Saved Over Time By Budget - ${getLoanName(loan.id)}`,
          subheader: buildLoanSubtitle(loan),
        },
        lines: {},
      }
    });

    Object.keys(config.graphs).forEach((loanId) => {
      Object.keys(paymentSchedules.value).forEach((budgetId) => {
        const line = [];
        getPaymentSummary(loanId, constants.DEFAULT).amortizationSchedule.forEach((record, index) => {
          line.push({ x: record.period, y: getInterestUpToPeriod(loanId, constants.DEFAULT, index) - getInterestUpToPeriod(loanId, budgetId, index) });
        });
        config.graphs[loanId].lines[budgetId] = line;
      });
    });
    return config;
  });

  const graphs = computed(() => ({
    [constants.GRAPH_BALANCES_OVER_TIME]: balancesGraphs.value,
    [constants.GRAPH_INTEREST_SAVED_OVER_TIME]: interestSavedGraphs.value,
    [constants.GRAPH_PERCENT_OF_PAYMENT_TO_PRINCIPAL]: percentOfPaymentAsPrincaplGraphs.value,
  }));

  return {
    avalanche,
    baseDate,
    budgetDetailsPanelActive,
    budgets,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildBudgetDetailsTitle,
    buildLoanSubtitle,
    buildInterestTableTitle,
    buildLoanDetailsTitle,
    clearState,
    createBudget,
    createBudgetButtonText,
    budgetFormActive,
    budgetFormTitle,
    createLoan,
    createLoanButtonText,
    loanFormActive,
    loanFormTitle,
    currencies,
    currency,
    currencySymbol,
    currentBudgetId,
    currentLoanId,
    deleteBudget,
    deleteLoan,
    editBudget,
    editLoan,
    exitBudgetForm,
    exitLoanForm,
    exitOptionsForm,
    exitRefinancingForm,
    exportState,
    Period,
    getBudget,
    getBudgetIndex,
    getBudgetName,
    getLifetimeInterest,
    getLoan,
    getLoanIndex,
    getLoanName,
    getNumPayments,
    getPaymentSummary,
    globalCurrentBalance,
    globalEffectiveInterestRate,
    globalMaxPeriods,
    globalMaxPeriodsPerYear,
    globalMaxTermInYears,
    globalMinPayment,
    globalPrincipal,
    graphs,
    language,
    languages,
    loadState,
    loanDetailsPanelActive,
    loans,
    loansWithTotals,
    minimumBudget,
    Money,
    monthlyBudgets,
    openBudgetForm,
    openLoanForm,
    openOptionsForm,
    openRefinancingForm,
    optionsFormActive,
    paymentSchedules,
    paymentSummaries,
    Percent,
    percentOfPaymentAsPrincaplGraphs,
    periodsAsDates,
    rawGlobalMinPayment,
    reducePayments,
    refinanceLoan,
    refinancingFormActive,
    refinancingFormTitle,
    refinancingScenarios,
    roundedGlobalMinPayment,
    roundingScale,
    roundUp,
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
    toggleRounding,
    toggleSnowballSort,
    totalsAsALoan,
    totalsByBudget,
    unviewBudget,
    unviewLoan,
    viewBudget,
    viewLoan,
  };
});
