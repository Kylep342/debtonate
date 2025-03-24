<script setup>
import { computed } from 'vue';

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
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import { useModal } from '@/apps/shared/composables/useModal';

const state = useDebtonateCoreStore();

useModal(computed(() => state.budgetDetailsPanelActive), constants.BUDGET_DETAILS_ID);
useModal(computed(() => state.budgetFormActive), constants.BUDGET_FORM_ID);
useModal(computed(() => state.loanDetailsPanelActive), constants.LOAN_DETAILS_ID);
useModal(computed(() => state.loanFormActive), constants.LOAN_FORM_ID);
useModal(computed(() => state.optionsFormActive), constants.OPTIONS_FORM_ID);
useModal(computed(() => state.refinancingFormActive), constants.REFINANCING_FORM_ID);
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
    <div :class="['flex-1', 'flex', 'bg-base-100', 'overflow-hidden', 'w-screen']">
      <LoansPanel />
      <BudgetsPanel />
      <div :class="['m-4']">
        <div
          v-if="!state.loans.length"
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
              <h2>Repayment Analysis</h2>
            </div>
            <GraphsPanel />
          </div>
          <div>
            <BudgetDetailsPanel :id="constants.BUDGET_DETAILS_ID" />
            <LoanDetailsPanel :id="constants.LOAN_DETAILS_ID" />
          </div>
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
</template>
