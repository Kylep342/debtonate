<script setup lang="ts">
import { computed } from 'vue';
import GraphsPanel from '@/apps/debtonate/components/GraphsPanel.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import constants from '@/apps/debtonate/constants/constants';
import { Button } from '@/apps/shared/types/app';
import { ILoan } from 'moneyfunx';

const state = useDebtonateCoreStore();

const selectedLoanName = computed<string>(() => (
  `Loan: ${state.getLoanName(state.selectedLoanId || constants.TOTALS)}`
));

const loanSelectors = computed<Button[]>(
  () => (state.loansWithTotals.map((loan: ILoan) => ({
    text: loan.name,
    onClick: () => state.setSelectedLoanId(loan.id),
  })))
);

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

</script>

<template>
  <div :class="['m-4', 'flex-1', 'flex', 'flex-col', 'items-center']">
    <div :class="['w-full', 'max-w-6xl']">
      <div :class="['header', 'flex', 'justify-between', 'items-center', 'pr-4']">
        <h2>Refinancing Analysis</h2>
        <div :class="['mr-4']">
          <base-menu
            :text="selectedLoanName"
            :buttons="loanSelectors"
            :classes="['btn-sm']"
          />
        </div>
      </div>
      <GraphsPanel />
      <TabularAnalysis
        title="Refinancing Scenario Comparison"
        :analysis="state.repatriateTabularAnalysis"
        :items="refinancingScenariosItems"
        :get-item-name="getScenarioName"
      />
    </div>
  </div>
</template>
