<script setup>
import { ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';
import emitters from '../constants/emitters';
import useCoreStore from '../stores/core';

const props = defineProps(['anchor', 'id', 'pivot', 'title', 'type']);
const emits = defineEmits([emitters.EMIT_EXIT_DETAILS_PANEL]);

const state = useCoreStore();

const viewedItemId = ref(props.type === constants.LOAN ? constants.DEFAULT : constants.TOTALS);

const isViewedItemId = (itemId) => viewedItemId.value === itemId;

const setViewedItemId = (itemId) => {
  viewedItemId.value = itemId;
};

const getItem = (itemId) => (
  props.type === constants.LOAN
    ? state.getBudget(itemId)
    : state.getLoan(itemId)
);

const getItemName = (itemId) => (
  props.type === constants.LOAN
    ? state.getBudgetName(itemId)
    : state.getLoanName(itemId)
);

const getPaymentSummary = (anchorId, itemId) => (
  props.type === constants.LOAN
    ? state.getPaymentSummary(anchorId, itemId)
    : state.getPaymentSummary(itemId, anchorId)
);

const buildAmortizationTableSubtitle = (anchor, item) => (
  props.type === constants.LOAN
    ? state.buildAmortizationTableSubtitle(anchor, item)
    : state.buildAmortizationTableSubtitle(item, anchor)
);

const buildAmortizationTableTitle = (anchor, item) => (
  props.type === constants.LOAN
    ? state.buildAmortizationTableTitle(anchor, item)
    : state.buildAmortizationTableTitle(item, anchor)
);

const generateKey = (...args) => args.map((arg) => arg.id || arg).join('');

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
              :id="'amortizationTable' + generateKey(anchor, getItem(viewedItemId))"
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
