<script setup>
import { computed, ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
// import RefinancingSummary from './RefinancingSummary.vue';
import RefinancingTable from './RefinancingTable.vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const props = defineProps(['anchor', 'pivot']);
const coreState = useCoreStore();

const title = computed(() => props.anchor ? coreState.buildLoanDetailsTitle(props.anchor) : constants.LOAN_DETAILS);
const viewedItemId = ref(constants.DEFAULT);
const isViewedItemId = (itemId) => viewedItemId.value === itemId;
const setViewedItemId = (itemId) => {
  viewedItemId.value = itemId;
};

const getItem = (itemId) => coreState.getBudget(itemId);
const getItemName = (itemId) => coreState.getBudgetName(itemId);
const getPaymentSummary = (anchorId, itemId) => coreState.getPaymentSummary(anchorId, itemId);
const buildAmortizationTableSubtitle = (anchor, item) => coreState.buildAmortizationTableSubtitle(anchor, item);
const buildAmortizationTableTitle = (anchor, item) => coreState.buildAmortizationTableTitle(anchor, item)
</script>

<template>
  <base-modal :id="constants.LOAN_DETAILS_ID">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="coreState.unviewLoan"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="anchor"
        :class="['tabframe', 'w-auto']"
      >
        <RefinancingTable
          v-if="coreState.refinancingScenarios[anchor.id]?.length"
          :parent-id="anchor.id"
          :scenarios="coreState.refinancingScenarios[anchor.id]"
        />
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
