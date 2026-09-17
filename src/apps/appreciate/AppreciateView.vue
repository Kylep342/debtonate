<script setup lang="ts">
import { computed, ref } from 'vue';

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
import GlossaryModal from '@/apps/shared/components/GlossaryModal.vue';
import ShareExportModal from '@/apps/shared/components/ShareExportModal.vue';
import SiteIntro from '@/apps/shared/components/SiteIntro.vue';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { useModal } from '@/apps/shared/composables/useModal';
import { usePlanSharing } from '@/apps/shared/composables/usePlanSharing';
import { useBreakpoint } from '@/apps/shared/functions/viewport';

const state: AppreciateCoreStore = useAppreciateCoreStore();
const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const { isDesktop } = useBreakpoint();

const { isPlanLoadedFromUrl, planLoadedMessage, dismissPlanAlert } = usePlanSharing({
  appType: 'appreciate',
  importState: state.importState,
});

const activeTab = ref('analysis');

const totalInvestedFormatted = computed<string>(() => {
  return globalOptions.Money(state.totalCurrentBalance);
});

const isRetirementPhase = computed<boolean>(() => state.viewPhase === constants.PHASE_RETIREMENT);

useModal(computed<boolean>(() => state.budgetDetailsPanelActive), constants.BUDGET_DETAILS_ID);
useModal(computed<boolean>(() => state.budgetFormActive), constants.BUDGET_FORM_ID);
useModal(computed<boolean>(() => state.instrumentDetailsPanelActive), constants.INSTRUMENT_DETAILS_ID);
useModal(computed<boolean>(() => state.instrumentFormActive), constants.INSTRUMENT_FORM_ID);
useModal(computed<boolean>(() => state.optionsFormActive), constants.OPTIONS_FORM_ID);
useModal(computed<boolean>(() => globalOptions.isGlossaryActive), constants.GLOSSARY_MODAL_ID);
useModal(computed<boolean>(() => globalOptions.isShareExportActive), constants.SHARE_EXPORT_MODAL_ID);

const tabClass = (tab: string) => [
  'tab',
  'tab-bordered',
  'flex-1',
  { 'tab-active': activeTab.value === tab }
];
</script>

<template>
  <div
    :class="['h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar />
    <BudgetForm :id="constants.BUDGET_FORM_ID" />
    <InstrumentForm :id="constants.INSTRUMENT_FORM_ID" />
    <OptionsForm :id="constants.OPTIONS_FORM_ID" />
    <GlossaryModal :id="constants.GLOSSARY_MODAL_ID" />
    <ShareExportModal
      :id="constants.SHARE_EXPORT_MODAL_ID"
      app-type="appreciate"
    />

    <!-- Shared Plan Notification Alert -->
    <div
      v-if="isPlanLoadedFromUrl"
      class="fixed top-14 right-4 z-50 max-w-sm cursor-pointer"
      @click="dismissPlanAlert"
    >
      <base-alert
        id="url-plan-alert"
        :message="planLoadedMessage"
        class="alert-success shadow-lg"
      />
    </div>

    <!-- Mobile/Tablet Tabs -->
    <div
      v-if="!isDesktop"
      class="tabs tabs-boxed bg-base-100 flex-none rounded-none border-b"
    >
      <a
        :class="tabClass('instruments')"
        @click="activeTab = 'instruments'"
      >Instruments</a>
      <a
        :class="tabClass('budgets')"
        @click="activeTab = 'budgets'"
      >Budgets</a>
      <a
        :class="tabClass('analysis')"
        @click="activeTab = 'analysis'"
      >Analysis</a>
    </div>

    <div :class="['flex-1', 'flex', 'bg-base-100', 'overflow-hidden', 'w-full', 'max-w-full', 'min-w-0', 'min-h-0', { 'flex-col': !isDesktop }]">
      <template v-if="isDesktop">
        <InstrumentsPanel />
        <BudgetsPanel />
      </template>
      <template v-else>
        <InstrumentsPanel
          v-if="activeTab === 'instruments'"
          :class="['!w-full']"
          :active-tab="ref(activeTab)"
        />
        <BudgetsPanel
          v-if="activeTab === 'budgets'"
          :class="['!w-full']"
          :active-tab="ref(activeTab)"
        />
      </template>

      <div
        v-if="isDesktop || activeTab === 'analysis'"
        :class="['flex-1', 'flex', 'flex-col', 'items-center', 'overflow-y-auto', 'min-h-0', 'h-full']"
        style="-webkit-overflow-scrolling: touch;"
      >
        <div
          v-if="!state.instruments.length"
          :class="['m-4', 'text-wrap', 'text-pretty', 'w-full', 'max-w-xl', 'mx-auto']"
        >
          <SiteIntro
            app-name="Appreciate"
            app-description="analyzing investments"
            item-type="instruments (investments)"
            budget-action="contributions"
          />
        </div>
        <div
          v-else
          :class="['w-full']"
        >
          <InvestigateApplet v-if="isRetirementPhase" />
          <AppreciateApplet v-else />
        </div>
      </div>

      <BudgetDetailsPanel :id="constants.BUDGET_DETAILS_ID" />
      <InstrumentDetailsPanel :id="constants.INSTRUMENT_DETAILS_ID" />
    </div>

    <!-- Floating Mobile Summary Pill -->
    <div
      v-if="!isDesktop && activeTab !== 'analysis' && state.instruments.length"
      class="fixed bottom-9 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none"
    >
      <button
        type="button"
        class="pointer-events-auto btn btn-sm h-auto py-2 px-3.5 shadow-xl border border-primary/30 bg-base-100/95 backdrop-blur text-xs flex items-center justify-between gap-2.5 rounded-full max-w-sm w-full transition-transform active:scale-95"
        @click="activeTab = 'analysis'"
      >
        <div class="flex items-center gap-1.5 truncate">
          <span class="badge badge-primary badge-xs py-2 px-2 font-semibold">Invested</span>
          <span class="font-medium truncate">{{ totalInvestedFormatted }}</span>
        </div>
        <div class="flex items-center gap-1.5 text-base-content/70 text-[11px] shrink-0">
          <span>View Analysis</span>
          <span class="text-primary font-bold text-xs">&rarr;</span>
        </div>
      </button>
    </div>

    <FooterBar :class="['flex-none']" />
  </div>
</template>
