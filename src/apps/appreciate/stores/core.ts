import * as d3 from 'd3';
import { contributions, contributionTypes, instrument, sorting, withdrawals, withdrawalTypes } from 'moneyfunx';
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
  desiredNetIncome: Ref<number>;
  retirementTaxRate: Ref<number>;
  inflationFactor: Ref<number>;
  instrumentDetailsPanelActive: Ref<boolean>;
  instrumentFormActive: Ref<boolean>;
  instruments: Ref<instrument.Instrument[]>;
  minimumBudget: Budget;
  optionsFormActive: Ref<boolean>;
  selectedCareerBudgetId: Ref<string | null>;
  viewPhase: Ref<string>;
  withdrawalBudgets: Ref<Budget[]>;
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
  cardGraphs: ComputedRef<Record<string, Record<string, DonutGraphContent>>>;
  contributionScenarios: ComputedRef<Record<string, ContributionScenario>>;
  contributionSchedules: ComputedRef<
    Record<string, Record<string, contributionTypes.ContributionSchedule>>
  >;
  graphs: ComputedRef<Record<string, GraphConfig>>;
  graphXScale: ComputedRef<() => d3.ScaleTime<number, number, any> | d3.ScaleLinear<number, number, any>>;
  inflationRate: ComputedRef<number>;
  instrumentCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>>;
  instrumentFormTitle: ComputedRef<string>;
  instrumentsWithTotals: ComputedRef<instrument.IInstrument[]>;
  retirementTaxRateEffective: ComputedRef<number>;
  monthlyBudgets: ComputedRef<MonthlyBudget[]>;
  monthlyWithdrawalBudgets: ComputedRef<MonthlyBudget[]>;
  periodLabel: ComputedRef<string>;
  purchasingPowerGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  totalAnnualLimit: ComputedRef<number>;
  totalCurrentBalance: ComputedRef<number>;
  totalMaxPeriodsPerYear: ComputedRef<number>;
  totalsAsAnInstrument: ComputedRef<instrument.IInstrument>;
  careerRetirementComparison: ComputedRef<
    Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule>
  >;
  withdrawalScenarios: ComputedRef<
    Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule>
  >;
  withdrawalSchedules: ComputedRef<
    Record<string, Record<string, withdrawalTypes.WithdrawalSchedule>>
  >;
}

export interface AppreciateCoreActions {
  amortizationTableRows: (
    schedule: contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule
  ) => Record<string, string>[];
  amortizationTableTotals: (
    schedule: contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule
  ) => Record<string, string>;
  avalanche: () => instrument.Instrument[];
  buildAmortizationTableSubtitle: (
    instrument: instrument.IInstrument,
    budget: Budget
  ) => string;
  buildAmortizationTableTitle: (
    instrument: instrument.IInstrument,
    budget: Budget
  ) => string;
  buildInstrumentSubtitle: (instrument: instrument.IInstrument) => string;
  clearState: () => void;
  createBudget: (proposedBudget: number) => string;
  createWithdrawalBudget: (proposedBudget: number) => string;
  createInstrument: (
    currentBalance: number,
    interestRate: number,
    name: string,
    annualLimit: number
  ) => string;
  deflate: (amount: number, periods: number) => number;
  deleteBudget: (id: string) => void;
  deleteWithdrawalBudget: (id: string) => void;
  deleteInstrument: (id: string) => void;
  editBudget: (id: string) => void;
  editWithdrawalBudget: (id: string) => void;
  editInstrument: (id: string) => void;
  exitBudgetForm: () => void;
  exitInstrumentForm: () => void;
  exitOptionsForm: () => void;
  exportState: () => Record<string, any>;
  getBudget: (id: string) => MonthlyBudget | undefined;
  getWithdrawalBudget: (id: string) => MonthlyBudget | undefined;
  getBudgetColor: (id: string) => string;
  getBudgetIndex: (id: string) => number;
  getBudgetName: (id: string) => string;
  getWithdrawalBudgetName: (id: string) => string;
  getContributionSchedule: (
    instrumentId: string,
    budgetId: string
  ) => contributionTypes.ContributionSchedule;
  getWithdrawalSchedule: (
    instrumentId: string,
    budgetId: string
  ) => withdrawalTypes.WithdrawalSchedule;
  getInstrument: (id: string) => instrument.IInstrument | undefined;
  getInstrumentIndex: (id: string) => number;
  getInstrumentName: (id: string) => string;
  getMaxMoney: (instrumentId: string) => number;
  getNumContributions: (instrumentId: string, budgetId: string) => number;
  getNumWithdrawals: (instrumentId: string, budgetId: string) => number;
  loadState: () => void;
  openBudgetForm: () => void;
  openInstrumentForm: () => void;
  openOptionsForm: () => void;
  saveState: () => void;
  setSelectedCareerBudgetId: (id: string) => void;
  setDesiredNetIncome: (newIncome: number) => void;
  setRetirementTaxRate: (newRate: number) => void;
  setInflationFactor: (newFactor: number) => void;
  setYearsToContribute: (newYears: number) => void;
  setYearsToSpend: (newYears: number) => void;
  sortInstruments: () => void;
  toggleAccrueBeforeContribution: () => void;
  toggleDeflateAllMoney: (newFactor: number) => void;
  togglePhase: () => void;
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
  const desiredNetIncome: Ref<number> = ref(constants.DEFAULT_DESIRED_NET_INCOME);
  const retirementTaxRate: Ref<number> = ref(constants.DEFAULT_RETIREMENT_TAX_RATE);
  const inflationFactor: Ref<number> = ref(constants.DEFAULT_INFLATION_FACTOR);
  const instrumentDetailsPanelActive: Ref<boolean> = ref(false);
  const instrumentFormActive: Ref<boolean> = ref(false);
  const instruments: Ref<instrument.Instrument[]> = ref([]);
  const minimumBudget: Budget = { id: constants.DEFAULT, relative: 0 };
  const optionsFormActive: Ref<boolean> = ref(false);
  const selectedCareerBudgetId: Ref<string | null> = ref(constants.DEFAULT);
  const viewPhase: Ref<string> = ref(constants.PHASE_CAREER);
  const withdrawalBudgets: Ref<Budget[]> = ref([]);
  const yearsToContribute: Ref<number> = ref(
    constants.DEFAULT_YEARS_TO_CONTRIBUTE
  );
  const yearsToSpend: Ref<number> = ref(constants.DEFAULT_YEARS_TO_SPEND);

