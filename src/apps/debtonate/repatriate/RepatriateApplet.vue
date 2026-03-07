<script setup lang="ts">
import { computed } from 'vue';
import GraphsPanel from '@/apps/debtonate/components/GraphsPanel.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import constants from '@/apps/debtonate/constants/constants';
import { Button } from '@/apps/shared/types/app';
import { ILoan } from 'moneyfunx';

const state = useDebtonateCoreStore();

const refinancingScenariosItems = computed(() => {
  const parentId = state.selectedLoanId || constants.TOTALS;
  const parentLoan = state.getLoan(parentId);
  if (!parentLoan) return [];
  const scenarios = state.refinancingScenarios[parentId] || [];
  return [parentLoan, ...scenarios];
});

const getScenarioName = (id: string) => {
  const parentId = state.selectedLoanId || constants.TOTALS;
  if (id === parentId) return 'Original';
  const scenario = state.refinancingScenarios[parentId]?.find(s => s.id === id);
  return scenario ? scenario.name : id;
};

const EXTRA_VIEW_COMPARATIVE_ANALYSIS = 'Comparative Analysis';

</script>

<template>
  <div :class="['m-4', 'flex-1', 'flex', 'flex-col', 'items-center']">
    <div :class="['w-full', 'max-w-6xl']">
      <div :class="['header', 'flex', 'justify-between', 'items-center', 'pr-4']">
        <h2>Refinancing Analysis</h2>
      </div>
      <GraphsPanel :extra-view-ids="[EXTRA_VIEW_COMPARATIVE_ANALYSIS]">
        <template #[`view-${EXTRA_VIEW_COMPARATIVE_ANALYSIS}`]>
          <TabularAnalysis
            title="Refinancing Scenario Comparison"
            :analysis="state.repatriateTabularAnalysis"
            :items="refinancingScenariosItems"
            :get-item-name="getScenarioName"
          />
        </template>
      </GraphsPanel>
    </div>
  </div>
</template>
