import * as d3 from 'd3';
import * as moneyfunx from 'moneyfunx';
import { defineStore } from 'pinia';
import { computed, ref, Ref, ComputedRef } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import keys from '@/apps/debtonate/constants/keys';
import { PaymentScenario } from '@/apps/debtonate/types/core';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Budget, MonthlyBudget } from '@/apps/shared/types/core';
import {
  Arc,
  ChartSeries,
  DonutGraphContent,
  GraphConfig,
  Graphs,
  LineGraphContent,
  Point,
} from '@/apps/shared/types/graph';

export interface DebtonateCoreState {
  budgetDetailsPanelActive: Ref<boolean>;
  budgetFormActive: Ref<boolean>;
  budgets: Ref<Budget[]>;
  currentBudgetId: Ref<string | null>;
  currentLoanId: Ref<string | null>;
  loanDetailsPanelActive: Ref<boolean>;
  loanFormActive: Ref<boolean>;
  loans: Ref<moneyfunx.Loan[]>;
  minimumBudget: Budget;
  optionsFormActive: Ref<boolean>;
  reducePayments: Ref<boolean>;
  refinancingFormActive: Ref<boolean>;
  refinancingScenarios: Ref<Record<string, moneyfunx.Loan[]>>;
  refinancingUseHighestPayment: Ref<boolean>;
  roundingEnabled: Ref<boolean>;
  roundingScale: Ref<number>;
  snowballSort: Ref<boolean>;
}

export interface DebtonateCoreGetters {
  amortizationTableHeaders: ComputedRef<
    Record<string, string | ComputedRef<string>>[]
  >;
  balancesGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  budgetCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>>;
  budgetFormTitle: ComputedRef<string>;
  cardGraphs: ComputedRef<Record<string, Record<string, DonutGraphContent>>>;
  graphs: ComputedRef<Record<string, GraphConfig>>;
  graphXScale: ComputedRef<d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>>;
  interestSavedGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  loanCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>>;
  loanFormTitle: ComputedRef<string>;
  loansWithTotals: ComputedRef<moneyfunx.ILoan[]>;
  monthlyBudgets: ComputedRef<MonthlyBudget[]>;
  paymentScenarios: ComputedRef<Record<string, PaymentScenario>>;
  paymentSchedules: ComputedRef<
    Record<string, Record<string, moneyfunx.PaymentSchedule>>
  >;
  percentOfPaymentAsPrincaplGraphs: ComputedRef<GraphConfig<LineGraphContent>>;
  periodLabel: ComputedRef<string>;
  rawTotalMinPayment: ComputedRef<number>;
  refinancingFormTitle: ComputedRef<string>;
  refinancingSchedules: ComputedRef<
    Record<string, Record<string, PaymentScenario>>
  >;
  roundedTotalMinPayment: ComputedRef<number>;
  totalCurrentBalance: ComputedRef<number>;
  totalEffectiveInterestRate: ComputedRef<number>;
  totalFees: ComputedRef<number>;
  totalMaxPeriods: ComputedRef<number>;
  totalMaxPeriodsPerYear: ComputedRef<number>;
  totalMaxTermInYears: ComputedRef<number>;
  totalMinPayment: ComputedRef<number>;
  totalPrincipal: ComputedRef<number>;
  totalsAsALoan: ComputedRef<moneyfunx.ILoan>;
}

