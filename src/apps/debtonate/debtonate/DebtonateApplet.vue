<script setup lang="ts">
import GraphsPanel from '@/apps/debtonate/components/GraphsPanel.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();
</script>

<template>
  <div :class="['m-4', 'flex-1', 'flex', 'flex-col', 'items-center']">
    <div :class="['w-full', 'max-w-6xl']">
      <div :class="['header', 'flex', 'justify-between', 'items-center', 'pr-4']">
        <h2>Repayment Analysis</h2>
      </div>
      <GraphsPanel />
      <TabularAnalysis
        title="Repayment Comparative Analysis"
        :analysis="state.debtonateTabularAnalysis"
        :items="state.monthlyBudgets"
        :get-item-name="state.getBudgetName"
      />
    </div>
  </div>
</template>
