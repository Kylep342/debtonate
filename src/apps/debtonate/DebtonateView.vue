<script setup>
import { watch } from 'vue';

import BudgetDetailsPanel from '@/apps/debtonate/components/BudgetDetailsPanel.vue';
import BudgetForm from '@/apps/debtonate/components/forms/BudgetForm.vue';
import BudgetsPanel from '@/apps/debtonate/components/BudgetsPanel.vue';
import FooterBar from '@/apps/shared/components/FooterBar.vue';
import GraphsPanel from '@/apps/debtonate/components/GraphsPanel.vue';
import HeaderBar from '@/apps/debtonate/components/HeaderBar.vue';
import LoanDetailsPanel from '@/apps/debtonate/components/LoanDetailsPanel.vue';
import LoanForm from '@/apps/debtonate/components/forms/LoanForm.vue';
import LoansPanel from '@/apps/debtonate/components/LoansPanel.vue';
import OptionsForm from '@/apps/debtonate/components/forms/OptionsForm.vue';
import RefinancingForm from '@/apps/debtonate/components/forms/RefinancingForm.vue';
import SiteIntro from '@/apps/debtonate/components/SiteIntro.vue';
import constants from '@/apps/debtonate/constants/constants';
import useCoreStore from '@/apps/debtonate/stores/core';
import { useModal } from '@/apps/shared/composables/useModal';

const coreState = useCoreStore();

// useModal(coreState.budgetDetailsPanelActive, constants.BUDGET_DETAILS_ID);
// useModal(coreState.budgetFormActive, constants.BUDGET_FORM_ID);
// useModal(coreState.loanDetailsPanelActive, constants.LOAN_DETAILS_ID);
// useModal(coreState.loanFormActive, constants.LOAN_FORM_ID);
// useModal(coreState.refinancingFormActive, constants.REFINANCING_FORM_ID);

watch(() => coreState.budgetDetailsPanelActive, async (show) => {
  if (show) {
    document.getElementById(constants.BUDGET_DETAILS_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.BUDGET_DETAILS_ID).close();
  }
});

watch(() => coreState.loanFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.LOAN_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.LOAN_FORM_ID).close();
  }
});

watch(() => coreState.budgetFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.BUDGET_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.BUDGET_FORM_ID).close();
  }
});

watch(() => coreState.loanDetailsPanelActive, async (show) => {
  if (show) {
    document.getElementById(constants.LOAN_DETAILS_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.LOAN_DETAILS_ID).close();
  }
});

watch(() => coreState.optionsFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.OPTIONS_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.OPTIONS_FORM_ID).close();
  }
});

watch(() => coreState.refinancingFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.REFINANCING_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.REFINANCING_FORM_ID).close();
  }
});

</script>

<template>
  <div
    id="debtonate"
    :class="['font-mono', 'h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar :class="['flex-none']" />
    <BudgetForm />
    <LoanForm />
    <OptionsForm />
    <RefinancingForm />
    <div :class="['flex-1', 'flex', 'bg-base-100', 'overflow-hidden', 'w-screen']">
      <LoansPanel />
      <BudgetsPanel />
      <div :class="['m-4']">
        <div
          v-if="!coreState.loans.length"
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
              <h2>Repayment Information</h2>
            </div>
            <GraphsPanel />
          </div>
          <div>
            <BudgetDetailsPanel />
            <LoanDetailsPanel />
          </div>
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
</template>
