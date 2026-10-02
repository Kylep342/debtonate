import * as d3 from 'd3';
import { contributions, contributionTypes, instrument, sorting, withdrawals, withdrawalTypes } from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import keys from '@/apps/appreciate/constants/keys';
import { ContributionScenario, UIInstrument } from '@/apps/appreciate/types/core';
import { computeStateHash } from '@/apps/shared/functions/export';
import { generateId } from '@/apps/shared/functions/id';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import {
  Budget,
  MonthlyBudget,
} from '@/apps/shared/types/core';
import {
  Arc,
  ChartSeries,
  DonutGraphContent,
  GraphConfig,
  Graphs,
  LineGraphContent,
  Point,
} from '@/apps/shared/types/graph';

export interface SafeWithdrawalRateResult {
  rate: number;
  formatted: string;
  tier: 'safe' | 'benchmark' | 'warning' | 'danger' | 'na';
  label: string;
  badgeClass: string;
}

export interface CrossoverPointResult {
  period: number | null;
  formatted: string;
  reached: boolean;
}

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
  instruments: Ref<UIInstrument[]>;
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
  cardGraphs: ComputedRef<Record<string, Record<string, Arc[]>>>;
  contributionScenarios: ComputedRef<Record<string, ContributionScenario>>;
  contributionSchedules: ComputedRef<
    Record<string, Record<string, contributionTypes.ContributionSchedule>>
  >;
  contributionsVsGrowthGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  escapeVelocityGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  graphs: ComputedRef<Record<string, GraphConfig>>;
  graphXScale: ComputedRef<() => d3.ScaleTime<number, number, any> | d3.ScaleLinear<number, number, any>>;
  inflationRate: ComputedRef<number>;
  instrumentCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>>;
  instrumentFormTitle: ComputedRef<string>;
  instrumentsWithTotals: ComputedRef<UIInstrument[]>;
  passiveIncomeGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  retirementTaxRateEffective: ComputedRef<number>;
  monthlyBudgets: ComputedRef<MonthlyBudget[]>;
  monthlyWithdrawalBudgets: ComputedRef<MonthlyBudget[]>;
  periodLabel: ComputedRef<string>;
  purchasingPowerGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  totalAnnualLimit: ComputedRef<number>;
  totalCurrentBalance: ComputedRef<number>;
  totalMaxPeriodsPerYear: ComputedRef<number>;
  totalsAsAnInstrument: ComputedRef<UIInstrument>;
  careerRetirementComparison: ComputedRef<
    Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule>
  >;
  withdrawalBalancesGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  withdrawalLongevityEnvelopeGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  withdrawalPurchasingPowerGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  withdrawalScenarios: ComputedRef<
    Record<string, withdrawalTypes.InstrumentsWithdrawalSchedule>
  >;
  withdrawalSchedules: ComputedRef<
    Record<string, Record<string, withdrawalTypes.WithdrawalSchedule>>
  >;
  withdrawalYieldVsDrawdownGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  stateHash: ComputedRef<string>;
}

export interface AppreciateCoreActions {
  amortizationTableRows: (
    schedule: contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule
  ) => Record<string, string>[];
  amortizationTableTotals: (
    schedule: contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule
  ) => Record<string, string>;
  avalanche: () => UIInstrument[];
  buildAmortizationTableSubtitle: (
    instrument: UIInstrument,
    budget: Budget
  ) => string;
  buildAmortizationTableTitle: (
    instrument: UIInstrument,
    budget: Budget
  ) => string;
  buildInstrumentSubtitle: (instrument: UIInstrument) => string;
  clearState: () => void;
  getBudgetComparativeAnalysis: (
    budgetId: string,
    isCareer?: boolean
  ) => Record<string, Record<string, any>>;
  getInstrumentComparativeAnalysis: (
    instrumentId: string,
    isCareer?: boolean
  ) => Record<string, Record<string, any>>;
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
  getSteadyStateMonthlyWithdrawal: (
    instrumentId: string,
    budgetId: string
  ) => number;
  getCrossoverPeriod: (
    instrumentId: string,
    budgetId: string
  ) => number | null;
  getCrossoverPoint: (
    instrumentId: string,
    budgetId: string
  ) => CrossoverPointResult;
  getSafeWithdrawalRate: (
    instrumentId: string,
    budgetId: string
  ) => SafeWithdrawalRateResult;
  getSafeWithdrawalRateForCareerBudget: (
    careerBudgetId: string,
    instrumentId?: string
  ) => SafeWithdrawalRateResult;
  getInstrument: (id: string) => UIInstrument | undefined;
  getInstrumentIndex: (id: string) => number;
  getInstrumentName: (id: string) => string;
  getMaxMoney: (instrumentId: string) => number;
  getMaxWithdrawalMoney: (instrumentId: string) => number;
  getNumContributions: (instrumentId: string, budgetId: string) => number;
  getNumWithdrawals: (instrumentId: string, budgetId: string) => number;
  importState: (data: Record<string, any>) => void;
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

// MAPPING UTILITIES
function toBigIntInstrument(uiInst: UIInstrument): instrument.Instrument {
  const biInst = new instrument.Instrument(
    BigInt(Math.round(uiInst.currentBalance * 100)),
    BigInt(Math.round(uiInst.annualRate * 1_000_000)),
    uiInst.periodsPerYear,
    uiInst.name,
    BigInt(Math.round(uiInst.annualLimit * 100))
  );
  biInst.id = uiInst.id;
  return biInst;
}

function toUIInstrument(biInst: instrument.Instrument): UIInstrument {
  return {
    id: biInst.id,
    name: biInst.name,
    currentBalance: Number(biInst.currentBalance) / 100,
    annualRate: Number(biInst.annualRate) / 1_000_000,
    periodsPerYear: biInst.periodsPerYear,
    periodicRate: biInst.periodicRate,
    annualLimit: Number(biInst.annualLimit) / 100,
  };
}

function toFloatContributionSchedule(biSchedule: any): any {
  const floatSchedule: any = {};
  Object.keys(biSchedule).forEach((key) => {
    const entry = biSchedule[key];
    floatSchedule[key] = {
      lifetimeGrowth: Number(entry.lifetimeGrowth) / 100,
      lifetimeContribution: Number(entry.lifetimeContribution) / 100,
      amortizationSchedule: entry.amortizationSchedule.map((record: any) => ({
        period: record.period,
        contribution: Number(record.contribution) / 100,
        growth: Number(record.growth) / 100,
        currentBalance: Number(record.currentBalance) / 100,
      })),
    };
  });
  return floatSchedule;
}

function toFloatWithdrawalSchedule(biSchedule: any): any {
  const floatSchedule: any = {};
  Object.keys(biSchedule).forEach((key) => {
    const entry = biSchedule[key];
    floatSchedule[key] = {
      lifetimeGrowth: Number(entry.lifetimeGrowth) / 100,
      lifetimeWithdrawal: Number(entry.lifetimeWithdrawal) / 100,
      amortizationSchedule: entry.amortizationSchedule.map((record: any) => ({
        period: record.period,
        withdrawal: Number(record.withdrawal) / 100,
        netAmount: Number(record.netAmount) / 100,
        growth: Number(record.growth) / 100,
        currentBalance: Number(record.currentBalance) / 100,
      })),
    };
  });
  return floatSchedule;
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
  const instruments: Ref<UIInstrument[]> = ref([]);
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
  const totalsAsAnInstrument: ComputedRef<UIInstrument> = computed(
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

  const instrumentsWithTotals: ComputedRef<UIInstrument[]> = computed(
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
          BigInt(Math.round(Number(finalBalance) * 100)),
          BigInt(Math.round(inst.annualRate * 1_000_000)),
          inst.periodsPerYear,
          inst.name,
          BigInt(Math.round(inst.annualLimit * 100))
        );
        retirementInstrument.id = inst.id;
        return retirementInstrument;
      });

