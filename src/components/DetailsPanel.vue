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
const viewedBudgetId = ref(constants.DEFAULT);

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

const flexBasis = `basis-1/${monthlyBudgets.value.length}`;

const setViewedBudgetId = (value) => {
  viewedBudgetId.value = value;
};

// const buttonStyle = (flag) => (flag ? 'btn-success' : '');

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
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="emitExit">
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['tabframe', 'w-auto']">
        <div :class="['tabs', 'flex', 'flex-row', 'join', 'join-horizontal', 'w-full', 'flex-grow']">
          <div v-for="budget in monthlyBudgets" :key="generateKey(loan, budget)"
            :class="['join-item', flexBasis, 'w-full', { 'border-t-2': budget.id === viewedBudgetId }]">
            <base-button :class="['btn-ghost', 'w-full']" @click=setViewedBudgetId(budget.id)>{{
              budgetPrimitives.getBudgetName(budget.id)
            }}</base-button>
          </div>
        </div>
        <div v-for="budget in monthlyBudgets" :key="generateKey(loan, budget)" name="tabscontent" class="w-auto">
          <AmortizationTable v-show="budget.id === viewedBudgetId" :id="'amortizationTable' + generateKey(loan, budget)"
            :keyPrefix="generateKey(loan, budget)" :paymentSummary="paymentSummary[budget.id]" :title="builders.buildAmortizationTableTitle(
              loan,
              budget,
            )
              " :subtitle="builders.buildAmortizationTableSubtitle(
                loan,
                budget,
              )
                " />
        </div>
      </div>
    </template>
  </base-modal>
</template>
