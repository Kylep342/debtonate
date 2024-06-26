<script setup>
import {
  computed, provide, ref, watch,
} from 'vue';

import * as moneyfunx from 'moneyfunx';

import BudgetForm from './components/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import LoanForm from './components/LoanForm.vue';
import LoansPanel from './components/LoansPanel.vue';
import OptionsForm from './components/OptionsForm.vue';
import constants from './constants/constants';
import keys from './constants/keys';

// data

const budgets = ref([]);
const colors = constants.COLORS;
const createBudgetFormActive = ref(false);
const createLoanFormActive = ref(false);
const currentBudgetId = ref(null);
const currentLoanId = ref(null);
const loans = ref([]);
const optionsFormActive = ref(false);
const periodsAsDates = ref(false);
const reducePayments = ref(false);
const roundingScale = ref(100);
const roundUp = ref(false);
const budgetDetailsPanelActive = ref(false);
const loanDetailsPanelActive = ref(false);
const snowballSort = ref(false);

// independent computed values

const baseDate = computed(() => Date.now());

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

const createLoanButtonText = computed(
  () => (currentLoanId.value ? constants.BTN_SAVE : constants.BTN_CREATE),
);

const monthlyBudgets = computed(() => {
  const budgetsArray = budgets.value.map((budget) => ({
    id: String(Math.floor(Math.random() * Date.now())),
    relative: budget,
    absolute: budget + globalMinPayment.value,
  }));

  budgetsArray.push({
    id: constants.DEFAULT,
    relative: 0,
    absolute: globalMinPayment.value,
  });

  return budgetsArray;
});

// independent methods

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
const togglePeriodsAsDates = () => {
  periodsAsDates.value = !periodsAsDates.value;
};
const toggleReducePayments = () => {
  reducePayments.value = !reducePayments.value;
};
const toggleRounding = () => {
  roundUp.value = !roundUp.value;
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
const getLoanIndex = (id) => (id !== constants.TOTALS
  ? loans.value.findIndex((loan) => loan.id === id) + 1
  : 0);
const getLoanName = (id) => (
  id === constants.TOTALS
    ? constants.NAME_TOTALS_AS_LOAN
    : `${constants.LOAN} ${getLoanIndex(id)}`
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
const getBudget = (id) => monthlyBudgets.value.find((budget) => budget.id === id);
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
  currentBudgetId.value = null;
  currentLoanId.value = null;
  loans.value = [];
  reducePayments.value = false;
  roundUp.value = false;
  budgetDetailsPanelActive.value = false;
  loanDetailsPanelActive.value = false;
  snowballSort.value = true;
};
const loadState = () => {
  budgets.value = JSON.parse(localStorage.getItem(keys.LS_BUDGETS));
  loans.value = JSON.parse(localStorage.getItem(keys.LS_LOANS)).map(
    (loan) => new moneyfunx.Loan(loan.principal, loan.annualRate, 12, loan.termInYears),
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

// dependent computed values

const createLoanFormTitle = computed(() => (currentLoanId.value
  ? `Editing Loan ${getLoanIndex(currentLoanId.value)}`
  : 'Creating a Loan'));

const createBudgetButtonText = computed(() => (
  currentBudgetId.value
    ? constants.BTN_SAVE
    : constants.BTN_CREATE
));

const createBudgetFormTitle = computed(() => (currentBudgetId.value
  ? `Editing Budget ${getBudgetIndex(currentBudgetId.value)}`
  : 'Creating a Budget'));

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
}));

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
      ? `$${globalMinPayment.value.toFixed(2)}/month`
      : `$${budget.absolute.toFixed(2)}/month (+$${budget.relative.toFixed(
        2,
      )}/month)`,
})));

const amortizationSchedulesGraphs = computed(() => {
  const balances = { totals: [] };

  loans.value.forEach((loan) => {
    balances[loan.id] = [];
  });

  Object.keys(balances).forEach((loanId) => {
    paymentSchedules.value.forEach((schedule) => {
      balances[loanId].push({
        x: Array.from(
          schedule.paymentSchedule[loanId].amortizationSchedule,
          (record) => record.period,
        ),
        y: Array.from(
          schedule.paymentSchedule[loanId].amortizationSchedule,
          (record) => record.principalRemaining,
        ),
        hovertemplate: 'Payment %{x}: %{y} Remaining',
        name: `$${(schedule.paymentAmount + globalMinPayment.value).toFixed(
          2,
        )}/month`,
        type: 'scatter',
      });
    });
  });
  return balances;
});

