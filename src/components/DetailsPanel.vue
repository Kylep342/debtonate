<script setup>
import { ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';
import emitters from '../constants/emitters';
import useCoreStore from '../stores/core';

const props = defineProps(['anchor', 'id', 'pivot', 'title', 'type']);
const emits = defineEmits([emitters.EMIT_EXIT_DETAILS_PANEL]);

const coreState = useCoreStore();

const viewedItemId = ref(props.type === constants.LOAN ? constants.DEFAULT : constants.TOTALS);

const isViewedItemId = (itemId) => viewedItemId.value === itemId;

const setViewedItemId = (itemId) => {
  viewedItemId.value = itemId;
};

const getItem = (itemId) => (
  props.type === constants.LOAN
    ? coreState.getBudget(itemId)
    : coreState.getLoan(itemId)
);

const getItemName = (itemId) => (
  props.type === constants.LOAN
    ? coreState.getBudgetName(itemId)
    : coreState.getLoanName(itemId)
);

const getPaymentSummary = (anchorId, itemId) => (
  props.type === constants.LOAN
    ? coreState.getPaymentSummary(anchorId, itemId)
    : coreState.getPaymentSummary(itemId, anchorId)
);

const buildAmortizationTableSubtitle = (anchor, item) => (
  props.type === constants.LOAN
    ? coreState.buildAmortizationTableSubtitle(anchor, item)
    : coreState.buildAmortizationTableSubtitle(item, anchor)
);

const buildAmortizationTableTitle = (anchor, item) => (
  props.type === constants.LOAN
    ? coreState.buildAmortizationTableTitle(anchor, item)
    : coreState.buildAmortizationTableTitle(item, anchor)
);

const emitExit = () => {
  emits(emitters.EMIT_EXIT_DETAILS_PANEL);
};
</script>

<template>
  <base-modal :id="props.id">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="emitExit"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="anchor"
        :class="['tabframe', 'w-auto']"
      >
        <base-tabs
          :get-item-name="getItemName"
          :pivot="pivot"
          :is-viewed-item-id="isViewedItemId"
          :set-viewed-item-id="setViewedItemId"
        >
          <template #tabContent>
            <AmortizationTable
              :payment-summary="getPaymentSummary(anchor.id, viewedItemId)"
              :title="buildAmortizationTableTitle(
                anchor,
                getItem(viewedItemId),
              )
              "
              :subtitle="buildAmortizationTableSubtitle(
                anchor,
                getItem(viewedItemId),
              )
              "
            />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
