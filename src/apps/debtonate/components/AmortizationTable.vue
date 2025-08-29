<script setup lang="ts">
import { computed } from 'vue';
import { PaymentSchedule } from 'moneyfunx';

import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  paymentSchedule: PaymentSchedule,
  title: string,
  subtitle: string,
}>();

const globalOptions = useGlobalOptionsStore();

const paymentHeader = computed<string>(() => (globalOptions.periodsAsDates ? 'Payment Date' : 'Payment Number'));

const amortizationRows = computed(() => {
  return props.paymentSchedule.amortizationSchedule.map(record => ({
    period: globalOptions.Period(record.period, true),
    amountPaid: globalOptions.Money(record.interest + record.principal),
    principalPaid: globalOptions.Money(record.principal),
    interestPaid: globalOptions.Money(record.interest),
    principalRemaining: globalOptions.Money(record.principalRemaining),
  }));
});

const tableTotals = computed(() => {
  const { lifetimePrincipal, lifetimeInterest } = props.paymentSchedule;
  return {
    totalPaid: globalOptions.Money(lifetimePrincipal + lifetimeInterest),
    totalPrincipal: globalOptions.Money(lifetimePrincipal),
    totalInterest: globalOptions.Money(lifetimeInterest),
    finalBalance: globalOptions.Money(0),
  };
});
</script>

<template>
  <div>
    <div>
      <h3 :class="['text-center']">{{ title }}</h3>
      <h5 :class="['text-center']">{{ subtitle }}</h5>
    </div>
    <div :class="['justifyCenter', 'max-h-90', 'overflow-y-auto']">
      <base-table :class="['table-sm']">
        <template #header>
          <thead>
            <tr>
              <th :class="['text-right']">{{ paymentHeader }}</th>
              <th :class="['text-right']">Amount Paid</th>
              <th :class="['text-right']">Principal Paid</th>
              <th :class="['text-right']">Interest Paid</th>
              <th :class="['text-right']">Principal Remaining</th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(row, index) in amortizationRows" :key="index">
              <td :class="['text-center']">{{ row.period }}</td>
              <td :class="['text-right']">{{ row.amountPaid }}</td>
              <td :class="['text-right']">{{ row.principalPaid }}</td>
              <td :class="['text-right']">{{ row.interestPaid }}</td>
              <td :class="['text-right']">{{ row.principalRemaining }}</td>
            </tr>
          </tbody>
        </template>
        <template #footer>
          <tfoot>
            <tr>
              <td :class="['textLeft']"><b>Totals:</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.totalPaid }}</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.totalPrincipal }}</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.totalInterest }}</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.finalBalance }}</b></td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>