<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRouter, Router } from 'vue-router';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { Button } from '@/apps/shared/types/app';
import routes from '@/apps/shared/constants/routes';

const router: Router = useRouter();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const copyStateToClipboard = () => navigator.clipboard.writeText(
  JSON.stringify(state.exportState())
);

const isCareer = computed(() => state.viewPhase === constants.PHASE_CAREER);
const isRetirement = computed(() => state.viewPhase === constants.PHASE_RETIREMENT);

const menuButtons: ComputedRef<Button[]> = computed(() => [
  { text: constants.BTN_OPTIONS, onClick: state.openOptionsForm },
  { text: constants.BTN_LOAD, onClick: state.loadState },
  { text: constants.BTN_SAVE, onClick: state.saveState },
  { text: constants.BTN_CLEAR, onClick: state.clearState },
  { text: constants.BTN_COPY, onClick: copyStateToClipboard },
  { text: constants.NAME_DEBTONATE, onClick: () => router.push(routes.ROUTE_DEBTONATE) },
]);

const phaseButtons: ComputedRef<Button[]> = computed(() => [
  { text: 'Career', onClick: () => state.setPhase(constants.PHASE_CAREER), classes: [{'btn-success': isCareer.value}] },
  { text: 'Retirement', onClick: () => state.setPhase(constants.PHASE_RETIREMENT), classes: [{'btn-success': isRetirement.value}] },
]);
</script>

<template>
  <header id="header-bar" :class="['navbar', 'bg-secondary', 'sticky', 'top-0', 'z-30']">
    <div :class="['flex-1']">
      <img src="/icon.png">
      <div :class="['flex', 'items-center']">
        <h1>Appreciate -&nbsp;</h1>
        <div :class="['flex', 'items-center']">
          <base-button
            v-for="(button) in phaseButtons"
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
