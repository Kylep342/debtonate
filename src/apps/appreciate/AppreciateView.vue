<script setup lang="ts">
import { watch } from 'vue';

import BudgetForm from '@/apps/shared/components/forms/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import InstrumentsPanel from './components/InstrumentsPanel.vue';
import InstrumentForm from './components/forms/InstrumentForm.vue';
import SiteIntro from './components/SiteIntro.vue';
import OptionsForm from './components/forms/OptionsForm.vue';
import constants from './constants/constants';
import useAppreciateCoreStore from './stores/core';
import FooterBar from '@/apps/shared/components/FooterBar.vue';

const state = useAppreciateCoreStore();

watch(() => state.budgetFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.BUDGET_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.BUDGET_FORM_ID).close();
  }
});

watch(() => state.instrumentFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.INSTRUMENT_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.INSTRUMENT_FORM_ID).close();
  }
});

watch(() => state.optionsFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.OPTIONS_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.OPTIONS_FORM_ID).close();
  }
});
</script>

<template>
  <div
    :class="['h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar />
    <BudgetForm />
    <InstrumentForm />
    <OptionsForm />
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
            <!-- <GraphsPanel /> -->
          </div>
          <!-- <div>
            <BudgetDetailsPanel />
            <LoanDetailsPanel />
          </div> -->
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
</template>
