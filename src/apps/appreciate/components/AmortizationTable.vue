<script setup lang="ts">
import { computed } from 'vue';
import { ContributionSchedule  } from 'moneyfunx';

import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  contributionSchedule: ContributionSchedule,
  title: string,
  subtitle: string,
}>();

const globalOptions = useGlobalOptionsStore();

const paymentHeader = computed<string>(() => (globalOptions.periodsAsDates ? 'Payment Date' : 'Payment Number'));

const amortizationRows = computed(() => {
  return props.contributionSchedule.amortizationSchedule.map(record => ({
    period: globalOptions.Period(record.period, true),
    growth: globalOptions.Money(record.growth + record.contribution),
    contribution: globalOptions.Money(record.contribution),
    interest: globalOptions.Money(record.growth),
    currentBalance: globalOptions.Money(record.currentBalance),
  }));
});

const tableTotals = computed(() => {
  const { lifetimeContribution, lifetimeGrowth } = props.contributionSchedule;
  return {
    totalGrowth: globalOptions.Money(lifetimeGrowth + lifetimeContribution),
    totalContribution: globalOptions.Money(lifetimeContribution),
    totalInterest: globalOptions.Money(lifetimeGrowth),
    finalBalance: globalOptions.Money(lifetimeGrowth + lifetimeContribution),
  }
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
              <th :class="['text-right']">Total Growth</th>
              <th :class="['text-right']">Contribution</th>
              <th :class="['text-right']">Interest</th>
              <th :class="['text-right']">Current Balance</th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(row, index) in amortizationRows" :key="index">
              <td :class="['text-center']">{{ row.period }}</td>
              <td :class="['text-right']">{{ row.growth }}</td>
              <td :class="['text-right']">{{ row.contribution }}</td>
              <td :class="['text-right']">{{ row.interest }}</td>
              <td :class="['text-right']">{{ row.currentBalance }}</td>
            </tr>
          </tbody>
        </template>
        <template #footer>
          <tfoot>
            <tr>
              <td :class="['textLeft']"><b>Totals:</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.totalGrowth }}</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.totalContribution }}</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.totalInterest }}</b></td>
              <td :class="['text-right']"><b>{{ tableTotals.finalBalance }}</b></td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
