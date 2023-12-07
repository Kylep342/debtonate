<script>
export default {
  props: [
    'budget',
    'budgetTotals',
    'deleteBudget',
    'editBudget',
    'index',
    'viewBudget',
  ],
  computed: {
    budgetAmount() {
      return `$${this.budget.absolute.toFixed(2)}/mo`;
    },
    budgetExtra() {
      return `+$${this.budget.relative.toFixed(2)}/mo`;
    },
    budgetPayments() {
      return this.budgetTotals.amortizationSchedule.length;
    },
    budgetTitle() {
      return this.budget.id === 'default' ? 'Minimum' : `Budget ${this.index}`;
    },
    budgetTotalInterest() {
      return `$${this.budgetTotals.lifetimeInterest.toFixed(2)}`;
    },
  },
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 :class="['cardHeaderTitle']">{{ budgetTitle }}</h2>
      <div :class="['cardheaderSubSection']">
        <button v-if="budget.id !== 'default'"
          :class="['exitButton', 'bold']"
          @click='this.deleteBudget(this.budget)'
        >
          x
        </button>
      </div>
    </div>
    <div :class="['cardBody']">
      <table :class="['cardTable']">
        <tr>
          <td :class="['textLeft']">Amount</td>
          <td :class="['textRight']">
            <b>{{ budgetAmount }}</b>
          </td>
        </tr>
        <tr v-if="this.budget.id !== 'default'">
          <td :class="['textLeft']">Extra</td>
          <td :class="['textRight']">
            <b>{{ budgetExtra }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Interest</td>
          <td :class="['textRight']">
            <b>{{ budgetTotalInterest }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Payments</td>
          <td :class="['textRight']">
            <b>{{ budgetPayments }}</b>
          </td>
        </tr>
      </table>
    </div>
    <div :class="['cardFooter', 'footer']">
      <div :class="['cardFooterButtonContainer']">
        <button @click='this.viewBudget(this.budget.id)'>View</button>
      </div>
      <div :class="['cardFooterButtonContainer']">
        <button @click='this.editBudget(this.budget.id)'>Edit</button>
      </div>
    </div>
  </div>
</template>