export interface DebtonateCoreActions {
  amortizationTableRows: (
    schedule: moneyfunx.PaymentSchedule
  ) => Record<string, string>[];
  amortizationTableTotals: (
    schedule: moneyfunx.PaymentSchedule
  ) => Record<string, string>;
  avalanche: () => moneyfunx.Loan[];
  buildAmortizationTableSubtitle: (
    loan: moneyfunx.ILoan,
    monthlyBudget: MonthlyBudget
  ) => string;
  buildAmortizationTableTitle: (
    loan: moneyfunx.ILoan,
    monthlyBudget: MonthlyBudget
  ) => string;
  buildLoanSubtitle: (loan: moneyfunx.ILoan) => string;
  clearState: () => void;
  createBudget: (proposedBudget: number) => string;
  createLoan: (
    principal: number,
    interestRate: number,
    termInYears: number,
    name: string,
    currentBalance: number,
    fees: number
  ) => string;
  createRefinanceScenario: (
    parentLoanId: string,
    principal: number,
    interestRate: number,
    termInYears: number,
    name: string,
    fees: number
  ) => string;
  deleteBudget: (id: string) => void;
  deleteLoan: (id: string) => void;
  deleteRefinancingScenario: (parentLoanId: string, scenarioId: string) => void;
  editBudget: (id: string) => void;
  editLoan: (id: string) => void;
  exitBudgetForm: () => void;
  exitLoanForm: () => void;
  exitOptionsForm: () => void;
  exitRefinancingForm: () => void;
  exportState: () => Record<string, any>;
  getBudget: (id: string) => MonthlyBudget | undefined;
  getBudgetColor: (id: string) => string;
  getBudgetIndex: (id: string) => number;
  getBudgetName: (id: string) => string;
  getInterestUpToPeriod: (
    loanId: string,
    budgetId: string,
    period: number
  ) => number;
  getLifetimeInterest: (loanId: string, budgetId: string) => number;
  getLoan: (id: string) => moneyfunx.ILoan | undefined;
  getLoanIndex: (id: string) => number;
  getLoanName: (id: string) => string;
  getNumPayments: (loanId: string, budgetId: string) => number;
  getPaymentSchedule: (
    loanId: string,
    budgetId: string
  ) => moneyfunx.PaymentSchedule;
  loadState: () => void;
  openBudgetForm: () => void;
  openLoanForm: () => void;
  openOptionsForm: () => void;
  refinanceLoan: (id: string) => void;
  refinancingScenarioName: (parentLoanId: string, name: string) => string;
  refinancingScenarioPayment: (
    parentLoan: moneyfunx.ILoan,
    loan: moneyfunx.ILoan
  ) => number;
  saveState: () => void;
  setRoundingScale: (newScale: number) => void;
  snowball: () => moneyfunx.Loan[];
  sortLoans: () => void;
  toggleAvalancheSort: () => void;
  toggleReducePayments: () => void;
  toggleRefinancingUseHighestPayment: () => void;
  toggleRounding: (scale: number) => void;
  toggleSnowballSort: () => void;
  unviewBudget: () => void;
  unviewLoan: () => void;
  viewBudget: (id: string) => void;
  viewLoan: (id: string) => void;
}