const amortizationSchedulesCharts = computed(() => {
  const charts = {};

  loans.value.forEach((loan) => {
    charts[loan.id] = {};
  });
  Object.keys(charts).forEach((loanId) => {
    charts[loanId] = {
      id: 'amortizationSchedulesChart',
      data: amortizationSchedulesGraphs.value[loanId],
      layout: {
        showLegend: false,
        barmode: 'group',
        title: `Balance Over Time - ${getLoanName(loanId)}`,
        xaxis: {
          title: {
            text: 'Payments',
          },
        },
        yaxis: {
          hoverformat: '$,.2f',
          tickformat: '$,.2f',
          title: {
            text: 'Principal Remaining',
          },
        },
        colorway: colors,
      },
    };
  });
  return charts;
});

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
  const balances = { totals: {} };

  loans.value.forEach((loan) => {
    balances[loan.id] = {};
  });

  Object.keys(balances).forEach((loanId) => {
    paymentSchedules.value.forEach((schedule) => {
      balances[loanId][schedule.budgetId] = {
        label: schedule.label,
        totalPaymentAmount: schedule.paymentAmount,
        amortizationSchedule:
          schedule.paymentSchedule[loanId].amortizationSchedule,
        totalPrincipalPaid: schedule.paymentSchedule[loanId].lifetimePrincipal,
        totalInterestPaid: schedule.paymentSchedule[loanId].lifetimeInterest,
        totalPayments: schedule.paymentSchedule[loanId].amortizationSchedule.length,
      };
    });
  });

  return balances;
});

// dependent methods

const getLoan = (id) => (id !== constants.TOTALS
  ? loans.value.find((loan) => loan.id === id)
  : totalsAsALoan.value);
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
  if (currentBudgetId.value) {
    deleteBudget(currentBudgetId.value);
    currentBudgetId.value = null;
  }
  budgets.value.push(proposedBudget);
  budgets.value.sort((a, b) => b - a);
  exitCreateBudgetForm();
};
const createLoan = (principal, interestRate, termInYears) => {
  const newLoan = new moneyfunx.Loan(principal, interestRate, 12, termInYears);
  if (currentLoanId.value) {
    deleteLoan(currentLoanId.value);
    currentLoanId.value = null;
  }
  loans.value.push(newLoan);
  sortLoans();
  exitCreateLoanForm();
};

const getNumPayments = (loan, budget) => (
  paymentSummaries.value[loan.id][budget.id].totalPayments
);

// title building functions

const buildBudgetDetailsTitle = (monthlyBudget) => `Budget Details - ${monthlyBudget.id === constants.DEFAULT
  ? 'Minimum Budget '
  : `Budget ${getBudgetIndex(monthlyBudget.id)}`
  } `
  + `$${monthlyBudget.absolute.toFixed(2)}/month `
  + `(+$${monthlyBudget.relative.toFixed(2)}/month)`;
const buildLoanDetailsTitle = (loan) => `Loan Details - ${loan.id === constants.TOTALS
  ? 'All Loans '
  : `Loan ${getLoanIndex(loan.id)}`
  } `
  + `($${loan.principal.toFixed(2)} `
  + `@ ${(loan.annualRate * 100).toFixed(2)}%)`;

const buildAmortizationTableTitle = (loan, monthlyBudget) => `Amortization Table - ${getLoanName(loan.id)} | ${getBudgetName(monthlyBudget.id)}`;
const buildAmortizationTableSubtitle = (loan, monthlyBudget) => `($${loan.principal} | ${(loan.annualRate * 100).toFixed(2)}% | $${monthlyBudget.absolute.toFixed(2)}/month | ${getNumPayments(loan, monthlyBudget)} Payments)`;

// watch

watch(budgetDetailsPanelActive, async (show) => {
  if (show) {
    document.getElementById(constants.BUDGET_DETAILS_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.BUDGET_DETAILS_ID).close();
  }
});

