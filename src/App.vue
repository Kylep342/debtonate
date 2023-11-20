<script>
import * as moneyfunx from 'moneyfunx';

import BudgetForm from './components/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import InterestTable from './components/InterestTable.vue';
import LoanForm from './components/LoanForm.vue';
import LoansPanel from './components/LoansPanel.vue';
import ManagementPanel from './components/ManagementPanel.vue';
import OptionsForm from './components/OptionsForm.vue';

export default {
  data() {
    return {
      budgets: [],
      colors: [
        '#DAF7A6',
        '#FFC300',
        '#FF5733',
        '#C70039',
        '#900C3F',
        '#581845',
      ],
      createBudgetFormActive: false,
      createLoanFormActive: false,
      currentLoanId: null,
      loans: [],
      optionsFormActive: false,
      reducePayments: false,
      roundingScale: 100,
      roundUp: false,
      showLoanDetailsPanel: false,
      snowballSort: false,
    };
  },
  computed: {
    createLoanFormTitle() {
      return this.currentLoanId
        ? `Editing Loan ${this.getLoanIndex(this.currentLoanId)}`
        : 'Creating a Loan';
    },
    createLoanButtonText() {
      return this.currentLoanId ? 'Save' : 'Create';
    },
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
    globalMinPayment() {
      return this.roundUp
        ? this.roundedGlobalMinPayment
        : this.rawGlobalMinPayment;
    },
    globalPrincipal() {
      return this.loans.reduce(
        (previousValue, currentValue) => previousValue + currentValue.principal,
        0,
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
    monthlyBudgets() {
      const budgets = this.budgets.map((budget) => ({
        id: String(Math.floor(Math.random() * Date.now())),
        relative: budget,
        absolute: budget + this.globalMinPayment,
      }));
      budgets.push({
        id: 'default',
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
          budget.id === 'default'
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
      const balances = {};
      this.loans.forEach((loan) => {
        balances[loan.id] = {};
        this.paymentSchedules.forEach((schedule) => {
          balances[loan.id][schedule.budgetId] = {
            label: schedule.label,
            totalPayemntAmount: schedule.paymentAmount,
            amortizationSchedule:
              schedule.paymentSchedule[loan.id].amortizationSchedule,
            totalPrincipalPaid: loan.principal,
            totalInterestPaid:
              schedule.paymentSchedule[loan.id].lifetimeInterest,
            totalPayments: schedule.paymentSchedule[loan.id].totalPayments,
          };
        });
      });
      return balances;
    },
    amortizationSchedulesGraphData() {
      const balances = {};
      this.loans.forEach((loan) => {
        balances[loan.id] = [];
        this.paymentSchedules.forEach((schedule) => {
          balances[loan.id].push({
            x: Array.from(
              schedule.paymentSchedule[loan.id].amortizationSchedule,
              (record) => record.period,
            ),
            y: Array.from(
              schedule.paymentSchedule[loan.id].amortizationSchedule,
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
      const charts = {};
      this.loans.forEach((loan, index) => {
        charts[loan.id] = {
          id: `amortizationSchedulesChart,${loan.id}`,
          data: this.amortizationSchedulesGraphData[loan.id],
          layout: {
            showLegend: false,
            barmode: 'group',
            title: `Balance Over Time - Loan ${index + 1}`,
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
    deleteLoan(id) {
      this.loans = this.loans.filter((loan) => loan.id !== id);
    },
    getLoan(id) {
      return this.loans.find((loan) => loan.id === id);
    },
    getLoanIndex(id) {
      return this.loans.findIndex((loan) => loan.id === id) + 1;
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
    },
    editLoan(id) {
      this.currentLoanId = id;
      const loan = this.getLoan(this.currentLoanId);
      this.principal = loan.principal;
      this.interestRate = loan.annualRate * 100;
      this.termInYears = loan.termInYears;
      this.createLoanFormActive = true;
    },
    viewLoan(id) {
      this.currentLoanId = id;
      this.showLoanDetailsPanel = true;
    },
    unviewLoan() {
      this.showLoanDetailsPanel = false;
      this.currentLoanId = null;
    },
    // TODO: enhance
    createBudget(createdBudget) {
      this.budgets = this.budgets.filter((budget) => budget !== createdBudget);
      this.budgets.push(createdBudget);
      this.budgets.sort((a, b) => b - a);
      this.createBudgetFormActive = false;
    },
    deleteBudget(budget) {
      this.budgets = this.budgets.filter(
        (addedBudget) => addedBudget !== parseFloat(budget.relative),
      );
    },
    loadState() {
      this.loans = JSON.parse(localStorage.getItem('debtonate.loans')).map(
        (loan) => new moneyfunx.Loan(
          loan.principal,
          loan.annualRate,
          12,
          loan.termInYears,
        ),
      );
      this.budgets = JSON.parse(localStorage.getItem('debtonate.budgets'));
    },
    saveState() {
      localStorage.setItem('debtonate.loans', JSON.stringify(this.loans));
      localStorage.setItem('debtonate.budgets', JSON.stringify(this.budgets));
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
      this.showLoanDetailsPanel = false;
      this.snowballSort = true;
      this.termInYears = null;
    },
  },
  components: {
    BudgetForm,
    BudgetsPanel,
    DetailsPanel,
    HeaderBar,
    InterestTable,
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
          :effectiveInterestRate='globalEffectiveInterestRate'
          :globalMinPayment='globalMinPayment'
          :loans='loans'
          :totalPrincipal='globalPrincipal'
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
            :loan='getLoan(currentLoanId)'
            :loanAmortizationSchedulesChart='
              amortizationSchedulesChartPerLoan[currentLoanId]
            '
            :loanPaymentSummaries='paymentSummaries[currentLoanId]'
            :monthlyBudgets='monthlyBudgets'
            @exit-details-panel='unviewLoan'
          />
        </div>
      </div>
    </div>
    <div :id='"sandbox"'></div>
  </div>
</template>

<style scoped></style>
