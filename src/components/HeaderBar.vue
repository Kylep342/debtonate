<script setup lang="ts">
import useCoreStore from '../stores/core';
import constants from '../constants/constants';

const coreState = useCoreStore();

const exportState = () => navigator.clipboard.writeText(
  JSON.stringify(coreState.exportState())
);

const buttons = {
  [constants.BTN_OPTIONS]: coreState.openOptionsForm,
  [constants.BTN_LOAD]: coreState.loadState,
  [constants.BTN_SAVE]: coreState.saveState,
  [constants.BTN_CLEAR]: coreState.clearState,
  // {text: constants.BTN_EXPORT, onClick: exportState},
}
const classes = ['rounded-none btn-secondary'];
</script>

<template>
  <header
    id="headerBar"
    :class="['navbar', 'bg-secondary', 'sticky', 'top-0', 'z-30']"
  >
    <div :class="['flex-1']">
      <img src="/icon.png">
      <h1>Debtonate</h1>
    </div>
    <ul :class="['menu menu-horizontal bg-secondary']">
      <li
        v-for="(onClick, text) in buttons"
        :key="text"
      >
        <base-button
          :class="classes"
          @click="onClick"
        >
          {{ text }}
        </base-button>
      </li>
    </ul>
  </header>
</template>
