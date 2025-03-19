import * as d3 from 'd3';
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import keys from '@/apps/appreciate/constants/keys';
import {
  Budget,
  ContributionScenario
} from '@/apps/appreciate/types/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import {
  Graph,
  GraphConfig,
  Graphs,
  Point,
} from '@/apps/shared/types/graph';

export default defineStore('appreciateCore', () => {
  // dependent stores
  const globalOptions = useGlobalOptionsStore();

  // 'appreciateCore' primitive state
  const budgetDetailsPanelActive = ref<boolean>(false);
  const budgetFormActive = ref<boolean>(false);
  const budgets = ref<Array<Budget>>([]);
  const currentBudgetId = ref<string|null>(null);
  const currentInstrumentId = ref<string|null>(null);
  const instrumentDetailsPanelActive = ref<boolean>(false);
  const instrumentFormActive = ref<boolean>(false);
  const instruments = ref<Array<moneyfunx.Instrument>>([]);
  const optionsFormActive = ref<boolean>(false);

  // independent functions/computed values

  const clearState = () => {
    budgetDetailsPanelActive.value = false;
    budgetFormActive.value = false;
    budgets.value = [];
    currentBudgetId.value = null;
    currentInstrumentId.value = null;
    instrumentDetailsPanelActive.value = false;
    instrumentFormActive.value = false;
    instruments.value = [];
    optionsFormActive.value = false;
  };

  const loadState = () => {
    budgets.value = JSON.parse(localStorage.getItem(keys.LS_BUDGETS)!);
    instruments.value = JSON.parse(localStorage.getItem(keys.LS_INSTRUMENTS)!);
  };

  const saveState = () => {
    localStorage.setItem(keys.LS_BUDGETS , JSON.stringify(budgets.value));
    localStorage.setItem(keys.LS_INSTRUMENTS , JSON.stringify(instruments.value));
  };

  //

  const globalCurrentBalance = computed(() => instruments.value.reduce(
    (totalBalance, instruments) => totalBalance + instruments.currentBalance,
    0,
  ));

});