      const biSchedule = withdrawals.drawdownInstruments(
        retirementInstruments,
        BigInt(Math.round(desiredNetIncome.value * 100)),
        yearsToSpend.value * constants.PERIODS_PER_YEAR,
        retirementTaxRateEffective.value,
        true
      );
      comparison[careerBudget.id] = toFloatWithdrawalSchedule(biSchedule);
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
        const biInstruments = instruments.value.map(toBigIntInstrument);
        const biSchedule = contributions.contributeInstruments(
          biInstruments,
          BigInt(Math.round(budget.relative * 100)),
          yearsToContribute.value * constants.PERIODS_PER_YEAR,
          accrueBeforeContribution.value
        );
        scenarios[budget.id] = <ContributionScenario>{
          contributionAmount: budget.relative,
          contributionSchedule: toFloatContributionSchedule(biSchedule),
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

    instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
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
          BigInt(Math.round(Number(finalBalance) * 100)),
          BigInt(Math.round(inst.annualRate * 1_000_000)),
          inst.periodsPerYear,
          inst.name,
          BigInt(Math.round(inst.annualLimit * 100))
        );
        retirementInstrument.id = inst.id;
        return retirementInstrument;
      });

      const biSchedule = withdrawals.drawdownInstruments(
        retirementInstruments,
        BigInt(Math.round(budget.relative * 100)),
        yearsToSpend.value * constants.PERIODS_PER_YEAR,
        retirementTaxRateEffective.value,
        true // accrueBeforeWithdrawal
      );
      scenarios[budget.id] = toFloatWithdrawalSchedule(biSchedule);
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

    instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
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
      'Crossover point',
      'Age of > $1M saved',
    ];

    metrics.forEach(metric => {
      analysis[metric] = {};
    });

    monthlyBudgets.value.forEach(budget => {
      const schedule = getContributionSchedule(constants.TOTALS, budget.id);
      const startingPrincipal = totalCurrentBalance.value;
      const contributedPrincipal = Number(schedule.lifetimeContribution);
      const principal = startingPrincipal + contributedPrincipal;
      const interest = Number(schedule.lifetimeGrowth);
      const total = principal + interest;

      analysis['Principal'][budget.id] = globalOptions.Money(principal);
      analysis['Interest'][budget.id] = globalOptions.Money(interest);
      analysis['Interest/principal ratio'][budget.id] = principal > 0 ? (interest / principal).toFixed(4) : '-';
      analysis['Share of balance at retirement as principal'][budget.id] = total > 0 ? globalOptions.Percent((principal / total) * 100) : '0.00%';
      analysis['Effective avg saved/yr of work'][budget.id] = globalOptions.Money(contributedPrincipal / yearsToContribute.value);
      analysis['Growth factor from present'][budget.id] = principal > 0 ? (total / principal).toFixed(4) : '-';
      analysis['Crossover point'][budget.id] = getCrossoverPoint(constants.TOTALS, budget.id).formatted;

      const milestonePeriod = schedule.amortizationSchedule.find(r => Number(r.currentBalance) >= 1000000)?.period;
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
      'Safe withdrawal rate',
      'Age of > $1M saved',
    ];

    metrics.forEach(metric => {
      analysis[metric] = {};
    });

    monthlyWithdrawalBudgets.value.forEach(budget => {
      const schedule = getWithdrawalSchedule(constants.TOTALS, budget.id);
      const initialBalance = Number(getContributionSchedule(constants.TOTALS, selectedCareerBudgetId.value || constants.DEFAULT).amortizationSchedule.slice(-1)[0]?.currentBalance || 0);
      const growth = Number(schedule.lifetimeGrowth);
      const finalBalance = Number(schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0);

      analysis['Initial balance'][budget.id] = globalOptions.Money(initialBalance);
      analysis['Growth'][budget.id] = globalOptions.Money(growth);
      analysis['Growth/initial ratio'][budget.id] = initialBalance > 0 ? (growth / initialBalance).toFixed(4) : '0.0000';
      analysis['Share of value retirement end as growth'][budget.id] = finalBalance > 0 ? globalOptions.Percent((growth / finalBalance) * 100) : '0.00%';
      analysis['Effective avg saved/yr'][budget.id] = globalOptions.Money(growth / yearsToSpend.value);
      analysis['Growth factor from retirement start'][budget.id] = initialBalance > 0 ? (finalBalance / initialBalance).toFixed(4) : '0.0000';
      analysis['Safe withdrawal rate'][budget.id] = getSafeWithdrawalRate(constants.TOTALS, budget.id).formatted;

      const milestonePeriod = schedule.amortizationSchedule.find(r => Number(r.currentBalance) >= 1000000)?.period;
      analysis['Age of > $1M saved'][budget.id] = milestonePeriod ? Math.floor(milestonePeriod / 12) + 65 : '-'; // Assuming retirement start retirement
    });

    return analysis;
  });

  const getInstrumentComparativeAnalysis = (
    instrumentId: string,
    isCareer: boolean = true,
  ): Record<string, Record<string, any>> => {
    const analysis: Record<string, Record<string, any>> = {};
    const isTotals = instrumentId === constants.TOTALS;
    const inst = isTotals ? null : getInstrument(instrumentId);
    if (!isTotals && !inst) return analysis;

    if (isCareer) {
      const metrics = [
        'Starting Balance',
        'Expected Return',
        'Principal Contributed',
        'Interest Growth',
        'Final Balance',
        'Interest/principal ratio',
        'Growth factor from present',
        'Crossover Point',
      ];
      metrics.forEach(m => { analysis[m] = {}; });

      const startBal = isTotals ? totalCurrentBalance.value : (inst?.currentBalance || 0);
      const rateStr = isTotals ? '-' : globalOptions.Percent(Number(inst?.annualRate || 0) * 100);

      monthlyBudgets.value.forEach(budget => {
        const schedule = getContributionSchedule(instrumentId, budget.id);
        const contributed = Number(schedule.lifetimeContribution);
        const totalPrincipal = startBal + contributed;
        const growth = Number(schedule.lifetimeGrowth);
        const finalBal = Number(schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0);

        analysis['Starting Balance'][budget.id] = globalOptions.Money(startBal);
        analysis['Expected Return'][budget.id] = rateStr;
        analysis['Principal Contributed'][budget.id] = globalOptions.Money(contributed);
        analysis['Interest Growth'][budget.id] = globalOptions.Money(growth);
        analysis['Final Balance'][budget.id] = globalOptions.Money(finalBal);
        analysis['Interest/principal ratio'][budget.id] = totalPrincipal > 0 ? (growth / totalPrincipal).toFixed(4) : '-';
        analysis['Growth factor from present'][budget.id] = totalPrincipal > 0 ? (finalBal / totalPrincipal).toFixed(4) : '-';
        analysis['Crossover Point'][budget.id] = getCrossoverPoint(instrumentId, budget.id).formatted;
      });
    } else {
      const metrics = [
        'Initial Balance',
        'Expected Return',
        'Growth in Retirement',
        'Final Balance',
        'Growth/initial ratio',
        'Growth factor from retirement start',
        'Safe Withdrawal Rate',
      ];
      metrics.forEach(m => { analysis[m] = {}; });

      const rateStr = isTotals ? '-' : globalOptions.Percent(Number(inst?.annualRate || 0) * 100);

      monthlyWithdrawalBudgets.value.forEach(budget => {
        const schedule = getWithdrawalSchedule(instrumentId, budget.id);
        const initialBal = Number(getContributionSchedule(instrumentId, selectedCareerBudgetId.value || constants.DEFAULT).amortizationSchedule.slice(-1)[0]?.currentBalance || 0);
        const growth = Number(schedule.lifetimeGrowth);
        const finalBal = Number(schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0);

        analysis['Initial Balance'][budget.id] = globalOptions.Money(initialBal);
        analysis['Expected Return'][budget.id] = rateStr;
        analysis['Growth in Retirement'][budget.id] = globalOptions.Money(growth);
        analysis['Final Balance'][budget.id] = globalOptions.Money(finalBal);
        analysis['Growth/initial ratio'][budget.id] = initialBal > 0 ? (growth / initialBal).toFixed(4) : '0.0000';
        analysis['Growth factor from retirement start'][budget.id] = initialBal > 0 ? (finalBal / initialBal).toFixed(4) : '0.0000';
        analysis['Safe Withdrawal Rate'][budget.id] = getSafeWithdrawalRate(instrumentId, budget.id).formatted;
      });
    }

    return analysis;
  };

  const getBudgetComparativeAnalysis = (
    budgetId: string,
    isCareer: boolean = true,
  ): Record<string, Record<string, any>> => {
    const analysis: Record<string, Record<string, any>> = {};

    if (isCareer) {
      const budget = getBudget(budgetId);
      if (!budget) return analysis;

      const metrics = [
        'Starting Balance',
        'Expected Return',
        'Principal Contributed',
        'Interest Growth',
        'Final Balance',
        'Interest/principal ratio',
        'Growth factor from present',
        'Crossover Point',
      ];
      metrics.forEach(m => { analysis[m] = {}; });

      instrumentsWithTotals.value.forEach(instItem => {
        const schedule = getContributionSchedule(instItem.id, budgetId);
        const isTotals = instItem.id === constants.TOTALS;
        const startBal = isTotals ? totalCurrentBalance.value : instItem.currentBalance;
        const rateStr = isTotals ? '-' : globalOptions.Percent(Number(instItem.annualRate) * 100);
        const contributed = Number(schedule.lifetimeContribution);
        const totalPrincipal = startBal + contributed;
        const growth = Number(schedule.lifetimeGrowth);
        const finalBal = Number(schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0);

        analysis['Starting Balance'][instItem.id] = globalOptions.Money(startBal);
        analysis['Expected Return'][instItem.id] = rateStr;
        analysis['Principal Contributed'][instItem.id] = globalOptions.Money(contributed);
        analysis['Interest Growth'][instItem.id] = globalOptions.Money(growth);
        analysis['Final Balance'][instItem.id] = globalOptions.Money(finalBal);
        analysis['Interest/principal ratio'][instItem.id] = totalPrincipal > 0 ? (growth / totalPrincipal).toFixed(4) : '-';
        analysis['Growth factor from present'][instItem.id] = totalPrincipal > 0 ? (finalBal / totalPrincipal).toFixed(4) : '-';
        analysis['Crossover Point'][instItem.id] = getCrossoverPoint(instItem.id, budgetId).formatted;
      });
    } else {
      const budget = getWithdrawalBudget(budgetId);
      if (!budget) return analysis;

      const metrics = [
        'Initial Balance',
        'Expected Return',
        'Growth in Retirement',
        'Final Balance',
        'Growth/initial ratio',
        'Growth factor from retirement start',
        'Safe Withdrawal Rate',
      ];
      metrics.forEach(m => { analysis[m] = {}; });

      instrumentsWithTotals.value.forEach(instItem => {
        const schedule = getWithdrawalSchedule(instItem.id, budgetId);
        const isTotals = instItem.id === constants.TOTALS;
        const initialBal = Number(getContributionSchedule(instItem.id, selectedCareerBudgetId.value || constants.DEFAULT).amortizationSchedule.slice(-1)[0]?.currentBalance || 0);
        const rateStr = isTotals ? '-' : globalOptions.Percent(Number(instItem.annualRate) * 100);
        const growth = Number(schedule.lifetimeGrowth);
        const finalBal = Number(schedule.amortizationSchedule.slice(-1)[0]?.currentBalance || 0);

        analysis['Initial Balance'][instItem.id] = globalOptions.Money(initialBal);
        analysis['Expected Return'][instItem.id] = rateStr;
        analysis['Growth in Retirement'][instItem.id] = globalOptions.Money(growth);
        analysis['Final Balance'][instItem.id] = globalOptions.Money(finalBal);
        analysis['Growth/initial ratio'][instItem.id] = initialBal > 0 ? (growth / initialBal).toFixed(4) : '0.0000';
        analysis['Growth factor from retirement start'][instItem.id] = initialBal > 0 ? (finalBal / initialBal).toFixed(4) : '0.0000';
        analysis['Safe Withdrawal Rate'][instItem.id] = getSafeWithdrawalRate(instItem.id, budgetId).formatted;
      });
    }

    return analysis;
  };

  // ease-of-use getters over computed values
  const periodLabel: ComputedRef<string> = computed(() => {
    if (viewPhase.value === constants.PHASE_CAREER) {
      return globalOptions.periodsAsDates ? 'Contribution Date' : 'Contribution Number';
    }
    return globalOptions.periodsAsDates ? 'Withdrawal Date' : 'Withdrawal Number';
  });

  // Graphing
  const graphXScale: ComputedRef<() => d3.ScaleTime<number, number, any> | d3.ScaleLinear<number, number, any>> = computed(() =>
    globalOptions.periodsAsDates ? d3.scaleTime : d3.scaleLinear
  );

  // graph data
  const balancesGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(
    () => {
      const graphs = <Graphs<LineGraphContent>>{};
      instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
        const lines = <ChartSeries<Point>>{};
        let overallMaxX = 0;
        let overallMaxY = 0;

        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: contributionTypes.ContributionRecord) => {
              line.push({ x: record.period, y: Number(record.currentBalance) });
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
        lineName: getBudgetAbsoluteRate,
        seriesLabel: () => 'Budget',
        subheader: () =>
          'Project nominal portfolio wealth accumulation across contribution plans over time',
        x: globalOptions.Period,
        xFormat: (x: number | Date) => globalOptions.Period(x, true),
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
      lineName: getBudgetAbsoluteRate,
      subheader: (instrumentId: string) =>
        buildInstrumentSubtitle(getInstrument(instrumentId)!),
      x: globalOptions.Period,
      xFormat: (x: number | Date) => globalOptions.Period(x, true),
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
      header: (budgetId: string) => {
        const budgetRate = viewPhase.value === constants.PHASE_CAREER
          ? getBudgetAbsoluteRate(budgetId)
          : getWithdrawalBudgetAbsoluteRate(budgetId);
        return `Yield Breakdown - ${budgetRate}`;
      },
      lineName: (budgetId: string) => viewPhase.value === constants.PHASE_CAREER
        ? getBudgetAbsoluteRate(budgetId)
        : getWithdrawalBudgetAbsoluteRate(budgetId),
      subheader: (instrumentId: string) =>
        buildInstrumentSubtitle(getInstrument(instrumentId)!),
      x: globalOptions.Period,
      xFormat: (x: number | Date) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Amount',
      yScale: d3.scaleLinear,
    }));

  const cardGraphs: ComputedRef<Record<string, Record<string, Arc[]>>> = computed(() => {
    const config = <Record<string, Record<string, Arc[]>>>{};
    instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
      config[instrument.id] = <Record<string, Arc[]>>{};
      monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
        const totalsContributionSummary = getContributionSchedule(
          instrument.id,
          budget.id
        );
        config[instrument.id][budget.id] = <Arc[]>[
          <Arc>{
            label: 'Lifetime Growth',
            value: Number(totalsContributionSummary.lifetimeGrowth),
            color: globalOptions.colorPalette[0],
          },
          <Arc>{
            label: 'Lifetime Contribution',
            value: Number(totalsContributionSummary.lifetimeContribution),
            color: globalOptions.colorPalette[2],
          },
        ];
      });
    });
    return config;
  });

  const purchasingPowerGraphs: ComputedRef<GraphConfig<LineGraphContent>> =
    computed(() => {
      const graphs = <Graphs<LineGraphContent>>{};
      instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
        const lines = <ChartSeries<Point>>{};
        let overallMaxX = 0;
        let overallMaxY = 0;

        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getContributionSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: contributionTypes.ContributionRecord) => {
              line.push({
                x: record.period,
                y: deflate(Number(record.currentBalance), record.period),
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
        lineName: getBudgetAbsoluteRate,
        seriesLabel: () => 'Budget',
        subheader: () =>
          'Forecast true future purchasing power by adjusting projected portfolio growth for inflation',
        x: globalOptions.Period,
        xFormat: (x: number | Date) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Purchasing Power',
        yScale: d3.scaleLinear,
      };
    });

  const withdrawalBalancesGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(
    () => {
      const graphs = <Graphs<LineGraphContent>>{};
      instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
        const lines = <ChartSeries<Point>>{};
        let overallMaxX = 0;
        let overallMaxY = 0;

        monthlyWithdrawalBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          const baseCareerId = selectedCareerBudgetId.value || constants.DEFAULT;
          const careerSchedule = getContributionSchedule(instrument.id, baseCareerId);
          const initialBalance = careerSchedule.amortizationSchedule.length > 0
            ? careerSchedule.amortizationSchedule.slice(-1)[0].currentBalance
            : (getInstrument(instrument.id)?.currentBalance || 0);

          line.push({ x: careerOffsetPeriods.value, y: Number(initialBalance) });

          getWithdrawalSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: withdrawalTypes.WithdrawalRecord) => {
              line.push({ x: careerOffsetPeriods.value + record.period, y: Number(record.currentBalance) });
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
        lineName: getWithdrawalBudgetAbsoluteRate,
        seriesLabel: () => 'Budget',
        subheader: () =>
          'Monitor retirement depletion horizons and capital longevity across spending strategies',
        x: globalOptions.Period,
        xFormat: (x: number | Date) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Balance',
        yScale: d3.scaleLinear,
      };
    }
  );

  const withdrawalPurchasingPowerGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(
    () => {
      const graphs = <Graphs<LineGraphContent>>{};
      instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
        const lines = <ChartSeries<Point>>{};
        let overallMaxX = 0;
        let overallMaxY = 0;

        monthlyWithdrawalBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          const baseCareerId = selectedCareerBudgetId.value || constants.DEFAULT;
          const careerSchedule = getContributionSchedule(instrument.id, baseCareerId);
          const initialBalance = careerSchedule.amortizationSchedule.length > 0
            ? careerSchedule.amortizationSchedule.slice(-1)[0].currentBalance
            : (getInstrument(instrument.id)?.currentBalance || 0);

          line.push({
            x: careerOffsetPeriods.value,
            y: deflate(Number(initialBalance), careerOffsetPeriods.value),
          });

          getWithdrawalSchedule(instrument.id, budget.id).amortizationSchedule.forEach(
            (record: withdrawalTypes.WithdrawalRecord) => {
              line.push({
                x: careerOffsetPeriods.value + record.period,
                y: deflate(Number(record.currentBalance), careerOffsetPeriods.value + record.period),
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
            minX: careerOffsetPeriods.value,
            minY: 0,
            maxX: overallMaxX,
            maxY: overallMaxY * 1.1,
          },
          lines: lines,
        };
      });

      return <GraphConfig<LineGraphContent>>{
        id: 'WithdrawalPurchasingPower',
        type: 'line',
        color: getBudgetColor,
        graphs: graphs,
        header: (instrumentId: string) =>
          `Purchasing Power Drawdown over Time by Withdrawal Budget - ${getInstrumentName(instrumentId)}`,
        lineName: getWithdrawalBudgetAbsoluteRate,
        seriesLabel: () => 'Budget',
        subheader: () =>
          'Evaluate the real inflation-adjusted purchasing power of your remaining retirement reserves',
        x: globalOptions.Period,
        xFormat: (x: number) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Purchasing Power',
        yScale: d3.scaleLinear,
      };
    }
  );

  const contributionsVsGrowthGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(() => {
    const graphs = <Graphs<LineGraphContent>>{};

    instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
      const lines = <ChartSeries<Point>>{};
      let overallMaxX = 0;
      let overallMaxY = 0;

      monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
        const schedule = getContributionSchedule(instrument.id, budget.id);
        const growthLine: Point[] = [];
        const contribLine: Point[] = [];

        let cumGrowth = 0;
        let cumContrib = Number(instrument.currentBalance || 0);

        schedule.amortizationSchedule.forEach((record: contributionTypes.ContributionRecord) => {
          cumGrowth += Number(record.growth);
          cumContrib += Number(record.contribution);

          growthLine.push({ x: record.period, y: cumGrowth });
          contribLine.push({ x: record.period, y: cumContrib });
        });

        lines[`${budget.id}_growth`] = growthLine;
        lines[`${budget.id}_contrib`] = contribLine;

        const lineMaxX = growthLine.length > 0 ? growthLine[growthLine.length - 1].x : 0;
        const lineMaxY = Math.max(
          growthLine.reduce((max, p) => Math.max(max, p.y), 0),
          contribLine.reduce((max, p) => Math.max(max, p.y), 0)
        );
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
        lines,
      };
    });

    return <GraphConfig<LineGraphContent>>{
      id: 'ContributionsVsGrowth',
      type: 'line',
      color: (id: string) => getBudgetColor(id.replace(/_growth|_contrib/, '')),
      strokeDasharray: (id: string) => (id.endsWith('_contrib') ? '4,4' : undefined),
      strokeWidth: (id: string) => (id.endsWith('_growth') ? 2.5 : 2),
      graphs,
      header: (instrumentId: string) =>
        `Cumulative Contributions vs Compound Growth - ${getInstrumentName(instrumentId)}`,
      lineName: (id: string) => {
        const baseId = id.replace(/_growth|_contrib/, '');
        const name = getBudgetAbsoluteRate(baseId);
        return id.endsWith('_growth') ? `${name} (Growth)` : `${name} (Principal)`;
      },
      seriesLabel: () => 'Budget / Component',
      subheader: () =>
        'Measure wealth engine efficiency by tracking physical deposits against exponential compound returns',
      x: globalOptions.Period,
      xFormat: (x: number | Date) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Cumulative Amount',
      yScale: d3.scaleLinear,
    };
  });

  const escapeVelocityGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(() => {
    const graphs = <Graphs<LineGraphContent>>{};

    instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
      const lines = <ChartSeries<Point>>{};
      let overallMaxX = 0;
      let overallMaxY = 0;

      monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
        const schedule = getContributionSchedule(instrument.id, budget.id);
        const growthLine: Point[] = [];
        const contribLine: Point[] = [];

        schedule.amortizationSchedule.forEach((record: contributionTypes.ContributionRecord) => {
          growthLine.push({ x: record.period, y: Number(record.growth) });
          contribLine.push({ x: record.period, y: Number(record.contribution) });
        });

        lines[`${budget.id}_growth`] = growthLine;
        lines[`${budget.id}_contrib`] = contribLine;

        const lineMaxX = growthLine.length > 0 ? growthLine[growthLine.length - 1].x : 0;
        const lineMaxY = Math.max(
          growthLine.reduce((max, p) => Math.max(max, p.y), 0),
          contribLine.reduce((max, p) => Math.max(max, p.y), 0)
        );
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
        lines,
      };
    });

    return <GraphConfig<LineGraphContent>>{
      id: 'EscapeVelocity',
      type: 'line',
      color: (id: string) => getBudgetColor(id.replace(/_growth|_contrib/, '')),
      strokeDasharray: (id: string) => (id.endsWith('_contrib') ? '5,4' : undefined),
      strokeWidth: (id: string) => (id.endsWith('_growth') ? 2.5 : 2),
      graphs,
      header: (instrumentId: string) =>
        `Escape Velocity (Periodic Return vs Contribution) - ${getInstrumentName(instrumentId)}`,
      lineName: (id: string) => {
        const baseId = id.replace(/_growth|_contrib/, '');
        const name = getBudgetAbsoluteRate(baseId);
        return id.endsWith('_growth') ? `${name} (Monthly Return)` : `${name} (Monthly Deposit)`;
      },
      seriesLabel: () => 'Budget / Stream',
      subheader: () =>
        'Pinpoint the crossover milestone where monthly compound returns overtake monthly savings deposits',
      x: globalOptions.Period,
      xFormat: (x: number | Date) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Monthly Amount',
      yScale: d3.scaleLinear,
    };
  });

  const passiveIncomeGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(() => {
    const graphs = <Graphs<LineGraphContent>>{};

    instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
      const lines = <ChartSeries<Point>>{};
      let overallMaxX = 0;
      let overallMaxY = desiredNetIncome.value;

      monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
        const line: Point[] = [];
        const schedule = getContributionSchedule(instrument.id, budget.id);
        const taxRate = Number(retirementTaxRateEffective.value || 0);

        schedule.amortizationSchedule.forEach((record: contributionTypes.ContributionRecord) => {
          const balance = Number(record.currentBalance);
          const annualGross = balance * 0.04;
          const monthlyGross = annualGross / 12;
          const monthlyNet = monthlyGross * (1 - taxRate);
          line.push({ x: record.period, y: monthlyNet });
        });

        lines[budget.id] = line;
        const lineMaxX = line.length > 0 ? line[line.length - 1].x : 0;
        const lineMaxY = line.reduce((max, p) => Math.max(max, p.y), 0);
        overallMaxX = Math.max(overallMaxX, lineMaxX);
        overallMaxY = Math.max(overallMaxY, lineMaxY);
      });

      // Target benchmark line across all periods
      const targetLine: Point[] = [];
      for (let p = 1; p <= overallMaxX; p++) {
        targetLine.push({ x: p, y: desiredNetIncome.value });
      }
      lines['target'] = targetLine;

      graphs[instrument.id] = <LineGraphContent>{
        config: {
          minX: 1,
          minY: 0,
          maxX: overallMaxX,
          maxY: overallMaxY * 1.1,
        },
        lines,
      };
    });

    return <GraphConfig<LineGraphContent>>{
      id: 'PassiveIncome',
      type: 'line',
      color: (id: string) => (id === 'target' ? '#eab308' : getBudgetColor(id)),
      strokeDasharray: (id: string) => (id === 'target' ? '6,4' : undefined),
      strokeWidth: (id: string) => (id === 'target' ? 2.5 : 2),
      graphs,
      header: (instrumentId: string) =>
        `Passive Monthly Income over Time - ${getInstrumentName(instrumentId)}`,
      lineName: (id: string) =>
        id === 'target'
          ? `Target Income (${globalOptions.Money(desiredNetIncome.value)}/mo)`
          : getBudgetAbsoluteRate(id),
      seriesLabel: () => 'Budget / Goal',
      subheader: () =>
        'Track Financial Independence by measuring sustainable monthly passive income (4% SWR) against your target goal',
      x: globalOptions.Period,
      xFormat: (x: number | Date) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Net Monthly Income',
      yScale: d3.scaleLinear,
    };
  });

  const withdrawalLongevityEnvelopeGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(() => {
    const graphs = <Graphs<LineGraphContent>>{};
    const baseCareerId = selectedCareerBudgetId.value || constants.DEFAULT;
    const baseBudget = monthlyWithdrawalBudgets.value[0] || { relative: 0, id: constants.DEFAULT };

    const simulateDrawdown = (rateDelta: number): Record<string, withdrawalTypes.WithdrawalSchedule> => {
      const retirementInstruments = instruments.value.map((inst) => {
        const scenario = contributionScenarios.value[baseCareerId];
        const instContribSched = scenario?.contributionSchedule[inst.id];
        const finalBalance = instContribSched && instContribSched.amortizationSchedule.length > 0
          ? instContribSched.amortizationSchedule.slice(-1)[0].currentBalance
          : inst.currentBalance;
        const adjustedRate = Math.max(0, inst.annualRate + rateDelta);
        const retInst = new instrument.Instrument(
          BigInt(Math.round(Number(finalBalance) * 100)),
          BigInt(Math.round(adjustedRate * 1_000_000)),
          inst.periodsPerYear,
          inst.name,
          BigInt(Math.round(inst.annualLimit * 100))
        );
        retInst.id = inst.id;
        return retInst;
      });

      const biSchedule = withdrawals.drawdownInstruments(
        retirementInstruments,
        BigInt(Math.round(baseBudget.relative * 100)),
        yearsToSpend.value * constants.PERIODS_PER_YEAR,
        retirementTaxRateEffective.value,
        true
      );
      return toFloatWithdrawalSchedule(biSchedule);
    };

    const bullSchedules = simulateDrawdown(0.02);
    const bearSchedules = simulateDrawdown(-0.02);

    instrumentsWithTotals.value.forEach((inst: UIInstrument) => {
      const lines = <ChartSeries<Point>>{};
      let overallMaxX = 0;
      let overallMaxY = 0;

      const careerSchedule = getContributionSchedule(inst.id, baseCareerId);
      const initialBalance = careerSchedule.amortizationSchedule.length > 0
        ? careerSchedule.amortizationSchedule.slice(-1)[0].currentBalance
        : (getInstrument(inst.id)?.currentBalance || 0);

      const scenarios: Array<{ id: string; schedule: withdrawalTypes.WithdrawalSchedule }> = [
        { id: 'bull', schedule: bullSchedules[inst.id] },
        { id: 'base', schedule: getWithdrawalSchedule(inst.id, baseBudget.id) },
        { id: 'bear', schedule: bearSchedules[inst.id] },
      ];

      scenarios.forEach(({ id, schedule }) => {
        const line: Point[] = [
          { x: careerOffsetPeriods.value, y: Number(initialBalance) }
        ];
        schedule?.amortizationSchedule?.forEach((record: withdrawalTypes.WithdrawalRecord) => {
          line.push({
            x: careerOffsetPeriods.value + record.period,
            y: Number(record.currentBalance),
          });
        });
        lines[id] = line;

        const lineMaxX = line.length > 0 ? line[line.length - 1].x : 0;
        const lineMaxY = line.reduce((max, p) => Math.max(max, p.y), 0);
        overallMaxX = Math.max(overallMaxX, lineMaxX);
        overallMaxY = Math.max(overallMaxY, lineMaxY);
      });

      graphs[inst.id] = <LineGraphContent>{
        config: {
          minX: careerOffsetPeriods.value,
          minY: 0,
          maxX: overallMaxX,
          maxY: overallMaxY * 1.1,
        },
        lines,
      };
    });

    return <GraphConfig<LineGraphContent>>{
      id: 'LongevityEnvelope',
      type: 'line',
      color: (id: string) => {
        if (id === 'bull') return '#10b981';
        if (id === 'base') return '#3b82f6';
        if (id === 'bear') return '#ef4444';
        return '#888888';
      },
      strokeDasharray: (id: string) => {
        if (id === 'bull') return '5,3';
        if (id === 'bear') return '3,3';
        return undefined;
      },
      strokeWidth: (id: string) => (id === 'base' ? 2.5 : 2),
      graphs,
      header: (instrumentId: string) =>
        `Longevity Envelope (Market Sensitivity) - ${getInstrumentName(instrumentId)}`,
      lineName: (id: string) => {
        if (id === 'bull') return 'Bull Market (+2% Return)';
        if (id === 'base') return 'Base Market (Expected Return)';
        if (id === 'bear') return 'Bear Market (-2% Return)';
        return id;
      },
      seriesLabel: () => 'Market Scenario',
      subheader: () =>
        'Stress-test portfolio survival across Bull (+2%), Base (Expected), and Bear (-2%) market returns',
      x: globalOptions.Period,
      xFormat: (x: number | Date) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Balance',
      yScale: d3.scaleLinear,
    };
  });

  const withdrawalYieldVsDrawdownGraphs: ComputedRef<GraphConfig<LineGraphContent>> = computed(() => {
    const graphs = <Graphs<LineGraphContent>>{};

    instrumentsWithTotals.value.forEach((instrument: UIInstrument) => {
      const lines = <ChartSeries<Point>>{};
      let overallMaxX = 0;
      let overallMaxY = 0;

      monthlyWithdrawalBudgets.value.forEach((budget: MonthlyBudget) => {
        const yieldLine: Point[] = [];
        const drawdownLine: Point[] = [];
        const sched = getWithdrawalSchedule(instrument.id, budget.id);

        sched.amortizationSchedule.forEach((record: withdrawalTypes.WithdrawalRecord) => {
          const y = Number(record.growth);
          const w = Number(record.withdrawal);
          yieldLine.push({ x: careerOffsetPeriods.value + record.period, y });
          drawdownLine.push({ x: careerOffsetPeriods.value + record.period, y: w });
        });

        lines[`${budget.id}_yield`] = yieldLine;
        lines[`${budget.id}_drawdown`] = drawdownLine;

        const lineMaxX = yieldLine.length > 0 ? yieldLine[yieldLine.length - 1].x : 0;
        const lineMaxY = Math.max(
          yieldLine.reduce((max, p) => Math.max(max, p.y), 0),
          drawdownLine.reduce((max, p) => Math.max(max, p.y), 0)
        );
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
        lines,
      };
    });

    return <GraphConfig<LineGraphContent>>{
      id: 'YieldVsDrawdown',
      type: 'line',
      color: (id: string) => {
        const baseId = id.replace(/_yield|_drawdown/, '');
        if (id.endsWith('_yield')) return '#10b981';
        if (id.endsWith('_drawdown')) return '#f43f5e';
        return getBudgetColor(baseId);
      },
      strokeDasharray: (id: string) => (id.endsWith('_drawdown') ? '4,4' : undefined),
      strokeWidth: () => 2,
      graphs,
      header: (instrumentId: string) =>
        `Periodic Yield vs Drawdown - ${getInstrumentName(instrumentId)}`,
      lineName: (id: string) => {
        const baseId = id.replace(/_yield|_drawdown/, '');
        const name = getWithdrawalBudgetAbsoluteRate(baseId);
        return id.endsWith('_yield') ? `${name} (Yield)` : `${name} (Withdrawal)`;
      },
      seriesLabel: () => 'Cash Flow Stream',
      subheader: () =>
        'Determine retirement sustainability by comparing monthly investment yield against cash withdrawn',
      x: globalOptions.Period,
      xFormat: (x: number | Date) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yFormat: globalOptions.Money,
      yLabel: () => 'Periodic Amount',
      yScale: d3.scaleLinear,
    };
  });

  const graphs: ComputedRef<Record<string, GraphConfig<LineGraphContent>>> = computed(
    (): Record<string, GraphConfig<LineGraphContent>> => {
    if (viewPhase.value === constants.PHASE_RETIREMENT) {
      return {
        [constants.GRAPH_BALANCES_OVER_TIME]: withdrawalBalancesGraphs.value,
        [constants.GRAPH_PURCHASING_POWER_OVER_TIME]: withdrawalPurchasingPowerGraphs.value,
        [constants.GRAPH_LONGEVITY_ENVELOPE_OVER_TIME]: withdrawalLongevityEnvelopeGraphs.value,
        [constants.GRAPH_YIELD_VS_DRAWDOWN_OVER_TIME]: withdrawalYieldVsDrawdownGraphs.value,
      };
    }
    return {
      [constants.GRAPH_BALANCES_OVER_TIME]: balancesGraphs.value,
      [constants.GRAPH_PURCHASING_POWER_OVER_TIME]: purchasingPowerGraphs.value,
      [constants.GRAPH_CONTRIBUTIONS_VS_GROWTH_OVER_TIME]: contributionsVsGrowthGraphs.value,
      [constants.GRAPH_ESCAPE_VELOCITY_OVER_TIME]: escapeVelocityGraphs.value,
      [constants.GRAPH_PASSIVE_INCOME_OVER_TIME]: passiveIncomeGraphs.value,
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

  const importState = (data: Record<string, any>): void => {
    globalOptions.importState(data);

    if (data[keys.LS_ACCRUE_BEFORE_CONTRIBUTION] !== undefined) {
      accrueBeforeContribution.value = data[keys.LS_ACCRUE_BEFORE_CONTRIBUTION];
    }
    const rawBudgets = data[keys.LS_BUDGETS] || data.budgets;
    if (rawBudgets) {
      budgets.value = rawBudgets;
    }
    if (data[keys.LS_DEFLATE_ALL_MONEY] !== undefined || data.deflateAllMoney !== undefined) {
      deflateAllMoney.value = data[keys.LS_DEFLATE_ALL_MONEY] ?? data.deflateAllMoney;
    }
    if (data[keys.LS_DESIRED_NET_INCOME] !== undefined || data.desiredNetIncome !== undefined) {
      desiredNetIncome.value = data[keys.LS_DESIRED_NET_INCOME] ?? data.desiredNetIncome;
    }
    if (data[keys.LS_RETIREMENT_TAX_RATE] !== undefined || data.retirementTaxRate !== undefined) {
      retirementTaxRate.value = data[keys.LS_RETIREMENT_TAX_RATE] ?? data.retirementTaxRate;
    }
    if (data[keys.LS_INFLATION_FACTOR] !== undefined || data.inflationFactor !== undefined) {
      inflationFactor.value = data[keys.LS_INFLATION_FACTOR] ?? data.inflationFactor;
    }
    const rawInstruments = data[keys.LS_INSTRUMENTS] || data.instruments;
    if (rawInstruments) {
      instruments.value = rawInstruments.map(
        (storedInstrument: any) => {
          const biInst = new instrument.Instrument(
            BigInt(Math.round(storedInstrument.currentBalance * 100)),
            BigInt(Math.round(storedInstrument.annualRate * 1_000_000)),
            constants.PERIODS_PER_YEAR,
            storedInstrument.name,
            BigInt(Math.round(storedInstrument.annualLimit * 100))
          );
          const uiInst = toUIInstrument(biInst);
          uiInst.id = storedInstrument.id;
          return uiInst;
        }
      );
    }
    if (data[keys.LS_SELECTED_CAREER_BUDGET_ID] !== undefined || data.selectedCareerBudgetId !== undefined) {
      selectedCareerBudgetId.value = data[keys.LS_SELECTED_CAREER_BUDGET_ID] ?? data.selectedCareerBudgetId;
    }
    if (data[keys.LS_VIEW_PHASE] !== undefined || data.viewPhase !== undefined) {
      viewPhase.value = data[keys.LS_VIEW_PHASE] ?? data.viewPhase;
    }
    const rawWithdrawalBudgets = data[keys.LS_WITHDRAWAL_BUDGETS] || data.withdrawalBudgets;
    if (rawWithdrawalBudgets) {
      withdrawalBudgets.value = rawWithdrawalBudgets;
    }
    if (data[keys.LS_YEARS_TO_CONTRIBUTE] !== undefined || data.yearsToContribute !== undefined) {
      yearsToContribute.value = data[keys.LS_YEARS_TO_CONTRIBUTE] ?? data.yearsToContribute;
    }
    if (data[keys.LS_YEARS_TO_SPEND] !== undefined || data.yearsToSpend !== undefined) {
      yearsToSpend.value = data[keys.LS_YEARS_TO_SPEND] ?? data.yearsToSpend;
    }
  };

  const loadState = (): void => {
    globalOptions.loadState();
    const data: Record<string, any> = {};

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

    if (storedAccrueBeforeContribution) {
      data[keys.LS_ACCRUE_BEFORE_CONTRIBUTION] = JSON.parse(
        storedAccrueBeforeContribution
      );
    }
    if (storedBudgets) data[keys.LS_BUDGETS] = JSON.parse(storedBudgets);
    if (storedDeflateAllMoney) {
      data[keys.LS_DEFLATE_ALL_MONEY] = JSON.parse(storedDeflateAllMoney);
    }
    if (storedDesiredNetIncome) {
      data[keys.LS_DESIRED_NET_INCOME] = JSON.parse(storedDesiredNetIncome);
    }
    if (storedRetirementTaxRate) {
      data[keys.LS_RETIREMENT_TAX_RATE] = JSON.parse(storedRetirementTaxRate);
    }
    if (storedInflationFactor) {
      data[keys.LS_INFLATION_FACTOR] = JSON.parse(storedInflationFactor);
    }
    if (storedInstruments) {
      data[keys.LS_INSTRUMENTS] = JSON.parse(storedInstruments);
    }
    if (storedSelectedCareerBudgetId) {
      data[keys.LS_SELECTED_CAREER_BUDGET_ID] = JSON.parse(storedSelectedCareerBudgetId);
    }
    if (storedViewPhase) {
      data[keys.LS_VIEW_PHASE] = JSON.parse(storedViewPhase);
    }
    if (storedWithdrawalBudgets) {
      data[keys.LS_WITHDRAWAL_BUDGETS] = JSON.parse(storedWithdrawalBudgets);
    }
    if (storedYearsToContribute) {
      data[keys.LS_YEARS_TO_CONTRIBUTE] = JSON.parse(storedYearsToContribute);
    }
    if (storedYearsToSpend) {
      data[keys.LS_YEARS_TO_SPEND] = JSON.parse(storedYearsToSpend);
    }

    importState(data);
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

  const stateHash: ComputedRef<string> = computed(() => computeStateHash(exportState()));

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
      saveState();
    }
  };

  const setRetirementTaxRate = (newRate: number): void => {
    if (!Number.isNaN(newRate) && newRate >= 0 && newRate < 100) {
      retirementTaxRate.value = newRate;
      saveState();
    }
  };

  const setSelectedCareerBudgetId = (id: string): void => {
    selectedCareerBudgetId.value = id;
    saveState();
  };

  const setYearsToContribute = (newYears: number): void => {
    if (
      !Number.isNaN(
        newYears && newYears > 0 && newYears < constants.MAX_DURATION_YEARS
      )
    ) {
      yearsToContribute.value = newYears;
      saveState();
    }
  };

  const setYearsToSpend = (newYears: number): void => {
    if (
      !Number.isNaN(
        newYears && newYears > 0 && newYears < constants.MAX_DURATION_YEARS
      )
    ) {
      yearsToSpend.value = newYears;
      saveState();
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

  const avalanche = (): UIInstrument[] => {
    const biInsts = instruments.value.map(toBigIntInstrument);
    const sortedBi = sorting.sortWith(
      sorting.sortWith(biInsts, sorting.snowball),
      sorting.avalanche
    );
    return sortedBi.map(bi => instruments.value.find(ui => ui.id === bi.id)!);
  };

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
  const getInstrument = (id: string): UIInstrument | undefined =>
    instrumentsWithTotals.value.find((instrument) => instrument.id === id);

  const deleteInstrument = (id: string): void => {
    instruments.value = instruments.value.filter(
      (instrument: UIInstrument) => instrument.id !== id
    );
  };
  const editInstrument = (id: string): void => {
    currentInstrumentId.value = id;
    openInstrumentForm();
  };
  const getInstrumentIndex = (id: string): number =>
    instrumentsWithTotals.value.findIndex(
      (instrument: UIInstrument) => instrument.id === id
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
    globalOptions.colorPalette[getBudgetIndex(id) % globalOptions.colorPalette.length];
  const getBudgetIndex = (id: string): number =>
    monthlyBudgets.value.findIndex((budget) => budget.id === id) + 1;
  const getBudgetName = (id: string): string =>
    id === constants.DEFAULT
      ? constants.NAME_MIN_BUDGET
      : `${constants.BUDGET} ${getBudgetIndex(id)}`;
  const getBudgetAbsoluteRate = (id: string): string => {
    const budget = getBudget(id);
    const suffix = globalOptions.periodsAsDates ? 'month' : 'period';
    return budget ? `${globalOptions.Money(budget.absolute)}/${suffix}` : id;
  };
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

  const getWithdrawalBudgetAbsoluteRate = (id: string): string => {
    const budget = getWithdrawalBudget(id);
    const suffix = globalOptions.periodsAsDates ? 'month' : 'period';
    return budget ? `${globalOptions.Money(budget.absolute)}/${suffix}` : id;
  };

  const deleteWithdrawalBudget = (id: string): void => {
    withdrawalBudgets.value = withdrawalBudgets.value.filter(
      (budget: Budget) => budget.id !== id && budget.id !== constants.DEFAULT
    );
  };

  const editWithdrawalBudget = (id: string): void => {
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
      id: generateId(),
      relative: proposedBudget,
    };
    if (currentBudgetId.value && currentBudgetId.value !== constants.DEFAULT) {
      deleteWithdrawalBudget(currentBudgetId.value);
      currentBudgetId.value = null;
    }
    withdrawalBudgets.value.push(budget);
    withdrawalBudgets.value.sort((a: Budget, b: Budget) => b.relative - a.relative);
    return budget.id;
  };

  // Creation functions

  // Budget
  const createBudget = (proposedBudget: number): string => {
    const budget = <Budget>{
      id: generateId(),
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
    const biInst = new instrument.Instrument(
      BigInt(Math.round(currentBalance * 100)),
      BigInt(Math.round(interestRate * 1_000_000)),
      constants.PERIODS_PER_YEAR,
      name,
      annualLimit ? BigInt(Math.round(annualLimit * 100)) : undefined
    );
    biInst.id = generateId();
    const uiInst = toUIInstrument(biInst);
    if (
      currentInstrumentId.value &&
      currentInstrumentId.value !== constants.TOTALS
    ) {
      deleteInstrument(currentInstrumentId.value);
      currentInstrumentId.value = null;
    }
    instruments.value.push(uiInst);
    sortInstruments();
    return uiInst.id;
  };

  // ease-of-use getters over computed values
  const getContributionSchedule = (
    instrumentId: string,
    budgetId: string
  ): contributionTypes.ContributionSchedule => {
    const instSchedules = contributionSchedules.value[instrumentId];
    return (instSchedules && instSchedules[budgetId]) || ({
      lifetimeGrowth: 0n,
      lifetimeContribution: 0n,
      amortizationSchedule: [],
    } as unknown as contributionTypes.ContributionSchedule);
  };

  const getWithdrawalSchedule = (
    instrumentId: string,
    budgetId: string
  ): withdrawalTypes.WithdrawalSchedule => {
    const instSchedules = withdrawalSchedules.value[instrumentId];
    return (instSchedules && instSchedules[budgetId]) || ({
      lifetimeGrowth: 0n,
      lifetimeWithdrawal: 0n,
      amortizationSchedule: [],
    } as unknown as withdrawalTypes.WithdrawalSchedule);
  };

  const getSteadyStateMonthlyWithdrawal = (
    instrumentId: string,
    budgetId: string
  ): number => {
    const isTotals = instrumentId === constants.TOTALS;
    const targetInstruments = isTotals
      ? instruments.value
      : instruments.value.filter(i => i.id === instrumentId);

    if (targetInstruments.length === 0) return 0;

    const N = yearsToSpend.value * constants.PERIODS_PER_YEAR;
    if (N <= 0) return 0;

    let totalNet = 0;
    targetInstruments.forEach(inst => {
      const sched = getContributionSchedule(inst.id, budgetId);
      const finalBal = sched.amortizationSchedule.length > 0
        ? Number(sched.amortizationSchedule.slice(-1)[0].currentBalance)
        : Number(inst.currentBalance || 0);

      if (!finalBal || finalBal <= 0 || Number.isNaN(finalBal)) return;

      const rate = Number(inst.annualRate || 0);
      const r = rate / constants.PERIODS_PER_YEAR;
      let pGross = 0;
      if (r <= 0 || Number.isNaN(r)) {
        pGross = finalBal / N;
      } else {
        const factor = Math.pow(1 + r, N);
        pGross = factor > 1 ? finalBal * (r * factor) / (factor - 1) : finalBal / N;
      }
      const taxRate = Number(retirementTaxRateEffective.value || 0);
      const pNet = pGross * (1 - taxRate);
      if (!Number.isNaN(pNet)) {
        totalNet += pNet;
      }
    });

    return deflateAllMoney.value
      ? deflate(totalNet, getNumContributions(constants.TOTALS, budgetId))
      : totalNet;
  };

  const getCrossoverPeriod = (
    instrumentId: string,
    budgetId: string
  ): number | null => {
    const schedule = getContributionSchedule(instrumentId, budgetId);
    if (!schedule || !schedule.amortizationSchedule || schedule.amortizationSchedule.length === 0) {
      return null;
    }
    if (schedule.lifetimeContribution <= 0) {
      return null;
    }
    const avgContribution = Number(schedule.lifetimeContribution) / schedule.amortizationSchedule.length;
    for (const record of schedule.amortizationSchedule) {
      const contrib = Number(record.contribution);
      const growth = Number(record.growth);
      const threshold = contrib > 0 ? contrib : avgContribution;
      if (growth >= threshold) {
        return record.period;
      }
    }
    return null;
  };

  const getCrossoverPoint = (
    instrumentId: string,
    budgetId: string
  ): CrossoverPointResult => {
    const schedule = getContributionSchedule(instrumentId, budgetId);
    if (!schedule || Number(schedule.lifetimeContribution) <= 0) {
      return {
        period: null,
        formatted: 'N/A',
        reached: false,
      };
    }
    const period = getCrossoverPeriod(instrumentId, budgetId);
    if (period === null) {
      return {
        period: null,
        formatted: `> ${yearsToContribute.value} yrs`,
        reached: false,
      };
    }
    const formatted = globalOptions.periodsAsDates
      ? (globalOptions.Period(period, true) as string)
      : `Period ${period}`;
    return {
      period,
      formatted,
      reached: true,
    };
  };

  const classifySafeWithdrawalRate = (rate: number): { tier: SafeWithdrawalRateResult['tier']; label: string; badgeClass: string } => {
    if (rate <= 3.5) {
      return {
        tier: 'safe',
        label: 'Safe',
        badgeClass: 'badge-success',
      };
    } else if (rate <= 4.5) {
      return {
        tier: 'benchmark',
        label: '4% Rule',
        badgeClass: 'badge-info',
      };
    } else if (rate <= 5.5) {
      return {
        tier: 'warning',
        label: 'Caution',
        badgeClass: 'badge-warning',
      };
    } else {
      return {
        tier: 'danger',
        label: 'High Risk',
        badgeClass: 'badge-error',
      };
    }
  };

  const getStartingRetirementBalance = (instrumentId: string, careerBudgetId?: string): number => {
    const baseCareerId = careerBudgetId || selectedCareerBudgetId.value || constants.DEFAULT;
    const careerSchedule = getContributionSchedule(instrumentId, baseCareerId);
    return careerSchedule.amortizationSchedule.length > 0
      ? Number(careerSchedule.amortizationSchedule.slice(-1)[0].currentBalance)
      : (getInstrument(instrumentId)?.currentBalance || (instrumentId === constants.TOTALS ? totalCurrentBalance.value : 0));
  };

  const getSafeWithdrawalRate = (
    instrumentId: string,
    budgetId: string
  ): SafeWithdrawalRateResult => {
    const nestEgg = getStartingRetirementBalance(instrumentId);
    if (!nestEgg || nestEgg <= 0) {
      return {
        rate: 0,
        formatted: 'N/A',
        tier: 'na',
        label: 'N/A',
        badgeClass: 'badge-ghost',
      };
    }

    const schedule = getWithdrawalSchedule(instrumentId, budgetId);
    let annualWithdrawal = 0;
    if (schedule.amortizationSchedule.length > 0) {
      annualWithdrawal = Number(schedule.amortizationSchedule[0].withdrawal) * constants.PERIODS_PER_YEAR;
    } else {
      const budget = getWithdrawalBudget(budgetId);
      const monthlyNet = budget ? budget.relative : desiredNetIncome.value;
      const taxRate = retirementTaxRateEffective.value || 0;
      const monthlyGross = taxRate < 1 ? monthlyNet / (1 - taxRate) : monthlyNet;
      annualWithdrawal = monthlyGross * constants.PERIODS_PER_YEAR;
    }

    if (annualWithdrawal <= 0) {
      return {
        rate: 0,
        formatted: '0.00%',
        tier: 'safe',
        label: 'Safe',
        badgeClass: 'badge-success',
      };
    }

    const rate = (annualWithdrawal / nestEgg) * 100;
    const formatted = `${rate.toFixed(2)}%`;
    const classification = classifySafeWithdrawalRate(rate);

    return {
      rate,
      formatted,
      ...classification,
    };
  };

  const getSafeWithdrawalRateForCareerBudget = (
    careerBudgetId: string,
    instrumentId: string = constants.TOTALS
  ): SafeWithdrawalRateResult => {
    const nestEgg = getStartingRetirementBalance(instrumentId, careerBudgetId);
    if (!nestEgg || nestEgg <= 0) {
      return {
        rate: 0,
        formatted: 'N/A',
        tier: 'na',
        label: 'N/A',
        badgeClass: 'badge-ghost',
      };
    }

    const taxRate = retirementTaxRateEffective.value || 0;
    const monthlyGross = taxRate < 1 ? desiredNetIncome.value / (1 - taxRate) : desiredNetIncome.value;
    const annualWithdrawal = monthlyGross * constants.PERIODS_PER_YEAR;

    if (annualWithdrawal <= 0) {
      return {
        rate: 0,
        formatted: '0.00%',
        tier: 'safe',
        label: 'Safe',
        badgeClass: 'badge-success',
      };
    }

    const rate = (annualWithdrawal / nestEgg) * 100;
    const formatted = `${rate.toFixed(2)}%`;
    const classification = classifySafeWithdrawalRate(rate);

    return {
      rate,
      formatted,
      ...classification,
    };
  };

  const getNumContributions = (
    instrumentId: string,
    budgetId: string
  ): number =>
    getContributionSchedule(instrumentId, budgetId).amortizationSchedule.length;

  const getMaxMoney = (instrumentId: string): number => {
    const bestSchedule = getContributionSchedule(
      instrumentId,
      monthlyBudgets.value[0].id
    );
    return Number(bestSchedule.lifetimeContribution + bestSchedule.lifetimeGrowth);
  };

  const getMaxWithdrawalMoney = (instrumentId: string): number => {
    const baseCareerId = selectedCareerBudgetId.value || constants.DEFAULT;
    const careerSchedule = getContributionSchedule(instrumentId, baseCareerId);
    let max = careerSchedule.amortizationSchedule.length > 0
      ? Number(careerSchedule.amortizationSchedule.slice(-1)[0].currentBalance)
      : (getInstrument(instrumentId)?.currentBalance || 0);

    monthlyWithdrawalBudgets.value.forEach((budget) => {
      const scheduleMap = withdrawalSchedules.value[instrumentId];
      if (!scheduleMap || !scheduleMap[budget.id]) return;
      const schedule = scheduleMap[budget.id];
      schedule.amortizationSchedule.forEach((record) => {
        if (Number(record.currentBalance) > max) max = Number(record.currentBalance);
      });
    });
    return max;
  };

  const amortizationTableHeaders: ComputedRef<
    Record<string, string | ComputedRef<string>>[]
  > = computed(() => {
    const baseHeaders = [
      { key: constants.TK_PERIOD, label: periodLabel.value },
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

  const buildAmortizationTableTitle = (
    instrument: UIInstrument,
    monthlyBudget: Budget
  ): string => {
    const budgetRate = viewPhase.value === constants.PHASE_CAREER
      ? getBudgetName(monthlyBudget.id)
      : getWithdrawalBudgetName(monthlyBudget.id);

    return `Amortization Table - ${getInstrumentName(
      instrument.id
    )} | ${budgetRate}`;
  };

  const buildAmortizationTableSubtitle = (
    instrument: UIInstrument,
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
    instrument: UIInstrument
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
    contributionsVsGrowthGraphs,
    escapeVelocityGraphs,
    graphs,
    graphXScale,
    inflationRate,
    retirementTaxRateEffective,
    instrumentCardGraphConfig,
    instrumentFormTitle,
    instrumentsWithTotals,
    monthlyBudgets,
    monthlyWithdrawalBudgets,
    passiveIncomeGraphs,
    periodLabel,
    purchasingPowerGraphs,
    totalAnnualLimit,
    totalCurrentBalance,
    totalMaxPeriodsPerYear,
    totalsAsAnInstrument,
    careerRetirementComparison,
    investmentTabularAnalysis,
    retirementTabularAnalysis,
    withdrawalBalancesGraphs,
    withdrawalLongevityEnvelopeGraphs,
    withdrawalPurchasingPowerGraphs,
    withdrawalScenarios,
    withdrawalSchedules,
    withdrawalYieldVsDrawdownGraphs,

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
    getBudgetColor,
    getBudgetComparativeAnalysis,
    getBudgetIndex,
    getBudgetName,
    getInstrumentComparativeAnalysis,
    getWithdrawalBudget,
    getWithdrawalBudgetName,
    getContributionSchedule,
    getWithdrawalSchedule,
    getSteadyStateMonthlyWithdrawal,
    getCrossoverPeriod,
    getCrossoverPoint,
    getSafeWithdrawalRate,
    getSafeWithdrawalRateForCareerBudget,
    getInstrument,
    getInstrumentIndex,
    getInstrumentName,
    getMaxMoney,
    getMaxWithdrawalMoney,
    getNumContributions,
    getNumWithdrawals,
    importState,
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
    stateHash,
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
