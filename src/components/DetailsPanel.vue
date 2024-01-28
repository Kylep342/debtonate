<script setup>
import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';

const props = defineProps([
  'index',
  'amortizationSchedulesChart',
  'loan',
  'monthlyBudgets',
  'paymentSummaries',
  'title',
  'type',
]);
const emits = defineEmits(['exit-details-panel']);

const buildTitle = (loan, monthlyBudget) => (
  `${loan.id === constants.TOTALS ? 'All Loans ' : `Loan ${props.index}`} `
  + `($${loan.principal.toFixed(2)} `
  + `@ ${(loan.annualRate * 100).toFixed(2)}%) `
  + `Total Budget: $${monthlyBudget.absolute.toFixed(2)}/mo`
);

const generateKey = (...args) => (''.concat(args.id));

const emitExit = () => { emits('exit-details-panel'); };
</script>

<template>
  <base-modal>
    <template #header>
      <h2>{{ props.title }}</h2>
    </template>
    <template #body>
      <div>
        <ul>
          <li
            v-for='budget in props.monthlyBudgets'
            :key='generateKey(props.loan, budget)'
          >
            <AmortizationTable
              :id="'amortizationTable' + generateKey(props.loan, budget)"
              :index='props.index'
              :keyPrefix='generateKey(props.loan, budget)'
              :paymentSummary='props.paymentSummaries[budget.id]'
              :title='buildTitle(props.loan, budget)'
            />
          </li>
        </ul>
        <base-chart
          :chart='props.amortizationSchedulesChart'
          :id="'amortizationChart' + loan.id"
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
