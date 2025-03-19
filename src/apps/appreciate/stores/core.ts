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
import {
  Graph,
  GraphConfig,
  Graphs,
  Point,
} from '@/apps/shared/types/graph';

export default defineStore('appreciateCore', () => {
  const budgetDetailsPanelActive = ref<boolean>(false);
  const budgetFormActive = ref<boolean>(false);
  const budgets = ref<Array<Budget>>([]);
  const currencies = [...new Set(Object.values(constants.LOCALE_CURRENCY))];
  const currency = ref(constants.LOCALE_CURRENCY[navigator.language] || 'USD');
  const currentBudgetId = ref<string|null>(null);
  const currentInstrumentId = ref<string|null>(null);
  const instrumentDetailsPanelActive = ref<boolean>(false);
  const instrumentFormActive = ref<boolean>(false);
  const instruments = ref<Array<moneyfunx.Instrument>>([]);
  const language = ref(navigator.language);
  const languages = [...new Set(Object.keys(constants.LOCALE_CURRENCY))];
  const optionsFormActive = ref<boolean>(false);

  // independent functions/computed values

  const clearState = () => {
    budgetDetailsPanelActive.value = false;
    budgetFormActive.value = false;
    budgets.value = [];
    currency.value = constants.LOCALE_CURRENCY[navigator.language];
    currentBudgetId.value = null;
    currentInstrumentId.value = null;
    instrumentDetailsPanelActive.value = false;
    instrumentFormActive.value = false;
    instruments.value = [];
    language.value = navigator.language;
    optionsFormActive.value = false;
  };

  const loadState = () => {
    budgets.value = JSON.parse(localStorage.getItem(keys.LS_BUDGETS)!);
    currency.value = JSON.parse(localStorage.getItem(keys.LS_CURRENCY)!);
    instruments.value = JSON.parse(localStorage.getItem(keys.LS_INSTRUMENTS)!);
    language.value = JSON.parse(localStorage.getItem(keys.LS_LANGUAGE)!);
  };

  const saveState = () => {
    localStorage.setItem(keys.LS_BUDGETS , JSON.stringify(budgets.value));
    localStorage.setItem(keys.LS_CURRENCY , JSON.stringify(currency.value));
    localStorage.setItem(keys.LS_INSTRUMENTS , JSON.stringify(instruments.value));
    localStorage.setItem(keys.LS_LANGUAGE , JSON.stringify(language.value));
  };

  const baseDate = ref(Date.now());
});