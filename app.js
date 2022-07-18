// import * as Vue from "vue";
import * as moneyfunx from "moneyfunx";
// import * as Plotly from "plotly.js-dist";

// const graph1 = Vue.component("reactive-chart", {
//   props: ["litChart"],
//   template: '<div :ref="litChart.id"></div>',
//   mounted() {
//     Plotly.plot(
//       this.$refs[this.litChart.id],
//       this.litChart.data,
//       this.litChart.layout
//     );
//   },
//   watch: {
//     chart: {
//       handler: function () {
//         Plotly.react(
//           this.$refs[this.chart.id],
//           this.chart.data,
//           this.chart.layout
//         );
//       },
//       deep: true,
//     },
//   },
// });

const app = Vue.createApp({
  data() {
    return {
      principal: null,
      interestRate: null,
      termInYears: null,
      budget: null,
      createFormActive: false,
      snowballSort: true,
      loans: [],
      addedBudgets: [],
    };
  },
  computed: {
    createLoanButtonEnabled() {
      return [this.principal, this.interestRate, this.termInYears].every(
        (current) => !Number.isNaN(parseFloat(current))
      );
    },
    globalMinPayment() {
      return this.loans.reduce(
        (previousValue, currentValue) =>
          (previousValue += currentValue.minPayment),
        0
      );
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
      return this.loans.map((loan) => {
        return {
          x: this.monthlyBudgets.map((budget) => budget.relative),
          y: this.monthlyBudgets.map(
            (budget) =>
              this.paymentSchedules.filter(
                (schedule) => schedule.budgetId === budget.id
              )[0].paymentSchedule[loan.id].lifetimeInterest
          ),
          type: "bar",
        };
      });
    },
    litChart() {
      return {
        id: "litChart",
        data: this.lifetimeInterestTotals,
        layout: { barmode: "group" },
      };
    },
  },
  watch: {},
  methods: {
    toggleCreate() {
      this.createFormActive = !this.createFormActive;
    },
    sortFunction() {
      return this.snowballSort ? moneyfunx.snowball : moneyfunx.avalanche;
    },
    avalanche() {
      this.snowballSort = false;
      this.loans = moneyfunx.sortLoans(this.loans, moneyfunx.avalanche);
    },
    snowball() {
      this.snowballSort = true;
      this.loans = moneyfunx.sortLoans(this.loans, moneyfunx.snowball);
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

      if (this.currentId) {
        this.loans = this.loans.filter((loan) => loan.id !== this.currentId);
      }

      this.loans.push(newLoan);
      this.loans = moneyfunx.sortLoans(this.loans, this.sortFunction());
      this.currentId = "";
      this.principal = null;
      this.interestRate = null;
      this.termInYears = null;
      this.createFormActive = createFormActive;
    },
    deleteLoan(id) {
      this.loans = this.loans.filter((loan) => loan.id !== id);
      this.loans = moneyfunx.sortLoans(this.loans, this.sortFunction());
    },
    editLoan(id) {
      this.currentId = id;
      const loan = this.loans.filter((loan) => loan.id === this.currentId)[0];
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
      console.log(JSON.parse(localStorage.getItem("debtonate")));
      this.loans = JSON.parse(localStorage.getItem("debtonate")).map(
        (loan) =>
          new moneyfunx.Loan(
            loan.principal,
            loan.annualRate,
            12,
            loan.termInYears
          )
      );
    },
    saveState() {
      localStorage.setItem("debtonate", JSON.stringify(this.loans));
    },
    clearState() {
      localStorage.clear();
    },
  },
});

app.mount("#assignment");