watch(createBudgetFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.BUDGET_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.BUDGET_FORM_ID).close();
  }
});

watch(createLoanFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.LOAN_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.LOAN_FORM_ID).close();
  }
});

watch(loanDetailsPanelActive, async (show) => {
  if (show) {
    document.getElementById(constants.LOAN_DETAILS_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.LOAN_DETAILS_ID).close();
  }
});

watch(optionsFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.OPTIONS_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.OPTIONS_FORM_ID).close();
  }
});

// provide

provide('options', {
  baseDate,
  periodsAsDates,
  reducePayments,
  roundUp,
  snowballSort,
});

provide('builders', {
  buildAmortizationTableSubtitle,
  buildAmortizationTableTitle,
  buildBudgetDetailsTitle,
  buildLoanDetailsTitle,
});

provide('budgetPrimitives', {
  currentBudgetId,
  deleteBudget,
  editBudget,
  getBudget,
  getBudgetIndex,
  getBudgetName,
  getNumPayments,
  monthlyBudgets,
  viewBudget,
});

provide('loanPrimitives', {
  currentLoanId,
  deleteLoan,
  editLoan,
  getLoan,
  getLoanIndex,
  getLoanName,
  loans,
  viewLoan,
});

provide('visuals', {
  amortizationSchedulesCharts,
  paymentSummaries,
});
</script>

<template>
  <div id="debtonate" :class="['font-mono']">
    <HeaderBar @clear-app-state="clearState" @load-app-state="loadState" @open-options-form="openOptionsForm"
      @save-app-state="saveState" />
    <LoanForm :id="constants.LOAN_FORM_ID" :createButtonText="createLoanButtonText" :loan="currentLoanId ?
      getLoan(currentLoanId) :
      null" :title="createLoanFormTitle" @create-loan="createLoan" @exit-create-loan="exitCreateLoanForm" />
    <BudgetForm :id="constants.BUDGET_FORM_ID" :createButtonText="createBudgetButtonText" :budget="currentBudgetId ?
      getBudget(currentBudgetId) :
      null" :title="createBudgetFormTitle" @create-budget="createBudget" @exit-create-budget="exitCreateBudgetForm" />
    <OptionsForm :id="constants.OPTIONS_FORM_ID" @exit-options-form="exitOptionsForm"
      @toggle-avalanche-sort="toggleAvalancheSort" @toggle-periods-as-dates="togglePeriodsAsDates"
      @toggle-reduce-payments="toggleReducePayments" @toggle-round-up="toggleRounding"
      @toggle-snowball-sort="toggleSnowballSort" />
    <div :class="['appBody', 'flex', 'bg-base-100', 'overflow-y-hidden', 'overscroll-none']">
      <LoansPanel :class="['flex-none']" :createFunction="openCreateLoanForm" :deleteLoan="deleteLoan"
        :editLoan="editLoan" :loans="loans" :totalsAsALoan="totalsAsALoan" :viewLoan="viewLoan" />
      <BudgetsPanel :class="['flex-initial']" :budgets="monthlyBudgets" :budgetsTotals="totalsByBudget"
        :createFunction="openCreateBudgetForm" :deleteBudget="deleteBudget" :editBudget="editBudget"
        :viewBudget="viewBudget" />
      <div v-if="loans.length" :class="[]">
        <div :class="['flex-grow']">
          <div :class="['header']">
            <h2>Repayment Information</h2>
            <p>To Be Implemented</p>
          </div>
        </div>
        <div>
          <DetailsPanel :id="constants.LOAN_DETAILS_ID" :title="currentLoanId ?
            buildLoanDetailsTitle(getLoan(currentLoanId)) :
            'Loan Details'
            " :type="constants.LOAN" @exit-details-panel="unviewLoan" />
          <DetailsPanel :id="constants.BUDGET_DETAILS_ID" :title="currentBudgetId
            ? buildBudgetDetailsTitle(getBudget(currentBudgetId))
            : 'Budget Details'
            " :type="constants.BUDGET" @exit-details-panel="unviewBudget" />
        </div>
      </div>
    </div>
  </div>
</template>
