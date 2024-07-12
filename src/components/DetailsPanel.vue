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

const flexBasis = `basis-1/${props.pivot.length}`;

const setViewedItemId = (value) => {
  viewedItemId.value = value;
};

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
            :class="['join-item', flexBasis, 'w-full', { 'border-t-2': item.id === viewedItemId }]">
            <base-button :class="['btn-ghost', 'w-full']" @click=setViewedItemId(item.id)>{{
              getItemName(item.id)
            }}</base-button>
          </div>
        </div>
        <div v-for="item in pivot" :key="generateKey(anchor, item)" name="tabscontent" class="w-auto">
          <AmortizationTable v-show="item.id === viewedItemId" :id="'amortizationTable' + generateKey(anchor, item)"
            :keyPrefix="generateKey(anchor, item)" :paymentSummary="getPaymentSummary(anchor.id, item.id)" :title="buildAmortizationTableTitle(
              anchor,
              item,
            )
              " :subtitle="buildAmortizationTableSubtitle(
                anchor,
                item,
              )
                " />
        </div>
      </div>
    </template>
  </base-modal>
</template>
