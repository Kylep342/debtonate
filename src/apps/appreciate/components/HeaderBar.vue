<script setup lang="ts">
import { useRouter } from 'vue-router';

// import useCoreStore from '@/apps/debtonate/stores/core';
import constants from '@/apps/shared/constants/constants';
import { Button } from '@/apps/shared/types/app';

// const coreState = useCoreStore();

const router = useRouter();

// const copyStateToClipboard = () => navigator.clipboard.writeText(
//   JSON.stringify(coreState.exportState())
// );

const buttons: Array<Button> = [
//   { text: constants.BTN_OPTIONS, onClick: coreState.openOptionsForm },
//   { text: constants.BTN_LOAD, onClick: coreState.loadState },
//   { text: constants.BTN_SAVE, onClick: coreState.saveState },
//   { text: constants.BTN_CLEAR, onClick: coreState.clearState },
//   { text: constants.BTN_COPY, onClick: copyStateToClipboard },
  { text: 'Debtonate', onClick: () => router.push('/') },
];
</script>

<template>
  <header id="header-bar" :class="['navbar', 'bg-secondary', 'sticky', 'top-0', 'z-30']">
    <div :class="['flex-1']">
      <img src="/icon.png">
      <h1>Appreciate</h1>
    </div>
    <base-menu :menu="constants.BTN_MENU" :buttons="buttons" />
  </header>
</template>
