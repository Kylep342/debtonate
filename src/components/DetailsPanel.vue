<script setup>
import { computed, inject } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';

const props = defineProps([
  'id',
  'type',
  'title',
]);
const emits = defineEmits(['exit-details-panel']);

const budgetPrimitives = inject('budgetPrimitives');
const loanPrimitives = inject('loanPrimitives');
const appData = inject('appData');

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
            v-for='budget in budgetPrimitives.monthlyBudgets'
            :key='generateKey(loan, budget)'
          >
            <AmortizationTable
              :id="'amortizationTable' + generateKey(loan, budget)"
              :keyPrefix='generateKey(loan, budget)'
              :paymentSummary='paymentSummary'
              :title='props.buildAmortizationTableTitle(loan, budget)'
            />
          </li>
        </ul>
        <base-chart
          :chart='amortizationSchedulesChart'
          :id="'amortizationSchedulesChart' + loan.id"
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
