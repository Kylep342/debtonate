<script setup>
import { computed, provide, ref } from 'vue';

import * as moneyfunx from 'moneyfunx';

import BudgetForm from './components/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import LoanForm from './components/LoanForm.vue';
import LoansPanel from './components/LoansPanel.vue';
import ManagementPanel from './components/ManagementPanel.vue';
import OptionsForm from './components/OptionsForm.vue';
import constants from './constants/constants';

// data

const budgets = ref([]);
const baseDate = ref(new Date());
const colors = ['#DAF7A6', '#900C3F', '#C70039', '#581845', '#FF5733', '#FFC300'];
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
const showBudgetDetailsPanel = ref(false);
const showLoanDetailsPanel = ref(false);
const snowballSort = ref(false);

// independent computed values

const rawGlobalMinPayment = computed(
  () => (loans.value.reduce((minPayment, loan) => minPayment + loan.minPayment, 0)),
);

const roundedGlobalMinPayment = computed(
  () => (
    rawGlobalMinPayment.value
    + (roundingScale.value - (rawGlobalMinPayment.value % roundingScale.value))
  ),
);

const globalLifetimeInterestPaid = computed(
  () => (
    loans.value.reduce((totalInterest, loan) => totalInterest + loan.totalInterest, 0)
  ),
);

const globalMaxPeriods = computed(
  () => (
    loans.value.reduce(
      (curMax, loan) => Math.max(
        curMax,
        loan.periodsPerYear * loan.termInYears,
      ),
      0,
    )
  ),
);

const globalMaxPeriodsPerYear = computed(
  () => (
    loans.value.reduce((curMax, loan) => Math.max(curMax, loan.periodsPerYear), 0)
  ),
);

const globalMaxTermInYears = computed(
  () => (
    loans.value.reduce((curMax, loan) => Math.max(curMax, loan.termInYears), 0)
  ),
);

const globalMinPayment = computed(
  () => (
    roundUp.value ? roundedGlobalMinPayment.value : rawGlobalMinPayment.value
  ),
);

const globalPrincipal = computed(
  () => (
    loans.value.reduce((totalPrincipal, loan) => totalPrincipal + loan.principal, 0)
  ),
);

const periodsAsDatesButtonText = computed(() => (periodsAsDates.value ? 'Turn Off' : 'Turn On'));
const reducePaymentsButtonText = computed(() => (reducePayments.value ? 'Turn Off' : 'Turn On'));
const roundingButtonText = computed(() => (roundUp.value ? 'Turn Off' : 'Turn On'));
const createLoanButtonText = computed(() => (currentLoanId.value ? 'Save' : 'Create'));

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

const openCreateBudgetForm = () => { createBudgetFormActive.value = true; };
const openCreateLoanForm = () => { createLoanFormActive.value = true; };
const openOptionsForm = () => { optionsFormActive.value = true; };
const exitCreateBudgetForm = () => {
  createBudgetFormActive.value = false;
  currentBudgetId.value = null;
};
const exitCreateLoanForm = () => {
  createLoanFormActive.value = false;
  currentLoanId.value = null;
};
const exitOptionsForm = () => { optionsFormActive.value = false; };
const togglePeriodsAsDates = () => { periodsAsDates.value = !periodsAsDates.value; };
const toggleReducePayments = () => { reducePayments.value = !reducePayments.value; };
const toggleRounding = () => { roundUp.value = !roundUp.value; };
const avalanche = () => {
  return moneyfunx.sortLoans(
    moneyfunx.sortLoans(loans.value, moneyfunx.snowball),
    moneyfunx.avalanche,
  );
};
const snowball = () => {
  return moneyfunx.sortLoans(
    moneyfunx.sortLoans(loans.value, moneyfunx.avalanche),
    moneyfunx.snowball,
  );
};

const deleteLoan = (id) => {
  loans.value = loans.value.filter((loan) => loan.id !== id);
};
const editLoan = (id) => {
  currentLoanId.value = id;
  createLoanFormActive.value = true;
};
const getLoanIndex = (id) => (id !== constants.TOTALS
  ? loans.value.findIndex((loan) => loan.id === id) + 1
  : 0
);
const viewLoan = (id) => {
  currentLoanId.value = id;
  showLoanDetailsPanel.value = true;
};
const unviewLoan = () => {
  showLoanDetailsPanel.value = false;
  currentLoanId.value = null;
};

