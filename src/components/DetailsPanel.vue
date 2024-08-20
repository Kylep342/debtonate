<script setup>
import { inject, ref } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';

const props = defineProps(['anchor', 'id', 'pivot', 'title', 'type']);
const emits = defineEmits(['exit-details-panel']);

const budgetPrimitives = inject('budgetPrimitives');
const builders = inject('builders');
const loanPrimitives = inject('loanPrimitives');
const visuals = inject('visuals');

const viewedItemId = ref(props.type === constants.LOAN ? constants.DEFAULT : constants.TOTALS);

const isViewedItemId = (itemId) => viewedItemId.value === itemId;

const setViewedItemId = (itemId) => {
  viewedItemId.value = itemId;
};

const getItem = (itemId) => (
  props.type === constants.LOAN
    ? budgetPrimitives.getBudget(itemId)
    : loanPrimitives.getLoan(itemId)
);

const getItemName = (itemId) => (
  props.type === constants.LOAN
    ? budgetPrimitives.getBudgetName(itemId)
    : loanPrimitives.getLoanName(itemId)
);

const getPaymentSummary = (anchorId, itemId) => (
  props.type === constants.LOAN
    ? visuals.getPaymentSummary(anchorId, itemId)
    : visuals.getPaymentSummary(itemId, anchorId)
);

const buildAmortizationTableSubtitle = (anchor, item) => (
  props.type === constants.LOAN
    ? builders.buildAmortizationTableSubtitle(anchor, item)
    : builders.buildAmortizationTableSubtitle(item, anchor)
);

const buildAmortizationTableTitle = (anchor, item) => (
  props.type === constants.LOAN
    ? builders.buildAmortizationTableTitle(anchor, item)
    : builders.buildAmortizationTableTitle(item, anchor)
);

const generateKey = (...args) => args.map((arg) => arg.id || arg).join('');

const emitExit = () => {
  emits('exit-details-panel');
};
</script>

<template>
  <base-modal :id="props.id">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="emitExit">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="anchor" :class="['tabframe', 'w-auto']">
        <div :class="['tabs', 'flex', 'flex-row', 'join', 'join-horizontal', 'w-full', 'flex-grow']">
          <div v-for="item in pivot" :key="generateKey(anchor, item)"
            :class="['join-item', 'w-full', { 'border-t-2': isViewedItemId(item.id) }]">
            <base-button :class="['btn-ghost', 'w-full']" @click=setViewedItemId(item.id)>{{
              getItemName(item.id)
            }}</base-button>
          </div>
        </div>
        <AmortizationTable :id="'amortizationTable' + generateKey(anchor, getItem(viewedItemId))"
          :keyPrefix="generateKey(anchor, getItem(viewedItemId))"
          :paymentSummary="getPaymentSummary(anchor.id, viewedItemId)" :title="buildAmortizationTableTitle(
            anchor,
            getItem(viewedItemId),
          )
            " :subtitle="buildAmortizationTableSubtitle(
              anchor,
              getItem(viewedItemId),
            )
              " />
      </div>
    </template>
  </base-modal>
</template>
