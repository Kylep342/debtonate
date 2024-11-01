<script setup>
import { ref, reactive } from 'vue';

import GraphsPanel from './GraphsPanel.vue';
import TablesPanel from './TablesPanel.vue';
import constants from '../constants/constants';

const tabs = reactive({
  [constants.GRAPHS]: GraphsPanel,
  [constants.TABLES]: TablesPanel,
});

const viewedComponentId = ref(constants.GRAPHS);

const isViewedComponentId = (value) => viewedComponentId.value === value;

const setViewedComponentId = (newValue) => {
  viewedComponentId.value = newValue;
};
</script>

<template>
  <div>
    <div :class="['tabs', 'flex', 'flex-row', 'join', 'w-full', 'flex-grow']">
      <div
        v-for="item in Object.keys(tabs)"
        :key="item"
        :class="['join-item', flexBasis, 'w-full', { 'border-t-2': isViewedComponentId(item) }]"
      >
        <base-button
          :class="['btn-ghost', 'w-full']"
          @click="setViewedComponentId(item)"
        >
          {{ item }}
        </base-button>
      </div>
    </div>
    <component :is="tabs[viewedComponentId]" />
  </div>
</template>