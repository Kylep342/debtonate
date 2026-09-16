<script setup lang="ts">
import { computed, ref } from 'vue';

import DebtonateApplet from '@/apps/debtonate/debtonate/DebtonateApplet.vue';
import RepatriateApplet from '@/apps/debtonate/repatriate/RepatriateApplet.vue';
import BudgetDetailsPanel from '@/apps/debtonate/components/BudgetDetailsPanel.vue';
import BudgetForm from '@/apps/debtonate/components/forms/BudgetForm.vue';
import BudgetsPanel from '@/apps/debtonate/components/BudgetsPanel.vue';
import FooterBar from '@/apps/shared/components/FooterBar.vue';
import HeaderBar from '@/apps/debtonate/components/HeaderBar.vue';
import LoanDetailsPanel from '@/apps/debtonate/components/LoanDetailsPanel.vue';
import LoanForm from '@/apps/debtonate/components/forms/LoanForm.vue';
import LoansPanel from '@/apps/debtonate/components/LoansPanel.vue';
import OptionsForm from '@/apps/debtonate/components/forms/OptionsForm.vue';
import RefinancingForm from '@/apps/debtonate/components/forms/RefinancingForm.vue';
import GlossaryModal from '@/apps/shared/components/GlossaryModal.vue';
import ShareExportModal from '@/apps/shared/components/ShareExportModal.vue';
import SiteIntro from '@/apps/shared/components/SiteIntro.vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { useModal } from '@/apps/shared/composables/useModal';
import { usePlanSharing } from '@/apps/shared/composables/usePlanSharing';
import { useBreakpoint } from '@/apps/shared/functions/viewport';

const state: DebtonateCoreStore = useDebtonateCoreStore();
const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const { isDesktop } = useBreakpoint();

const { isPlanLoadedFromUrl, planLoadedMessage, dismissPlanAlert } = usePlanSharing({
  appType: 'debtonate',
  importState: state.importState,
});

const activeTab = ref('analysis');

const isRepatriatePhase = computed<boolean>(() => state.viewPhase === constants.PHASE_REPATRIATE);

useModal(computed<boolean>(() => state.budgetDetailsPanelActive), constants.BUDGET_DETAILS_ID);
useModal(computed<boolean>(() => state.budgetFormActive), constants.BUDGET_FORM_ID);
useModal(computed<boolean>(() => state.loanDetailsPanelActive), constants.LOAN_DETAILS_ID);
useModal(computed<boolean>(() => state.loanFormActive), constants.LOAN_FORM_ID);
useModal(computed<boolean>(() => state.optionsFormActive), constants.OPTIONS_FORM_ID);
useModal(computed<boolean>(() => state.refinancingFormActive), constants.REFINANCING_FORM_ID);
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
    <HeaderBar :class="['flex-none']" />
    <BudgetForm :id="constants.BUDGET_FORM_ID" />
    <LoanForm :id="constants.LOAN_FORM_ID" />
    <OptionsForm :id="constants.OPTIONS_FORM_ID" />
    <RefinancingForm :id="constants.REFINANCING_FORM_ID" />
    <GlossaryModal :id="constants.GLOSSARY_MODAL_ID" />
    <ShareExportModal
      :id="constants.SHARE_EXPORT_MODAL_ID"
      app-type="debtonate"
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
        :class="tabClass('loans')"
        @click="activeTab = 'loans'"
      >Loans</a>
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
        <LoansPanel />
        <BudgetsPanel />
      </template>
      <template v-else>
        <LoansPanel
          v-if="activeTab === 'loans'"
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
          v-if="!state.loans.length"
          :class="['m-4', 'text-wrap', 'text-pretty', 'w-30']"
        >
          <SiteIntro
            app-name="Debtonate"
            app-description="analyzing debt"
            item-type="loans"
            budget-action="payments"
          />
        </div>
        <div
          v-else
          :class="['w-full']"
        >
          <RepatriateApplet v-if="isRepatriatePhase" />
          <DebtonateApplet v-else />
        </div>
      </div>

      <BudgetDetailsPanel :id="constants.BUDGET_DETAILS_ID" />
      <LoanDetailsPanel :id="constants.LOAN_DETAILS_ID" />
    </div>

    <FooterBar :class="['flex-none']" />
  </div>
</template>
