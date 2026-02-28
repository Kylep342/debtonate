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

const appButtons: Button[] = [
  { text: constants.NAME_APPRECIATE, onClick: () => router.push(routes.ROUTE_APPRECIATE) },
  { text: constants.NAME_DEBTONATE, onClick: () => router.push(routes.ROUTE_DEBTONATE) },
];

const phaseButtons: ComputedRef<Button[]> = computed(() => [
  {
    text: constants.PT_CURRENT_DEBT,
    onClick: () => state.setPhase(constants.PHASE_DEBTONATE),
    classes: [{'btn-success': isDebtonate.value}]
  },
  {
    text: constants.PT_REFINANCING,
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
        <base-menu
          :text="constants.NAME_DEBTONATE"
          :buttons="appButtons"
          :classes="['btn-secondary', 'btn-sm']"
          style="filter: brightness(0.9);"
        />
        <span class="text-xl font-bold mx-2">&nbsp|&nbsp</span>
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
    <base-button @click="state.openOptionsForm">{{ constants.BTN_OPTIONS }}</base-button>
  </header>
</template>
