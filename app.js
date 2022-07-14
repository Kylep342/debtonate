

const app = Vue.createApp({
  data() {
    return {
      principal: 0,
      interestRate: 0,
      termInYears: 0,
      loans: [],
    }
  },
  methods: {
    setPrincipal(event) {
      this.principal = event.target.value;
    },
    setInterestRate(event) {
      this.interestRate = event.target.value;
    },
    setTermInYears(event) {
      this.termInYears = event.target.value;
    },
    createLoan() {
      const newLoan = {
        principal: this.principal,
        interestRate: this.interestRate,
        termInYears: this.termInYears,
      }
      alert(`New loan: ${newLoan}`);
      this.loans.push(newLoan);
      this.principal = 0;
      this.interestRate = 0;
      this.termInYears = 0;
    },
  },
});

app.mount("#assignment");
