<script setup lang="ts">
import { computed } from 'vue';
import { PaymentRecord, PaymentSchedule } from 'moneyfunx';

import AmortizationTableFrame from '@/apps/shared/components/AmortizationTableFrame.vue'; // Import the new component
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  paymentSchedule: PaymentSchedule,
  title: string,
  subtitle: string,
}>();

const globalOptions = useGlobalOptionsStore();
const periodLabel = computed<string>(() => (globalOptions.periodsAsDates ? 'Payment Date' : 'Payment Number'));

const headers = [
  { key: 'period', label: periodLabel, class: 'text-center' },
  { key: 'amountPaid', label: 'Amount Paid' },
  { key: 'principalPaid', label: 'Principal Paid' },
  { key: 'interestPaid', label: 'Interest Paid' },
  { key: 'principalRemaining', label: 'PrincipalRemaining' },
];

// tableRows pre-foromats rendered rows
const tableRows = computed(() => {
  return props.paymentSchedule.amortizationSchedule.map((record: PaymentRecord) => ({
    period: globalOptions.Period(record.period, true),
    amountPaid: globalOptions.Money(record.interest + record.principal),
    principalPaid: globalOptions.Money(record.principal),
    interestPaid: globalOptions.Money(record.interest),
    principalRemaining: globalOptions.Money(record.principalRemaining),
  }));
});

// tableTotals pre-formats the totals summary row
const tableTotals = computed(() => {
  const { lifetimePrincipal, lifetimeInterest } = props.paymentSchedule;
  return {
    amountPaid: globalOptions.Money(lifetimePrincipal + lifetimeInterest),
    principalPaid: globalOptions.Money(lifetimePrincipal),
    interestPaid: globalOptions.Money(lifetimeInterest),
    principalRemaining: globalOptions.Money(0),
  };
});
</script>

<template>
  <AmortizationTableFrame
    :title="title"
    :subtitle="subtitle"
    :headers="headers"
    :rows="tableRows"
    :totals="tableTotals"
  />
</template>
