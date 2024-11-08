<script setup>
import { ref, reactive } from 'vue';

import GraphsPanel from './GraphsPanel.vue';
import TablesPanel from './TablesPanel.vue';
import constants from '../constants/constants';

const tabs = reactive({
  [constants.GRAPHS]: GraphsPanel,
  [constants.TABLES]: TablesPanel,
});

const flexBasis = `basis-1/${Object.keys(tabs).length}`;

const viewedTabId = ref(constants.GRAPHS);

const isViewedTabId = (value) => viewedTabId.value === value;

const setViewedTabId = (newValue) => {
  viewedTabId.value = newValue;
};

const tabStyle = (id) => isViewedTabId(id) ? 'btn-secondary' : 'btn-ghost';
</script>

<template>
  <div>
    <div :class="['tabs', 'flex', 'flex-row', 'join', 'w-full', 'flex-grow']">
      <div
        v-for="tab in Object.keys(tabs)"
        :key="tab"
        :class="['join-item', flexBasis, 'w-full']"
      >
        <base-button
          :class="[
            'w-full',
            tabStyle(tab),
            {'shadow-lg': isViewedTabId(tab)},
          ]"
          @click="setViewedTabId(tab)"
        >
          {{ tab }}
        </base-button>
      </div>
    </div>
    <GraphsPanel v-show="isViewedTabId(constants.GRAPHS)" />
    <TablesPanel v-show="isViewedTabId(constants.TABLES)" />
  </div>
</template>
