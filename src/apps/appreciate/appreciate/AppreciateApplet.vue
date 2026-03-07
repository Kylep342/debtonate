<script setup lang="ts">
import GraphsPanel from '@/apps/appreciate/components/GraphsPanel.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';

const state = useAppreciateCoreStore();
const EXTRA_VIEW_COMPARATIVE_ANALYSIS = 'Comparative Analysis';
</script>

<template>
  <div :class="['m-4', 'flex-1', 'flex', 'flex-col', 'items-center']">
    <div :class="['w-full', 'max-w-6xl']">
      <div :class="['header', 'flex', 'justify-between', 'items-center', 'pr-4']">
        <h2>Investment Analysis</h2>
      </div>
      <GraphsPanel :extra-view-ids="[EXTRA_VIEW_COMPARATIVE_ANALYSIS]">
        <template #[`view-${EXTRA_VIEW_COMPARATIVE_ANALYSIS}`]>
          <TabularAnalysis
            title="Investment Comparative Analysis"
            :analysis="state.investmentTabularAnalysis"
            :items="state.monthlyBudgets"
            :get-item-name="state.getBudgetName"
          />
        </template>
      </GraphsPanel>
    </div>
  </div>
</template>
