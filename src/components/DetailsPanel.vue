<script setup>
import { computed, inject, ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';

const props = defineProps(['id', 'title', 'type']);
const emits = defineEmits(['exit-details-panel']);

const budgetPrimitives = inject('budgetPrimitives');
const builders = inject('builders');
const loanPrimitives = inject('loanPrimitives');
const visuals = inject('visuals');

const monthlyBudgets = ref(budgetPrimitives.monthlyBudgets);

const loan = computed(() => {
  const currentLoanId = loanPrimitives.currentLoanId?.value;
  return props.type === constants.LOAN && currentLoanId
    ? loanPrimitives.getLoan(currentLoanId)
    : loanPrimitives.getLoan(constants.TOTALS);
});

const paymentSummary = computed(() => {
  const currentLoanId = loanPrimitives.currentLoanId?.value;
  return props.type === constants.LOAN && currentLoanId
    ? visuals.paymentSummaries.value[currentLoanId]
    : visuals.paymentSummaries.value.totals;
});

const generateKey = (...args) => args.map((arg) => arg.id || arg).join('');

const emitExit = () => {
  emits('exit-details-panel');
};
</script>

<template>
  <base-modal :id="props.id">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #body>
      <!-- <div role="tablist" class="tabs tabs-bordered"> -->
        <!-- <ul> -->
        <ul role="tablist" class="tabs tabs-bordered">
          <li v-for="budget in monthlyBudgets" :key="generateKey(loan, budget)">
            <input
              type="radio"
              name="amortization_tables"
              role="tab"
              class="tab"
              :aria-label="`Tab ${budgetPrimitives.getBudgetIndex(budget.id)}`"
            >
            <div role="tabpanel" class="tab-content p-10">
              <AmortizationTable
                :id="'amortizationTable' + generateKey(loan, budget)"
                :keyPrefix="generateKey(loan, budget)"
                :paymentSummary="paymentSummary[budget.id]"
                :title="
                  builders.buildAmortizationTableTitle(
                    loan,
                    budget,
                    loanPrimitives.getLoanIndex(loanPrimitives.currentLoanId)
                  )
                "
              />
            </div>
          </li>
        </ul>
      <!-- </div> -->
    </template>
    <template #actions>
      <base-button :class="['createButton']" @click="emitExit"
        >Close</base-button
      >
    </template>
  </base-modal>
</template>
