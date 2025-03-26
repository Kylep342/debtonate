<script setup lang="ts">
import { computed } from 'vue';

import { useModal } from '@/apps/shared/composables/useModal';
import BudgetDetailsPanel from './components/BudgetDetailsPanel.vue';
import BudgetForm from '@/apps/shared/components/forms/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import constants from './constants/constants';
import FooterBar from '@/apps/shared/components/FooterBar.vue';
import GraphsPanel from './components/GraphsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import InstrumentDetailsPanel from './components/InstrumentDetailsPanel.vue';
import InstrumentForm from './components/forms/InstrumentForm.vue';
import InstrumentsPanel from './components/InstrumentsPanel.vue';
import OptionsForm from './components/forms/OptionsForm.vue';
import SiteIntro from './components/SiteIntro.vue';
import useAppreciateCoreStore from './stores/core';

const state = useAppreciateCoreStore();

useModal(computed(() => state.budgetDetailsPanelActive), constants.BUDGET_DETAILS_ID);
useModal(computed(() => state.budgetFormActive), constants.BUDGET_FORM_ID);
useModal(computed(() => state.instrumentDetailsPanelActive), constants.INSTRUMENT_DETAILS_ID);
useModal(computed(() => state.instrumentFormActive), constants.INSTRUMENT_FORM_ID);
useModal(computed(() => state.optionsFormActive), constants.OPTIONS_FORM_ID);
</script>

<template>
  <div
    :class="['h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar />
    <BudgetForm :id="constants.BUDGET_FORM_ID" />
    <InstrumentForm :id="constants.INSTRUMENT_FORM_ID" />
    <OptionsForm :id="constants.OPTIONS_FORM_ID" />
    <div :class="['flex-1', 'flex', 'bg-base-100', 'overflow-hidden', 'w-screen']">
      <InstrumentsPanel />
      <BudgetsPanel />
      <div :class="['m-4']">
        <div
          v-if="!state.instruments.length"
          :class="['text-wrap', 'text-pretty', 'w-30']"
        >
          <SiteIntro />
        </div>
        <div
          v-else
          :class="[]"
        >
          <div :class="['flex-grow']">
            <div :class="['header']">
              <h2>Investment Analysis</h2>
            </div>
            <GraphsPanel />
          </div>
          <div>
            <BudgetDetailsPanel :id="constants.BUDGET_DETAILS_ID" />
            <InstrumentDetailsPanel :id="constants.INSTRUMENT_DETAILS_ID" />
          </div>
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
</template>