const deleteBudget = (id) => {
  const monthlyBudget = monthlyBudgets.value.find(
    (budget) => budget.id === id,
  );
  budgets.value = budgets.value.filter((budget) => budget !== monthlyBudget.relative);
};
const editBudget = (id) => {
  currentBudgetId.value = id;
  createBudgetFormActive.value = true;
};
const getBudget = (id) => (monthlyBudgets.value.find((budget) => budget.id === id));
const getBudgetIndex = (id) => (monthlyBudgets.value.findIndex((budget) => budget.id === id) + 1);
const viewBudget = (id) => {
  currentBudgetId.value = id;
  showBudgetDetailsPanel.value = true;
};
const unviewBudget = () => {
  showBudgetDetailsPanel.value = false;
  currentBudgetId.value = null;
};

const buildBudgetDetailsTitle = (monthlyBudget) => (`Budget Details - ${
  monthlyBudget.id === constants.DEFAULT
    ? 'Minimum Budget '
    : `Budget ${getBudgetIndex(monthlyBudget.id)}`} `
  + `$${monthlyBudget.absolute.toFixed(2)}/mo `
  + `(+$${monthlyBudget.relative.toFixed(2)}/mo)`
);
const buildLoanDetailsTitle = (loan) => (`Loan Details - ${
  loan.id === constants.TOTALS
    ? 'All Loans '
    : `Loan ${getLoanIndex(loan.id)}`} `
  + `($${loan.principal.toFixed(2)} `
  + `@ ${(loan.annualRate * 100).toFixed(2)}%)`
);

const clearState = () => {
  budgets.value = [];
  createBudgetFormActive.value = false;
  createLoanFormActive.value = false;
  currentBudgetId.value = null;
  currentLoanId.value = null;
  loans.value = [];
  reducePayments.value = false;
  roundUp.value = false;
  showBudgetDetailsPanel.value = false;
  showLoanDetailsPanel.value = false;
  snowballSort.value = true;
};
const loadState = () => {
  budgets.value = JSON.parse(localStorage.getItem('debtonate.budgets'));
  loans.value = JSON.parse(localStorage.getItem('debtonate.loans')).map(
    (loan) => new moneyfunx.Loan(
      loan.principal,
      loan.annualRate,
      12,
      loan.termInYears,
    ),
  );
  periodsAsDates.value = JSON.parse(localStorage.getItem('debtonate.periodsAsDates'));
  reducePayments.value = JSON.parse(localStorage.getItem('debtonate.reducePayments'));
  roundUp.value = JSON.parse(localStorage.getItem('debtonate.roundUp'));
  snowballSort.value = JSON.parse(localStorage.getItem('debtonate.snowballSort'));
};
const saveState = () => {
  localStorage.setItem('debtonate.budgets', JSON.stringify(budgets.value));
  localStorage.setItem('debtonate.loans', JSON.stringify(loans.value));
  localStorage.setItem('debtonate.periodsAsDates', JSON.stringify(periodsAsDates.value));
  localStorage.setItem('debtonate.reducePayments', JSON.stringify(reducePayments.value));
  localStorage.setItem('debtonate.roundUp', JSON.stringify(roundUp.value));
  localStorage.setItem('debtonate.snowballSort', JSON.stringify(snowballSort.value));
};

// dependent computed values

const createLoanFormTitle = computed(() => (currentLoanId.value
  ? `Editing Loan ${getLoanIndex(currentLoanId.value)}`
  : 'Creating a Loan'
));
const createBudgetButtonText = computed(() => (currentBudgetId.value ? 'Save' : 'Create'));
const createBudgetFormTitle = computed(() => (currentBudgetId.value
  ? `Editing Budget ${getBudgetIndex(currentBudgetId.value)}`
  : 'Creating a Budget'
));