export const useDebtonateCoreStore = defineStore('debtonateCore', () => {
  // dependent stores

  const globalOptions = useGlobalOptionsStore();

  /** STATE */

  const budgetDetailsPanelActive: Ref<boolean> = ref(false);
  const budgetFormActive: Ref<boolean> = ref(false);
  const budgets: Ref<Budget[]> = ref([]);
  const currentBudgetId: Ref<string | null> = ref(null);
  const currentLoanId: Ref<string | null> = ref(null);
  const loanDetailsPanelActive: Ref<boolean> = ref(false);
  const loanFormActive: Ref<boolean> = ref(false);
  const loans: Ref<moneyfunx.Loan[]> = ref([]);
  const minimumBudget: Budget = { id: constants.DEFAULT, relative: 0 };
  const optionsFormActive: Ref<boolean> = ref(false);
  const reducePayments: Ref<boolean> = ref(true);
  const refinancingFormActive: Ref<boolean> = ref(false);
  const refinancingScenarios: Ref<Record<string, moneyfunx.Loan[]>> = ref({});
  const refinancingUseHighestPayment: Ref<boolean> = ref(false);
  const roundingEnabled: Ref<boolean> = ref(false);
  const roundingScale: Ref<number> = ref(100);
  const snowballSort: Ref<boolean> = ref(false);

  /** GETTERS */

  // total values across all instruments
  const rawTotalMinPayment: ComputedRef<number> = computed(() =>
    loans.value.reduce((minPayment, loan) => minPayment + loan.minPayment, 0)
  );

  const roundedTotalMinPayment: ComputedRef<number> = computed(
    () =>
      rawTotalMinPayment.value +
      (roundingScale.value - (rawTotalMinPayment.value % roundingScale.value))
  );

  const totalMaxPeriods: ComputedRef<number> = computed(() =>
    loans.value.reduce(
      (curMax, loan) => Math.max(curMax, loan.periodsPerYear * loan.termInYears),
      0
    )
  );

  const totalMaxPeriodsPerYear: ComputedRef<number> = computed(() =>
    loans.value.reduce(
      (curMax, loan) => Math.max(curMax, loan.periodsPerYear),
      0
    )
  );

  const totalMaxTermInYears: ComputedRef<number> = computed(() =>
    loans.value.reduce((curMax, loan) => Math.max(curMax, loan.termInYears), 0)
  );

  const totalMinPayment: ComputedRef<number> = computed(() =>
    roundingEnabled.value ? roundedTotalMinPayment.value : rawTotalMinPayment.value
  );

  const totalPrincipal: ComputedRef<number> = computed(() =>
    loans.value.reduce((totalPrincipal, loan) => totalPrincipal + loan.principal, 0)
  );

  const totalCurrentBalance: ComputedRef<number> = computed(() =>
    loans.value.reduce(
      (totalBalance, loan) => totalBalance + loan.currentBalance,
      0
    )
  );

  const totalEffectiveInterestRate: ComputedRef<number> = computed(() =>
    loans.value.reduce(
      (weightedRate, loan) =>
        weightedRate +
        loan.annualRate * (loan.currentBalance / totalCurrentBalance.value),
      0
    )
  );

  const totalFees: ComputedRef<number> = computed(() =>
    loans.value.reduce((totalFees, loan) => totalFees + loan.fees, 0)
  );

  // Loans
  const totalsAsALoan: ComputedRef<moneyfunx.ILoan> = computed(() => ({
    id: constants.TOTALS,
    principal: totalPrincipal.value,
    annualRate: totalEffectiveInterestRate.value,
    periodsPerYear: totalMaxPeriodsPerYear.value,
    termInYears: totalMaxTermInYears.value,
    periodicRate: totalEffectiveInterestRate.value / constants.PERIODS_PER_YEAR, // not implemented for Totals as a Loan (see notes.ts)
    periods: totalMaxPeriods.value,
    minPayment: totalMinPayment.value,
    name: constants.NAME_TOTALS_AS_LOAN,
    currentBalance: totalCurrentBalance.value,
    fees: totalFees.value,
  }));

  const loansWithTotals: ComputedRef<moneyfunx.ILoan[]> = computed(() => [
    totalsAsALoan.value,
    ...loans.value,
  ]);

  // Budgets
  const monthlyBudgets: ComputedRef<MonthlyBudget[]> = computed(() =>
    [...budgets.value, minimumBudget].map((budget) => ({
      ...budget,
      absolute: budget.relative + totalMinPayment.value,
    }))
  );

  // Refinancing
  const refinancingSchedules: ComputedRef<
    Record<string, Record<string, PaymentScenario>>
  > = computed(() => {
    const schedules = <Record<string, Record<string, PaymentScenario>>>{};
    Object.entries(refinancingScenarios.value).forEach(
      ([parentLoanId, scenarios]) => {
        const parentLoan = getLoan(parentLoanId)!;
        schedules[parentLoanId] = <Record<string, PaymentScenario>>{};
        scenarios.forEach((scenario) => {
          const payment = refinancingScenarioPayment(parentLoan, scenario);
          const paymentSchedule = moneyfunx.payLoans(
            [scenario],
            payment,
            false
          );
          schedules[parentLoanId][scenario.id] = <PaymentScenario>{
            paymentAmount: payment,
            paymentSchedule: paymentSchedule,
          };
        });
      }
    );
    return schedules;
  });

  // String builders
  const budgetFormTitle: ComputedRef<string> = computed(() =>
    currentBudgetId.value && budgetFormActive.value
      ? `Editing ${getBudgetName(currentBudgetId.value)}`
      : 'Creating a Budget'
  );

  const loanFormTitle: ComputedRef<string> = computed(() =>
    currentLoanId.value && loanFormActive.value
      ? `Editing ${getLoanName(currentLoanId.value)}`
      : 'Creating a Loan'
  );

  const refinancingFormTitle: ComputedRef<string> = computed(() =>
    currentLoanId.value && refinancingFormActive.value
      ? `Refinancing ${getLoanName(currentLoanId.value)}`
      : 'Refinancing'
  );

  // Payments
  const paymentScenarios: ComputedRef<Record<string, PaymentScenario>> = computed(
    () => {
      const scenarios: Record<string, PaymentScenario> = {};
      monthlyBudgets.value.forEach((budget) => {
        scenarios[budget.id] = <PaymentScenario>{
          paymentAmount: budget.relative,
          paymentSchedule: moneyfunx.payLoans(
            loans.value,
            budget.absolute,
            reducePayments.value
          ),
        };
      });
      return scenarios;
    }
  );

  const paymentSchedules: ComputedRef<
    Record<string, Record<string, moneyfunx.PaymentSchedule>>
  > = computed(() => {
    const schedules: Record<
      string,
      Record<string, moneyfunx.PaymentSchedule>
    > = {};

    loansWithTotals.value.forEach((loan: moneyfunx.ILoan) => {
      schedules[loan.id] = <Record<string, moneyfunx.PaymentSchedule>>{};
    });

    Object.keys(schedules).forEach((loanId: string) => {
      Object.keys(paymentScenarios.value).forEach((budgetId) => {
        const schedule = paymentScenarios.value[budgetId];
        schedules[loanId][budgetId] = { ...schedule.paymentSchedule[loanId] };
      });
    });
    return schedules;
  });

  // ease-of-use getters over computed values
  const periodLabel: ComputedRef<string> = computed(() =>
    globalOptions.periodsAsDates ? 'Payment Date' : 'Payment Number'
  );

  const amortizationTableHeaders: ComputedRef<
    Record<string, string | ComputedRef<string>>[]
  > = computed(() => [
    { key: 'period', label: periodLabel },
    { key: 'amountPaid', label: 'Total Payment' },
    { key: 'principalPaid', label: 'Principal' },
    { key: 'interestPaid', label: 'Interest' },
    { key: 'principalRemaining', label: 'Principal Remaining' },
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
        header: (loanId: string) =>
          `Balances over Time by Budget - ${getLoanName(loanId)}`,
        lineName: getBudgetName,
        subheader: (loanId: string) => buildLoanSubtitle(getLoan(loanId)!),
        x: globalOptions.Period,
        xFormat: (x: number) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Balance',
        yScale: d3.scaleLinear,
      };

      loansWithTotals.value.forEach((loan: moneyfunx.ILoan) => {
        config.graphs[loan.id] = <LineGraphContent>{
          config: {
            maxX: getNumPayments(loan.id, constants.DEFAULT),
            maxY: getLoan(loan.id)!.currentBalance,
          },
          lines: <ChartSeries<Point>>{},
        };
        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getPaymentSchedule(loan.id, budget.id).amortizationSchedule.forEach(
            (record: moneyfunx.PaymentRecord) => {
              line.push({ x: record.period, y: record.principalRemaining });
            }
          );
          config.graphs[loan.id].lines[budget.id] = line;
        });
      });
      return config;
    }
  );

  const budgetCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>> = computed(
    () => ({
      id: 'BudgetCardSummary',
      type: 'donut',
      color: getBudgetColor,
      header: (loanId: string) => `Cost Breakdown - ${getLoanName(loanId)}`,
      lineName: getBudgetName,
      subheader: (loanId: string) => buildLoanSubtitle(getLoan(loanId)!),
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

  const loanCardGraphConfig: ComputedRef<GraphConfig<DonutGraphContent>> = computed(
    () => ({
      id: 'LoanCardSummary',
      type: 'donut',
      color: () => '#FFFFFF',
      header: (budgetId: string) =>
        `Cost Breakdown - ${getBudgetName(budgetId)}`,
      lineName: getBudgetName,
      subheader: (loanId: string) => buildLoanSubtitle(getLoan(loanId)!),
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

  const cardGraphs: ComputedRef<Record<string, Record<string, DonutGraphContent>>> =
    computed(() => {
      const config = <Record<string, Record<string, DonutGraphContent>>>{};
      loansWithTotals.value.forEach((loan: moneyfunx.ILoan) => {
        config[loan.id] = <Record<string, DonutGraphContent>>{};
        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const paymentSchedule = getPaymentSchedule(loan.id, budget.id);
          config[loan.id][budget.id] = <Arc[]>[
            <Arc>{
              label: 'Lifetime Interest',
              value: paymentSchedule.lifetimeInterest,
              color: globalOptions.colorPalate[0],
            },
            <Arc>{
              label: 'Lifetime Principal',
              value: paymentSchedule.lifetimePrincipal,
              color: globalOptions.colorPalate[2],
            },
          ];
        });
      });
      return config;
    });

  const interestSavedGraphs: ComputedRef<GraphConfig<LineGraphContent>> =
    computed(() => {
      const config = <GraphConfig<LineGraphContent>>{
        id: 'InterestSaved',
        type: 'line',
        color: getBudgetColor,
        graphs: <Graphs<LineGraphContent>>{},
        header: (loanId: string) =>
          `Interest Saved over Time by Budget - ${getLoanName(loanId)}`,
        lineName: getBudgetName,
        subheader: (loanId: string) => buildLoanSubtitle(getLoan(loanId)!),
        x: globalOptions.Period,
        xFormat: (x: number) => globalOptions.Period(x, true),
        xLabel: () => globalOptions.Time,
        xScale: graphXScale.value,
        y: (y: number) => y,
        yFormat: globalOptions.Money,
        yLabel: () => 'Interest Saved',
        yScale: d3.scaleLinear,
      };

      loansWithTotals.value.forEach((loan: moneyfunx.ILoan) => {
        config.graphs[loan.id] = <LineGraphContent>{
          config: {
            maxX: getNumPayments(loan.id, constants.DEFAULT),
            maxY: getLifetimeInterest(loan.id, constants.DEFAULT),
          },
          lines: <ChartSeries<Point>>{},
        };
        monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
          const line: Point[] = [];
          getPaymentSchedule(loan.id, constants.DEFAULT).amortizationSchedule.forEach(
            (record: moneyfunx.PaymentRecord, index: number) => {
              line.push({
                x: record.period,
                y:
                  getInterestUpToPeriod(loan.id, constants.DEFAULT, index) -
                  getInterestUpToPeriod(loan.id, budget.id, index),
              });
            }
          );
          config.graphs[loan.id].lines[budget.id] = line;
        });
      });
      return config;
    });

  const percentOfPaymentAsPrincaplGraphs: ComputedRef<
    GraphConfig<LineGraphContent>
  > = computed(() => {
    const config = <GraphConfig<LineGraphContent>>{
      id: 'PercentOfPaymentAsPrincipal',
      type: 'line',
      color: getBudgetColor,
      graphs: <Graphs<LineGraphContent>>{},
      header: (loanId: string) =>
        `Percent of Payment as Principal over Time by Budget - ${getLoanName(
          loanId
        )}`,
      lineName: getBudgetName,
      subheader: (loanId: string) => buildLoanSubtitle(getLoan(loanId)!),
      x: globalOptions.Period,
      xFormat: (x: number) => globalOptions.Period(x, true),
      xLabel: () => globalOptions.Time,
      xScale: graphXScale.value,
      y: (y: number) => y,
      yLabel: () => 'Percent of Payemnt to Principal',
      yFormat: globalOptions.Percent,
      yScale: d3.scaleLinear,
    };

    // idea; toggle presence of lines as data with boolean k-v
    loansWithTotals.value.forEach((loan: moneyfunx.ILoan) => {
      config.graphs[loan.id] = <LineGraphContent>{
        config: {
          maxX: getNumPayments(loan.id, constants.DEFAULT),
          maxY: 100,
        },
        lines: <ChartSeries<Point>>{},
      };
      monthlyBudgets.value.forEach((budget: MonthlyBudget) => {
        const line: Point[] = [];
        getPaymentSchedule(loan.id, budget.id).amortizationSchedule.forEach(
          (record: moneyfunx.PaymentRecord) => {
            line.push({
              x: record.period,
              y: (record.principal * 100) / (record.principal + record.interest),
            });
          }
        );
        config.graphs[loan.id].lines[budget.id] = line;
      });
    });
    return config;
  });

  const graphs: ComputedRef<Record<string, GraphConfig<LineGraphContent>>> = computed(() => ({
    [constants.GRAPH_BALANCES_OVER_TIME]: balancesGraphs.value,
    [constants.GRAPH_INTEREST_SAVED_OVER_TIME]: interestSavedGraphs.value,
    [constants.GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL]:
      percentOfPaymentAsPrincaplGraphs.value,
  }));

  /** ACTIONS */

  // state management
  const clearState = () => {
    globalOptions.clearState();

    budgetDetailsPanelActive.value = false;
    budgetFormActive.value = false;
    budgets.value = [];
    currentBudgetId.value = null;
    currentLoanId.value = null;
    loanDetailsPanelActive.value = false;
    loanFormActive.value = false;
    loans.value = [];
    optionsFormActive.value = false;
    reducePayments.value = true;
    refinancingFormActive.value = false;
    refinancingScenarios.value = {};
    refinancingUseHighestPayment.value = false;
    roundingEnabled.value = false;
    roundingScale.value = 100;
    snowballSort.value = true;
  };

  const loadState = () => {
    globalOptions.loadState();

    // Safer loading
    const storedBudgets = localStorage.getItem(keys.LS_BUDGETS);
    if (storedBudgets) budgets.value = JSON.parse(storedBudgets);

    const storedLoans = localStorage.getItem(keys.LS_LOANS);
    if (storedLoans)
      loans.value = JSON.parse(storedLoans).map(
        (loan: moneyfunx.ILoan) =>
          new moneyfunx.Loan(
            loan.principal,
            loan.annualRate,
            constants.PERIODS_PER_YEAR,
            loan.termInYears,
            loan.name,
            loan.currentBalance,
            loan.fees
          )
      );

    const storedReducePayments = localStorage.getItem(keys.LS_REDUCE_PAYMENTS);
    if (storedReducePayments)
      reducePayments.value = JSON.parse(storedReducePayments);

    const storedRefinancingUseHighestPayment = localStorage.getItem(
      keys.LS_REFINANCING_USE_HIGHEST_PAYMENT
    );
    if (storedRefinancingUseHighestPayment)
      refinancingUseHighestPayment.value = JSON.parse(
        storedRefinancingUseHighestPayment
      );

    const storedRoundingEnabled = localStorage.getItem(keys.LS_ROUNDING_ENABLED);
    if (storedRoundingEnabled)
      roundingEnabled.value = JSON.parse(storedRoundingEnabled);

    const storedRoundingScale = localStorage.getItem(keys.LS_ROUNDING_SCALE);
    if (storedRoundingScale)
      roundingScale.value = JSON.parse(storedRoundingScale);

    const storedSnowballSort = localStorage.getItem(keys.LS_SNOWBALL_SORT);
    if (storedSnowballSort)
      snowballSort.value = JSON.parse(storedSnowballSort);
  };

  const saveState = (): void => {
    globalOptions.saveState();

    localStorage.setItem(keys.LS_BUDGETS, JSON.stringify(budgets.value));
    localStorage.setItem(keys.LS_LOANS, JSON.stringify(loans.value));
    localStorage.setItem(
      keys.LS_REDUCE_PAYMENTS,
      JSON.stringify(reducePayments.value)
    );
    localStorage.setItem(
      keys.LS_REFINANCING_USE_HIGHEST_PAYMENT,
      JSON.stringify(refinancingUseHighestPayment.value)
    );
    localStorage.setItem(
      keys.LS_ROUNDING_ENABLED,
      JSON.stringify(roundingEnabled.value)
    );
    localStorage.setItem(
      keys.LS_ROUNDING_SCALE,
      JSON.stringify(roundingScale.value)
    );
    localStorage.setItem(
      keys.LS_SNOWBALL_SORT,
      JSON.stringify(snowballSort.value)
    );
  };

  const exportState = () => ({
    ...globalOptions.exportState(),

    [keys.LS_BUDGETS]: budgets.value,
    [keys.LS_LOANS]: loans.value,
    [keys.LS_REDUCE_PAYMENTS]: reducePayments.value,
    [keys.LS_REFINANCING_USE_HIGHEST_PAYMENT]:
      refinancingUseHighestPayment.value,
    [keys.LS_ROUNDING_ENABLED]: roundingEnabled.value,
    [keys.LS_ROUNDING_SCALE]: roundingScale.value,
    [keys.LS_SNOWBALL_SORT]: snowballSort.value,
  });

  // debtonate settings
  const setRoundingScale = (newScale: number): void => {
    if (!Number.isNaN(newScale) && newScale > 0) {
      roundingScale.value = newScale;
    }
  };
  const toggleReducePayments = (): void => {
    reducePayments.value = !reducePayments.value;
  };
  const toggleRefinancingUseHighestPayment = (): void => {
    refinancingUseHighestPayment.value = !refinancingUseHighestPayment.value;
  };
  const toggleRounding = (scale: number): void => {
    roundingEnabled.value = !roundingEnabled.value;
    if (roundingEnabled.value) {
      setRoundingScale(scale);
    }
  };
  const avalanche = (): moneyfunx.Loan[] =>
    moneyfunx.sortWith(
      moneyfunx.sortWith(loans.value, moneyfunx.snowball),
      moneyfunx.avalanche
    );
  const snowball = (): moneyfunx.Loan[] =>
    moneyfunx.sortWith(
      moneyfunx.sortWith(loans.value, moneyfunx.avalanche),
      moneyfunx.snowball
    );

  const sortLoans = (): void => {
    loans.value = snowballSort.value === true ? snowball() : avalanche();
  };

  const toggleAvalancheSort = (): void => {
    snowballSort.value = false;
    sortLoans();
  };

  const toggleSnowballSort = (): void => {
    snowballSort.value = true;
    sortLoans();
  };

  // Loans
  const getLoan = (id: string): moneyfunx.ILoan | undefined =>
    loansWithTotals.value.find((loan) => loan.id === id);

  const deleteLoan = (id: string): void => {
    loans.value = loans.value.filter((loan) => loan.id !== id);
  };
  const editLoan = (id: string): void => {
    currentLoanId.value = id;
    openLoanForm();
  };
  const getLoanIndex = (id: string): number =>
    loansWithTotals.value.findIndex((loan) => loan.id === id);
  const getLoanName = (id: string): string => getLoan(id)!.name;
  const unviewLoan = () => {
    loanDetailsPanelActive.value = false;
    currentLoanId.value = null;
  };
  const viewLoan = (id: string): void => {
    currentLoanId.value = id;
    loanDetailsPanelActive.value = true;
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

  // Forms
  const openBudgetForm = (): void => {
    budgetFormActive.value = true;
  };
  const openLoanForm = (): void => {
    loanFormActive.value = true;
  };
  const openOptionsForm = (): void => {
    optionsFormActive.value = true;
  };
  const refinanceLoan = (id: string): void => {
    currentLoanId.value = id;
    refinancingFormActive.value = true;
  };
  const exitBudgetForm = (): void => {
    budgetFormActive.value = false;
    currentBudgetId.value = null;
  };
  const exitLoanForm = (): void => {
    loanFormActive.value = false;
    currentLoanId.value = null;
  };
  const exitOptionsForm = (): void => {
    optionsFormActive.value = false;
  };
  const exitRefinancingForm = (): void => {
    refinancingFormActive.value = false;
    currentLoanId.value = null;
  };

  // Refinancing scenarios
  const refinancingScenarioPayment = (
    parentLoan: moneyfunx.ILoan,
    loan: moneyfunx.ILoan
  ): number =>
    refinancingUseHighestPayment.value
      ? Math.max(loan.minPayment, parentLoan.minPayment)
      : loan.minPayment;

  const refinancingScenarioName = (
    parentLoanId: string,
    name: string
  ): string =>
    name ||
    `Scenario ${refinancingScenarios.value[parentLoanId]?.length + 1 || 1}`;

  const createRefinanceScenario = (
    parentLoanId: string,
    principal: number,
    interestRate: number,
    termInYears: number,
    name: string,
    fees: number
  ): string => {
    const loan = new moneyfunx.Loan(
      principal,
      interestRate,
      constants.PERIODS_PER_YEAR,
      termInYears,
      refinancingScenarioName(parentLoanId, name),
      undefined,
      fees
    );
    if (refinancingScenarios.value[parentLoanId]) {
      refinancingScenarios.value[parentLoanId].push(loan);
    } else {
      refinancingScenarios.value[parentLoanId] = [loan];
    }
    return loan.id;
  };

  const deleteRefinancingScenario = (
    parentLoanId: string,
    scenarioId: string
  ) => {
    refinancingScenarios.value[parentLoanId] = refinancingScenarios.value[
      parentLoanId
    ].filter((scenario) => scenario.id !== scenarioId);
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

  // Loan
  const createLoan = (
    principal: number,
    interestRate: number,
    termInYears: number,
    name: string,
    currentBalance: number,
    fees: number
  ): string => {
    const loan = new moneyfunx.Loan(
      principal,
      interestRate,
      constants.PERIODS_PER_YEAR,
      termInYears,
      name,
      currentBalance,
      fees
    );
    if (currentLoanId.value && currentLoanId.value !== constants.TOTALS) {
      deleteLoan(currentLoanId.value);
      currentLoanId.value = null;
    }
    loans.value.push(loan);
    sortLoans();
    return loan.id;
  };

  // ease-of-use getters over computed values
  const getPaymentSchedule = (
    loanId: string,
    budgetId: string
  ): moneyfunx.PaymentSchedule => paymentSchedules.value[loanId][budgetId];

  const getNumPayments = (loanId: string, budgetId: string): number =>
    getPaymentSchedule(loanId, budgetId).amortizationSchedule.length;


  const getLifetimeInterest = (loanId: string, budgetId: string): number =>
    getPaymentSchedule(loanId, budgetId).lifetimeInterest;


  const getInterestUpToPeriod = (
    loanId: string,
    budgetId: string,
    period: number
  ): number =>
    getPaymentSchedule(loanId, budgetId)
      .amortizationSchedule.slice(0, period)
      .reduce((acc, record) => acc + record.interest, 0);

  const amortizationTableRows = (schedule: moneyfunx.PaymentSchedule) => {
    return schedule.amortizationSchedule.map(
      (record: moneyfunx.PaymentRecord) => ({
        period: globalOptions.Period(record.period, true) as string,
        amountPaid: globalOptions.Money(record.interest + record.principal),
        principalPaid: globalOptions.Money(record.principal),
        interestPaid: globalOptions.Money(record.interest),
        principalRemaining: globalOptions.Money(record.principalRemaining),
      })
    );
  };

  const amortizationTableTotals = (schedule: moneyfunx.PaymentSchedule) => {
    const { lifetimePrincipal, lifetimeInterest } = schedule;
    return {
      period: 'Totals',
      amountPaid: globalOptions.Money(lifetimePrincipal + lifetimeInterest),
      principalPaid: globalOptions.Money(lifetimePrincipal),
      interestPaid: globalOptions.Money(lifetimeInterest),
      principalRemaining: globalOptions.Money(0),
    };
  };

  // title building functions
  const buildAmortizationTableTitle = (
    loan: moneyfunx.ILoan,
    monthlyBudget: MonthlyBudget
  ): string =>
    `Amortization Table - ${getLoanName(loan.id)} | ${getBudgetName(
      monthlyBudget.id
    )}`;

  const buildAmortizationTableSubtitle = (
    loan: moneyfunx.ILoan,
    monthlyBudget: MonthlyBudget
  ): string =>
    `(${globalOptions.Money(loan.currentBalance)} | ${globalOptions.Percent(
      loan.annualRate * 100
    )} | ${globalOptions.Money(
      monthlyBudget.absolute
    )}/month | ${getNumPayments(loan.id, monthlyBudget.id)} Payments)`;

  const buildLoanSubtitle = (loan: moneyfunx.ILoan): string =>
    `(${globalOptions.Money(loan.currentBalance)} | ${globalOptions.Percent(
      loan.annualRate * 100
    )} | ${loan.termInYears * loan.periodsPerYear} Payments)`;

  /** return */

  return {
    // STATE
    budgetDetailsPanelActive,
    budgetFormActive,
    budgets,
    currentBudgetId,
    currentLoanId,
    loanDetailsPanelActive,
    loanFormActive,
    loans,
    minimumBudget,
    optionsFormActive,
    reducePayments,
    refinancingFormActive,
    refinancingScenarios,
    refinancingUseHighestPayment,
    roundingEnabled,
    roundingScale,
    snowballSort,

    // GETTERS
    amortizationTableHeaders,
    balancesGraphs,
    budgetCardGraphConfig,
    budgetFormTitle,
    cardGraphs,
    graphs,
    graphXScale,
    interestSavedGraphs,
    loanCardGraphConfig,
    loanFormTitle,
    loansWithTotals,
    monthlyBudgets,
    paymentScenarios,
    paymentSchedules,
    percentOfPaymentAsPrincaplGraphs,
    periodLabel,
    rawTotalMinPayment,
    refinancingFormTitle,
    refinancingSchedules,
    roundedTotalMinPayment,
    totalCurrentBalance,
    totalEffectiveInterestRate,
    totalFees,
    totalMaxPeriods,
    totalMaxPeriodsPerYear,
    totalMaxTermInYears,
    totalMinPayment,
    totalPrincipal,
    totalsAsALoan,

    // ACTIONS
    amortizationTableRows,
    amortizationTableTotals,
    avalanche,
    buildAmortizationTableSubtitle,
    buildAmortizationTableTitle,
    buildLoanSubtitle,
    clearState,
    createBudget,
    createLoan,
    createRefinanceScenario,
    deleteBudget,
    deleteLoan,
    deleteRefinancingScenario,
    editBudget,
    editLoan,
    exitBudgetForm,
    exitLoanForm,
    exitOptionsForm,
    exitRefinancingForm,
    exportState,
    getBudget,
    getBudgetColor,
    getBudgetIndex,
    getBudgetName,
    getInterestUpToPeriod,
    getLifetimeInterest,
    getLoan,
    getLoanIndex,
    getLoanName,
    getNumPayments,
    getPaymentSchedule,
    loadState,
    openBudgetForm,
    openLoanForm,
    openOptionsForm,
    refinanceLoan,
    refinancingScenarioName,
    refinancingScenarioPayment,
    saveState,
    setRoundingScale,
    snowball,
    sortLoans,
    toggleAvalancheSort,
    toggleReducePayments,
    toggleRefinancingUseHighestPayment,
    toggleRounding,
    toggleSnowballSort,
    unviewBudget,
    unviewLoan,
    viewBudget,
    viewLoan,
  };
});

export type DebtonateCoreStore = ReturnType<typeof useDebtonateCoreStore>;
