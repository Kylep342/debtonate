<script>
import * as moneyfunx from 'moneyfunx';

import BudgetsPanel from './components/BudgetsPanel.vue';
import Chart from './components/Chart.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import InterestTable from './components/InterestTable.vue';
import LoansPanel from './components/LoansPanel.vue';

export default {
  data() {
    return {
      currentLoanId: null,
      principal: null,
      interestRate: null,
      termInYears: null,
      budget: null,
      createBudgetFormActive: false,
      createLoanFormActive: false,
      optionsFormActive: false,
      snowballSort: true,
      reducePayments: false,
      roundUp: false,
      showLoanDetailsPanel: false,
      loans: [],
      budgets: [],
      colors: ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'],
    };
  },
  computed: {
    createLoanButtonEnabled() {
      return [this.principal, this.interestRate, this.termInYears].every(
        (current) => !Number.isNaN(parseFloat(current)) && parseFloat(current) > 0,
      );
    },
    createLoanFormTitle() {
      return this.currentLoanId ? `Editing Loan ${this.getLoanIndex(this.currentLoanId)}` : 'Creating a Loan';
    },
    createBudgetButtonEnabled() {
      return (
        !Number.isNaN(parseFloat(this.budget)) && parseFloat(this.budget) > 0
      );
    },
    createLoanButtonText() {
      return this.currentLoanId ? 'Save Changes' : 'Create';
    },
    enableReducePaymentsButtonText() {
      return this.reducePayments ? 'Turn Off' : 'Turn On';
    },
    rawGlobalMinPayment() {
      return this.loans.reduce(
        (previousValue, currentValue) => (previousValue + currentValue.minPayment),
        0,
      );
    },
    roundedGlobalMinPayment() {
      return this.rawGlobalMinPayment + (100 - (this.rawGlobalMinPayment % 100));
    },
    globalMinPayment() {
      return this.roundUp ? this.roundedGlobalMinPayment : this.rawGlobalMinPayment;
    },
    globalPrincipal() {
      return this.loans.reduce(
        (previousValue, currentValue) => (previousValue + currentValue.principal),
        0,
      );
    },
    globalEffectiveInterestRate() {
      return this.loans.reduce(
        (previousValue, currentValue) => (
          previousValue + currentValue.annualRate
          * (currentValue.principal / this.globalPrincipal)
        ),
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
        paymentSchedule: moneyfunx.payLoans(this.loans, budget.absolute),
        label: budget.id === 'default'
          ? `Baseline $${this.globalMinPayment.toFixed(2)}/mo`
          : `Additional $${budget.relative.toFixed(2)}/mo ($${budget.absolute.toFixed(2)}/mo)`,
      }));
    },
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
            amortizationSchedule: schedule.paymentSchedule[loan.id].amortizationSchedule,
            totalPrincipalPaid: loan.principal,
            totalInterestPaid: schedule.paymentSchedule[loan.id].lifetimeInterest,
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
            name: `$${(schedule.paymentAmount + this.globalMinPayment).toFixed(2)}/mo`,
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
      // });
      return charts;
    },
    lifetimeInterestTotals() {
      return [{
        x: this.monthlyBudgets.map((budget) => `$${(budget.relative + this.globalMinPayment).toFixed(2)}/month`),
        y: this.monthlyBudgets.map(
          (budget) => this.paymentSchedules.filter(
            (schedule) => schedule.budgetId === budget.id,
          )[0].paymentSchedule.totalInterest.toFixed(2),
        ),
        name: 'Total Interest Paid',
        type: 'bar',
      }];
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
    clearCreateLoan() {
      this.currentLoanId = null;
      this.principal = null;
      this.interestRate = null;
      this.termInYears = null;
    },
    exitCreateBudgetForm() {
      this.createBudgetFormActive = false;
    },
    exitCreateLoanForm() {
      this.clearCreateLoan();
      this.createLoanFormActive = false;
    },
    exitOptionsForm() {
      this.optionsFormActive = false;
    },
    enableReducePayments() {
      this.reducePayments = !this.reducePayments;
    },
    enableRounding() {
      this.roundUp = !this.roundUp;
    },
    sortLoans() {
      return this.snowballSort ? this.snowball() : this.avalanche();
    },
    avalanche() {
      this.snowballSort = false;
      this.loans = moneyfunx.sortLoans(
        moneyfunx.sortLoans(this.loans, moneyfunx.snowball),
        moneyfunx.avalanche,
      );
    },
    snowball() {
      this.snowballSort = true;
      this.loans = moneyfunx.sortLoans(
        moneyfunx.sortLoans(this.loans, moneyfunx.avalanche),
        moneyfunx.snowball,
      );
    },
    deleteLoan(id) {
      this.loans = this.loans.filter((loan) => loan.id !== id);
    },
    getLoan(id) {
      return this.loans.filter((loan) => loan.id === id)[0];
    },
    getLoanIndex(id) {
      return this.loans.findIndex((loan) => loan.id === id) + 1;
    },
    createLoan(createLoanFormActive = false) {
      const principal = parseFloat(this.principal);
      const interestRate = parseFloat(this.interestRate) / 100;
      const termInYears = parseFloat(this.termInYears);
      const newLoan = new moneyfunx.Loan(
        principal,
        interestRate,
        12,
        termInYears,
      );
      if (this.currentLoanId) {
        this.deleteLoan(this.currentLoanId);
      }
      this.loans.push(newLoan);
      this.sortLoans();
      this.clearCreateLoan();
      this.createLoanFormActive = createLoanFormActive;
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
    addBudget() {
      this.budgets = this.budgets.filter(
        (budget) => budget !== parseFloat(this.budget),
      );
      this.budgets.push(parseFloat(this.budget));
      this.budgets.sort((a, b) => b - a);
      this.budget = null;
      this.createBudgetFormActive = false;
    },
    deleteBudget(budget) {
      this.budgets = this.budgets.filter(
        (addedBudget) => addedBudget !== parseFloat(budget),
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
      localStorage.setItem(
        'debtonate.budgets',
        JSON.stringify(this.budgets),
      );
    },
    clearState() {
      localStorage.clear();
      this.currentLoanId = null;
      this.principal = null;
      this.interestRate = null;
      this.termInYears = null;
      this.budget = null;
      this.createBudgetFormActive = false;
      this.createLoanFormActive = false;
      this.snowballSort = true;
      this.reducePayments = false;
      this.roundUp = false;
      this.showLoanDetailsPanel = false;
      this.loans = [];
      this.budgets = [];
    },
  },
  components: {
    Chart, LoansPanel, BudgetsPanel, InterestTable, DetailsPanel,
  },
};
</script>

<template>
  <div id="debtonate">
    <header :id="['header']" :class="['header']">
      <h1 :class="['headerTitle']">Debtonate</h1>
      <div :class="['headerButtonContainer']">
        <button :class="['headerButton']" @click="openOptionsForm">Options</button>
        <button :class="['headerButton']" @click="loadState">Load</button>
        <button :class="['headerButton']" @click="saveState">Save</button>
        <button :class="['headerButton']" @click="clearState" :disabled="false">Clear</button>
      </div>
    </header>
    <!-- NOTE: form start -->
    <div id="createLoanForm" class="modalFrame" v-show="createLoanFormActive">
      <div :class="['modal']">
        <div :class="['header']">
          <h2 :class="['headerTitle']">{{ createLoanFormTitle }}</h2>
          <div :class="['headerButtonContainer']">
            <button
              @click="exitCreateLoanForm"
              :class="{ active: createLoanFormActive, exitButton: true, bold: true }"
              :disabled="!createLoanFormActive"
            >
              x
            </button>
          </div>
        </div>
        <div :class="['cardBody']">
          <div :class="['formInputs']">
            <div :class="['formInputWrapper']">
                <label>Principal</label>
                <input v-model="principal" type="number" label="Principal" />
            </div>
            <div :class="['formInputWrapper']">
                <label>Interest</label>
                <input v-model="interestRate" type="number" label="Interest" />
            </div>
            <div :class="['formInputWrapper']">
                <label>Term</label>
                <input v-model="termInYears" type="number" label="Term Length" />
            </div>
          </div>
        </div>
        <div :class="['cardFooter', 'footer']">
          <div :class="['cardFooterButtonContainer']">
            <button
              @click="createLoan(false)"
              :class="{ active: createLoanButtonEnabled, createButton: true }"
              :disabled="!createLoanButtonEnabled"
            >
              {{ createLoanButtonText }}
            </button>
            <button
              @click="createLoan(true)"
              :class="{ active: createLoanButtonEnabled, createButton: true }"
              :disabled="!createLoanButtonEnabled"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="createBudgetForm" class="modalFrame" v-show="createBudgetFormActive">
      <div :class="['modal']">
        <div :class="['header']">
          <h2 :class="['headerTitle']">Creating a Budget</h2>
          <div :class="['headerButtonContainer']">
            <button
              @click="exitCreateBudgetForm"
              :class="{ active: createBudgetFormActive, exitButton: true, bold: true }"
              :disabled="!createBudgetFormActive"
            >
              x
            </button>
          </div>
        </div>
        <div :class="['cardBody']">
          <div :class="['formInputs']">
            <div :class="['formInputWrapper']">
                <label>Budget</label>
                <input v-model="budget" type="number" label="Budget" />
            </div>
          </div>
        </div>
          <div :class="['cardFooter', 'footer']">
            <div :class="['cardFooterButtonContainer']">
              <button
                @click="addBudget"
                :class="{ active: createBudgetButtonEnabled, createButton: true }"
                :disabled="!createBudgetButtonEnabled"
              >
                Create
              </button>
            </div>
          </div>
      </div>
    </div>
    <div id="optionsForm" class="modalFrame" v-show="optionsFormActive">
      <div :class="['modal']">
        <div :class="['header']">
          <h2 :class="['headerTitle']">Options</h2>
          <div :class="['headerButtonContainer']">
            <button
              @click="exitOptionsForm"
              :class="{ active: optionsFormaActive, exitButton: true, bold: true }"
              :disabled="!optionsFormActive"
            >
              x
            </button>
          </div>
        </div>
        <div :class="['cardBody']">
          <div :class="['formInputs']">
            <div :class="['formInputWrapper']">
              <h3>Sorting Method</h3>
              <button
                @click="avalanche"
                :class="{ active: snowballSort }"
                :disabled="!snowballSort"
              >
                Avalanche
              </button>
              <button
                @click="snowball"
                :class="{ active: !snowballSort }"
                :disabled="snowballSort"
              >
                Snowball
              </button>
            </div>
            <div :class="['formInputWrapper']">
              <h3>Reduce Payments</h3>
              <button
                @click="enableReducePayments"
                :class="{ active: true }"
              >
                {{ enableReducePaymentsButtonText }}
              </button>
            </div>
            <div :class="['formInputWrapper']">
              <h3>Rounding</h3>
              <button
                @click="enableRounding"
              >
                {{ roundUp ? "Disable" : "Enable" }} Rounding
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div :class="['appBody']">
      <div id="todo2" :class="['mgmtPanel']">
        <div id="loanManagementPanel">
          <div :class="['panelHeader', 'header']">
            <h2 class="panelHeaderTitle">Loans</h2>
            <div class="panelHeaderButtonContainer">
              <button
                @click="openCreateLoanForm"
                :class="{ active: !createLoanFormActive, bold: true }"
                :disabled="createLoanFormActive"
              >
              +
              </button>
            </div>
          </div>
        </div>
        <LoansPanel
          :loans="loans"
          :deleteLoan="deleteLoan"
          :editLoan="editLoan"
          :viewLoan="viewLoan"
        />
        <div id="budgetManagementPanel">
          <div :class="['panelHeader', 'header']">
            <h2 class="panelHeaderTitle">Budgets</h2>
            <div class="panelHeaderButtonContainer">
              <button
                @click="openCreateBudgetForm"
                :class="{ active: !createLoanFormActive, bold: true }"
                :disabled="createLoanFormActive"
              >
              +
              </button>
            </div>
          </div>
        </div>
        <BudgetsPanel :budgets="budgets" :deleteBudget="deleteBudget" />
      </div>
      <div id="todo3" v-show="loans.length" :class="['presPanel']">
        <div :class="['panel']">
          <div :class="['panelHeader', 'header']">
            <h2>Repayment Information</h2>
          </div>
          <div id="infoPanel" :class="['infoPanel']">
            <div id="globalMinPaymentPanel">
              <p>Minimum Payment: ${{ globalMinPayment.toFixed(2) }}</p>
              <p v-if="roundUp">
                (Rounded by ${{ (roundedGlobalMinPayment - rawGlobalMinPayment).toFixed(2) }})
              </p>
            </div>
            <div id="globalPrincipalPanel">
              <p>Total Principal: ${{ globalPrincipal.toFixed(2) }}</p>
            </div>
            <div>
              <p>Effective Interest Rate: {{ (globalEffectiveInterestRate * 100).toFixed(2) }}%</p>
            </div>
          </div>
          <div id="lifetimeInterestTotals">
            <InterestTable
              :loans="loans"
              :paymentSchedules="paymentSchedules"
              :globalMinPayment="globalMinPayment"
            />
            <Chart :class="['graph']" :chart="lifetimeInterestTotalsChart" />
          </div>
        </div>
        <div>
          <DetailsPanel
            v-if="showLoanDetailsPanel"
            :loan="getLoan(currentLoanId)"
            :index="getLoanIndex(currentLoanId)"
            :monthlyBudgets="monthlyBudgets"
            :loanPaymentSummaries="paymentSummaries[currentLoanId]"
            :loanAmortizationSchedulesChart="amortizationSchedulesChartPerLoan[currentLoanId]"
            :exit="unviewLoan"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