const globalEffectiveInterestRate = computed(
  () => (
    loans.value.reduce(
      (weightedRate, loan) => (
        weightedRate + (loan.annualRate * (loan.principal / globalPrincipal.value))
      ),
      0,
    )
  ),
);

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

const paymentSchedules = computed(() => (
  monthlyBudgets.value.map(
    (budget) => ({
      budgetId: budget.id,
      paymentAmount: budget.relative,
      paymentSchedule: moneyfunx.payLoans(loans.value, budget.absolute, reducePayments.value),
      label: budget.id === constants.DEFAULT
        ? `$${globalMinPayment.value.toFixed(2)}/mo`
        : `$${budget.absolute.toFixed(2)}/mo (+$${budget.relative.toFixed(2)}/mo)`,
    }),
  )
));

const amortizationSchedulesGraphData = computed(() => {
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
        name: `$${(schedule.paymentAmount + globalMinPayment.value).toFixed(2)}/mo`,
        type: 'scatter',
      });
    });
  });
  return balances;
});

const amortizationSchedulesChartPerLoan = computed(() => {
  const charts = { totals: [] };

  loans.value.forEach((loan) => {
    charts[loan.id] = {};
  });
  Object.keys(charts).forEach((loanId, index) => {
    charts[loanId] = {
      id: `amortizationSchedulesChart,${loanId}`,
      data: amortizationSchedulesGraphData.value[loanId],
      layout: {
        showLegend: false,
        barmode: 'group',
        title: `Balance Over Time - ${loanId === constants.TOTALS ? 'All Loans' : `Loan ${index}`}`,
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

const lifetimeInterestTotals = computed(() => ([
  {
    x: monthlyBudgets.value.map(
      (budget) => `$${budget.absolute.toFixed(2)}/month`,
    ),
    y: monthlyBudgets.value.map((budget) => paymentSchedules.value.find(
      (schedule) => schedule.budgetId === budget.id,
    ).paymentSchedule?.totals.lifetimeInterest),
    name: 'Total Interest Paid',
    type: 'bar',
  },
]));

const lifetimeInterestTotalsChart = computed(() => ({
  id: 'lifetimeInterestTotalsChart',
  data: lifetimeInterestTotals.value,
  layout: {
    barmode: 'group',
    title: 'Total Interest Paid - All Loans',
    xaxis: {
      title: {
        text: 'Budgets',
      },
    },
    yaxis: {
      hoverformat: '$,.2f',
      tickformat: '$,.2f',
      title: {
        text: 'Interest',
      },
    },
    colorway: colors,
  },
}));

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
        amortizationSchedule: schedule.paymentSchedule[loanId].amortizationSchedule,
        totalPrincipalPaid: schedule.paymentSchedule[loanId].lifetimePrincipal,
        totalInterestPaid: schedule.paymentSchedule[loanId].lifetimeInterest,
        totalPayments: schedule.paymentSchedule[loanId].totalPayments,
      };
    });
  });

  return balances;
});

// dependent methods

const getLoan = (id) => (id !== constants.TOTALS
  ? loans.value.find((loan) => loan.id === id)
  : totalsAsALoan.value
);
const sortLoans = () => {
  loans.value = (
    snowballSort.value === true
      ? snowball()
      : avalanche()
    );
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
  createBudgetFormActive.value = false;
};
const createLoan = (principal, interestRate, termInYears) => {
  const newLoan = new moneyfunx.Loan(principal, interestRate, 12, termInYears);
  if (currentLoanId.value) {
    deleteLoan(currentLoanId.value);
    currentLoanId.value = null;
  }
  loans.value.push(newLoan);
  sortLoans();
  createLoanFormActive.value = false;
};

// provide

provide('options', {
  baseDate,
  periodsAsDates,
  reducePayments,
  roundUp,
  snowballSort,
});

provide('budgetFunctions', {
  deleteBudget,
  editBudget,
  viewBudget,
});

provide('loanFunctions', {
  deleteLoan,
  editLoan,
  viewLoan,
});
</script>

