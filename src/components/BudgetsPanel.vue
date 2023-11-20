<script>
import BudgetCard from './BudgetCard.vue';

export default {
  props: ['budgets', 'deleteBudget', 'budgetsTotals'],
  components: { BudgetCard },
};
</script>

<template>
  <div :class="['panel']" v-show='this.budgets.length'>
    <ul :class="['cardHolder']">
      <li v-for='(budget, index) in this.budgets' :key='budget.id' :class="['card']">
        <BudgetCard
          :budget='budget'
          :deleteBudget='this.deleteBudget'
          :index='index + 1'
          :budgetTotals='this.budgetsTotals[budget.id]'
        />
      </li>
    </ul>
  </div>
</template>