  /** GETTERS */

  // total values across all instruments
  const inflationRate: ComputedRef<number> = computed(
    () => inflationFactor.value / 100
  );

  const retirementTaxRateEffective: ComputedRef<number> = computed(
    () => retirementTaxRate.value / 100
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
  const totalsAsAnInstrument: ComputedRef<instrument.IInstrument> = computed(
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

  const instrumentsWithTotals: ComputedRef<instrument.IInstrument[]> = computed(
    () => [totalsAsAnInstrument.value, ...instruments.value]
  );

  const careerOffsetPeriods: ComputedRef<number> = computed(
    () => yearsToContribute.value * constants.PERIODS_PER_YEAR
  );

  // Budgets
  const monthlyBudgets: ComputedRef<MonthlyBudget[]> = computed(() =>
    [...budgets.value, minimumBudget].map((budget) => ({
      ...budget,
      absolute: budget.relative,
    }))
  );

  const monthlyWithdrawalBudgets: ComputedRef<MonthlyBudget[]> = computed(() =>
    [...withdrawalBudgets.value, { id: constants.DEFAULT, relative: desiredNetIncome.value }].map((budget) => ({
      ...budget,
      absolute: budget.relative,
    }))
  );

  const careerRetirementComparison: ComputedRef<
    Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule>
  > = computed(() => {
    const comparison: Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule> = {};
    monthlyBudgets.value.forEach((careerBudget: MonthlyBudget) => {
      const retirementInstruments = instruments.value.map((inst) => {
        const instContributionSchedule = contributionScenarios.value[careerBudget.id].contributionSchedule[inst.id];
        const finalBalance = instContributionSchedule.amortizationSchedule.length > 0
          ? instContributionSchedule.amortizationSchedule.slice(-1)[0].currentBalance
          : inst.currentBalance;
        const retirementInstrument = new instrument.Instrument(
          finalBalance,
          inst.annualRate,
          inst.periodsPerYear,
          inst.name,
          inst.annualLimit
        );
        retirementInstrument.id = inst.id;
        return retirementInstrument;
      });

      comparison[careerBudget.id] = withdrawals.drawdownInstruments(
        retirementInstruments,
        desiredNetIncome.value,
        yearsToSpend.value * constants.PERIODS_PER_YEAR,
        retirementTaxRateEffective.value,
        true
      );
    });
    return comparison;
  });

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
          contributionSchedule: contributions.contributeInstruments(
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
    Record<string, Record<string, contributionTypes.ContributionSchedule>>
  > = computed(() => {
    const schedules: Record<
      string,
      Record<string, contributionTypes.ContributionSchedule>
    > = {};

    instrumentsWithTotals.value.forEach((instrument: instrument.IInstrument) => {
      schedules[instrument.id] = <
        Record<string, contributionTypes.ContributionSchedule>
      >{};
    });

    Object.keys(schedules).forEach((instrumentId: string) => {
      Object.keys(contributionScenarios.value).forEach((budgetId: string) => {
        const schedule = contributionScenarios.value[budgetId];
        schedules[instrumentId][budgetId] = <contributionTypes.ContributionSchedule>{
          ...schedule.contributionSchedule[instrumentId],
        };
      });
    });
    return schedules;
  });

  // Withdrawals
  const withdrawalScenarios: ComputedRef<
    Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule>
  > = computed(() => {
    const scenarios: Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule> = {};
    const baseBudgets = viewPhase.value === constants.PHASE_CAREER
      ? monthlyBudgets.value
      : monthlyWithdrawalBudgets.value;

    const baseCareerId = (selectedCareerBudgetId.value && contributionScenarios.value[selectedCareerBudgetId.value])
      ? selectedCareerBudgetId.value
      : constants.DEFAULT;

    baseBudgets.forEach((budget: MonthlyBudget) => {
      const retirementInstruments = instruments.value.map((inst) => {
        const scenario = contributionScenarios.value[baseCareerId];
        const instContributionSchedule = scenario.contributionSchedule[inst.id];
        const finalBalance = instContributionSchedule.amortizationSchedule.length > 0
          ? instContributionSchedule.amortizationSchedule.slice(-1)[0].currentBalance
          : inst.currentBalance;
        const retirementInstrument = new instrument.Instrument(
          finalBalance,
          inst.annualRate,
          inst.periodsPerYear,
          inst.name,
          inst.annualLimit
        );
        retirementInstrument.id = inst.id;
        return retirementInstrument;
      });

      scenarios[budget.id] = withdrawals.drawdownInstruments(
        retirementInstruments,
        budget.relative,
        yearsToSpend.value * constants.PERIODS_PER_YEAR,
        retirementTaxRateEffective.value,
        true // accrueBeforeWithdrawal
      );
    });
    return scenarios;
  });

  const withdrawalSchedules: ComputedRef<
    Record<string, Record<string, withdrawalTypes.WithdrawalSchedule>>
  > = computed(() => {
    const schedules: Record<
      string,
      Record<string, withdrawalTypes.WithdrawalSchedule>
    > = {};

    instrumentsWithTotals.value.forEach((instrument: instrument.IInstrument) => {
      schedules[instrument.id] = <
        Record<string, withdrawalTypes.WithdrawalSchedule>
      >{};
    });

    Object.keys(schedules).forEach((instrumentId: string) => {
      Object.keys(withdrawalScenarios.value).forEach((budgetId: string) => {
        const schedule = withdrawalScenarios.value[budgetId];
        schedules[instrumentId][budgetId] = <withdrawalTypes.WithdrawalSchedule>{
          ...schedule[instrumentId],
        };
      });
    });
    return schedules;
  });

  const investmentTabularAnalysis: ComputedRef<Record<string, Record<string, any>>> = computed(() => {
    const analysis: Record<string, Record<string, any>> = {};
    const metrics = [
      'Principal',
      'Interest',
      'Interest/principal ratio',
      'Share of balance at retirement as principal',
      'Effective avg saved/yr of work',
      'Growth factor from present',
      'Age of > $1M saved',
    ];

    metrics.forEach(metric => {
      analysis[metric] = {};
    });

    monthlyBudgets.value.forEach(budget => {
      const schedule = getContributionSchedule(constants.TOTALS, budget.id);
      const principal = schedule.lifetimeContribution;
      const interest = schedule.lifetimeGrowth;
      const total = principal + interest;

      analysis['Principal'][budget.id] = globalOptions.Money(principal);
      analysis['Interest'][budget.id] = globalOptions.Money(interest);
      analysis['Interest/principal ratio'][budget.id] = principal > 0 ? (interest / principal).toFixed(4) : '0.0000';
      analysis['Share of balance at retirement as principal'][budget.id] = total > 0 ? globalOptions.Percent((principal / total) * 100) : '0.00%';
      analysis['Effective avg saved/yr of work'][budget.id] = globalOptions.Money(principal / yearsToContribute.value);
      analysis['Growth factor from present'][budget.id] = principal > 0 ? (total / principal).toFixed(4) : '0.0000';

      const milestonePeriod = schedule.amortizationSchedule.find(r => r.currentBalance >= 1000000)?.period;
      analysis['Age of > $1M saved'][budget.id] = milestonePeriod ? Math.floor(milestonePeriod / 12) + 26 : '-'; // Assuming age 26 start
    });

    return analysis;
  });

  const retirementTabularAnalysis: ComputedRef<Record<string, Record<string, any>>> = computed(() => {
    const analysis: Record<string, Record<string, any>> = {};
    const metrics = [
      'Initial balance',
      'Growth',
      'Growth/initial ratio',
      'Share of value retirement end as growth',
      'Effective avg saved/yr',
      'Growth factor from retirement start',
      'Age of > $1M saved',
    ];

    metrics.forEach(metric => {
      analysis[metric] = {};
    });

    monthlyWithdrawalBudgets.value.forEach(budget => {
      const schedule = getWithdrawalSchedule(constants.TOTALS, budget.id);
      const initialBalance = getContributionSchedule(constants.TOTALS, selectedCareerBudgetId.value || constants.DEFAULT).amortizationSchedule.slice(-1)[0]?.currentBalance || 0;
      const growth = schedule.lifetimeGrowth;
      const finalBalance = schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0;

      analysis['Initial balance'][budget.id] = globalOptions.Money(initialBalance);
      analysis['Growth'][budget.id] = globalOptions.Money(growth);
      analysis['Growth/initial ratio'][budget.id] = initialBalance > 0 ? (growth / initialBalance).toFixed(4) : '0.0000';
      analysis['Share of value retirement end as growth'][budget.id] = finalBalance > 0 ? globalOptions.Percent((growth / finalBalance) * 100) : '0.00%';
      analysis['Effective avg saved/yr'][budget.id] = globalOptions.Money(growth / yearsToSpend.value);
      analysis['Growth factor from retirement start'][budget.id] = initialBalance > 0 ? (finalBalance / initialBalance).toFixed(4) : '0.0000';

      const milestonePeriod = schedule.amortizationSchedule.find(r => r.currentBalance >= 1000000)?.period;
      analysis['Age of > $1M saved'][budget.id] = milestonePeriod ? Math.floor(milestonePeriod / 12) + 65 : '-'; // Assuming retirement start retirement
    });

    return analysis;
  });

  // ease-of-use getters over computed values
  const periodLabel: ComputedRef<string> = computed(() =>
    globalOptions.periodsAsDates ? 'Contribution Date' : 'Contribution Number'
  );

  // Graphing
  const graphXScale: ComputedRef<() => d3.ScaleTime<number, number, any> | d3.ScaleLinear<number, number, any>> = computed(() =>
    globalOptions.periodsAsDates ? d3.scaleTime : d3.scaleLinear
  );

  // graph data
  const balancesGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(
    () => {
      const graphs = <Graphs<LineGraphContent>>{};
      instrumentsWithTotals.value.forEach((instrument: instrument.IInstrument) => {
        const lines = <ChartSeries<Point>>{};
        let overallMaxX = 0;
        let overallMaxY = 0;

        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: contributionTypes.ContributionRecord) => {
              line.push({ x: record.period, y: record.currentBalance });
            }
          );
          lines[budget.id] = line;

          const lineMaxX = line.length > 0 ? line[line.length - 1].x : 0;
          const lineMaxY = line.reduce((max, p) => Math.max(max, p.y), 0);
          overallMaxX = Math.max(overallMaxX, lineMaxX);
          overallMaxY = Math.max(overallMaxY, lineMaxY);
        });

        graphs[instrument.id] = <LineGraphContent>{
          config: {
            minX: 1,
            minY: 0,
            maxX: overallMaxX,
            maxY: overallMaxY * 1.1,
          },
          lines: lines,
        };
      });

      return <GraphConfig<LineGraphContent>>{
        id: 'Balances',
        type: 'line',
        color: getBudgetColor,
        graphs: graphs,
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
    }
  );

