<script setup lang="ts">
import { computed } from 'vue';

import BudgetDetailsPanel from '@/apps/appreciate/components/BudgetDetailsPanel.vue';
import BudgetForm from '@/apps/appreciate/components/forms/BudgetForm.vue';
import BudgetsPanel from '@/apps/appreciate/components/BudgetsPanel.vue';
import constants from '@/apps/appreciate/constants/constants';
import FooterBar from '@/apps/shared/components/FooterBar.vue';
import GraphsPanel from '@/apps/appreciate/components/GraphsPanel.vue';
import HeaderBar from '@/apps/appreciate/components/HeaderBar.vue';
import InstrumentDetailsPanel from '@/apps/appreciate/components/InstrumentDetailsPanel.vue';
import InstrumentForm from '@/apps/appreciate/components/forms/InstrumentForm.vue';
import InstrumentsPanel from '@/apps/appreciate/components/InstrumentsPanel.vue';
import OptionsForm from '@/apps/appreciate/components/forms/OptionsForm.vue';
import SiteIntro from '@/apps/appreciate/components/SiteIntro.vue';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import { useModal } from '@/apps/shared/composables/useModal';

const state = useAppreciateCoreStore();

useModal(computed<Boolean>(() => state.budgetDetailsPanelActive), constants.BUDGET_DETAILS_ID);
useModal(computed<Boolean>(() => state.budgetFormActive), constants.BUDGET_FORM_ID);
useModal(computed<Boolean>(() => state.instrumentDetailsPanelActive), constants.INSTRUMENT_DETAILS_ID);
useModal(computed<Boolean>(() => state.instrumentFormActive), constants.INSTRUMENT_FORM_ID);
useModal(computed<Boolean>(() => state.optionsFormActive), constants.OPTIONS_FORM_ID);
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