<template>
  <div id='debtonate'>
    <HeaderBar
      @clear-app-state='clearState'
      @load-app-state='loadState'
      @open-options-form='openOptionsForm'
      @save-app-state='saveState'
    />
    <LoanForm
      v-if='createLoanFormActive'
      :createButtonText='createLoanButtonText'
      :loan='currentLoanId ? getLoan(currentLoanId) : null'
      :title='createLoanFormTitle'
      @create-loan='createLoan'
      @exit-create-loan='exitCreateLoanForm'
    />
    <BudgetForm
      v-if='createBudgetFormActive'
      :createButtonText='createBudgetButtonText'
      :budget='currentBudgetId ? getBudget(currentBudgetId) : null'
      :title='createBudgetFormTitle'
      @create-budget='createBudget'
      @exit-create-budget='exitCreateBudgetForm'
    />
    <!-- TODO: Make the ButtonText attributes computed in the component itself -->
    <OptionsForm
      v-if='optionsFormActive'
      :periodsAsDatesButtonText='periodsAsDatesButtonText'
      :reducePaymentsButtonText='reducePaymentsButtonText'
      :roundingButtonText='roundingButtonText'
      @exit-options-form='exitOptionsForm'
      @toggle-avalanche-sort='toggleAvalancheSort'
      @toggle-periods-as-dates='togglePeriodsAsDates'
      @toggle-reduce-payments='toggleReducePayments'
      @toggle-round-up='toggleRounding'
      @toggle-snowball-sort='toggleSnowballSort'
    />
    <br />
    <div :class="['appBody']">
      <div id='todo2' :class="['mgmtPanel']">
        <ManagementPanel
          :class="['mgmtPanelHeader']"
          :createFunction='openCreateLoanForm'
          :panelId='"loanManagementPanel"'
          :panelTitle='"Loans"'
        />
        <LoansPanel
          v-if="loans.length"
          :class="['mgmtPanelBody']"
          :deleteLoan='deleteLoan'
          :editLoan='editLoan'
          :loans='loans'
          :totalsAsALoan='totalsAsALoan'
          :viewLoan='viewLoan'
        />
      </div>
      <div :class="['mgmtPanel']">
        <ManagementPanel
          :class="['mgmtPanelHeader']"
          :createFunction='openCreateBudgetForm'
          :panelId='"budgetManagementPanel"'
          :panelTitle='"Budgets"'
        />
        <BudgetsPanel
          v-if="loans.length"
          :class="['mgmtPanelBody']"
          :budgets='monthlyBudgets'
          :budgetsTotals='totalsByBudget'
          :deleteBudget='deleteBudget'
          :editBudget='editBudget'
          :viewBudget='viewBudget'
        />
      </div>
      <div id='todo' v-if='loans.length' :class="['presPanel']">
        <div :class="['panel']">
          <div :class="['panelHeader', 'header']">
            <h2>Repayment Information</h2>
          </div>
          <div id='lifetimeInterestTotals'>
            <base-chart :class="['graph']" :chart='lifetimeInterestTotalsChart' />
          </div>
        </div>
        <div>
          <DetailsPanel
            v-if='showLoanDetailsPanel'
            :index='getLoanIndex(currentLoanId)'
            :amortizationSchedulesChart='
              amortizationSchedulesChartPerLoan[currentLoanId]
            '
            :loan='getLoan(currentLoanId)'
            :monthlyBudgets='monthlyBudgets'
            :paymentSummaries='paymentSummaries[currentLoanId]'
            :title='buildLoanDetailsTitle(getLoan(currentLoanId))'
            :type='constants.LOAN'
            @exit-details-panel='unviewLoan'
          />
        </div>
          <DetailsPanel
            v-if='showBudgetDetailsPanel'
            :index='getBudgetIndex(currentBudgetId)'
            :amortizationSchedulesChart='
              amortizationSchedulesChartPerLoan.totals
            '
            :loan='totalsAsALoan'
            :monthlyBudgets='[getBudget(currentBudgetId)]'
            :paymentSummaries='paymentSummaries.totals'
            :title='buildBudgetDetailsTitle(getBudget(currentBudgetId))'
            :type='constants.BUDGET'
            @exit-details-panel='unviewBudget'
          />
      </div>
    </div>
    <div :id='"sandbox"'></div>
  </div>
</template>

<style scoped></style>
