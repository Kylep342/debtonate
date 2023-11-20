<script>
import BudgetCard from './BudgetCard.vue';

export default {
  props: ['budgets', 'budgetsTotals', 'deleteBudget'],
  components: { BudgetCard },
};
</script>

<template>
  <div :class="['panel']" v-show='this.budgets.length'>
    <ul :class="['cardHolder']">
      <li v-for='(budget, index) in this.budgets' :key='budget.id' :class="['card']">
        <BudgetCard
          :budget='budget'
          :budgetTotals='this.budgetsTotals[budget.id]'
          :deleteBudget='this.deleteBudget'
          :index='index + 1'
        />
      </li>
    </ul>
  </div>
</template>
