import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export interface UIState {
  budgetDetailsPanelActive: Ref<boolean>;
  budgetFormActive: Ref<boolean>;
  instrumentDetailsPanelActive: Ref<boolean>; // For Appreciate
  instrumentFormActive: Ref<boolean>; // For Appreciate
  loanDetailsPanelActive: Ref<boolean>; // For Debtonate
  loanFormActive: Ref<boolean>; // For Debtonate
  optionsFormActive: Ref<boolean>;
  refinancingFormActive: Ref<boolean>; // For Debtonate
  
  // IDs can stay here or be passed, but often easier to manage centrally if multiple UIs use them
  currentBudgetId: Ref<string | null>;
  currentInstrumentId: Ref<string | null>; // For Appreciate
  currentLoanId: Ref<string | null>; // For Debtonate
}

export const useAppUIStore = defineStore('appUI', () => {
  /** STATE */
  const budgetDetailsPanelActive: Ref<boolean> = ref(false);
  const budgetFormActive: Ref<boolean> = ref(false);
  const instrumentDetailsPanelActive: Ref<boolean> = ref(false);
  const instrumentFormActive: Ref<boolean> = ref(false);
  const loanDetailsPanelActive: Ref<boolean> = ref(false);
  const loanFormActive: Ref<boolean> = ref(false);
  const optionsFormActive: Ref<boolean> = ref(false);
  const refinancingFormActive: Ref<boolean> = ref(false);
  
  const currentBudgetId: Ref<string | null> = ref(null);
  const currentInstrumentId: Ref<string | null> = ref(null);
  const currentLoanId: Ref<string | null> = ref(null);


  /** ACTIONS (Forms) */

  // Generic Open/Exit actions for Budgets
  const openBudgetForm = () => { budgetFormActive.value = true; };
  const exitBudgetForm = () => { budgetFormActive.value = false; currentBudgetId.value = null; };
  
  // Generic Open/Exit actions for Options
  const openOptionsForm = () => { optionsFormActive.value = true; };
  const exitOptionsForm = () => { optionsFormActive.value = false; };

  // Instrument-specific actions (Appreciate)
  const openInstrumentForm = () => { instrumentFormActive.value = true; };
  const exitInstrumentForm = () => { instrumentFormActive.value = false; currentInstrumentId.value = null; };
  const viewInstrument = (id: string) => { currentInstrumentId.value = id; instrumentDetailsPanelActive.value = true; };
  const unviewInstrument = () => { instrumentDetailsPanelActive.value = false; currentInstrumentId.value = null; };
  
  // Loan-specific actions (Debtonate)
  const openLoanForm = () => { loanFormActive.value = true; };
  const exitLoanForm = () => { loanFormActive.value = false; currentLoanId.value = null; };
  const viewLoan = (id: string) => { currentLoanId.value = id; loanDetailsPanelActive.value = true; };
  const unviewLoan = () => { loanDetailsPanelActive.value = false; currentLoanId.value = null; };
  
  // Refinancing-specific actions (Debtonate)
  const refinanceLoan = (id: string) => { currentLoanId.value = id; refinancingFormActive.value = true; };
  const exitRefinancingForm = () => { refinancingFormActive.value = false; currentLoanId.value = null; };

  // Common View/Unview Budgets (used by both)
  const viewBudget = (id: string) => { currentBudgetId.value = id; budgetDetailsPanelActive.value = true; };
  const unviewBudget = () => { budgetDetailsPanelActive.value = false; currentBudgetId.value = null; };

  return {
    // STATE
    budgetDetailsPanelActive,
    budgetFormActive,
    instrumentDetailsPanelActive, 
    instrumentFormActive,
    loanDetailsPanelActive,
    loanFormActive,
    optionsFormActive, 
    refinancingFormActive,
    currentBudgetId,
    currentInstrumentId,
    currentLoanId,
    // ACTIONS
    openBudgetForm,
    exitBudgetForm,
    openOptionsForm,
    exitOptionsForm, 
    openInstrumentForm,
    exitInstrumentForm,
    viewInstrument,
    unviewInstrument,
    openLoanForm,
    exitLoanForm,
    viewLoan,
    unviewLoan,
    refinanceLoan,
    exitRefinancingForm,
    viewBudget,
    unviewBudget
  };
});
