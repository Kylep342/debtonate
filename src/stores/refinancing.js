
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import constants from '../constants/constants';
import keys from '../constants/keys';
import useCoreStore from '../stores/core';


export default defineStore('refinancing', () => {
  const coreState = useCoreStore();
  const refinancingFormActive = ref(false);
  const scenarios = ref({});

  // const refinancingFormTitle = computed(() => `Refinancing ${coreState.getLoanName(coreState.currentLoanId)}`);
  const refinancingFormTitle = computed(() => `Refinancing`);

  const exitRefinancingForm = () => {
    refinancingFormActive.value = false;
  };

  const openRefinancingForm = () => {
    refinancingFormActive.value = true;
  };

  const scenarioName = (loanId) => `${coreState.getLoanName(loanId)} - Refinance Scenario ${scenarios[loanId]?.length + 1 || 1}`;

  const addScenario = (loanId, principal, interestRate, termInYears, fees) => {
    const refinancedLoan = new moneyfunx.Loan(principal, interestRate, 12, termInYears, scenarioName(loanId));
    console.log(`${refinancedLoan}`);
    if (fees) {
      console.log(fees);
    }
  };

  return {
    addScenario,
    refinancingFormTitle,
    exitRefinancingForm,
    openRefinancingForm,
    refinancingFormActive,
    scenarioName,
    scenarios,
  }
});


/* create refinanced loan
 * compute paymentschedules for refinanced loan
 * apportion fees across payment schedule
**/