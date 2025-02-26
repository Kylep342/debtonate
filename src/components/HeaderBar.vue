<script setup lang="ts">
import useCoreStore from '@/stores/core';
import constants from '@/constants/constants';
import { Button } from '@/types/app';

const coreState = useCoreStore();

const copyStateToClipboard = () => navigator.clipboard.writeText(
  JSON.stringify(coreState.exportState())
);

const buttons: Array<Button> = [
  {text: constants.BTN_OPTIONS, onClick: coreState.openOptionsForm},
  {text: constants.BTN_LOAD, onClick: coreState.loadState},
  {text: constants.BTN_SAVE, onClick: coreState.saveState},
  {text: constants.BTN_CLEAR, onClick: coreState.clearState},
  {text: constants.BTN_COPY, onClick: copyStateToClipboard},
]
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
    <base-menu
      :menu="constants.BTN_MENU"
      :buttons="buttons"
    />
  </header>
</template>
