<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Button } from '@/apps/shared/types/app';
import constants from '@/apps/shared/constants/constants';
import routes from '@/apps/shared/constants/routes';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();

const router = useRouter();

const copyStateToClipboard = () => navigator.clipboard.writeText(
  JSON.stringify(state.exportState())
);

const buttons: Array<Button> = [
  { text: constants.BTN_OPTIONS, onClick: state.openOptionsForm },
  { text: constants.BTN_LOAD, onClick: state.loadState },
  { text: constants.BTN_SAVE, onClick: state.saveState },
  { text: constants.BTN_CLEAR, onClick: state.clearState },
  { text: constants.BTN_COPY, onClick: copyStateToClipboard },
  { text: constants.NAME_APPRECIATE, onClick: () => router.push(routes.ROUTE_APPRECIATE) },
];
</script>

<template>
  <header id="header-bar" :class="['navbar', 'bg-secondary', 'sticky', 'top-0', 'z-30']">
    <div :class="['flex-1']">
      <img src="/icon.png">
      <h1>Debtonate</h1>
    </div>
    <base-menu :text="constants.BTN_MENU" :buttons="buttons" />
  </header>
</template>
