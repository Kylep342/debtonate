<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import constants from '@/apps/appreciate/constants/constants';

const state: AppreciateCoreStore = useAppreciateCoreStore();
const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

const careerBudgets = computed(() => state.monthlyBudgets);

type SummaryRow = {
  label: string;
  values: string[];
};

const summaryRows: ComputedRef<SummaryRow[]> = computed(() => {
  const rows: SummaryRow[] = [];

  // Initial Balance Row
  rows.push({
    label: 'Initial Retirement Balance',
    values: careerBudgets.value.map(budget => {
      const schedule = state.getContributionSchedule(constants.TOTALS, budget.id);
      const finalBalance = schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0;
      return globalOptions.Money(finalBalance);
    })
  });

  // Growth during Retirement Row
  rows.push({
    label: 'Growth in Retirement',
    values: careerBudgets.value.map(budget => {
      const withdrawalSchedule = state.careerRetirementComparison[budget.id][constants.TOTALS];
      return globalOptions.Money(withdrawalSchedule.lifetimeGrowth);
    })
  });

  // Ending Balance Row
  rows.push({
    label: `Balance after ${state.yearsToSpend} years`,
    values: careerBudgets.value.map(budget => {
      const withdrawalSchedule = state.careerRetirementComparison[budget.id][constants.TOTALS];
      const finalBalance = withdrawalSchedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0;
      return globalOptions.Money(finalBalance);
    })
  });

  // Depletion Period
  rows.push({
    label: 'Money Lasts',
    values: careerBudgets.value.map(budget => {
      const withdrawalSchedule = state.careerRetirementComparison[budget.id][constants.TOTALS];
      const periods = withdrawalSchedule.amortizationSchedule.filter(r => r.currentBalance > 0.01).length;
      return `${Math.floor(periods / 12)} years ${periods % 12} months`;
    })
  });

  return rows;
});
</script>

<template>
  <div :class="['card', 'bg-base-200', 'shadow-xl', 'p-4']">
    <h3 :class="['text-xl', 'font-bold', 'mb-4', 'text-center']">Retirement Comparison (by Career Budget)</h3>
    <div :class="['overflow-x-auto']">
      <table :class="['table', 'table-zebra', 'w-full']">
        <thead>
          <tr>
            <th>Metric</th>
            <th v-for="budget in careerBudgets" :key="budget.id" :class="['text-right']">
              {{ state.getBudgetName(budget.id) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in summaryRows" :key="row.label">
            <td :class="['font-semibold']">{{ row.label }}</td>
            <td v-for="(val, index) in row.values" :key="index" :class="['text-right']">
              {{ val }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
