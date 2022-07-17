// import * as Vue from "vue";
import * as moneyfunx from "moneyfunx";

const app = Vue.createApp({
  data() {
    return {
      principal: null,
      interestRate: null,
      termInYears: null,
      createFormActive: false,
      loans: [],
      paymentBudgets: [],
    };
  },
  computed: {
    paymentSchedules() {
      return this.loans;
    },
    globalMinPayment() {
      return this.loans.reduce(
        (previousValue, currentValue) =>
          (previousValue += currentValue.minPayment),
        0
      );
    },
    createLoanButtonEnabled() {
      return this.principal && this.interestRate && this.termInYears;
    },
  },
  watch: {},
  methods: {
    toggleCreate() {
      this.createFormActive = !this.createFormActive;
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

      console.log(`New loan: ${JSON.stringify(newLoan)}`);
      this.loans.push(newLoan);
      this.principal = null;
      this.interestRate = null;
      this.termInYears = null;
      this.createFormActive = createFormActive;
    },
    deleteLoan(id) {
      this.loans = this.loans.filter((loan) => loan.id != id);
    },
  },
});

app.mount("#assignment");
