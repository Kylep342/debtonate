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
  [constants.BTN_EXPORT]: exportState,
}
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
    <div :class="['dropdown', 'dropdown-bottom', 'dropdown-end']">
      <base-button>{{ constants.BTN_MENU }}</base-button>
      <ul
        tabIndex="{0}"
        :class="['dropdown-content', 'menu', 'bg-base-100', 'rounded-box', 'z-[1]', 'w-fit', 'p-2', 'shadow']"
      >
        <li
          v-for="(onClick, text) in buttons"
          :key="text"
          @click.prevent="onClick"
        >
          <a>{{ text }}</a>
        </li>
      </ul>
    </div>
  </header>
</template>
