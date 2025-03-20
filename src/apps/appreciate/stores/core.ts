import * as d3 from 'd3';
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import sharedConstants from '@/apps/shared/constants/constants';
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

  const accrueBeforeContribution = ref<boolean>(false);
  const budgetDetailsPanelActive = ref<boolean>(false);
  const budgetFormActive = ref<boolean>(false);
  const budgets = ref<Array<Budget>>([]);
  const currentBudgetId = ref<string|null>(null);
  const currentInstrumentId = ref<string|null>(null);
  const deflateAllMoney = ref<boolean>(false);
  const inflationFactor = ref<number>(constants.DEFAULT_INFLATION_FACTOR);
  const instrumentDetailsPanelActive = ref<boolean>(false);
  const instrumentFormActive = ref<boolean>(false);
  const instruments = ref<Array<moneyfunx.Instrument>>([]);
  const minimumBudget: Budget = {id: constants.DEFAULT, relative: 0};
  const optionsFormActive = ref<boolean>(false);
  const yearsToContribute = ref<number>(constants.DEFAULT_YEARS_TO_CONTRIBUTE);
  const yearsToSpend = ref<number>(constants.DEFAULT_YEARS_TO_SPEND);



  /** independent functions/computed values */

  // state management

  const clearState = (): void => {
    globalOptions.clearState();

    accrueBeforeContribution.value = false;
    budgetDetailsPanelActive.value = false;
    budgetFormActive.value = false;
    budgets.value = [];
    currentBudgetId.value = null;
    currentInstrumentId.value = null;
    deflateAllMoney.value = false;
    inflationFactor.value = constants.DEFAULT_INFLATION_FACTOR;
    instrumentDetailsPanelActive.value = false;
    instrumentFormActive.value = false;
    instruments.value = [];
    optionsFormActive.value = false;
    yearsToContribute.value = constants.DEFAULT_YEARS_TO_CONTRIBUTE;
    yearsToSpend.value = constants.DEFAULT_YEARS_TO_SPEND;
  };

  const loadState = (): void => {
    globalOptions.loadState();

    accrueBeforeContribution.value = JSON.parse(localStorage.getItem(keys.LS_ACCRUE_BEFORE_CONTRIBUTION)!);
    budgets.value = JSON.parse(localStorage.getItem(keys.LS_BUDGETS)!);
    deflateAllMoney.value = JSON.parse(localStorage.getItem(keys.LS_DEFLATE_ALL_MONEY)!);
    inflationFactor.value = JSON.parse(localStorage.getItem(keys.LS_INFLATION_FACTOR)!);
    instruments.value = JSON.parse(localStorage.getItem(keys.LS_INSTRUMENTS)!);
    yearsToContribute.value = JSON.parse(localStorage.getItem(keys.LS_YEARS_TO_CONTRIBUTE)!);
    yearsToSpend.value = JSON.parse(localStorage.getItem(keys.LS_YEARS_TO_SPEND)!);
  };

  const saveState = (): void => {
    globalOptions.saveState();

    localStorage.setItem(keys.LS_ACCRUE_BEFORE_CONTRIBUTION, JSON.stringify(accrueBeforeContribution.value));
    localStorage.setItem(keys.LS_BUDGETS , JSON.stringify(budgets.value));
    localStorage.setItem(keys.LS_DEFLATE_ALL_MONEY , JSON.stringify(deflateAllMoney.value));
    localStorage.setItem(keys.LS_INFLATION_FACTOR, JSON.stringify(inflationFactor.value));
    localStorage.setItem(keys.LS_INSTRUMENTS , JSON.stringify(instruments.value));
    localStorage.setItem(keys.LS_YEARS_TO_CONTRIBUTE, JSON.stringify(yearsToContribute.value));
    localStorage.setItem(keys.LS_YEARS_TO_SPEND, JSON.stringify(yearsToSpend.value));
  };

  const exportState = () => ({
    ...globalOptions.exportState(),

    [keys.LS_ACCRUE_BEFORE_CONTRIBUTION]: accrueBeforeContribution.value,
    [keys.LS_BUDGETS]: budgets.value,
    [keys.LS_DEFLATE_ALL_MONEY]: deflateAllMoney.value,
    [keys.LS_INFLATION_FACTOR]: inflationFactor.value,
    [keys.LS_INSTRUMENTS]: instruments.value,
    [keys.LS_YEARS_TO_CONTRIBUTE]: yearsToContribute.value,
    [keys.LS_YEARS_TO_SPEND]: yearsToSpend.value,
  });

  // appreciate settings

  const setInflationFactor = (newFactor: number): void => {
    if (!Number.isNaN(newFactor && newFactor > 0 && newFactor < constants.MAX_DELTA_FACTOR)) {
      inflationFactor.value = newFactor;
    }
  };

  const setYearsToContribute = (newYears: number): void => {
    if (!Number.isNaN(newYears && newYears > 0 && newYears < moneyfunx.MAX_DURATION_YEARS)) {
      yearsToContribute.value = newYears;
    }
  };

  const setYearsToSpend = (newYears: number): void => {
    if (!Number.isNaN(newYears && newYears > 0 && newYears < moneyfunx.MAX_DURATION_YEARS)) {
      yearsToSpend.value = newYears;
    }
  };

  const toggleAccrueBeforeContribution = (): void => {
    accrueBeforeContribution.value = !accrueBeforeContribution.value
  };

  const toggleDeflateAllMoney = (): void => {
    deflateAllMoney.value = !deflateAllMoney.value
  };


  /** dependent computed options/functions */

  // total values across all instruments

  const totalCurrentBalance = computed<number>(() => instruments.value.reduce(
    (totalBalance, instruments) => totalBalance + instruments.currentBalance,
    0,
  ));

  const totalMaxPeriodsPerYear = computed<number>(
    () => instruments.value.reduce((curMax, instrument) => Math.max(curMax, instrument.periodsPerYear), 0),
  );


  /** form functions */

  const openBudgetForm = (): void => {
    budgetFormActive.value = true;
  };
  const openInstrumentForm = (): void => {
    instrumentFormActive.value = true;
  };
  const openOptionsForm = (): void => {
    optionsFormActive.value = true;
  };

  const exitBudgetForm = (): void => {
    budgetFormActive.value = false;
    currentBudgetId.value = null;
  };
  const exitInstrumentForm = (): void => {
    instrumentFormActive.value = false;
    currentInstrumentId.value = null;
  };
  const exitOptionsForm = (): void => {
    optionsFormActive.value = false;
  };


  /** Instruments */

  // attribute functions in here are placeholder
  const totalsAsAnInstrument = computed<moneyfunx.IInstrument>(() => ({
    id: sharedConstants.TOTALS,
    name: constants.NAME_TOTALS_AS_AN_INSTRUMENT,
    currentBalance: totalCurrentBalance.value,
    annualRate: () => 0,
    periodsPerYear: totalMaxPeriodsPerYear.value,
    periodicRate: () => 0.01,
    annualLimit: () => 1000,
  }));

  const instrumentsWithTotals = computed<Array<moneyfunx.IInstrument>>(() => [totalsAsAnInstrument.value, ...instruments.value]);

  const getInstrument = (id: string): moneyfunx.IInstrument|undefined => instrumentsWithTotals.value.find((instrument) => instrument.id === id);

  const deleteInstrument = (id: string): void => {
    instruments.value = instruments.value.filter((instrument) => instrument.id !== id);
  };
  const editInstrument = (id: string): void => {
    currentInstrumentId.value = id;
    openInstrumentForm();
  };
  const getInstrumentIndex = (id: string): number => instrumentsWithTotals.value.findIndex((instrument) => instrument.id === id);
  const getInstrumentName = (id: string): string => getInstrument(id)!.name
  const unviewInstrument = (): void => {
    instrumentDetailsPanelActive.value = false;
    currentInstrumentId.value = null;
  };
  const viewInstrument = (id: string): void => {
    currentInstrumentId.value = id;
    instrumentDetailsPanelActive.value = true;
  };


  /** Budgets */

  const monthlyBudgets = computed<Array<Budget>>(() => [...budgets.value, minimumBudget]);

  const deleteBudget = (id: string): void => {
    budgets.value = budgets.value.filter(
      (budget) => budget.id !== id && budget.id !== constants.DEFAULT,
    );
  };
  const editBudget = (id: string): void => {
    currentBudgetId.value = id;
    openBudgetForm();
  };
  const getBudgetColor = (id: string): string => constants.COLORS[getBudgetIndex(id) % constants.COLORS.length];
  const getBudgetIndex = (id: string): number => monthlyBudgets.value.findIndex((budget) => budget.id === id) + 1;
  const getBudgetName = (id: string): string => (
    id === constants.DEFAULT
      ? constants.NAME_MIN_BUDGET
      : `${constants.BUDGET} ${getBudgetIndex(id)}`
  );
  const unviewBudget = (): void => {
    budgetDetailsPanelActive.value = false;
    currentBudgetId.value = null;
  };
  const viewBudget = (id: string): void => {
    currentBudgetId.value = id;
    budgetDetailsPanelActive.value = true;
  };


  /** dependent computed values */

  const budgetFormTitle = computed<string>(() => (currentBudgetId.value && budgetFormActive.value
    ? `Editing ${getBudgetName(currentBudgetId.value)}`
    : 'Creating a Budget'));

  const instrumentFormTitle = computed<string>(() => (currentInstrumentId.value && instrumentFormActive.value
    ? `Editing ${getInstrumentName(currentInstrumentId.value)}`
    : 'Creating an Instrument'));

  const contributionScenarios = computed<Record<string, ContributionScenario>>(() => {
      const scenarios: Record<string, ContributionScenario> = {};
      monthlyBudgets.value.forEach((budget) => {
        scenarios[budget.id] = {
          contributionAmount: budget.relative,
          contributionSchedule: moneyfunx.contributeInstruments(
            instruments.value,
            budget.relative,
            yearsToContribute.value,
            accrueBeforeContribution.value,
          ),
        }
      });
      return scenarios;
    });

    const contributionSchedules = computed<Record<string, Record<string, moneyfunx.ContributionSchedule>>>(() => {
      const schedules: Record<string, Record<string, moneyfunx.ContributionSchedule>> = {};

      instrumentsWithTotals.value.forEach((instrument) => {
        schedules[instrument.id] = {};
      });

      Object.keys(schedules).forEach((instrumentId) => {
        Object.keys(contributionScenarios.value).forEach((budgetId) => {
          const schedule = contributionScenarios.value[budgetId];
          schedules[instrumentId][budgetId] = {...schedule.contributionSchedule[instrumentId]}});
        });
      return schedules;
    });


    /** Creation functions */

    // Budget

    const createBudget = (proposedBudget: number): string => {
      const budget = {
        id: String(Math.floor(Math.random() * Date.now())),
        relative: proposedBudget
      };
      if (currentBudgetId.value && currentBudgetId.value !== constants.DEFAULT) {
        deleteBudget(currentBudgetId.value);
        currentBudgetId.value = null;
      };
      budgets.value.push(budget);
      budgets.value.sort((a, b) => b.relative - a.relative);
      exitBudgetForm();
      return budget.id
    };

    // Instrument

    const createInstrument = (
      currentBalance: number,
      interestRate: Function,
      name: string,
      annualLimit: Function,
    ): string => {
      const instrument = new moneyfunx.Instrument(currentBalance, interestRate, 12, name, annualLimit);
      if (currentInstrumentId.value && currentInstrumentId.value !== constants.TOTALS) {
        deleteInstrument(currentInstrumentId.value);
        currentInstrumentId.value = null;
      };
      instruments.value.push(instrument);
      // sortInstruments();
      exitInstrumentForm();
      return instrument.id;
    };

  // ease-of-use getters over computed values

  const getContributionSchedule = (instrumentId: string, budgetId: string) => contributionSchedules.value[instrumentId][budgetId];

  const getNumContributions = (
    instrumentId: string,
    budgetId: string
  ): number => getContributionSchedule(instrumentId, budgetId).amortizationSchedule.length;

  const getLifetimeGrowth = (
    instrumentId: string,
    budgetId: string
  ): number => getContributionSchedule(instrumentId, budgetId).lifetimeGrowth;

  const getGrowthUpToPeriod = (
    instrumentId: string,
    budgetId: string,
    period: number
  ): number => getContributionSchedule(
    instrumentId,
    budgetId
  ).amortizationSchedule.slice(
    0,
    period
  ).reduce(
    (acc, record) => acc + record.growth,
    0
  );

  // title building functions

  const buildAmortizationTableTitle = (
    instrument: moneyfunx.IInstrument,
    monthlyBudget: Budget
  ): string => `Amortization Table - ${getInstrumentName(instrument.id)} | ${getBudgetName(monthlyBudget.id)}`;
  const buildAmortizationTableSubtitle = (
    instrument: moneyfunx.IInstrument,
    monthlyBudget: Budget
  ): string => `(${globalOptions.Money(instrument.currentBalance)} | ${globalOptions.Percent(instrument.annualRate() * 100)} | ${globalOptions.Money(monthlyBudget.absolute)}/month | ${getNumContributions(instrument.id, monthlyBudget.id)} Contributions)`;
  const buildInstrumentSubtitle = (
    instrument: moneyfunx.IInstrument
  ): string => `(${globalOptions.Money(instrument.currentBalance)} | ${globalOptions.Percent(instrument.annualRate() * 100)})`;


  /** return */

  return {
    accrueBeforeContribution,
    budgetDetailsPanelActive,
    budgetFormActive,
    budgetFormTitle,
    budgets,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildInstrumentSubtitle,
    clearState,
    contributionScenarios,
    contributionSchedules,
    createBudget,
    createInstrument,
    currentBudgetId,
    currentInstrumentId,
    deflateAllMoney,
    deleteBudget,
    deleteInstrument,
    editBudget,
    editInstrument,
    exitBudgetForm,
    exitInstrumentForm,
    exitOptionsForm,
    exportState,
    getBudgetColor,
    getBudgetIndex,
    getBudgetName,
    getContributionSchedule,
    getGrowthUpToPeriod,
    getInstrument,
    getInstrumentIndex,
    getInstrumentName,
    getLifetimeGrowth,
    getNumContributions,
    instrumentDetailsPanelActive,
    instrumentFormActive,
    instrumentFormTitle,
    instruments,
    instrumentsWithTotals,
    loadState,
    minimumBudget,
    monthlyBudgets,
    openBudgetForm,
    openInstrumentForm,
    openOptionsForm,
    optionsFormActive,
    saveState,
    setInflationFactor,
    setYearsToContribute,
    setYearsToSpend,
    toggleAccrueBeforeContribution,
    toggleDeflateAllMoney,
    totalCurrentBalance,
    totalMaxPeriodsPerYear,
    totalsAsAnInstrument,
    unviewBudget,
    unviewInstrument,
    viewBudget,
    viewInstrument,
    yearsToContribute,
    yearsToSpend,
  };
});