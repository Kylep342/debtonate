<script setup>
import { watch } from 'vue';

import BudgetDetailsPanel from './components/BudgetDetailsPanel.vue';
import BudgetForm from './components/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import FooterBar from './components/FooterBar.vue';
import GraphsPanel from './components/GraphsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import LoanDetailsPanel from './components/LoanDetailsPanel.vue';
import LoanForm from './components/LoanForm.vue';
import LoansPanel from './components/LoansPanel.vue';
import OptionsForm from './components/OptionsForm.vue';
import RefinancingForm from './components/RefinancingForm.vue';
import SiteIntro from './components/SiteIntro.vue';
import constants from './constants/constants';
import useCoreStore from './stores/core';

const coreState = useCoreStore();

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
    <!-- <BaseAlert :id="'alert'" :message="'lmao'" / -->
    <FooterBar />
  </div>
</template>
