<script setup lang="ts">
import { computed } from 'vue';
import { ContributionRecord, ContributionSchedule } from 'moneyfunx';

import AmortizationTableFrame from '@/apps/shared/components/AmortizationTableFrame.vue'; // Import the new component
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  contributionSchedule: ContributionSchedule,
  title: string,
  subtitle: string,
}>();

const globalOptions = useGlobalOptionsStore();
const periodLabel = computed<string>(() => (globalOptions.periodsAsDates ? 'Contribution Date' : 'Contribution Number'))

const headers = [
  { key: 'period', label: periodLabel, class: 'text-center' },
  { key: 'totalGrowth', label: 'Total Growth' },
  { key: 'contribution', label: 'Contribution' },
  { key: 'interest', label: 'Interest' },
  { key: 'currentBalance', label: 'Current Balance' },
];

// tableRows pre-foromats rendered rows
const tableRows = computed(() => {
  return props.contributionSchedule.amortizationSchedule.map((record: ContributionRecord) => ({
    period: globalOptions.Period(record.period, true),
    totalGrowth: globalOptions.Money(record.growth + record.contribution),
    contribution: globalOptions.Money(record.contribution),
    interest: globalOptions.Money(record.growth),
    currentBalance: globalOptions.Money(record.currentBalance),
  }));
});

// tableTotals pre-formats the totals summary row
const tableTotals = computed(() => {
  const { lifetimeContribution, lifetimeGrowth } = props.contributionSchedule;
  return {
    totalGrowth: globalOptions.Money(lifetimeGrowth + lifetimeContribution),
    contribution: globalOptions.Money(lifetimeContribution),
    interest: globalOptions.Money(lifetimeGrowth),
    currentBalance: globalOptions.Money(lifetimeGrowth + lifetimeContribution),
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
