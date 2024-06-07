<script setup>
import { computed, inject, onMounted, ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';

const props = defineProps(['id', 'title', 'type']);
const emits = defineEmits(['exit-details-panel']);

const budgetPrimitives = inject('budgetPrimitives');
const builders = inject('builders');
const loanPrimitives = inject('loanPrimitives');
const visuals = inject('visuals');

const monthlyBudgets = ref(budgetPrimitives.monthlyBudgets);

// const selectedBudget = ref();

// onMounted(() => {
//   selectBudget.value = monthlyBudgets.value[0];
// });

const flexBasis = computed(() => `basis-1/${monthlyBudgets.value.length}`);

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

// const selectBudget = (budget) => {
//   selectedBudget.value = budget.value;
// };

const generateKey = (...args) => args.map((arg) => arg.id || arg).join('');

const emitExit = () => {
  emits('exit-details-panel');
};
</script>

<template>
  <base-modal :id="props.id" class="">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="emitExit"
      >
        x
      </base-button
      >
    </template>
    <template #body>
      <!-- <div>
        <ul class="flex flex-row">
          <li v-for="budget in monthlyBudgets" :key="generateKey(loan, budget)">
            <base-button
              :class="'empty'"
              @click="selectBudget(budget)">
              Budget {{ budgetPrimitives.getBudgetIndex(budget) }}
            </base-button>
          </li>
        </ul>
        <AmortizationTable
          v-if="selectBudget"
          :id="'amortizationTable' + generateKey(loan, selectBudget)"
          :keyPrefix="generateKey(loan, selectBudget)"
          :paymentSummary="paymentSummary[selectBudget.id]"
          :title="
            builders.buildAmortizationTableTitle(
              loan,
              selectBudget,
              loanPrimitives.getLoanIndex(loan.id)
            )
          "
        />
      </div> -->
      <div role="tablist" class="tabs tabs-bordered w-full">
        <ul class="flex flex-row">
          <li v-for="budget in monthlyBudgets" :key="generateKey(loan, budget)">
            <input
              type="radio"
              name="amortization_tables"
              :id="'tab' + index"
              role="tab"
              :class="['tab', flexBasis]"
              :aria-label="`${budgetPrimitives.getBudgetName(budget.id)}`"
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
                    loanPrimitives.getLoanIndex(loan.id)
                  )
                "
              />
            </div>
          </li>
        </ul>
      </div>
    </template>
  </base-modal>
</template>
