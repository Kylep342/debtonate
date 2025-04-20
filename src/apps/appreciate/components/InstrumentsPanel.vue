<script setup lang="ts">
import { computed, reactive } from 'vue';

import { Button } from '@/apps/shared/types/app';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useResize } from '@/apps/shared/composables/useResize';
import constants from '@/apps/appreciate/constants/constants';
import InstrumentCard from '@/apps/appreciate/components/InstrumentCard.vue';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';

const state = useAppreciateCoreStore();

const {
  viewedItemId: viewedBudgetId,
  isViewedItemId: isViewedBudgetId,
  setViewedItemId: setViewedBudgetId
} = usePivot(constants.DEFAULT);

const { scrollContainer } = useResize('resizeInstrumentsPanel');

/**
 * Local state
 */

const budgetSelectors = computed<Array<Button>>(
  () => (state.monthlyBudgets.map((budget) => ({
    text: state.getBudgetName(budget.id),
    onClick: () => setViewedBudgetId(budget.id),
  })))
);

const button = <Button>{
  text: constants.BTN_CREATE,
  onClick: state.openInstrumentForm,
  classes: ['btn-success', 'text-center'],
};

const menu = reactive<Menu>({
  text: constants.BTN_PIVOT,
  buttons: budgetSelectors,
});
</script>

<template>
  <base-card :id="'instrumentManagementPanel'" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel :button="button" :menu="menu" :title="constants.INSTRUMENTS" :class="['border-b-2']" />
    </template>
    <template #cardBody>
      <div ref="scrollContainer" :class="[
        'border-r-2',
        'overflow-y-auto',
        'flex',
        'flex-col',
        'min-h-0'
      ]">
        <ul>
          <li v-for="(instrument) in state.instrumentsWithTotals" :key="instrument.id">
            <InstrumentCard :instrument="instrument" :viewedBudgetId="viewedBudgetId" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
