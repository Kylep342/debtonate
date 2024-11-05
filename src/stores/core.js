import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import * as moneyfunx from 'moneyfunx';

import constants from '../constants/constants';
import keys from '../constants/keys';

export default defineStore('core', () => {
  const budgetDetailsPanelActive = ref(false);
  const budgets = ref([]);
  const createBudgetFormActive = ref(false);
  const createLoanFormActive = ref(false);
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
  const roundingScale = ref(100);
  const roundUp = ref(false);
  const snowballSort = ref(false);

  // primitive computed values/methods

  const baseDate = computed(() => Date.now());

  const formatPeriod = (period, asStr = false) => {
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

  const Money = (amount) => (
    Intl.NumberFormat(
      language.value,
      {
        style: 'currency',
        currency: currency.value,
      },
    ).format(amount)
  );

  const currencySymbol = computed(() => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.value,
      }).format(1);

      const match = formatted.match(/[\p{Sc}]+/u);

      return match ? match[0] : null;
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

  const globalLifetimeInterestPaid = computed(() => loans.value.reduce(
    (totalInterest, loan) => totalInterest + loan.totalInterest,
    0,
  ));

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

  const globalEffectiveInterestRate = computed(() => loans.value.reduce(
    (weightedRate, loan) => weightedRate + loan.annualRate * (loan.principal / globalPrincipal.value),
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
    totalInterest: globalLifetimeInterestPaid.value,
    name: constants.NAME_TOTALS_AS_LOAN,
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

  const openCreateBudgetForm = () => {
    createBudgetFormActive.value = true;
  };
  const openCreateLoanForm = () => {
    createLoanFormActive.value = true;
  };
  const openOptionsForm = () => {
    optionsFormActive.value = true;
  };
  const exitCreateBudgetForm = () => {
    createBudgetFormActive.value = false;
    currentBudgetId.value = null;
  };
  const exitCreateLoanForm = () => {
    createLoanFormActive.value = false;
    currentLoanId.value = null;
  };
  const exitOptionsForm = () => {
    optionsFormActive.value = false;
  };
  const setCurrency = (newValue) => {
    currency.value = newValue;
  };
  const setLanguage = (newValue) => {
    language.value = newValue;
  };
  const setRoundingScale = (newValue) => {
    roundingScale.value = newValue;
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
    openCreateLoanForm();
  };
  const getLoanIndex = (id) => loansWithTotals.value.findIndex((loan) => loan.id === id);
  const getLoanName = (id) => (
    getLoan(id).name || `${constants.LOAN} ${getLoanIndex(id)}`
  );
  const viewLoan = (id) => {
    currentLoanId.value = id;
    loanDetailsPanelActive.value = true;
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
    openCreateBudgetForm();
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
    createBudgetFormActive.value = false;
    createLoanFormActive.value = false;
    currency.value = constants.LOCALE_CURRENCY[navigator.language];
    currentBudgetId.value = null;
    currentLoanId.value = null;
    language.value = navigator.language;
    loans.value = [];
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
      ),
    );
    periodsAsDates.value = JSON.parse(
      localStorage.getItem(keys.LS_PERIODS_AS_DATES),
    );
    reducePayments.value = JSON.parse(
      localStorage.getItem(keys.LS_REDUCE_PAYMENTS),
    );
    roundUp.value = JSON.parse(localStorage.getItem(keys.LS_ROUND_UP));
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
    localStorage.setItem(
      keys.LS_SNOWBALL_SORT,
      JSON.stringify(snowballSort.value),
    );
  };

  // dependent computed values/methods

  const createLoanFormTitle = computed(() => (currentLoanId.value
    ? `Editing ${getLoanName(currentLoanId.value)}`
    : 'Creating a Loan'));

  const createBudgetButtonText = computed(() => (
    currentBudgetId.value
      ? constants.BTN_SAVE
      : constants.BTN_CREATE
  ));

  const createLoanButtonText = computed(
    () => (currentLoanId.value ? constants.BTN_SAVE : constants.BTN_CREATE),
  );

  const createBudgetFormTitle = computed(() => (currentBudgetId.value
    ? `Editing ${getBudgetName(currentBudgetId.value)}`
    : 'Creating a Budget'));

  const paymentSchedules = computed(() => monthlyBudgets.value.map((budget) => ({
    budgetId: budget.id,
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
  })));

  const totalsByBudget = computed(() => {
    const totals = {};
    monthlyBudgets.value.forEach((budget) => {
      totals[budget.id] = paymentSchedules.value.find(
        (schedule) => schedule.budgetId === budget.id,
      ).paymentSchedule.totals;
    });
    return totals;
  });

  const paymentSummaries = computed(() => {
    const summaries = {};

    loansWithTotals.value.forEach((loan) => {
      summaries[loan.id] = {};
    });

    Object.keys(summaries).forEach((loanId) => {
      paymentSchedules.value.forEach((schedule) => {
        summaries[loanId][schedule.budgetId] = {
          label: schedule.label,
          amortizationSchedule:
            schedule.paymentSchedule[loanId].amortizationSchedule,
          totalPrincipalPaid: schedule.paymentSchedule[loanId].lifetimePrincipal,
          totalInterestPaid: schedule.paymentSchedule[loanId].lifetimeInterest,
          totalPayments: schedule.paymentSchedule[loanId].amortizationSchedule.length,
        };
      });
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
    exitCreateBudgetForm();
  };
  const createLoan = (principal, interestRate, termInYears, name) => {
    const newLoan = new moneyfunx.Loan(principal, interestRate, 12, termInYears, name);
    if (currentLoanId.value && currentLoanId.value !== constants.TOTALS) {
      deleteLoan(currentLoanId.value);
      currentLoanId.value = null;
    }
    loans.value.push(newLoan);
    sortLoans();
    exitCreateLoanForm();
  };

  const getPaymentSummary = (loanId, budgetId) => paymentSummaries.value[loanId][budgetId];

  const getNumPayments = (loanId, budgetId) => paymentSummaries.value[loanId][budgetId].totalPayments;
  const getLifetimeInterest = (loanId, budgetId) => (
    paymentSummaries.value[loanId][budgetId].totalInterestPaid
  );

  // title building functions

  const buildBudgetDetailsTitle = (monthlyBudget) => `Budget Details - ${getBudgetName(monthlyBudget.id)} `
    + `${Money(monthlyBudget.absolute)}/month `
    + `(+${Money(monthlyBudget.relative)}/month)`;
  const buildLoanDetailsTitle = (loan) => `Loan Details - ${getLoanName(loan.id)} `
    + `(${Money(loan.principal)} `
    + `@ ${(loan.annualRate * 100).toFixed(2)}%)`;

  const buildAmortizationTableTitle = (loan, monthlyBudget) => `Amortization Table - ${getLoanName(loan.id)} | ${getBudgetName(monthlyBudget.id)}`;
  const buildAmortizationTableSubtitle = (loan, monthlyBudget) => `(${Money(loan.principal)} | ${(loan.annualRate * 100).toFixed(2)}% | ${Money(monthlyBudget.absolute)}/month | ${getNumPayments(loan.id, monthlyBudget.id)} Payments)`;
  const buildInterestTableTitle = (loan) => `Interest Table - ${getLoanName(loan.id)}`;
  const buildInterestTableSubtitle = (loan) => `(${Money(loan.principal)} | ${(loan.annualRate * 100).toFixed(2)}%)`;

  // graph data

  const balanceOverTimeGraphs = computed(() => {
    const configs = {};

    loansWithTotals.value.forEach((loan) => {
      configs[loan.id] = {
        config: {
          maxX: globalMaxPeriods.value,
          maxY: getLoan(loan.id).principal,
          hovertemplate: 'Payment %{x}: %{y} Remaining',
          header: `Balances Over Time By Budget | ${getLoanName(loan.id)}`,
          subheader: buildInterestTableSubtitle(loan),
        },
        lines: [],
      };
    });

    Object.keys(configs).forEach((loanId) => {
      paymentSchedules.value.forEach((schedule) => {
        const line = [];
        schedule.paymentSchedule[loanId]?.amortizationSchedule.forEach((record) => {
          line.push({ x: record.period, y: record.principalRemaining });
        });
        configs[loanId].lines.push(line);
      });
    });
    return configs;
  });

  return {
    avalanche,
    balanceOverTimeGraphs,
    baseDate,
    budgetDetailsPanelActive,
    budgets,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildBudgetDetailsTitle,
    buildInterestTableSubtitle,
    buildInterestTableTitle,
    buildLoanDetailsTitle,
    clearState,
    createBudget,
    createBudgetButtonText,
    createBudgetFormActive,
    createBudgetFormTitle,
    createLoan,
    createLoanButtonText,
    createLoanFormActive,
    createLoanFormTitle,
    currencies,
    currency,
    currencySymbol,
    currentBudgetId,
    currentLoanId,
    deleteBudget,
    deleteLoan,
    editBudget,
    editLoan,
    exitCreateBudgetForm,
    exitCreateLoanForm,
    exitOptionsForm,
    formatPeriod,
    getBudget,
    getBudgetIndex,
    getBudgetName,
    getLifetimeInterest,
    getLoan,
    getLoanIndex,
    getLoanName,
    getNumPayments,
    getPaymentSummary,
    globalEffectiveInterestRate,
    globalLifetimeInterestPaid,
    globalMaxPeriods,
    globalMaxPeriodsPerYear,
    globalMaxTermInYears,
    globalMinPayment,
    globalPrincipal,
    language,
    languages,
    loadState,
    loanDetailsPanelActive,
    loans,
    loansWithTotals,
    minimumBudget,
    Money,
    monthlyBudgets,
    openCreateBudgetForm,
    openCreateLoanForm,
    openOptionsForm,
    optionsFormActive,
    paymentSchedules,
    paymentSummaries,
    periodsAsDates,
    rawGlobalMinPayment,
    reducePayments,
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
