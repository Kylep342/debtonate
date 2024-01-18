<script>
import * as moneyfunx from 'moneyfunx';

import BudgetForm from './components/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
// import InterestTable from './components/InterestTable.vue';
import LoanForm from './components/LoanForm.vue';
import LoansPanel from './components/LoansPanel.vue';
import ManagementPanel from './components/ManagementPanel.vue';
import OptionsForm from './components/OptionsForm.vue';
import constants from './constants/constants';


export default {
  data() {
    return {
      constants,
      budget: null,
      budgets: [],
      colors: [
        '#DAF7A6',
        '#900C3F',
        '#C70039',
        '#581845',
        '#FF5733',
        '#FFC300',
      ],
      createBudgetFormActive: false,
      createLoanFormActive: false,
      currentLoanId: null,
      interestRate: null,
      loans: [],
      principal: null,
      optionsFormActive: false,
      reducePayments: false,
      roundingScale: 100,
      roundUp: false,
      showBudgetDetailsPanel: false,
      showLoanDetailsPanel: false,
      snowballSort: false,
      termInYears: null,
    };
  },
  computed: {
    toggleReducePaymentsButtonText() {
      return this.reducePayments ? 'Turn Off' : 'Turn On';
    },
    toggleRoundingButtonText() {
      return this.roundUp ? 'Disable' : 'Enable';
    },
    rawGlobalMinPayment() {
      return this.loans.reduce(
        (previousValue, currentValue) => previousValue + currentValue.minPayment,
        0,
      );
    },
    roundedGlobalMinPayment() {
      return (
        this.rawGlobalMinPayment
        + (this.roundingScale - (this.rawGlobalMinPayment % this.roundingScale))
      );
    },
    globalEffectiveInterestRate() {
      return this.loans.reduce(
        (previousValue, currentValue) => previousValue
          + currentValue.annualRate
            * (currentValue.principal / this.globalPrincipal),
        0,
      );
    },
    globalLifetimeInterestPaid() {
      return this.loans.reduce((accumulator, loan) => accumulator + loan.totalInterest, 0);
    },
    globalMaxPeriodsPerYear() {
      return this.loans.reduce((curMax, loan) => Math.max(curMax, loan.periodsPerYear), 0);
    },
    globalMaxTermInYears() {
      return this.loans.reduce((curMax, loan) => Math.max(curMax, loan.termInYears), 0);
    },
    globalMinPayment() {
      return this.roundUp
        ? this.roundedGlobalMinPayment
        : this.rawGlobalMinPayment;
    },
    globalPrincipal() {
      return this.loans.reduce((accumulator, loan) => accumulator + loan.principal, 0);
    },
    createBudgetButtonEnabled() {
      return (
        !Number.isNaN(parseFloat(this.budget)) && parseFloat(this.budget) > 0
      );
    },
    createLoanButtonText() {
      return this.currentLoanId ? 'Save' : 'Create';
    },
    createLoanFormTitle() {
      return this.currentLoanId
        ? `Editing Loan ${this.getLoanIndex(this.currentLoanId)}`
        : 'Creating a Loan';
    },
    createBudgetButtonText() {
      return this.currentBudgetId ? 'Save' : 'Create';
    },
    createBudgetFormTitle() {
      return this.currentBudgetId
        ? `Editing Budget ${this.getBudgetIndex(this.currentBudgetId)}`
        : 'Creating a Budget';
    },
    monthlyBudgets() {
      const budgets = this.budgets.map((budget) => ({
        id: String(Math.floor(Math.random() * Date.now())),
        relative: budget,
        absolute: budget + this.globalMinPayment,
      }));
      budgets.push({
        id: constants.DEFAULT,
        relative: 0,
        absolute: this.globalMinPayment,
      });
      return budgets;
    },
    paymentSchedules() {
      return this.monthlyBudgets.map((budget) => ({
        budgetId: budget.id,
        paymentAmount: budget.relative,
        paymentSchedule: moneyfunx.payLoans(this.loans, budget.absolute, this.reducePayments),
        label:
          budget.id === constants.DEFAULT
            ? `$${this.globalMinPayment.toFixed(2)}/mo`
            : `$${budget.absolute.toFixed(2)}/mo (+$${budget.relative.toFixed(
              2,
            )}/mo)`,
      }));
    },
    // TODO
    balancesOverTime() {
      return 5;
    },
    paymentSummaries() {
      const balances = {
        totals: {},
      };
      this.loans.forEach((loan) => {
        balances[loan.id] = {};
      });
      Object.keys(balances).forEach((loanId) => {
        this.paymentSchedules.forEach((schedule) => {
          balances[loanId][schedule.budgetId] = {
            label: schedule.label,
            totalPayemntAmount: schedule.paymentAmount,
            amortizationSchedule:
              schedule.paymentSchedule[loanId].amortizationSchedule,
            totalPrincipalPaid: schedule.paymentSchedule[loanId].lifetimePrincipal,
            totalInterestPaid:
              schedule.paymentSchedule[loanId].lifetimeInterest,
            totalPayments: schedule.paymentSchedule[loanId].totalPayments,
          };
        });
      });
      return balances;
    },
    amortizationSchedulesGraphData() {
      const balances = {
        totals: [],
      };
      this.loans.forEach((loan) => {
        balances[loan.id] = [];
      });
      Object.keys(balances).forEach((loanId) => {
        this.paymentSchedules.forEach((schedule) => {
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
            name: `$${(schedule.paymentAmount + this.globalMinPayment).toFixed(
              2,
            )}/mo`,
            type: 'scatter',
          });
        });
      });
      return balances;
    },
    amortizationSchedulesChartPerLoan() {
      const charts = {
        totals: {},
      };
      this.loans.forEach((loan) => {
        charts[loan.id] = {};
      });
      Object.keys(charts).forEach((loanId, index) => {
        charts[loanId] = {
          id: `amortizationSchedulesChart,${loanId}`,
          data: this.amortizationSchedulesGraphData[loanId],
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
            colorway: this.colors,
          },
        };
      });
      return charts;
    },
    totalsAsALoan() {
      return {
        id: constants.TOTALS,
        principal: this.globalPrincipal,
        annualRate: this.globalEffectiveInterestRate,
        periodsPerYear: this.globalMaxPeriodsPerYear,
        termInYears: this.globalMaxTermInYears,
        periodicRate: null, // not implemented for Totals as a Loan (see notes.ts)
        periods: this.periodsPerYear * this.termInYears,
        minPayment: this.globalMinPayment,
        totalInterest: this.globalLifetimeInterestPaid,
      };
    },
    totalsByBudget() {
      const totals = {};
      this.monthlyBudgets.forEach((budget) => {
        totals[budget.id] = this.paymentSchedules.find(
          (schedule) => schedule.budgetId === budget.id,
        ).paymentSchedule.totals;
      });
      return totals;
    },
    lifetimeInterestTotals() {
      return [
        {
          x: this.monthlyBudgets.map(
            (budget) => `$${budget.absolute.toFixed(2)}/month`,
          ),
          y: this.monthlyBudgets.map((budget) => this.paymentSchedules.find(
            (schedule) => schedule.budgetId === budget.id,
          ).paymentSchedule?.totals.lifetimeInterest),
          name: 'Total Interest Paid',
          type: 'bar',
        },
      ];
    },
    lifetimeInterestTotalsChart() {
      return {
        id: 'lifetimeInterestTotalsChart',
        data: this.lifetimeInterestTotals,
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
          colorway: this.colors,
        },
      };
    },
  },
  watch: {},
  methods: {
    openCreateBudgetForm() {
      this.createBudgetFormActive = true;
    },
    openCreateLoanForm() {
      this.createLoanFormActive = true;
    },
    openOptionsForm() {
      this.optionsFormActive = true;
    },
    exitCreateBudgetForm() {
      this.createBudgetFormActive = false;
    },
    exitCreateLoanForm() {
      this.createLoanFormActive = false;
      this.currentLoanId = null;
    },
    exitOptionsForm() {
      this.optionsFormActive = false;
    },
    toggleReducePayments() {
      this.reducePayments = !this.reducePayments;
    },
    toggleRounding() {
      this.roundUp = !this.roundUp;
    },
    sortLoans() {
      return this.snowballSort ? this.snowball() : this.avalanche();
    },
    toggleAvalancheSort() {
      this.snowballSort = false;
      this.sortLoans();
    },
    toggleSnowballSort() {
      this.snowballSort = true;
      this.sortLoans();
    },
    avalanche() {
      this.loans = moneyfunx.sortLoans(
        moneyfunx.sortLoans(this.loans, moneyfunx.snowball),
        moneyfunx.avalanche,
      );
    },
    snowball() {
      this.loans = moneyfunx.sortLoans(
        moneyfunx.sortLoans(this.loans, moneyfunx.avalanche),
        moneyfunx.snowball,
      );
    },
    createLoan(principal, interestRate, termInYears) {
      const newLoan = new moneyfunx.Loan(
        principal,
        interestRate,
        12,
        termInYears,
      );
      if (this.currentLoanId) {
        this.deleteLoan(this.currentLoanId);
        this.currentLoanId = null;
      }
      this.loans.push(newLoan);
      this.sortLoans();
      this.createLoanFormActive = false;
      this.interestRate = null;
      this.principal = null;
      this.termInYears = null;
    },
    deleteLoan(id) {
      this.loans = this.loans.filter((loan) => loan.id !== id);
    },
    editLoan(id) {
      this.currentLoanId = id;
      const loan = this.getLoan(this.currentLoanId);
      this.principal = loan.principal;
      this.interestRate = loan.annualRate * 100;
      this.termInYears = loan.termInYears;
      this.createLoanFormActive = true;
    },
    getLoan(id) {
      return id !== constants.TOTALS ? this.loans.find(
        (loan) => loan.id === id,
      ) : this.totalsAsALoan;
    },
    getLoanIndex(id) {
      return this.loans.findIndex((loan) => loan.id === id) + 1;
    },
    viewLoan(id) {
      this.currentLoanId = id;
      this.showLoanDetailsPanel = true;
    },
    unviewLoan() {
      this.showLoanDetailsPanel = false;
      this.currentLoanId = null;
    },
    viewTotals() {
      this.showTotalsDetailsPanel = true;
    },
    unviewTotals() {
      this.showTotalsDetailsPanel = false;
    },
    // TODO: enhance
    createBudget(proposedBudget) {
      this.budgets = this.budgets.filter((budget) => budget !== proposedBudget);
      this.budgets.push(proposedBudget);
      this.budgets.sort((a, b) => b - a);
      this.createBudgetFormActive = false;
      this.budget = null;
    },
    deleteBudget(budget) {
      this.budgets = this.budgets.filter(
        (addedBudget) => addedBudget !== parseFloat(budget.relative),
      );
    },
    editBudget(id) {
      this.currentBudgetId = id;
      const budget = this.getBudget(id);
      this.budget = budget.relative;
      this.createBudgetFormActive = true;
    },
    getBudget(id) {
      return this.monthlyBudgets.find((budget) => budget.id === id);
    },
    getBudgetIndex(id) {
      return this.monthlyBudgets.findIndex((budget) => budget.id === id) + 1;
    },
    viewBudget(id) {
      this.currentBudgetId = id;
      this.showBudgetDetailsPanel = true;
    },
    unviewBudget() {
      this.showBudgetDetailsPanel = false;
      this.currentBudgetId = null;
    },
    clearState() {
      this.budgets = [];
      this.createBudgetFormActive = false;
      this.createLoanFormActive = false;
      this.currentLoanId = null;
      this.interestRate = null;
      this.loans = [];
      this.principal = null;
      this.reducePayments = false;
      this.roundUp = false;
      this.showBudgetDetailsPanel = false;
      this.showLoanDetailsPanel = false;
      // this.showTotalsDetailsPanel = false;
      this.snowballSort = true;
      this.termInYears = null;
    },
    loadState() {
      this.budgets = JSON.parse(localStorage.getItem('debtonate.budgets'));
      this.loans = JSON.parse(localStorage.getItem('debtonate.loans')).map(
        (loan) => new moneyfunx.Loan(
          loan.principal,
          loan.annualRate,
          12,
          loan.termInYears,
        ),
      );
      this.reducePayments = JSON.parse(localStorage.getItem('debtonate.reducePayments'));
      this.roundUp = JSON.parse(localStorage.getItem('debtonate.roundUp'));
      this.snowballSort = JSON.parse(localStorage.getItem('debtonate.snowballSort'));
    },
    saveState() {
      localStorage.setItem('debtonate.budgets', JSON.stringify(this.budgets));
      localStorage.setItem('debtonate.loans', JSON.stringify(this.loans));
      localStorage.setItem('debtonate.reducePayments', JSON.stringify(this.reducePayments));
      localStorage.setItem('debtonate.roundUp', JSON.stringify(this.roundUp));
      localStorage.setItem('debtonate.snowballSort', JSON.stringify(this.snowballSort));
    },
  },
  components: {
    BudgetForm,
    BudgetsPanel,
    DetailsPanel,
    HeaderBar,
    // InterestTable,
    LoanForm,
    LoansPanel,
    ManagementPanel,
    OptionsForm,
  },
};
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
    <OptionsForm
      v-if='optionsFormActive'
      :reducePayments='reducePayments'
      :roundUp='roundUp'
      :snowballSort='snowballSort'
      @exit-options-form='exitOptionsForm'
      @toggle-avalanche-sort='toggleAvalancheSort'
      @toggle-snowball-sort='toggleSnowballSort'
      @toggle-reduce-payments='toggleReducePayments'
      @toggle-round-up='toggleRounding'
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
      <div id='todo3' v-show='loans.length' :class="['presPanel']">
        <div :class="['panel']">
          <div :class="['panelHeader', 'header']">
            <h2>Repayment Information</h2>
          </div>
          <div id='lifetimeInterestTotals'>
            <!-- <InterestTable
              :globalMinPayment='globalMinPayment'
              :loans='loans'
              :paymentSchedules='paymentSchedules'
            /> -->
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
            :type='constants.BUDGET'
            @exit-details-panel='unviewBudget'
          />
      </div>
    </div>
    <div :id='"sandbox"'></div>
  </div>
</template>

<style scoped></style>
