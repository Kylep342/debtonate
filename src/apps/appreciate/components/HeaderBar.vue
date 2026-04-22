<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRouter, Router } from 'vue-router';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { Button } from '@/apps/shared/types/app';
import routes from '@/apps/shared/constants/routes';
import { useBreakpoint } from '@/apps/shared/functions/viewport';

const router: Router = useRouter();
const state: AppreciateCoreStore = useAppreciateCoreStore();
const { isMobile } = useBreakpoint();

const isCareer = computed(() => state.viewPhase === constants.PHASE_CAREER);
const isRetirement = computed(() => state.viewPhase === constants.PHASE_RETIREMENT);

const appButtons: Button[] = [
  { text: constants.NAME_APPRECIATE, onClick: () => router.push(routes.ROUTE_APPRECIATE) },
  { text: constants.NAME_DEBTONATE, onClick: () => router.push(routes.ROUTE_DEBTONATE) },
];

const phaseButtons: ComputedRef<Button[]> = computed(() => [
  {
    text: isMobile.value ? 'Career' : constants.PT_CAREER,
    onClick: () => state.setPhase(constants.PHASE_CAREER),
    classes: [{'btn-success': isCareer.value}]
  },
  {
    text: isMobile.value ? 'Retire' : constants.PT_RETIREMENT,
    onClick: () => state.setPhase(constants.PHASE_RETIREMENT),
    classes: [{'btn-success': isRetirement.value}]
  },
]);
</script>

<template>
  <header id="header-bar" :class="['navbar', 'bg-secondary', 'px-2', 'md:px-4', 'sticky', 'top-0', 'z-30']">
    <div :class="['flex-1']">
      <img v-if="!isMobile" src="/icon.png">
      <div :class="['flex', 'items-center']">
        <base-menu
          :text="isMobile ? 'Appreciate' : constants.NAME_APPRECIATE"
          :buttons="appButtons"
          :classes="['btn-secondary', 'btn-sm', 'px-1']"
          style="filter: brightness(0.9);"
        />
        <span v-if="!isMobile" class="text-xl font-bold mx-2">&nbsp|&nbsp</span>
        <div :class="['flex', 'items-center', 'gap-1']">
          <base-button
            v-for="(button) in phaseButtons"
            :key="button.text"
            @click.prevent="button.onClick"
            :class="['btn-xs', 'sm:btn-sm', ...button.classes]"
          >
          {{ button.text }}
          </base-button>
        </div>
      </div>
    </div>
    <base-button :class="['btn-sm']" @click="state.openOptionsForm">
      {{ isMobile ? 'Opts' : constants.BTN_OPTIONS }}
    </base-button>
  </header>
</template>
