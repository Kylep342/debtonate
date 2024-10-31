<script setup>
import { watch } from 'vue';

import BudgetForm from './components/BudgetForm.vue';
import BudgetsPanel from './components/BudgetsPanel.vue';
import DetailsPanel from './components/DetailsPanel.vue';
import GraphsPanel from './components/GraphsPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import LoanForm from './components/LoanForm.vue';
import LoansPanel from './components/LoansPanel.vue';
import OptionsForm from './components/OptionsForm.vue';
import SiteIntro from './components/SiteIntro.vue';
import TablesPanel from './components/TablesPanel.vue';
import constants from './constants/constants';
import useCoreStore from './stores/core';

// core state

const state = useCoreStore();

watch(() => state.budgetDetailsPanelActive, async (show) => {
  if (show) {
    document.getElementById(constants.BUDGET_DETAILS_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.BUDGET_DETAILS_ID).close();
  }
});

watch(() => state.createLoanFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.LOAN_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.LOAN_FORM_ID).close();
  }
});

watch(() => state.createBudgetFormActive, async (show) => {
  if (show) {
    document.getElementById(constants.BUDGET_FORM_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.BUDGET_FORM_ID).close();
  }
});

watch(() => state.loanDetailsPanelActive, async (show) => {
  if (show) {
    document.getElementById(constants.LOAN_DETAILS_ID).showModal();
  } else if (!show) {
    document.getElementById(constants.LOAN_DETAILS_ID).close();
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
    id="debtonate"
    :class="['font-mono', 'h-screen', 'flex', 'flex-col']"
  >
    <HeaderBar :class="['flex-none']" />
    <LoanForm
      :create-button-text="state.createLoanButtonText"
      :loan="state.currentLoanId ?
        state.getLoan(state.currentLoanId) :
        null"
      :title="state.createLoanFormTitle"
    />
    <BudgetForm
      :create-button-text="state.createBudgetButtonText"
      :budget="state.currentBudgetId ?
        state.getBudget(state.currentBudgetId) :
        null"
      :title="state.createBudgetFormTitle"
    />
    <OptionsForm />
    <div :class="['flex-1', 'flex', 'bg-base-100', 'overflow-hidden', 'w-screen']">
      <LoansPanel
        :class="['flex-none']"
        :create-function="state.openCreateLoanForm"
        :delete-loan="state.deleteLoan"
        :edit-loan="state.editLoan"
        :view-loan="state.viewLoan"
      />
      <BudgetsPanel
        :class="['flex-none']"
        :budgets-totals="state.totalsByBudget"
        :create-function="state.openCreateBudgetForm"
        :delete-budget="state.deleteBudget"
        :edit-budget="state.editBudget"
        :view-budget="state.viewBudget"
      />
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
              <h2>Repayment Information</h2>
            </div>
            <GraphsPanel :graphs="state.balanceOverTimeGraphs" />
            <TablesPanel />
          </div>
          <div>
            <DetailsPanel
              :id="constants.LOAN_DETAILS_ID"
              :title="state.currentLoanId
                ? state.buildLoanDetailsTitle(state.getLoan(state.currentLoanId))
                : constants.LOAN_DETAILS
              "
              :type="constants.LOAN"
              :anchor="state.getLoan(state.currentLoanId)"
              :pivot="state.monthlyBudgets"
              @exit-details-panel="state.unviewLoan"
            />
            <DetailsPanel
              :id="constants.BUDGET_DETAILS_ID"
              :title="state.currentBudgetId
                ? state.buildBudgetDetailsTitle(state.getBudget(state.currentBudgetId))
                : constants.BUDGET_DETAILS
              "
              :type="constants.BUDGET"
              :anchor="state.getBudget(state.currentBudgetId)"
              :pivot="state.loansWithTotals"
              @exit-details-panel="state.unviewBudget"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
