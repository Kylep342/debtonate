import * as d3 from 'd3';
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import keys from '@/apps/appreciate/constants/keys';
import { ContributionScenario } from '@/apps/appreciate/types/core';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import {
  Budget,
  MonthlyBudget,
} from '@/apps/shared/types/core';
import {
  Arc,
  ChartSeries,
  DonutGraphContent,
  // Graph,
  GraphConfig,
  Graphs,
  LineGraphContent,
  Point,
} from '@/apps/shared/types/graph';

export interface AppreciateCoreState {
  accrueBeforeContribution: Ref<boolean>;
  budgetDetailsPanelActive: Ref<boolean>;
  budgetFormActive: Ref<boolean>;
  budgets: Ref<Budget[]>;
  currentBudgetId: Ref<string | null>;
  currentInstrumentId: Ref<string | null>;
  deflateAllMoney: Ref<boolean>;
  inflationFactor: Ref<number>;
  instrumentDetailsPanelActive: Ref<boolean>;
  instrumentFormActive: Ref<boolean>;
  instruments: Ref<moneyfunx.Instrument[]>;
  minimumBudget: Budget;
  optionsFormActive: Ref<boolean>;
  yearsToContribute: Ref<number>;
  yearsToSpend: Ref<number>;
}

export interface AppreciateCoreGetters {
  amortizationTableHeaders: ComputedRef<
    Record<string, string | ComputedRef<string>>[]
  >;
  balancesGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  budgetCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>>;
  budgetFormTitle: ComputedRef<string>;
  cardGraphs: ComputedRef<DonutGraphContent>;
  contributionScenarios: ComputedRef<Record<string, ContributionScenario>>;
  contributionSchedules: ComputedRef<
    Record<string, Record<string, moneyfunx.ContributionSchedule>>
  >;
  graphs: ComputedRef<Record<string, GraphConfig>>;
  graphXScale: ComputedRef<d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>>;
  inflationRate: ComputedRef<number>;
  instrumentCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>>;
  instrumentFormTitle: ComputedRef<string>;
  instrumentsWithTotals: ComputedRef<moneyfunx.IInstrument[]>;
  monthlyBudgets: ComputedRef<MonthlyBudget[]>;
  periodLabel: ComputedRef<string>;
  purchasingPowerGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  totalAnnualLimit: ComputedRef<number>;
  totalCurrentBalance: ComputedRef<number>;
  totalMaxPeriodsPerYear: ComputedRef<number>;
  totalsAsAnInstrument: ComputedRef<moneyfunx.IInstrument>;
}

export interface AppreciateCoreActions {
  amortizationTableRows: (
    schedule: moneyfunx.ContributionSchedule
  ) => Record<string, string>[];
  amortizationTableTotals: (
    schedule: moneyfunx.ContributionSchedule
  ) => Record<string, string>;
  avalanche: () => moneyfunx.Instrument[];
  buildAmortizationTableSubtitle: (
    instrument: moneyfunx.IInstrument,
    budget: Budget
  ) => string;
  buildAmortizationTableTitle: (
    instrument: moneyfunx.IInstrument,
    budget: Budget
  ) => string;
  buildInstrumentSubtitle: (instrument: moneyfunx.IInstrument) => string;
  clearState: () => void;
  createBudget: (proposedBudget: number) => string;
  createInstrument: (
    currentBalance: number,
    interestRate: number,
    name: string,
    annualLimit: number
  ) => string;
  deflate: (amount: number, periods: number) => number;
  deleteBudget: (id: string) => void;
  deleteInstrument: (id: string) => void;
  editBudget: (id: string) => void;
  editInstrument: (id: string) => void;
  exitBudgetForm: () => void;
  exitInstrumentForm: () => void;
  exitOptionsForm: () => void;
  exportState: () => Record<string, any>;
  getBudget: (id: string) => MonthlyBudget | undefined;
  getBudgetColor: (id: string) => string;
  getBudgetIndex: (id: string) => number;
  getBudgetName: (id: string) => string;
  getContributionSchedule: (
    instrumentId: string,
    budgetId: string
  ) => moneyfunx.ContributionSchedule;
  getInstrument: (id: string) => moneyfunx.IInstrument | undefined;
  getInstrumentIndex: (id: string) => number;
  getInstrumentName: (id: string) => string;
  getMaxMoney: (instrumentId: string) => number;
  getNumContributions: (instrumentId: string, budgetId: string) => number;
  loadState: () => void;
  openBudgetForm: () => void;
  openInstrumentForm: () => void;
  openOptionsForm: () => void;
  saveState: () => void;
  setInflationFactor: (newFactor: number) => void;
  setYearsToContribute: (newYears: number) => void;
  setYearsToSpend: (newYears: number) => void;
  sortInstruments: () => void;
  toggleAccrueBeforeContribution: () => void;
  toggleDeflateAllMoney: (newFactor: number) => void;
  unviewBudget: () => void;
  unviewInstrument: () => void;
  viewBudget: (id: string) => void;
  viewInstrument: (id: string) => void;
}

