<script setup lang="ts">
import { computed } from 'vue';

import AppreciateApplet from '@/apps/appreciate/appreciate/AppreciateApplet.vue';
import InvestigateApplet from '@/apps/appreciate/investigate/InvestigateApplet.vue';
import BudgetDetailsPanel from '@/apps/appreciate/components/BudgetDetailsPanel.vue';
import BudgetsPanel from '@/apps/appreciate/components/BudgetsPanel.vue';
import BudgetForm from '@/apps/appreciate/components/forms/BudgetForm.vue';
import constants from '@/apps/appreciate/constants/constants';
import FooterBar from '@/apps/shared/components/FooterBar.vue';
import HeaderBar from '@/apps/appreciate/components/HeaderBar.vue';
import InstrumentDetailsPanel from '@/apps/appreciate/components/InstrumentDetailsPanel.vue';
import InstrumentForm from '@/apps/appreciate/components/forms/InstrumentForm.vue';
import InstrumentsPanel from '@/apps/appreciate/components/InstrumentsPanel.vue';
import OptionsForm from '@/apps/appreciate/components/forms/OptionsForm.vue';
import SiteIntro from '@/apps/shared/components/SiteIntro.vue';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { useModal } from '@/apps/shared/composables/useModal';

const state: AppreciateCoreStore = useAppreciateCoreStore();

const isRetirementPhase = computed<boolean>(() => state.viewPhase === constants.PHASE_RETIREMENT);

useModal(computed<boolean>(() => state.budgetDetailsPanelActive), constants.BUDGET_DETAILS_ID);
useModal(computed<boolean>(() => state.budgetFormActive), constants.BUDGET_FORM_ID);
useModal(computed<boolean>(() => state.instrumentDetailsPanelActive), constants.INSTRUMENT_DETAILS_ID);
useModal(computed<boolean>(() => state.instrumentFormActive), constants.INSTRUMENT_FORM_ID);
useModal(computed<boolean>(() => state.optionsFormActive), constants.OPTIONS_FORM_ID);
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

      <div :class="['flex-1', 'flex', 'flex-col', 'items-center', 'overflow-y-auto']">
        <div
          v-if="!state.instruments.length"
          :class="['m-4', 'text-wrap', 'text-pretty', 'w-30']"
        >
          <SiteIntro
            app-name="Appreciate"
            app-description="analyzing investments"
            item-type="instruments (investments)"
            budget-action="contributions"
          />
        </div>
        <div v-else :class="['w-full']">
          <InvestigateApplet v-if="isRetirementPhase" />
          <AppreciateApplet v-else />
        </div>
      </div>

      <BudgetDetailsPanel :id="constants.BUDGET_DETAILS_ID" />
      <InstrumentDetailsPanel :id="constants.INSTRUMENT_DETAILS_ID" />
    </div>

    <FooterBar />
  </div>
</template>
