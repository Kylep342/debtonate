<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRouter, Router } from 'vue-router';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import routes from '@/apps/shared/constants/routes';
import { useBreakpoint } from '@/apps/shared/functions/viewport';

const router: Router = useRouter();
const state: DebtonateCoreStore = useDebtonateCoreStore();
const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const { isMobile } = useBreakpoint();

const isDebtonate = computed(() => state.viewPhase === constants.PHASE_DEBTONATE);
const isRepatriate = computed(() => state.viewPhase === constants.PHASE_REPATRIATE);

const appButtons: Button[] = [
  { text: constants.NAME_APPRECIATE, onClick: () => router.push(routes.ROUTE_APPRECIATE) },
  { text: constants.NAME_DEBTONATE, onClick: () => router.push(routes.ROUTE_DEBTONATE) },
  { text: constants.BTN_GLOSSARY, onClick: () => globalOptions.openGlossary() },
  { text: constants.BTN_SHARE_EXPORT, onClick: () => globalOptions.openShareExport() },
];

const phaseButtons: ComputedRef<Button[]> = computed(() => [
  {
    text: isMobile.value ? 'Debt' : constants.PT_CURRENT_DEBT,
    onClick: () => state.setPhase(constants.PHASE_DEBTONATE),
    classes: [{'btn-success': isDebtonate.value}]
  },
  {
    text: isMobile.value ? 'Refi' : constants.PT_REFINANCING,
    onClick: () => state.setPhase(constants.PHASE_REPATRIATE),
    classes: [{'btn-success': isRepatriate.value}]
  },
]);
</script>

<template>
  <header
    id="header-bar"
    :class="['navbar', 'bg-secondary', 'px-2', 'md:px-4', 'sticky', 'top-0', 'z-30']"
  >
    <div :class="['flex-1', 'flex', 'items-center', 'min-w-0', 'gap-1']">
      <img
        src="/icon.png"
        alt="Debtonate logo"
        class="shrink-0"
      >
      <div :class="['flex', 'items-center', 'min-w-0']">
        <base-menu
          :text="isMobile ? 'Debtonate' : constants.NAME_DEBTONATE"
          :buttons="appButtons"
          :classes="['btn-secondary', 'btn-sm', 'px-1']"
          align="start"
          style="filter: brightness(0.9);"
        />
        <span
          v-if="!isMobile"
          class="text-xl font-bold mx-2"
        >&nbsp;|&nbsp;</span>
        <div :class="['flex', 'items-center', 'gap-1']">
          <base-button
            v-for="(button) in phaseButtons"
            :key="button.text"
            :class="['btn-xs', 'sm:btn-sm', ...button.classes]"
            @click.prevent="button.onClick"
          >
            {{ button.text }}
          </base-button>
        </div>
      </div>
    </div>
    <base-button
      :class="['btn-sm', 'shrink-0']"
      @click="state.openOptionsForm"
    >
      {{ isMobile ? 'Opts' : constants.BTN_OPTIONS }}
    </base-button>
  </header>
</template>
