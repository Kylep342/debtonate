<script setup>
import { computed, inject, ref, watch } from 'vue';

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
  const currentLoanId = loanPrimitives.currentLoanId.value;
  return props.type.value === constants.LOAN
    ? loanPrimitives.getLoan(currentLoanId)
    : loanPrimitives.getLoan(constants.TOTALS);
});

const amortizationSchedulesChart = computed(() => {
  const currentLoanId = loanPrimitives.currentLoanId.value;
  return props.type.value === constants.LOAN
    ? visuals.amortizationSchedulesCharts.value[currentLoanId]
    : visuals.amortizationSchedulesCharts.value.totals;
});

const paymentSummary = computed(() => {
  const currentLoanId = loanPrimitives.currentLoanId.value;
  return props.type.value === constants.LOAN
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
      <div>
        <ul>
          <li v-for="budget in monthlyBudgets" :key="generateKey(loan, budget)">
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
          </li>
        </ul>
        <base-chart
          :chart="amortizationSchedulesChart"
          :id="'amortizationSchedulesChart'"
        />
      </div>
    </template>
    <template #actions>
      <base-button :class="['createButton']" @click="emitExit"
        >Close</base-button
      >
    </template>
  </base-modal>
</template>