  const budgetCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>> = computed(
    () => ({
      id: 'BudgetCardSummary',
      type: 'donut',
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
    instrumentsWithTotals.value.forEach((instrument: instrument.IInstrument) => {
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
      const graphs = <Graphs<LineGraphContent>>{};
      instrumentsWithTotals.value.forEach((instrument: instrument.IInstrument) => {
        const lines = <ChartSeries<Point>>{};
        let overallMaxX = 0;
        let overallMaxY = 0;

        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: contributionTypes.ContributionRecord) => {
              line.push({
                x: record.period,
                y: deflate(record.currentBalance, record.period),
              });
            }
          );
          lines[budget.id] = line;

          const lineMaxX = line.length > 0 ? line[line.length - 1].x : 0;
          const lineMaxY = line.reduce((max, p) => Math.max(max, p.y), 0);
          overallMaxX = Math.max(overallMaxX, lineMaxX);
          overallMaxY = Math.max(overallMaxY, lineMaxY);
        });

        graphs[instrument.id] = <LineGraphContent>{
          config: {
            minX: 1,
            minY: 0,
            maxX: overallMaxX,
            maxY: overallMaxY * 1.1,
          },
          lines: lines,
        };
      });

      return <GraphConfig<LineGraphContent>>{
        id: 'PurchasingPower',
        type: 'line',
        color: getBudgetColor,
        graphs: graphs,
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
    });

