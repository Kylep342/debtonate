

const app = Vue.createApp({
  data() {
    return {
      principal: null,
      interestRate: null,
      termInYears: null,
      loans: [],
      paymentBudgets: [],
    }
  },
  computed: {
    paymentSchedules() {
      return this.loans
    }
  },
  watch: {},
  methods: {
    createLoan() {
      const newLoan = {
        principal: this.principal,
        interestRate: this.interestRate,
        termInYears: this.termInYears,
      }
      console.log(`New loan: ${JSON.stringify(newLoan)}`);
      this.loans.push(newLoan);
      this.principal = null;
      this.interestRate = null;
      this.termInYears = null;
    },
  },
});

app.mount("#assignment");
