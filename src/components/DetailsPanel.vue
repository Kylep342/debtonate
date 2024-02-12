<script setup>
import { computed, inject, ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';

const props = defineProps([
  'id',
  'type',
  'title',
]);
const emits = defineEmits(['exit-details-panel']);

const appData = inject('appData');
const builders = inject('builders');
const budgetPrimitives = inject('budgetPrimitives');
const loanPrimitives = inject('loanPrimitives');

const monthlyBudgets = ref(budgetPrimitives.monthlyBudgets);

const loan = computed(() => (
  props.type.value === constants.LOAN
    ? loanPrimitives.getLoan(loanPrimitives.currentLoanId)
    : loanPrimitives.getLoan(constants.TOTALS)
));

const amortizationSchedulesChart = computed(() => (
  props.type.value === constants.LOAN
    ? appData.amortizationSchedulesChartPerLoan[loanPrimitives.currentLoanId]
    : appData.amortizationSchedulesChartPerLoan.totals
));

const paymentSummary = computed(() => (
  props.type.value === constants.LOAN
    ? appData.paymentSummaries[loanPrimitives.currentLoanId]
    : appData.paymentSummaries.totals
));

const generateKey = (...args) => (''.concat(args.id));

const emitExit = () => { emits('exit-details-panel'); };
</script>

<template>
  <base-modal :id='props.id'>
    <template #header>
      <h2>{{ props.title }}</h2>
    </template>
    <template #body>
      <div>
        <ul>
          <li
            v-for='budget in monthlyBudgets'
            :key='generateKey(loan, budget)'
          >
            <AmortizationTable
              :id="'amortizationTable' + generateKey(loan, budget)"
              :keyPrefix='generateKey(loan, budget)'
              :paymentSummary='paymentSummary'
              :title='builders.buildAmortizationTableTitle(
                loan,
                budget,
                loanPrimitives.getLoanIndex(loanPrimitives.currentLoanId),
              )'
            />
          </li>
        </ul>
        <base-chart
          :chart='amortizationSchedulesChart'
          :id="'amortizationSchedulesChart'"
        />
      </div>
    </template>
    <template #actions>
      <base-button :class="['createButton']" @click='emitExit'
        >Close</base-button
      >
    </template>
  </base-modal>
</template>
