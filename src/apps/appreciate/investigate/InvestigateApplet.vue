<script setup lang="ts">
import { computed } from 'vue';
import GraphsPanel from '@/apps/appreciate/components/GraphsPanel.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import InvestigateSummary from '@/apps/appreciate/investigate/components/InvestigateSummary.vue';
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
        <div :class="['mr-4']">
          <base-menu
            :text="investmentAnalysisPivotText"
            :buttons="careerBudgetSelectors"
            :classes="['btn-sm']"
          />
        </div>
      </div>
      <GraphsPanel />
      <TabularAnalysis
        title="Retirement Comparative Analysis"
        :analysis="state.retirementTabularAnalysis"
        :items="state.monthlyWithdrawalBudgets"
        :get-item-name="state.getWithdrawalBudgetName"
      />
      <div :class="['mt-8']">
        <InvestigateSummary />
      </div>
    </div>
  </div>
</template>
