<script>
import * as moneyfunx from "moneyfunx";
import BudgetsCard from "./components/BudgetsCard.vue";
import DataChart from "./components/DataChart.vue";
import InterestTable from './components/InterestTable.vue';
import LoanCard from "./components/LoansCard.vue";

export default {
  data() {
    return {
      currentLoanId: null,
      principal: null,
      interestRate: null,
      termInYears: null,
      budget: null,
      createFormActive: false,
      snowballSort: true,
      roundUp: false,
      loans: [],
      addedBudgets: [],
    };
  },
  computed: {
    createLoanButtonEnabled() {
      return [this.principal, this.interestRate, this.termInYears].every(
        (current) =>
          !Number.isNaN(parseFloat(current)) && parseFloat(current) > 0
      );
    },
    createLoanFormTitle() {
      return this.currentLoanId ? "Editing a Loan" : "Creating a Loan";
    },
    createBudgetButtonEnabled() {
      return (
        !Number.isNaN(parseFloat(this.budget)) && parseFloat(this.budget) > 0
      );
    },
    createLoanButtonText() {
      return this.currentLoanId ? "Save Changes" : "Create Loan";
    },
    rawGlobalMinPayment() {
      return this.loans.reduce(
        (previousValue, currentValue) =>
          (previousValue += currentValue.minPayment),
        0
      );
    },
    roundedGlobalMinPayment() {
      return this.rawGlobalMinPayment + (100 - this.rawGlobalMinPayment % 100);
    },
    globalMinPayment() {
      return this.roundUp ? this.roundedGlobalMinPayment : this.rawGlobalMinPayment;
    },
    monthlyBudgets() {
      const budgets = this.addedBudgets.map((budget) => {
        return {
          id: String(Math.floor(Math.random() * Date.now())),
          relative: budget,
          absolute: budget + this.globalMinPayment,
        };
      });
      budgets.push({
        id: "default",
        relative: 0,
        absolute: this.globalMinPayment,
      });
      return budgets;
    },
    paymentSchedules() {
      return this.monthlyBudgets.map((budget) => {
        return {
          budgetId: budget.id,
          paymentAmount: budget.relative,
          paymentSchedule: moneyfunx.payLoans(this.loans, budget.absolute),
        };
      });
    },
    lifetimeInterestTotals() {
        return [{
          x: this.monthlyBudgets.map((budget) => `$${(budget.relative + this.globalMinPayment).toFixed(2)}/month`),
          y: this.monthlyBudgets.map(
            (budget) =>
              this.paymentSchedules.filter(
                (schedule) => schedule.budgetId === budget.id
              )[0].paymentSchedule["totalInterest"].toFixed(2)
          ),
          name: "Total Interest Paid",
          type: "bar",
        }];
    },
    litChart() {
      return {
        id: "litChart",
        data: this.lifetimeInterestTotals,
        layout: {
          barmode: "group",
          title: "Total Interest Paid",
          yaxis: {
            hoverformat: "$.2f"
          }
        },
      };
    },
  },
  watch: {},
  methods: {
    toggleCreate() {
      this.createFormActive = true;
    },
    clearCreate() {
      this.currentLoanId = "";
      this.principal = null;
      this.interestRate = null;
      this.termInYears = null;
    },
    backCreate() {
      this.clearCreate();
      this.createFormActive = false;
    },
    toggleRounding() {
      this.roundUp = !this.roundUp;
    },
    sortLoans() {
      this.snowballSort ? this.snowball() : this.avalanche();
    },
    avalanche() {
      this.snowballSort = false;
      this.loans = moneyfunx.sortLoans(
        moneyfunx.sortLoans(this.loans, moneyfunx.snowball),
        moneyfunx.avalanche
      );
    },
    snowball() {
      this.snowballSort = true;
      this.loans = moneyfunx.sortLoans(
        moneyfunx.sortLoans(this.loans, moneyfunx.avalanche),
        moneyfunx.snowball
      );
    },
    deleteLoan(id) {
      this.loans = this.loans.filter((loan) => loan.id !== id);
    },
    getLoan(id) {
      return this.loans.filter((loan) => loan.id === id)[0];
    },
    createLoan(createFormActive = false) {
      const principal = parseFloat(this.principal);
      const interestRate = parseFloat(this.interestRate) / 100;
      const termInYears = parseFloat(this.termInYears);
      const newLoan = new moneyfunx.Loan(
        principal,
        interestRate,
        12,
        termInYears
      );
      if (this.currentLoanId) {
        this.deleteLoan(this.currentLoanId);
      }
      this.loans.push(newLoan);
      this.sortLoans();
      this.clearCreate();
      this.createFormActive = createFormActive;
    },
    editLoan(id) {
      this.currentLoanId = id;
      const loan = this.getLoan(this.currentLoanId);
      this.principal = loan.principal;
      this.interestRate = loan.annualRate * 100;
      this.termInYears = loan.termInYears;
      this.createFormActive = true;
    },
    addBudget() {
      this.addedBudgets = this.addedBudgets.filter(
        (budget) => budget !== parseFloat(this.budget)
      );
      this.addedBudgets.push(parseFloat(this.budget));
      this.addedBudgets.sort((a, b) => b - a);
      this.budget = null;
    },
    deleteBudget(budget) {
      this.addedBudgets = this.addedBudgets.filter(
        (addedBudget) => addedBudget !== parseFloat(budget)
      );
    },
    loadState() {
      this.loans = JSON.parse(localStorage.getItem("debtonate.loans")).map(
        (loan) =>
          new moneyfunx.Loan(
            loan.principal,
            loan.annualRate,
            12,
            loan.termInYears
          )
      );
      this.addedBudgets = JSON.parse(localStorage.getItem("debtonate.budgets"));
    },
    saveState() {
      localStorage.setItem("debtonate.loans", JSON.stringify(this.loans));
      localStorage.setItem(
        "debtonate.budgets",
        JSON.stringify(this.addedBudgets)
      );
    },
    clearState() {
      localStorage.clear();
    },
  },
  components: { DataChart, LoanCard, BudgetsCard, InterestTable },
};
</script>