export const useAppreciateCoreStore = defineStore('appreciateCore', () => {
  // dependent stores

  const globalOptions = useGlobalOptionsStore();

  /** STATE */

  const accrueBeforeContribution: Ref<boolean> = ref(false);
  const budgetDetailsPanelActive: Ref<boolean> = ref(false);
  const budgetFormActive: Ref<boolean> = ref(false);
  const budgets: Ref<Budget[]> = ref([]);
  const currentBudgetId: Ref<string | null> = ref(null);
  const currentInstrumentId: Ref<string | null> = ref(null);
  const deflateAllMoney: Ref<boolean> = ref(false);
  const inflationFactor: Ref<number> = ref(constants.DEFAULT_INFLATION_FACTOR);
  const instrumentDetailsPanelActive: Ref<boolean> = ref(false);
  const instrumentFormActive: Ref<boolean> = ref(false);
  const instruments: Ref<moneyfunx.Instrument[]> = ref([]);
  const minimumBudget: Budget = { id: constants.DEFAULT, relative: 0 };
  const optionsFormActive: Ref<boolean> = ref(false);
  const yearsToContribute: Ref<number> = ref(
    constants.DEFAULT_YEARS_TO_CONTRIBUTE
  );
  const yearsToSpend: Ref<number> = ref(constants.DEFAULT_YEARS_TO_SPEND);

  /** GETTERS */

  // total values across all instruments
  const inflationRate: ComputedRef<number> = computed(
    () => inflationFactor.value / 100
  );

  const totalAnnualLimit: ComputedRef<number> = computed(() =>
    instruments.value.reduce(
      (annualLimit, instrument) => annualLimit + instrument.annualLimit,
      0
    )
  );

  const totalCurrentBalance: ComputedRef<number> = computed(() =>
    instruments.value.reduce(
      (totalBalance, instrument) => totalBalance + instrument.currentBalance,
      0
    )
  );

  const totalMaxPeriodsPerYear: ComputedRef<number> = computed(() =>
    instruments.value.reduce(
      (curMax, instrument) => Math.max(curMax, instrument.periodsPerYear),
      0
    )
  );

  // Instruments
  const totalsAsAnInstrument: ComputedRef<moneyfunx.IInstrument> = computed(
    () => ({
      id: constants.TOTALS,
      name: constants.NAME_TOTALS_AS_AN_INSTRUMENT,
      currentBalance: totalCurrentBalance.value,
      annualRate: 0,
      periodsPerYear: totalMaxPeriodsPerYear.value,
      periodicRate: 0,
      annualLimit: totalAnnualLimit.value,
    })
  );

  const instrumentsWithTotals: ComputedRef<moneyfunx.IInstrument[]> = computed(
    () => [totalsAsAnInstrument.value, ...instruments.value]
  );

  // Budgets
  const monthlyBudgets: ComputedRef<MonthlyBudget[]> = computed(() =>
    [...budgets.value, minimumBudget].map((budget) => ({
      ...budget,
      absolute: budget.relative,
    }))
  );

  // String builders
  const budgetFormTitle: ComputedRef<string> = computed(() =>
    currentBudgetId.value && budgetFormActive.value
      ? `Editing ${getBudgetName(currentBudgetId.value)}`
      : 'Creating a Budget'
  );

  const instrumentFormTitle: ComputedRef<string> = computed(() =>
    currentInstrumentId.value && instrumentFormActive.value
      ? `Editing ${getInstrumentName(currentInstrumentId.value)}`
      : 'Creating an Instrument'
  );

  // Contriubtions
  const contributionScenarios: ComputedRef<Record<string, ContributionScenario>> =
    computed(() => {
      const scenarios: Record<string, ContributionScenario> = {};
      monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
        scenarios[budget.id] = <ContributionScenario>{
          contributionAmount: budget.relative,
          contributionSchedule: moneyfunx.contributeInstruments(
            instruments.value,
            budget.relative,
            yearsToContribute.value * constants.PERIODS_PER_YEAR,
            accrueBeforeContribution.value
          ),
        };
      });
      return scenarios;
    });

  const contributionSchedules: ComputedRef<
    Record<string, Record<string, moneyfunx.ContributionSchedule>>
  > = computed(() => {
    const schedules: Record<
      string,
      Record<string, moneyfunx.ContributionSchedule>
    > = {};

    instrumentsWithTotals.value.forEach((instrument: moneyfunx.IInstrument) => {
      schedules[instrument.id] = <
        Record<string, moneyfunx.ContributionSchedule>
      >{};
    });

    Object.keys(schedules).forEach((instrumentId: string) => {
      Object.keys(contributionScenarios.value).forEach((budgetId: string) => {
        const schedule = contributionScenarios.value[budgetId];
        schedules[instrumentId][budgetId] = <moneyfunx.ContributionSchedule>{
          ...schedule.contributionSchedule[instrumentId],
        };
      });
    });
    return schedules;
  });

  // ease-of-use getters over computed values
  const periodLabel: ComputedRef<string> = computed(() =>
    globalOptions.periodsAsDates ? 'Contribution Date' : 'Contribution Number'
  );

  const amortizationTableHeaders: ComputedRef<
    Record<string, string | ComputedRef<string>>[]
  > = computed(() => [
    { key: 'period', label: periodLabel },
    { key: 'totalGrowth', label: 'Total Growth' },
    { key: 'contribution', label: 'Contribution' },
    { key: 'interest', label: 'Interest' },
    { key: 'currentBalance', label: 'Current Balance' },
  ]);

  // Graphing
  const graphXScale: ComputedRef<d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>> = computed(() =>
    globalOptions.periodsAsDates ? d3.scaleTime : d3.scaleLinear
  );

  // graph data
  const balancesGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(
    () => {
      const config = <GraphConfig<LineGraphContent>>{
        id: 'Balances',
        type: 'line',
        color: getBudgetColor,
        graphs: <Graphs<LineGraphContent>>{},
        header: (instrumentId: string) =>
          `Balances over Time by Budget - ${getInstrumentName(instrumentId)}`,
        lineName: getBudgetName,
        subheader: (instrumentId: string) =>
          buildInstrumentSubtitle(getInstrument(instrumentId)!),
        x: globalOptions.Period,
        xFormat: (x: number) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Balance',
        yScale: d3.scaleLinear,
      };

      instrumentsWithTotals.value.forEach((instrument: moneyfunx.IInstrument) => {
        config.graphs[instrument.id] = <LineGraphContent>{
          config: {
            maxX: getNumContributions(instrument.id, constants.DEFAULT),
            maxY: getMaxMoney(instrument.id) * 1.1,
          },
          lines: <ChartSeries<Point>>{},
        };
        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: moneyfunx.ContributionRecord) => {
              line.push({ x: record.period, y: record.currentBalance });
            }
          );
          config.graphs[instrument.id].lines[budget.id] = line;
        });
      });
      return config;
    }
  );

  const budgetCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>> = computed(
    () => ({
      id: 'BudgetCardSummary',
      type: 'donut',
      // graphs: balancesGraphs,
      color: getBudgetColor,
      header: (instrumentId: string) =>
        `Yield Breakdown - ${getInstrumentName(instrumentId)}`,
      lineName: getBudgetName,
      subheader: (instrumentId: string) =>
        buildInstrumentSubtitle(getInstrument(instrumentId)!),
      x: globalOptions.Period,
      xFormat: (x: number) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Amount',
      yScale: d3.scaleLinear,
    })
  );

  const instrumentCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>> =
    computed(() => ({
      id: 'InstrumentCardSummary',
      type: 'donut',
      color: () => '#FFFFFF',
      header: (budgetId: string) =>
        `Yield Breakdown - ${getBudgetName(budgetId)}`,
      lineName: getBudgetName,
      subheader: (instrumentId: string) =>
        buildInstrumentSubtitle(getInstrument(instrumentId)!),
      x: globalOptions.Period,
      xFormat: (x: number) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Amount',
      yScale: d3.scaleLinear,
    }));

  const cardGraphs: ComputedRef<Record<string, Record<string, DonutGraphContent>>> = computed(() => {
    const config = <Record<string, Record<string, DonutGraphContent>>>{};
    instrumentsWithTotals.value.forEach((instrument: moneyfunx.IInstrument) => {
      config[instrument.id] = <Record<string, DonutGraphContent>>{};
      monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
        const totalsContributionSummary = getContributionSchedule(
          instrument.id,
          budget.id
        );
        config[instrument.id][budget.id] = <Arc[]>[
          <Arc>{
            label: 'Lifetime Growth',
            value: totalsContributionSummary.lifetimeGrowth,
            color: globalOptions.colorPalate[0],
          },
          <Arc>{
            label: 'Lifetime Contribution',
            value: totalsContributionSummary.lifetimeContribution,
            color: globalOptions.colorPalate[2],
          },
        ];
      });
    });
    return config;
  });

  const purchasingPowerGraphs: ComputedRef<GraphConfig<LineGraphContent>> =
    computed(() => {
      const config = <GraphConfig<LineGraphContent>>{
        id: 'PurchasingPower',
        type: 'line',
        color: getBudgetColor,
        graphs: <Graphs<LineGraphContent>>{},
        header: (instrumentId: string) =>
          `Purchasing Power over Time by Budget - ${getInstrumentName(
            instrumentId
          )}`,
        lineName: getBudgetName,
        subheader: (instrumentId: string) =>
          buildInstrumentSubtitle(getInstrument(instrumentId)!),
        x: globalOptions.Period,
        xFormat: (x: number) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Balance',
        yScale: d3.scaleLinear,
      };

      instrumentsWithTotals.value.forEach((instrument: moneyfunx.IInstrument) => {
        config.graphs[instrument.id] = <LineGraphContent>{
          config: {
            maxX: getNumContributions(instrument.id, constants.DEFAULT),
            maxY: deflate(
              getMaxMoney(instrument.id) * 1.1,
              getNumContributions(instrument.id, constants.DEFAULT)
            ),
          },
          lines: <ChartSeries<Point>>{},
        };
        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: moneyfunx.ContributionRecord) => {
              line.push({
                x: record.period,
                y: deflate(record.currentBalance, record.period),
              });
            }
          );
          config.graphs[instrument.id].lines[budget.id] = line;
        });
      });
      return config;
    });

  const graphs: ComputedRef<Record<string, GraphConfig<LineGraphContent>>> = computed(() => ({
    [constants.GRAPH_BALANCES_OVER_TIME]: balancesGraphs.value,
    [constants.GRAPH_PURCHASING_POWER_OVER_TIME]: purchasingPowerGraphs.value,
  }));

  /** ACTIONS */

  // state manangement
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

    const storedAccrueBeforeContribution = localStorage.getItem(
      keys.LS_ACCRUE_BEFORE_CONTRIBUTION
    );
    const storedBudgets = localStorage.getItem(keys.LS_BUDGETS);
    const storedDeflateAllMoney = localStorage.getItem(
      keys.LS_DEFLATE_ALL_MONEY
    );
    const storedInflationFactor = localStorage.getItem(
      keys.LS_INFLATION_FACTOR
    );
    const storedInstruments = localStorage.getItem(keys.LS_INSTRUMENTS);
    const storedYearsToContribute = localStorage.getItem(
      keys.LS_YEARS_TO_CONTRIBUTE
    );
    const storedYearsToSpend = localStorage.getItem(keys.LS_YEARS_TO_SPEND);

    if (storedAccrueBeforeContribution)
      accrueBeforeContribution.value = JSON.parse(
        storedAccrueBeforeContribution
      );
    if (storedBudgets) budgets.value = JSON.parse(storedBudgets);
    if (storedDeflateAllMoney)
      deflateAllMoney.value = JSON.parse(storedDeflateAllMoney);
    if (storedInflationFactor)
      inflationFactor.value = JSON.parse(storedInflationFactor);
    if (storedInstruments)
      instruments.value = JSON.parse(storedInstruments).map(
        (instrument: moneyfunx.IInstrument) =>
          new moneyfunx.Instrument(
            instrument.currentBalance,
            instrument.annualRate,
            constants.PERIODS_PER_YEAR,
            instrument.name,
            instrument.annualLimit
          )
      );
    if (storedYearsToContribute)
      yearsToContribute.value = JSON.parse(storedYearsToContribute);
    if (storedYearsToSpend)
      yearsToSpend.value = JSON.parse(storedYearsToSpend);
  };

  const saveState = (): void => {
    globalOptions.saveState();

    localStorage.setItem(
      keys.LS_ACCRUE_BEFORE_CONTRIBUTION,
      JSON.stringify(accrueBeforeContribution.value)
    );
    localStorage.setItem(keys.LS_BUDGETS, JSON.stringify(budgets.value));
    localStorage.setItem(
      keys.LS_DEFLATE_ALL_MONEY,
      JSON.stringify(deflateAllMoney.value)
    );
    localStorage.setItem(
      keys.LS_INFLATION_FACTOR,
      JSON.stringify(inflationFactor.value)
    );
    localStorage.setItem(keys.LS_INSTRUMENTS, JSON.stringify(instruments.value));
    localStorage.setItem(
      keys.LS_YEARS_TO_CONTRIBUTE,
      JSON.stringify(yearsToContribute.value)
    );
    localStorage.setItem(
      keys.LS_YEARS_TO_SPEND,
      JSON.stringify(yearsToSpend.value)
    );
  };

  const exportState = (): Record<string, any> => ({
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
    if (
      !Number.isNaN(
        newFactor && newFactor > 0 && newFactor < constants.MAX_DELTA_FACTOR
      )
    ) {
      inflationFactor.value = newFactor;
    }
  };

  const setYearsToContribute = (newYears: number): void => {
    if (
      !Number.isNaN(
        newYears && newYears > 0 && newYears < moneyfunx.MAX_DURATION_YEARS
      )
    ) {
      yearsToContribute.value = newYears;
    }
  };

  const setYearsToSpend = (newYears: number): void => {
    if (
      !Number.isNaN(
        newYears && newYears > 0 && newYears < moneyfunx.MAX_DURATION_YEARS
      )
    ) {
      yearsToSpend.value = newYears;
    }
  };

  const toggleAccrueBeforeContribution = (): void => {
    accrueBeforeContribution.value = !accrueBeforeContribution.value;
  };

  const toggleDeflateAllMoney = (newFactor: number): void => {
    deflateAllMoney.value = !deflateAllMoney.value;
    if (deflateAllMoney.value) {
      setInflationFactor(newFactor);
    }
  };

  const avalanche = (): moneyfunx.Instrument[] =>
    moneyfunx.sortWith(
      moneyfunx.sortWith(instruments.value, moneyfunx.snowball),
      moneyfunx.avalanche
    );

  const deflate = (amount: number, periods: number): number =>
    amount * (1 - inflationRate.value / constants.PERIODS_PER_YEAR) ** periods;

  const sortInstruments = () => {
    instruments.value = avalanche();
  };

  // form functions
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

  // Instruments
  const getInstrument = (id: string): moneyfunx.IInstrument | undefined =>
    instrumentsWithTotals.value.find((instrument) => instrument.id === id);

  const deleteInstrument = (id: string): void => {
    instruments.value = instruments.value.filter(
      (instrument: moneyfunx.Instrument) => instrument.id !== id
    );
  };
  const editInstrument = (id: string): void => {
    currentInstrumentId.value = id;
    openInstrumentForm();
  };
  const getInstrumentIndex = (id: string): number =>
    instrumentsWithTotals.value.findIndex(
      (instrument: moneyfunx.IInstrument) => instrument.id === id
    );
  const getInstrumentName = (id: string): string => getInstrument(id)!.name;
  const unviewInstrument = (): void => {
    instrumentDetailsPanelActive.value = false;
    currentInstrumentId.value = null;
  };
  const viewInstrument = (id: string): void => {
    currentInstrumentId.value = id;
    instrumentDetailsPanelActive.value = true;
  };

  // Budgets
  const getBudget = (id: string): MonthlyBudget | undefined =>
    monthlyBudgets.value.find((budget) => budget.id === id);

  const deleteBudget = (id: string): void => {
    budgets.value = budgets.value.filter(
      (budget: Budget) => budget.id !== id && budget.id !== constants.DEFAULT
    );
  };
  const editBudget = (id: string): void => {
    currentBudgetId.value = id;
    openBudgetForm();
  };
  const getBudgetColor = (id: string): string =>
    globalOptions.colorPalate[getBudgetIndex(id) % globalOptions.colorPalate.length];
  const getBudgetIndex = (id: string): number =>
    monthlyBudgets.value.findIndex((budget) => budget.id === id) + 1;
  const getBudgetName = (id: string): string =>
    id === constants.DEFAULT
      ? constants.NAME_MIN_BUDGET
      : `${constants.BUDGET} ${getBudgetIndex(id)}`;
  const unviewBudget = (): void => {
    budgetDetailsPanelActive.value = false;
    currentBudgetId.value = null;
  };
  const viewBudget = (id: string): void => {
    currentBudgetId.value = id;
    budgetDetailsPanelActive.value = true;
  };

  // Creation functions

  // Budget
  const createBudget = (proposedBudget: number): string => {
    const budget = <Budget>{
      id: String(Math.floor(Math.random() * Date.now())),
      relative: proposedBudget,
    };
    if (currentBudgetId.value && currentBudgetId.value !== constants.DEFAULT) {
      deleteBudget(currentBudgetId.value);
      currentBudgetId.value = null;
    }
    budgets.value.push(budget);
    budgets.value.sort((a: Budget, b: Budget) => b.relative - a.relative);
    return budget.id;
  };

  // Instrument
  const createInstrument = (
    currentBalance: number,
    interestRate: number,
    name: string,
    annualLimit: number
  ): string => {
    const instrument = new moneyfunx.Instrument(
      currentBalance,
      interestRate,
      constants.PERIODS_PER_YEAR,
      name,
      annualLimit
    );
    if (
      currentInstrumentId.value &&
      currentInstrumentId.value !== constants.TOTALS
    ) {
      deleteInstrument(currentInstrumentId.value);
      currentInstrumentId.value = null;
    }
    instruments.value.push(instrument);
    sortInstruments();
    return instrument.id;
  };

  // ease-of-use getters over computed values
  const getContributionSchedule = (
    instrumentId: string,
    budgetId: string
  ): moneyfunx.ContributionSchedule =>
    contributionSchedules.value[instrumentId][budgetId];

  const getNumContributions = (
    instrumentId: string,
    budgetId: string
  ): number =>
    getContributionSchedule(instrumentId, budgetId).amortizationSchedule.length;

  // budgets is sorted on every create; order preserved on delete
  const getMaxMoney = (instrumentId: string): number => {
    // monthly budgets is sorted every change; the first one yields the most money
    const bestSchedule = getContributionSchedule(
      instrumentId,
      monthlyBudgets.value[0].id
    );
    return bestSchedule.lifetimeContribution + bestSchedule.lifetimeGrowth;
  };

  const amortizationTableRows = (schedule: moneyfunx.ContributionSchedule) => {
    return schedule.amortizationSchedule.map(
      (record: moneyfunx.ContributionRecord) => ({
        period: globalOptions.Period(record.period, true) as string,
        totalGrowth: globalOptions.Money(record.growth + record.contribution),
        contribution: globalOptions.Money(record.contribution),
        interest: globalOptions.Money(record.growth),
        currentBalance: globalOptions.Money(record.currentBalance),
      })
    );
  };

  const amortizationTableTotals = (schedule: moneyfunx.ContributionSchedule) => {
    const { lifetimeContribution, lifetimeGrowth } = schedule;
    return {
      period: 'Totals',
      totalGrowth: globalOptions.Money(lifetimeGrowth + lifetimeContribution),
      contribution: globalOptions.Money(lifetimeContribution),
      interest: globalOptions.Money(lifetimeGrowth),
      currentBalance: globalOptions.Money(lifetimeGrowth + lifetimeContribution),
    };
  };

  // title building functions
  const buildAmortizationTableTitle = (
    instrument: moneyfunx.IInstrument,
    monthlyBudget: Budget
  ): string =>
    `Amortization Table - ${getInstrumentName(
      instrument.id
    )} | ${getBudgetName(monthlyBudget.id)}`;

  const buildAmortizationTableSubtitle = (
    instrument: moneyfunx.IInstrument,
    monthlyBudget: Budget
  ): string =>
    `(${globalOptions.Money(
      instrument.currentBalance
    )} | ${globalOptions.Percent(
      instrument.annualRate * 100
    )} | ${globalOptions.Money(
      (monthlyBudget as MonthlyBudget).absolute
    )}/month | ${getNumContributions(
      instrument.id,
      monthlyBudget.id
    )} Contributions)`;

  const buildInstrumentSubtitle = (
    instrument: moneyfunx.IInstrument
  ): string =>
    `(${globalOptions.Money(
      instrument.currentBalance
    )} | ${globalOptions.Percent(instrument.annualRate * 100)})`;

  /** return */

  return {
    // STATE
    accrueBeforeContribution,
    budgetDetailsPanelActive,
    budgetFormActive,
    budgets,
    currentBudgetId,
    currentInstrumentId,
    deflateAllMoney,
    inflationFactor,
    instrumentDetailsPanelActive,
    instrumentFormActive,
    instruments,
    minimumBudget,
    optionsFormActive,
    yearsToContribute,
    yearsToSpend,

    // GETTERS
    amortizationTableHeaders,
    balancesGraphs,
    budgetCardGraphConfig,
    budgetFormTitle,
    cardGraphs,
    contributionScenarios,
    contributionSchedules,
    graphs,
    graphXScale,
    inflationRate,
    instrumentCardGraphConfig,
    instrumentFormTitle,
    instrumentsWithTotals,
    monthlyBudgets,
    periodLabel,
    purchasingPowerGraphs,
    totalAnnualLimit,
    totalCurrentBalance,
    totalMaxPeriodsPerYear,
    totalsAsAnInstrument,

    // ACTIONS
    amortizationTableRows,
    amortizationTableTotals,
    avalanche,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildInstrumentSubtitle,
    clearState,
    createBudget,
    createInstrument,
    deflate,
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
    getInstrument,
    getInstrumentIndex,
    getInstrumentName,
    getMaxMoney,
    getNumContributions,
    loadState,
    openBudgetForm,
    openInstrumentForm,
    openOptionsForm,
    saveState,
    setInflationFactor,
    setYearsToContribute,
    setYearsToSpend,
    sortInstruments,
    toggleAccrueBeforeContribution,
    toggleDeflateAllMoney,
    unviewBudget,
    unviewInstrument,
    viewBudget,
    viewInstrument,
  };
});

export type AppreciateCoreStore = ReturnType<typeof useAppreciateCoreStore>;
