<script setup>
import { computed, ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const props = defineProps(['anchor', 'pivot']);
const coreState = useCoreStore();

const title = computed(() => props.anchor ? coreState.buildBudgetDetailsTitle(props.anchor) : constants.BUDGET_DETAILS);
const viewedItemId = ref(props.type === constants.LOAN ? constants.DEFAULT : constants.TOTALS);
const isViewedItemId = (itemId) => viewedItemId.value === itemId;
const setViewedItemId = (itemId) => {
  viewedItemId.value = itemId;
};

const getItem = (itemId) => coreState.getLoan(itemId);
const getItemName = (itemId) => coreState.getLoanName(itemId);
const getPaymentSummary = (anchorId, itemId) => coreState.getPaymentSummary(itemId, anchorId);
const buildAmortizationTableSubtitle = (anchor, item) => coreState.buildAmortizationTableSubtitle(item, anchor);
const buildAmortizationTableTitle = (anchor, item) => coreState.buildAmortizationTableTitle(item, anchor);
</script>

<template>
  <base-modal :id="constants.BUDGET_DETAILS_ID">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="coreState.unviewBudget"
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