<template>
  <section id="debtonate">
    <div id="header">
      <h1>Debtonate</h1>
      <div>
        <button @click="loadState">Load</button>
        <button @click="saveState">Save</button>
        <button @click="clearState" :disabled="true">Clear</button>
      </div>
    </div>
    <div>
      <div id="createLoanForm" v-show="createFormActive">
        <h2>{{ createLoanFormTitle }}</h2>
        <hr />
        <p>Principal</p>
        <input v-model="principal" type="number" label="Principal" />
        <hr />
        <p>Interest</p>
        <input v-model="interestRate" type="number" label="Interest" />
        <hr />
        <p>Term</p>
        <input v-model="termInYears" type="number" label="Term Length" />
        <hr />
        <button
          @click="createLoan(false)"
          :class="{ active: createLoanButtonEnabled }"
          :disabled="!createLoanButtonEnabled"
        >
          {{ createLoanButtonText }}
        </button>
        <button
          @click="createLoan(true)"
          :class="{ active: createLoanButtonEnabled }"
          :disabled="!createLoanButtonEnabled"
        >
          Create Another
        </button>
        <button
          @click="backCreate"
          :class="{ active: createFormActive }"
          :disabled="!createFormActive"
        >
          Back
        </button>
      </div>
    </div>
    <hr />
    <div id="todo" class="panel">
      <div id="todo2" class="mgmtPanel">
        <div id="loanManagementPanel">
          <h2>Your Loans</h2>
          <div>
            <button
              @click="toggleCreate"
              :class="{ active: !createFormActive }"
              :disabled="createFormActive"
            >
              Create a Loan
            </button>
          </div>
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
        <LoanCard :loans="loans" :editLoan="editLoan" :deleteLoan="deleteLoan"/>
        <div id="budgetManagementPanel">
          <h2>Your Budgets</h2>
          <p>Budget</p>
          <input v-model="budget" type="number" label="Budget Amount" />
          <br />
          <button @click="addBudget" :disabled="!createBudgetButtonEnabled">
            Create Budget
          </button>
        </div>
        <div v-show="loans.length" id="globalMinPaymentPanel">
          <p>Minimum Budget: ${{ globalMinPayment.toFixed(2) }}</p><br/><p v-if="roundUp">(Rounded by ${{ (roundedGlobalMinPayment - rawGlobalMinPayment).toFixed(2) }})</p>
          <button @click="toggleRounding">{{ roundUp ? "Disable" : "Enable" }} Rounding</button>
        </div>
        <BudgetsCard :budgets="addedBudgets" :deleteBudget="deleteBudget" />
      </div>
      <div id="todo3" class="presPanel">
        <div v-show="loans.length" id="lifetimeInterestTotals">
          <InterestTable :loans="loans" :paymentSchedules="paymentSchedules" :globalMinPayment="globalMinPayment" />
          <DataChart :chart="litChart" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