  const withdrawalBalancesGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(
    () => {
      const graphs = <Graphs<LineGraphContent>>{};
      instrumentsWithTotals.value.forEach((instrument: instrument.IInstrument) => {
        const lines = <ChartSeries<Point>>{};
        let overallMaxX = 0;
        let overallMaxY = 0;

        monthlyWithdrawalBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          // Add initial balance point (period 0 in retirement, which is end of career)
          const baseCareerId = selectedCareerBudgetId.value || constants.DEFAULT;
          const careerSchedule = getContributionSchedule(instrument.id, baseCareerId);
          const initialBalance = careerSchedule.amortizationSchedule.length > 0
            ? careerSchedule.amortizationSchedule.slice(-1)[0].currentBalance
            : (getInstrument(instrument.id)?.currentBalance || 0);

          line.push({ x: careerOffsetPeriods.value, y: initialBalance });

          getWithdrawalSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: withdrawalTypes.WithdrawalRecord) => {
              line.push({ x: careerOffsetPeriods.value + record.period, y: record.currentBalance });
            }
          );
          lines[budget.id] = line;

          const lineMaxX = line.length > 0 ? line[line.length - 1].x : 0;
          const lineMaxY = line.reduce((max, p) => Math.max(max, p.y), 0);
          overallMaxX = Math.max(overallMaxX, lineMaxX);
          overallMaxY = Math.max(overallMaxY, lineMaxY);
        });

