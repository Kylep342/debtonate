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
        :class="['join-item', flexBasis, 'w-full']"
      >
        <base-button
          :class="[
            'w-full',
            {'btn-ghost': !isViewedComponentId(item)},
            {'btn-secondary': isViewedComponentId(item)},
            {'shadow-lg': isViewedComponentId(item)},
          ]"
          @click="setViewedComponentId(item)"
        >
          {{ item }}
        </base-button>
      </div>
    </div>
    <GraphsPanel v-show="isViewedComponentId(constants.GRAPHS)" />
    <TablesPanel v-show="isViewedComponentId(constants.TABLES)" />
  </div>
</template>