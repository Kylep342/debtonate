<script setup lang="ts">
import { computed } from 'vue';
import GraphsPanel from '@/apps/appreciate/components/GraphsPanel.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import constants from '@/apps/appreciate/constants/constants';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const state = useAppreciateCoreStore();

const investmentAnalysisPivotText = computed<string>(() => (
  `From Career: ${state.getBudgetName(state.selectedCareerBudgetId || constants.DEFAULT)}`
));

const careerBudgetSelectors = computed<Button[]>(
  () => (state.monthlyBudgets.map((budget: MonthlyBudget) => ({
    text: state.getBudgetName(budget.id),
    onClick: () => state.setSelectedCareerBudgetId(budget.id),
  })))
);
</script>

<template>
  <div :class="['m-4', 'flex-1', 'flex', 'flex-col', 'items-center']">
    <div :class="['w-full', 'max-w-6xl']">
      <div :class="['header', 'flex', 'justify-between', 'items-center', 'pr-4']">
        <h2>Retirement Analysis</h2>
      </div>
      <GraphsPanel>
        <template #extraPivot>
          <base-menu
            :text="investmentAnalysisPivotText"
            :buttons="careerBudgetSelectors"
            :classes="['btn-outline', 'btn-sm']"
            align="start"
          />
        </template>
      </GraphsPanel>
    </div>
  </div>
</template>