        graphs[instrument.id] = <LineGraphContent>{
          config: {
            minX: careerOffsetPeriods.value,
            minY: 0,
            maxX: overallMaxX,
            maxY: overallMaxY * 1.1,
          },
          lines: lines,
        };
      });

      return <GraphConfig<LineGraphContent>>{
        id: 'WithdrawalBalances',
        type: 'line',
        color: getBudgetColor,
        graphs: graphs,
        header: (instrumentId: string) =>
          `Drawdown over Time by Withdrawal Budget - ${getInstrumentName(instrumentId)}`,
        lineName: getWithdrawalBudgetName,
        subheader: (instrumentId: string) =>
          `Starting from ${getBudgetName(selectedCareerBudgetId.value || constants.DEFAULT)} outcome`,
        x: globalOptions.Period,
        xFormat: (x: number) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Balance',
        yScale: d3.scaleLinear,
      };
    }
  );

  const graphs: ComputedRef<Record<string, GraphConfig<LineGraphContent>>> = computed(() => {
    if (viewPhase.value === constants.PHASE_RETIREMENT) {
      return {
        [constants.GRAPH_BALANCES_OVER_TIME]: withdrawalBalancesGraphs.value,
      };
    }
    return {
      [constants.GRAPH_BALANCES_OVER_TIME]: balancesGraphs.value,
      [constants.GRAPH_PURCHASING_POWER_OVER_TIME]: purchasingPowerGraphs.value,
    };
  });

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
    desiredNetIncome.value = constants.DEFAULT_DESIRED_NET_INCOME;
    retirementTaxRate.value = constants.DEFAULT_RETIREMENT_TAX_RATE;
    inflationFactor.value = constants.DEFAULT_INFLATION_FACTOR;
    instrumentDetailsPanelActive.value = false;
    instrumentFormActive.value = false;
    instruments.value = [];
    optionsFormActive.value = false;
    selectedCareerBudgetId.value = constants.DEFAULT;
    viewPhase.value = constants.PHASE_CAREER;
    withdrawalBudgets.value = [];
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
    const storedDesiredNetIncome = localStorage.getItem(
      keys.LS_DESIRED_NET_INCOME
    );
    const storedRetirementTaxRate = localStorage.getItem(
      keys.LS_RETIREMENT_TAX_RATE
    );
    const storedInflationFactor = localStorage.getItem(
      keys.LS_INFLATION_FACTOR
    );
    const storedInstruments = localStorage.getItem(keys.LS_INSTRUMENTS);
    const storedSelectedCareerBudgetId = localStorage.getItem(keys.LS_SELECTED_CAREER_BUDGET_ID);
    const storedViewPhase = localStorage.getItem(keys.LS_VIEW_PHASE);
    const storedWithdrawalBudgets = localStorage.getItem(keys.LS_WITHDRAWAL_BUDGETS);
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
    if (storedDesiredNetIncome)
      desiredNetIncome.value = JSON.parse(storedDesiredNetIncome);
    if (storedRetirementTaxRate)
      retirementTaxRate.value = JSON.parse(storedRetirementTaxRate);
    if (storedInflationFactor)
      inflationFactor.value = JSON.parse(storedInflationFactor);
    if (storedInstruments)
      instruments.value = JSON.parse(storedInstruments).map(
        (storedInstrument: instrument.IInstrument) =>
          new instrument.Instrument(
            storedInstrument.currentBalance,
            storedInstrument.annualRate,
            constants.PERIODS_PER_YEAR,
            storedInstrument.name,
            storedInstrument.annualLimit
          )
      );
    if (storedSelectedCareerBudgetId)
      selectedCareerBudgetId.value = JSON.parse(storedSelectedCareerBudgetId);
    if (storedViewPhase)
      viewPhase.value = JSON.parse(storedViewPhase);
    if (storedWithdrawalBudgets)
      withdrawalBudgets.value = JSON.parse(storedWithdrawalBudgets);
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
      keys.LS_DESIRED_NET_INCOME,
      JSON.stringify(desiredNetIncome.value)
    );
    localStorage.setItem(
      keys.LS_RETIREMENT_TAX_RATE,
      JSON.stringify(retirementTaxRate.value)
    );
    localStorage.setItem(
      keys.LS_INFLATION_FACTOR,
      JSON.stringify(inflationFactor.value)
    );
    localStorage.setItem(keys.LS_INSTRUMENTS, JSON.stringify(instruments.value));
    localStorage.setItem(keys.LS_SELECTED_CAREER_BUDGET_ID, JSON.stringify(selectedCareerBudgetId.value));
    localStorage.setItem(keys.LS_VIEW_PHASE, JSON.stringify(viewPhase.value));
    localStorage.setItem(keys.LS_WITHDRAWAL_BUDGETS, JSON.stringify(withdrawalBudgets.value));
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
    [keys.LS_DESIRED_NET_INCOME]: desiredNetIncome.value,
    [keys.LS_RETIREMENT_TAX_RATE]: retirementTaxRate.value,
    [keys.LS_INFLATION_FACTOR]: inflationFactor.value,
    [keys.LS_INSTRUMENTS]: instruments.value,
    [keys.LS_SELECTED_CAREER_BUDGET_ID]: selectedCareerBudgetId.value,
    [keys.LS_VIEW_PHASE]: viewPhase.value,
    [keys.LS_WITHDRAWAL_BUDGETS]: withdrawalBudgets.value,
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

  const setDesiredNetIncome = (newIncome: number): void => {
    if (!Number.isNaN(newIncome) && newIncome >= 0) {
      desiredNetIncome.value = newIncome;
    }
  };

  const setRetirementTaxRate = (newRate: number): void => {
    if (!Number.isNaN(newRate) && newRate >= 0 && newRate < 100) {
      retirementTaxRate.value = newRate;
    }
  };

  const setSelectedCareerBudgetId = (id: string): void => {
    selectedCareerBudgetId.value = id;
  };

  const setYearsToContribute = (newYears: number): void => {
    if (
      !Number.isNaN(
        newYears && newYears > 0 && newYears < constants.MAX_DURATION_YEARS
      )
    ) {
      yearsToContribute.value = newYears;
    }
  };

  const setYearsToSpend = (newYears: number): void => {
    if (
      !Number.isNaN(
        newYears && newYears > 0 && newYears < constants.MAX_DURATION_YEARS
      )
    ) {
      yearsToSpend.value = newYears;
    }
  };

  const setPhase = (phase: string): void => {
    if (viewPhase.value !== phase) {
      unviewBudget();
      unviewInstrument();
      viewPhase.value = phase;
    }
  };

  const togglePhase = (): void => {
    setPhase(
      viewPhase.value === constants.PHASE_CAREER
        ? constants.PHASE_RETIREMENT
        : constants.PHASE_CAREER
    );
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

  const avalanche = (): instrument.Instrument[] =>
    sorting.sortWith(
      sorting.sortWith(instruments.value, sorting.snowball),
      sorting.avalanche
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
  const getInstrument = (id: string): instrument.IInstrument | undefined =>
    instrumentsWithTotals.value.find((instrument) => instrument.id === id);

  const deleteInstrument = (id: string): void => {
    instruments.value = instruments.value.filter(
      (instrument: instrument.Instrument) => instrument.id !== id
    );
  };
  const editInstrument = (id: string): void => {
    currentInstrumentId.value = id;
    openInstrumentForm();
  };
  const getInstrumentIndex = (id: string): number =>
    instrumentsWithTotals.value.findIndex(
      (instrument: instrument.IInstrument) => instrument.id === id
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

  const getWithdrawalBudget = (id: string): MonthlyBudget | undefined =>
    monthlyWithdrawalBudgets.value.find((budget) => budget.id === id);

  const getWithdrawalBudgetName = (id: string): string => {
    if (id === constants.DEFAULT) return 'Target Income';
    const index = withdrawalBudgets.value.findIndex(b => b.id === id) + 1;
    return `Withdrawal ${index}`;
  };

  const deleteWithdrawalBudget = (id: string): void => {
    withdrawalBudgets.value = withdrawalBudgets.value.filter(
      (budget: Budget) => budget.id !== id && budget.id !== constants.DEFAULT
    );
  };

  const editWithdrawalBudget = (id: string): void => {
    // Reuse budget form logic but targeted at withdrawal budgets
    currentBudgetId.value = id;
    openBudgetForm();
  };

  const getNumWithdrawals = (
    instrumentId: string,
    budgetId: string
  ): number =>
    getWithdrawalSchedule(instrumentId, budgetId).amortizationSchedule.length;

  const createWithdrawalBudget = (proposedBudget: number): string => {
    const budget = <Budget>{
      id: String(Math.floor(Math.random() * Date.now())),
      relative: proposedBudget,
    };
    withdrawalBudgets.value.push(budget);
    withdrawalBudgets.value.sort((a: Budget, b: Budget) => b.relative - a.relative);
    return budget.id;
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
    const createdInstrument = new instrument.Instrument(
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
    instruments.value.push(createdInstrument);
    sortInstruments();
    return createdInstrument.id;
  };

  // ease-of-use getters over computed values
  const getContributionSchedule = (
    instrumentId: string,
    budgetId: string
  ): contributionTypes.ContributionSchedule => {
    const instSchedules = contributionSchedules.value[instrumentId];
    return (instSchedules && instSchedules[budgetId]) || <contributionTypes.ContributionSchedule>{
      lifetimeGrowth: 0,
      lifetimeContribution: 0,
      amortizationSchedule: [],
    };
  };

  const getWithdrawalSchedule = (
    instrumentId: string,
    budgetId: string
  ): withdrawalTypes.WithdrawalSchedule => {
    const instSchedules = withdrawalSchedules.value[instrumentId];
    return (instSchedules && instSchedules[budgetId]) || <withdrawalTypes.WithdrawalSchedule>{
      lifetimeGrowth: 0,
      lifetimeWithdrawal: 0,
      amortizationSchedule: [],
    };
  };

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

  const getMaxWithdrawalMoney = (instrumentId: string): number => {
    const baseCareerId = selectedCareerBudgetId.value || constants.DEFAULT;
    const careerSchedule = getContributionSchedule(instrumentId, baseCareerId);
    let max = careerSchedule.amortizationSchedule.length > 0
      ? careerSchedule.amortizationSchedule.slice(-1)[0].currentBalance
      : (getInstrument(instrumentId)?.currentBalance || 0);

    monthlyWithdrawalBudgets.value.forEach((budget) => {
      const scheduleMap = withdrawalSchedules.value[instrumentId];
      if (!scheduleMap || !scheduleMap[budget.id]) return;
      const schedule = scheduleMap[budget.id];
      schedule.amortizationSchedule.forEach((record) => {
        if (record.currentBalance > max) max = record.currentBalance;
      });
    });
    return max;
  };

  const amortizationTableHeaders: ComputedRef<
    Record<string, string | ComputedRef<string>>[]
  > = computed(() => {
    const baseHeaders = [
      { key: constants.TK_PERIOD, label: periodLabel },
      { key: constants.TK_TOTAL_GROWTH, label: 'Growth' },
    ];

    if (viewPhase.value === constants.PHASE_CAREER) {
      return [
        ...baseHeaders,
        { key: constants.TK_CONTRIBUTION, label: 'Contribution' },
        { key: constants.TK_CURRENT_BALANCE, label: 'Current Balance' },
      ];
    } else {
      return [
        ...baseHeaders,
        { key: 'withdrawal', label: 'Gross Withdrawal' },
        { key: 'netAmount', label: 'Net Income' },
        { key: constants.TK_CURRENT_BALANCE, label: 'Current Balance' },
      ];
    }
  });

  const amortizationTableRows = (schedule: contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule) => {
    return schedule.amortizationSchedule.map(
      (record: any) => {
        const row: Record<string, string> = {
          [constants.TK_PERIOD]: globalOptions.Period(record.period, true) as string,
          [constants.TK_TOTAL_GROWTH]: globalOptions.Money(record.growth),
          [constants.TK_CURRENT_BALANCE]: globalOptions.Money(record.currentBalance),
        };

        if ('contribution' in record) {
          row[constants.TK_CONTRIBUTION] = globalOptions.Money(record.contribution);
        }

        if ('withdrawal' in record) {
          row['withdrawal'] = globalOptions.Money(record.withdrawal);
          row['netAmount'] = globalOptions.Money(record.netAmount);
        }

        return row;
      }
    );
  };

  const amortizationTableTotals = (schedule: contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule) => {
    const { lifetimeGrowth } = schedule;
    const totals: Record<string, string> = {
      [constants.TK_PERIOD]: 'Totals',
      [constants.TK_TOTAL_GROWTH]: globalOptions.Money(lifetimeGrowth),
    };

    if ('lifetimeContribution' in schedule) {
      totals[constants.TK_CONTRIBUTION] = globalOptions.Money(schedule.lifetimeContribution);
      totals[constants.TK_CURRENT_BALANCE] = globalOptions.Money(schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0);
    }

    if ('lifetimeWithdrawal' in schedule) {
      totals['withdrawal'] = globalOptions.Money(schedule.lifetimeWithdrawal);
      const totalNet = schedule.amortizationSchedule.reduce((acc, r: any) => acc + (r.netAmount || 0), 0);
      totals['netAmount'] = globalOptions.Money(totalNet);
      totals[constants.TK_CURRENT_BALANCE] = globalOptions.Money(schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0);
    }

    return totals;
  };

  // title building functions
  const buildAmortizationTableTitle = (
    instrument: instrument.IInstrument,
    monthlyBudget: Budget
  ): string => {
    const budgetName = viewPhase.value === constants.PHASE_CAREER
      ? getBudgetName(monthlyBudget.id)
      : getWithdrawalBudgetName(monthlyBudget.id);

    return `Amortization Table - ${getInstrumentName(
      instrument.id
    )} | ${budgetName}`;
  };

  const buildAmortizationTableSubtitle = (
    instrument: instrument.IInstrument,
    monthlyBudget: Budget
  ): string => {
    const countLabel = viewPhase.value === constants.PHASE_CAREER ? 'Contributions' : 'Withdrawals';
    const count = viewPhase.value === constants.PHASE_CAREER
      ? getNumContributions(instrument.id, monthlyBudget.id)
      : getNumWithdrawals(instrument.id, monthlyBudget.id);

    return `(${globalOptions.Money(
      instrument.currentBalance
    )} | ${globalOptions.Percent(
      instrument.annualRate * 100
    )} | ${globalOptions.Money(
      (monthlyBudget as MonthlyBudget).absolute
    )}/month | ${count} ${countLabel})`;
  };

  const buildInstrumentSubtitle = (
    instrument: instrument.IInstrument
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
    desiredNetIncome,
    retirementTaxRate,
    inflationFactor,
    instrumentDetailsPanelActive,
    instrumentFormActive,
    instruments,
    minimumBudget,
    optionsFormActive,
    selectedCareerBudgetId,
    viewPhase,
    withdrawalBudgets,
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
    retirementTaxRateEffective,
    instrumentCardGraphConfig,
    instrumentFormTitle,
    instrumentsWithTotals,
    monthlyBudgets,
    monthlyWithdrawalBudgets,
    periodLabel,
    purchasingPowerGraphs,
    totalAnnualLimit,
    totalCurrentBalance,
    totalMaxPeriodsPerYear,
    totalsAsAnInstrument,
    careerRetirementComparison,
    investmentTabularAnalysis,
    retirementTabularAnalysis,
    withdrawalScenarios,
    withdrawalSchedules,

    // ACTIONS
    amortizationTableRows,
    amortizationTableTotals,
    avalanche,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildInstrumentSubtitle,
    clearState,
    createBudget,
    createWithdrawalBudget,
    createInstrument,
    deflate,
    deleteBudget,
    deleteWithdrawalBudget,
    deleteInstrument,
    editBudget,
    editWithdrawalBudget,
    editInstrument,
    exitBudgetForm,
    exitInstrumentForm,
    exitOptionsForm,
    exportState,
    getBudget,
    getWithdrawalBudget,
    getBudgetColor,
    getBudgetIndex,
    getBudgetName,
    getWithdrawalBudgetName,
    getContributionSchedule,
    getWithdrawalSchedule,
    getInstrument,
    getInstrumentIndex,
    getInstrumentName,
    getMaxMoney,
    getNumContributions,
    getNumWithdrawals,
    loadState,
    openBudgetForm,
    openInstrumentForm,
    openOptionsForm,
    saveState,
    setSelectedCareerBudgetId,
    setDesiredNetIncome,
    setRetirementTaxRate,
    setInflationFactor,
    setPhase,
    setYearsToContribute,
    setYearsToSpend,
    sortInstruments,
    toggleAccrueBeforeContribution,
    toggleDeflateAllMoney,
    togglePhase,
    unviewBudget,
    unviewInstrument,
    viewBudget,
    viewInstrument,
  };
});

export type AppreciateCoreStore = ReturnType<typeof useAppreciateCoreStore>;
