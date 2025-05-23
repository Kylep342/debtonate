import * as d3 from 'd3';
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import keys from '@/apps/appreciate/constants/keys';
import {
  Budget,
  MonthlyBudget,
  ContributionScenario
} from '@/apps/appreciate/types/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import {
  Arc,
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
    instruments.value = JSON.parse(localStorage.getItem(keys.LS_INSTRUMENTS)!).map(
      (instrument) => new moneyfunx.Instrument(
        instrument.currentBalance,
        instrument.annualRate,
        constants.PERIODS_PER_YEAR,
        instrument.name,
        instrument.annualLimit
      )
    );
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

  const toggleDeflateAllMoney = (newFactor: number): void => {
    deflateAllMoney.value = !deflateAllMoney.value
    if (deflateAllMoney.value) {
      setInflationFactor(newFactor);
    }
  };

  const avalanche = (): Array<moneyfunx.Instrument> => moneyfunx.sortWith(
    moneyfunx.sortWith(instruments.value, moneyfunx.snowball),
    moneyfunx.avalanche,
  );

  const deflate = (amount: number, periods: number): number => (amount * ((1 - inflationFactor.value / constants.PERIODS_PER_YEAR) ** periods));

  const sortInstruments = () => {
    instruments.value = avalanche();
  }

  /** dependent computed options/functions */

  // total values across all instruments

  const totalAnnualLimit = computed<number>(() => instruments.value.reduce(
    (annualLimit, instrument) => annualLimit + instrument.annualLimit,
    0,
  ));

  const totalCurrentBalance = computed<number>(() => instruments.value.reduce(
    (totalBalance, instrument) => totalBalance + instrument.currentBalance,
    0,
  ));

  // const totalEffectiveInterestRate = computed<number>(() => instruments.value.reduce(
  //   (interestRate, instrument) => ,
  //   0,
  // ))

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

  const totalsAsAnInstrument = computed<moneyfunx.IInstrument>(() => ({
    id: constants.TOTALS,
    name: constants.NAME_TOTALS_AS_AN_INSTRUMENT,
    currentBalance: totalCurrentBalance.value,
    annualRate: 0,
    periodsPerYear: totalMaxPeriodsPerYear.value,
    periodicRate: 0,
    annualLimit: totalAnnualLimit.value,
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

  const monthlyBudgets = computed<Array<MonthlyBudget>>(() => ([...budgets.value, minimumBudget].map((budget) => ({
    ...budget,
    absolute: budget.relative,
  }))));

  const getBudget = (id: string): Budget|undefined => monthlyBudgets.value.find((budget) => budget.id === id);

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
            yearsToContribute.value * constants.PERIODS_PER_YEAR,
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
      return budget.id
    };

    // Instrument

    const createInstrument = (
      currentBalance: number,
      interestRate: number,
      name: string,
      annualLimit: number,
    ): string => {
      const instrument = new moneyfunx.Instrument(currentBalance, interestRate, constants.PERIODS_PER_YEAR, name, annualLimit);
      if (currentInstrumentId.value && currentInstrumentId.value !== constants.TOTALS) {
        deleteInstrument(currentInstrumentId.value);
        currentInstrumentId.value = null;
      };
      instruments.value.push(instrument);
      sortInstruments();
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

  // budgets is sorted on every create; order preserved on delete
  const getMaxMoney = (
    instrumentId: string
  ): number => {
    const bestSchedule = getContributionSchedule(instrumentId, monthlyBudgets.value[0].id)
    return bestSchedule.lifetimeContribution + bestSchedule.lifetimeGrowth
  };

  // const getMaxGrowthBalanceRatio = (
  //   instrumentId: string
  // ): number => {
  //   const bestSchedule = getContributionSchedule(instrumentId, monthlyBudgets.value[0].id)
  //   return bestSchedule.lifetimeGrowth / (bestSchedule.lifetimeContribution + 1)
  // };

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
  ): string => `(${globalOptions.Money(instrument.currentBalance)} | ${globalOptions.Percent(instrument.annualRate * 100)} | ${globalOptions.Money(monthlyBudget.absolute)}/month | ${getNumContributions(instrument.id, monthlyBudget.id)} Contributions)`;
  const buildInstrumentSubtitle = (
    instrument: moneyfunx.IInstrument
  ): string => `(${globalOptions.Money(instrument.currentBalance)} | ${globalOptions.Percent(instrument.annualRate * 100)})`;


  /** Graphing */

  const graphXScale = computed(() => globalOptions.periodsAsDates ? d3.scaleTime : d3.scaleLinear);

  // graph data

  const balancesGraphs = computed<GraphConfig>(() => {
    const config = <GraphConfig>{
      id: 'Balances',
      color: getBudgetColor,
      graphs: <Graphs>{},
      header: instrumentId => `Balances over Time by Budget - ${getInstrumentName(instrumentId)}`,
      lineName: getBudgetName,
      subheader: instrumentId => buildInstrumentSubtitle(getInstrument(instrumentId)!),
      x: globalOptions.Period,
      xFormat: (x) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: y => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Balance',
      yScale: d3.scaleLinear,
    };

    instrumentsWithTotals.value.forEach((instrument) => {
      config.graphs[instrument.id] = <Graph>{
        config: {
          maxX: getNumContributions(instrument.id, constants.DEFAULT),
          maxY: getMaxMoney(instrument.id) * 1.1,
        },
        lines: <Record<string, Point[]>>{},
      };
      monthlyBudgets.value.forEach((budget) => {
        const line: Point[] = [];
        getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach((record: moneyfunx.ContributionRecord) => {
          line.push({ x: record.period, y: record.currentBalance });
        });
        config.graphs[instrument.id].lines[budget.id] = line;
      });
    });
    return config;
  });


  const budgetCardGraphConfig = computed(() => ({
    id: 'BudgetCardSummary',
    color: getBudgetColor,
    header: instrumentId => `Cost Breakdown - ${getInstrumentName(instrumentId)}`,
    lineName: getBudgetName,
    subheader: instrumentId => buildInstrumentSubtitle(getInstrument(instrumentId)!),
    x: globalOptions.Period,
    xFormat: (x) => globalOptions.Period(x, true),
    xLabel: () => globalOptions.Time,
    xScale: graphXScale.value,
    y: y => y,
    yFormat: globalOptions.Money,
    yLabel: () => 'Amount',
    yScale: d3.scaleLinear,
  }));

  const instrumentCardGraphConfig = computed(() => ({
    id: 'InstrumentCardSummary',
    color: () => '#FFFFFF',
    header: budgetId => `Cost Breakdown - ${getBudgetName(budgetId)}`,
    lineName: getBudgetName,
    subheader: instrumentId => buildInstrumentSubtitle(getInstrument(instrumentId)!),
    x: globalOptions.Period,
    xFormat: (x) => globalOptions.Period(x, true),
    xLabel: () => globalOptions.Time,
    xScale: graphXScale.value,
    y: y => y,
    yFormat: globalOptions.Money,
    yLabel: () => 'Amount',
    yScale: d3.scaleLinear,
  }));

  const cardGraphs = computed<Record<string, Record<string, Arc[]>>>(() => {
    const config = <Record<string, Record<string, Arc[]>>>{};
    instrumentsWithTotals.value.forEach((instrument) => {
      config[instrument.id] = <Record<string, Arc[]>>{};
      monthlyBudgets.value.forEach((budget) => {
        const totalsContributionSummary = getContributionSchedule(instrument.id, budget.id);
        config[instrument.id][budget.id] = [
          { label: 'Lifetime Growth', value: totalsContributionSummary.lifetimeGrowth, color: constants.COLORS[0] },
          { label: 'Lifetime Contribution', value: totalsContributionSummary.lifetimeContribution, color: constants.COLORS[2] },
        ];
      });
    });
    return config;
  });

  const purchasingPowerGraphs = computed<GraphConfig>(() => {
    const config = <GraphConfig>{
      id: 'PurchasingPower',
      color: getBudgetColor,
      graphs: <Graphs>{},
      header: instrumentId => `Purchasing Power over Time by Budget - ${getInstrumentName(instrumentId)}`,
      lineName: getBudgetName,
      subheader: instrumentId => buildInstrumentSubtitle(getInstrument(instrumentId)!),
      x: globalOptions.Period,
      xFormat: (x) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: y => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Balance',
      yScale: d3.scaleLinear,
    };

    instrumentsWithTotals.value.forEach((instrument) => {
      config.graphs[instrument.id] = <Graph>{
        config: {
          maxX: getNumContributions(instrument.id, constants.DEFAULT),
          maxY: deflate(getMaxMoney(instrument.id) * 1.1, getNumContributions(instrument.id, constants.DEFAULT)),
        },
        lines: <Record<string, Point[]>>{},
      };
      monthlyBudgets.value.forEach((budget) => {
        const line: Point[] = [];
        getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach((record: moneyfunx.ContributionRecord) => {
          line.push({ x: record.period, y: deflate(record.currentBalance, record.period) });
        });
        config.graphs[instrument.id].lines[budget.id] = line;
      });
    });
    return config;
  });

  const graphs = computed(() => ({
    [constants.GRAPH_BALANCES_OVER_TIME]: balancesGraphs.value,
    [constants.GRAPH_PURCHASING_POWER_OVER_TIME]: purchasingPowerGraphs.value,
  }));


  /** return */

  return {
    accrueBeforeContribution,
    avalanche,
    budgetCardGraphConfig,
    budgetDetailsPanelActive,
    budgetFormActive,
    budgetFormTitle,
    budgets,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildInstrumentSubtitle,
    cardGraphs,
    clearState,
    contributionScenarios,
    contributionSchedules,
    createBudget,
    createInstrument,
    currentBudgetId,
    currentInstrumentId,
    deflate,
    deflateAllMoney,
    deleteBudget,
    deleteInstrument,
    editBudget,
    editInstrument,
    exitBudgetForm,
    exitInstrumentForm,
    exitOptionsForm,
    exportState,
    getBudget,
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
    graphs,
    inflationFactor,
    instrumentCardGraphConfig,
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
    sortInstruments,
    toggleAccrueBeforeContribution,
    toggleDeflateAllMoney,
    totalAnnualLimit,
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
