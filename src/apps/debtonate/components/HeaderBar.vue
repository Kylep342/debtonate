<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRouter, Router } from 'vue-router';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { Button } from '@/apps/shared/types/app';
import routes from '@/apps/shared/constants/routes';

const router: Router = useRouter();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const copyStateToClipboard = () => navigator.clipboard.writeText(
  JSON.stringify(state.exportState())
);

const isDebtonate = computed(() => state.viewPhase === constants.PHASE_DEBTONATE);
const isRepatriate = computed(() => state.viewPhase === constants.PHASE_REPATRIATE);

const menuButtons: Button[] = [
  { text: constants.BTN_OPTIONS, onClick: state.openOptionsForm },
  { text: constants.BTN_LOAD, onClick: state.loadState },
  { text: constants.BTN_SAVE, onClick: state.saveState },
  { text: constants.BTN_CLEAR, onClick: state.clearState },
  { text: constants.BTN_COPY, onClick: copyStateToClipboard },
  { text: constants.NAME_APPRECIATE, onClick: () => router.push(routes.ROUTE_APPRECIATE) },
];

const phaseButtons: ComputedRef<Button[]> = computed(() => [
  {
    text: 'Loans',
    onClick: () => state.setPhase(constants.PHASE_DEBTONATE),
    classes: [{'btn-success': isDebtonate.value}]
  },
  {
    text: 'Refinance',
    onClick: () => state.setPhase(constants.PHASE_REPATRIATE),
    classes: [{'btn-success': isRepatriate.value}]
  },
]);
</script>

<template>
  <header id="header-bar" :class="['navbar', 'bg-secondary', 'sticky', 'top-0', 'z-30']">
    <div :class="['flex-1']">
      <img src="/icon.png">
      <div :class="['flex', 'items-center']">
        <h1>Debtonate -&nbsp;</h1>
        <div :class="['flex', 'items-center']">
          <base-button
            v-for="(button) in phaseButtons"
            :key="button.text"
            @click.prevent="button.onClick"
            :class="['btn-sm', ...button.classes]"
          >
          {{ button.text }}
          </base-button>
        </div>
      </div>
    </div>
    <base-menu :text="constants.BTN_MENU" :buttons="menuButtons" />
  </header>
</template>
