import * as d3 from 'd3';
import { instrument } from 'moneyfunx';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import constants from '@/apps/appreciate/constants/constants';
import keys from '@/apps/appreciate/constants/keys';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import sharedKeys from '@/apps/shared/constants/keys';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { MonthlyBudget } from '@/apps/shared/types/core';

const Instruments = (): instrument.Instrument[] => [
  new instrument.Instrument(10000, 0.11, constants.PERIODS_PER_YEAR, 'IRA', 6500),
  new instrument.Instrument(0, 0.042666667, constants.PERIODS_PER_YEAR, 'ABC'),
  new instrument.Instrument(45000, 0.085, constants.PERIODS_PER_YEAR, '401(K)', 23500),
];

const Budgets = (): MonthlyBudget[] => [
  { id: String(Math.floor(Math.random() * Date.now())), relative: 1200 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 555 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 200 },
];

describe('Appreciate Core Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has correct total values', async () => {
    const state: AppreciateCoreStore = useAppreciateCoreStore();
    state.budgets = Budgets();
    state.instruments = Instruments();
    state.sortInstruments();

    expect(
      state.instrumentsWithTotals.map((instrument: instrument.IInstrument) => instrument.name)
    ).toStrictEqual([constants.NAME_TOTALS_AS_AN_INSTRUMENT, 'IRA', '401(K)', 'ABC']);

    expect(
      state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
    ).toStrictEqual([1200, 555, 200, 0]);

    expect(state.totalAnnualLimit).toBe(30000);
    expect(state.totalCurrentBalance).toBe(55000);
  });

  describe('with budgets', async () => {
    it('creates a budget', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.createBudget(100);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['100.00', '0.00']);

      state.instruments = Instruments();
      expect(state.getBudget(constants.DEFAULT).absolute.toFixed(2)).toBe('0.00');

      state.createBudget(200);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['200.00', '100.00', '0.00']);
    });

    it('deletes a budget', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      const firstBudgetId = state.monthlyBudgets[0].id;
      const firstBudget = state.getBudget(firstBudgetId);
      state.deleteBudget(firstBudget.id);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([555, 200, 0]);
    });

    it('edits a budget', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.budgets = Budgets();
      const firstBudgetId = state.monthlyBudgets[0].id;
      const firstBudget = state.getBudget(firstBudgetId);
      expect(state.currentBudgetId).toBe(null);
      expect(state.budgetFormActive).toBe(false);

      state.editBudget(firstBudgetId);
      expect(state.currentBudgetId).toBe(firstBudgetId);
      expect(state.budgetFormActive).toBe(true);

      state.createBudget(firstBudget.relative + 100);
      state.exitBudgetForm();
      expect(state.currentBudgetId).toBe(null);
      expect(state.budgetFormActive).toBe(false);
      expect(state.getBudget(firstBudgetId)).toBe(undefined);
    });

    it('sorts budgets', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      state.createBudget(350);
      expect(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.relative)
      ).toStrictEqual([1200, 555, 350, 200, 0]);
    });

    it('gets budget attributes', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
      state.budgets = Budgets();
      const firstBudgetId = state.monthlyBudgets[0].id;
      expect(state.getBudgetIndex(constants.DEFAULT)).toBe(4);
      expect(state.getBudgetColor(constants.DEFAULT)).toBe(globalOptions.colorPalate[4 % globalOptions.colorPalate.length]);
      expect(state.getBudgetName(constants.DEFAULT)).toBe(constants.NAME_MIN_BUDGET);
      expect(state.getBudgetIndex(firstBudgetId)).toBe(1);
      expect(state.getBudgetColor(firstBudgetId)).toBe(globalOptions.colorPalate[1]);
      expect(state.getBudgetName(firstBudgetId)).toBe('Budget 1');
    });
  });

  describe('with instruments', async () => {
    it('creates an instrument', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      const firstInstrumentDummy = Instruments()[0]
      state.createInstrument(
        firstInstrumentDummy.currentBalance,
        () => 0,
        firstInstrumentDummy.name,
        () => 0
      );

      expect(
        state.instruments.map((instrument: instrument.Instrument) => instrument.name)
      ).toStrictEqual(
        ['IRA']
      );

      expect(
        state.instrumentsWithTotals.map((instrument: instrument.IInstrument) => instrument.name)
      ).toStrictEqual(
        [constants.NAME_TOTALS_AS_AN_INSTRUMENT, 'IRA']
      );
    });

    it('deletes an instrument', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.instruments = Instruments();
      state.sortInstruments();
      const firstInstrumentId = state.instruments[0].id;
      expect(state.instruments.length).toBe(3);

      state.deleteInstrument(firstInstrumentId);
      expect(state.instruments.length).toBe(2);
      expect(state.instruments.map((instrument: instrument.Instrument) => instrument.name)).toStrictEqual(['401(K)', 'ABC']);
    });

    it('edits an instrument', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.instruments = Instruments();
      state.sortInstruments();
      const firstInstrumentId = state.instruments[0].id;
      const firstInstrument = state.getInstrument(firstInstrumentId);
      expect(state.currentInstrumentId).toBe(null);
      expect(state.instrumentFormActive).toBe(false);

      state.editInstrument(firstInstrumentId);
      expect(state.currentInstrumentId).toBe(firstInstrumentId);
      expect(state.instrumentFormActive).toBe(true);

      const editedInstrumentId = state.createInstrument(
        firstInstrument.currentBalance,
        4.88,
        'Beans',
      );
      state.exitInstrumentForm();
      expect(state.currentInstrumentId).toBe(null);
      expect(state.instrumentFormActive).toBe(false);
      expect(state.getInstrument(firstInstrumentId)).toBe(undefined);
      expect(state.getInstrument(editedInstrumentId).name).toBe('Beans');
    });

    it('gets intstrument attributes', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.instruments = Instruments();
      state.sortInstruments();
      const firstInstrumentId = state.instruments[0].id;
      expect(state.getInstrumentIndex(constants.TOTALS)).toBe(0);
      expect(state.getInstrumentName(constants.TOTALS)).toBe(constants.NAME_TOTALS_AS_AN_INSTRUMENT);
      expect(state.getInstrumentIndex(firstInstrumentId)).toBe(1);
      expect(state.getInstrumentName(firstInstrumentId)).toBe('IRA');
    });
  });

  it('handles internal state', async () => {
    const state: AppreciateCoreStore = useAppreciateCoreStore();
    const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

    const initialState = state.exportState();
    expect(Object.keys(initialState)).toStrictEqual([
      sharedKeys.LS_CURRENCY,
      sharedKeys.LS_LANGUAGE,
      sharedKeys.LS_PERIODS_AS_DATES,
      keys.LS_ACCRUE_BEFORE_CONTRIBUTION,
      keys.LS_BUDGETS,
      keys.LS_DEFLATE_ALL_MONEY,
      keys.LS_INFLATION_FACTOR,
      keys.LS_INSTRUMENTS,
      keys.LS_YEARS_TO_CONTRIBUTE,
      keys.LS_YEARS_TO_SPEND,
    ]);

    state.budgets = Budgets();
    state.instruments = Instruments();
    state.setInflationFactor(0.05);
    state.toggleAccrueBeforeContribution();
    state.toggleDeflateAllMoney(0.04);
    state.setYearsToContribute(30);
    state.setYearsToSpend(42);
    globalOptions.setCurrency('JPY');
    globalOptions.setLanguage('en-GB');

    const changedState = state.exportState();
    state.saveState();
    state.clearState();

    expect(state.budgets).toStrictEqual(initialState[keys.LS_BUDGETS]);
    expect(state.instruments.map(
      (instrument: instrument.Instrument) => instrument.name)
    ).toStrictEqual(initialState[keys.LS_INSTRUMENTS].map(
      (instrument: instrument.Instrument) => instrument.name
    ));
    expect(state.accrueBeforeContribution).toBe(initialState[keys.LS_ACCRUE_BEFORE_CONTRIBUTION]);
    expect(state.deflateAllMoney).toBe(initialState[keys.LS_DEFLATE_ALL_MONEY]);
    expect(state.inflationFactor).toBe(initialState[keys.LS_INFLATION_FACTOR]);
    expect(state.yearsToContribute).toBe(initialState[keys.LS_YEARS_TO_CONTRIBUTE]);
    expect(state.yearsToSpend).toBe(initialState[keys.LS_YEARS_TO_SPEND]);
    expect(globalOptions.language).toBe(initialState[sharedKeys.LS_LANGUAGE]);
    expect(globalOptions.currency).toBe(initialState[sharedKeys.LS_CURRENCY]);

    state.loadState();
    expect(state.budgets).toStrictEqual(changedState[keys.LS_BUDGETS]);
    expect(state.instruments.map(
      (instrument: instrument.Instrument) => instrument.name
    )).toStrictEqual(changedState[keys.LS_INSTRUMENTS].map(
      (instrument: instrument.Instrument) => instrument.name
    ));
    expect(state.accrueBeforeContribution).toBe(changedState[keys.LS_ACCRUE_BEFORE_CONTRIBUTION]);
    expect(state.deflateAllMoney).toBe(changedState[keys.LS_DEFLATE_ALL_MONEY]);
    expect(state.inflationFactor).toBe(changedState[keys.LS_INFLATION_FACTOR]);
    expect(state.yearsToContribute).toBe(changedState[keys.LS_YEARS_TO_CONTRIBUTE]);
    expect(state.yearsToSpend).toBe(changedState[keys.LS_YEARS_TO_SPEND]);
    expect(globalOptions.language).toBe(changedState[sharedKeys.LS_LANGUAGE]);
    expect(globalOptions.currency).toBe(changedState[sharedKeys.LS_CURRENCY]);
  });

  it('manages component states', async () => {
    const state: AppreciateCoreStore = useAppreciateCoreStore();
    state.budgets = Budgets();
    // monthlyBudgets is 1-indexed as the base minimumBudget is at [0]
    const firstBudgetId = state.monthlyBudgets[1].id;
    state.instruments = Instruments();
    const firstInstrumentId = state.instruments[0].id;

    // budgetDetailsFormActive
    expect(state.budgetDetailsPanelActive).toBe(false);
    state.viewBudget(firstBudgetId);
    expect(state.budgetDetailsPanelActive).toBe(true);
    expect(state.currentBudgetId).toBe(firstBudgetId);
    state.unviewBudget();
    expect(state.budgetDetailsPanelActive).toBe(false);
    expect(state.currentBudgetId).toBe(null);

    // budgetFormActive
    expect(state.budgetFormActive).toBe(false);
    state.openBudgetForm();
    expect(state.budgetFormActive).toBe(true);
    state.exitBudgetForm();
    expect(state.currentBudgetId).toBe(null);
    expect(state.budgetFormActive).toBe(false);
    state.editBudget(firstBudgetId);
    expect(state.currentBudgetId).toBe(firstBudgetId);
    expect(state.budgetFormActive).toBe(true);
    state.exitBudgetForm();
    expect(state.budgetFormActive).toBe(false);
    expect(state.currentBudgetId).toBe(null);

    // optionsFormActive
    expect(state.optionsFormActive).toBe(false);
    state.openOptionsForm();
    expect(state.optionsFormActive).toBe(true);
    state.exitOptionsForm();
    expect(state.optionsFormActive).toBe(false);

    // instrumentDetailsPanelActive
    expect(state.instrumentDetailsPanelActive).toBe(false);
    state.viewInstrument(firstInstrumentId);
    expect(state.instrumentDetailsPanelActive).toBe(true);
    expect(state.currentInstrumentId).toBe(firstInstrumentId);
    state.unviewInstrument();
    expect(state.instrumentDetailsPanelActive).toBe(false);
    expect(state.currentInstrumentId).toBe(null);

    // instrumentFormActive
    expect(state.instrumentFormActive).toBe(false);
    state.openInstrumentForm();
    expect(state.instrumentFormActive).toBe(true);
    state.exitInstrumentForm();
    expect(state.currentInstrumentId).toBe(null);
    expect(state.instrumentFormActive).toBe(false);
    state.editInstrument(firstInstrumentId);
    expect(state.currentInstrumentId).toBe(firstInstrumentId);
    expect(state.instrumentFormActive).toBe(true);
    state.exitInstrumentForm();
    expect(state.instrumentFormActive).toBe(false);
    expect(state.currentInstrumentId).toBe(null);
  });

  it('builds titles', async () => {
    const state: AppreciateCoreStore = useAppreciateCoreStore();
    state.budgets = Budgets();
    state.instruments = Instruments();
    state.sortInstruments();
    const firstBudgetId = state.monthlyBudgets[0].id;
    const firstInstrumentId = state.instruments[0].id;
    expect(state.buildInstrumentSubtitle(state.getInstrument(firstInstrumentId))).toBe(
      '($10,000.00 | 11%)'
    );

    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.instrumentFormTitle).toBe('Creating an Instrument');
    state.editBudget(firstBudgetId);
    expect(state.budgetFormTitle).toBe('Editing Budget 1');
    expect(state.instrumentFormTitle).toBe('Creating an Instrument');
    state.exitBudgetForm();

    state.editInstrument(firstInstrumentId);
    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.instrumentFormTitle).toBe('Editing IRA');
    state.exitInstrumentForm();
    expect(state.budgetFormTitle).toBe('Creating a Budget');
    expect(state.instrumentFormTitle).toBe('Creating an Instrument');

    expect(
      state.buildAmortizationTableSubtitle(
        state.getInstrument(firstInstrumentId),
        state.getBudget(firstBudgetId)
      )
    ).toBe('($10,000.00 | 11% | $1,200.00/month | 300 Contributions)');
    expect(
      state.buildAmortizationTableTitle(
        state.getInstrument(firstInstrumentId),
        state.getBudget(firstBudgetId)
      )
    ).toBe('Amortization Table - IRA | Budget 1');
  });

  it('computes contribution schedules', async () => {
    const state: AppreciateCoreStore = useAppreciateCoreStore();
    state.budgets = Budgets();
    state.instruments = Instruments();

    expect(
      Object.keys(state.contributionScenarios)
    ).toStrictEqual(
      state.monthlyBudgets.map((budget: MonthlyBudget) => budget.id)
    );

    state.monthlyBudgets.forEach((budget: MonthlyBudget) => {
      expect(
        Object.keys(state.contributionScenarios[budget.id].contributionSchedule)
      ).toStrictEqual(
        [...state.instruments.map((instrument: instrument.Instrument) => instrument.id), constants.TOTALS]
      );
      expect(
        state.contributionScenarios[budget.id].contributionAmount
      ).toBe(
        budget.relative
      );
    });
  });

  it('computes contribution summaries', async () => {
    const state: AppreciateCoreStore = useAppreciateCoreStore();
    state.budgets = Budgets();
    state.instruments = Instruments();

    expect(
      Object.keys(state.contributionSchedules)
    ).toStrictEqual(
      state.instrumentsWithTotals.map((instrument: instrument.IInstrument) => instrument.id)
    );

    Object.keys(state.contributionSchedules).forEach((instrumentId) => {
      expect(
        Object.keys(state.contributionSchedules[instrumentId])
      ).toStrictEqual(
        state.monthlyBudgets.map((budget: MonthlyBudget) => budget.id)
      );
    });
  });

  describe('with graphing', () => {
    it('configures graphs', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

      expect(state.graphXScale).toStrictEqual(d3.scaleLinear);

      state.budgets = Budgets();
      state.instruments = Instruments();

      const firstBudgetId = state.budgets[0].id;
      const firstInstrumentId = state.instruments[0].id;

      expect(
        Object.keys(state.graphs)
      ).toStrictEqual([
        constants.GRAPH_BALANCES_OVER_TIME,
        constants.GRAPH_PURCHASING_POWER_OVER_TIME,
      ]);

      globalOptions.togglePeriodsAsDates();
      expect(state.graphXScale).toStrictEqual(d3.scaleTime);

      const i1B1Interest = state.cardGraphs[firstInstrumentId][firstBudgetId][0]
      const i1B1Contribution = state.cardGraphs[firstInstrumentId][firstBudgetId][1]

      expect(Object.keys(i1B1Interest)).toStrictEqual([
        'label',
        'value',
        'color',
      ]);

      expect(Object.keys(i1B1Contribution)).toStrictEqual([
        'label',
        'value',
        'color',
      ]);

      [
        state.budgetCardGraphConfig,
        state.instrumentCardGraphConfig,
      ].forEach((config) => expect(Object.keys(config)).toStrictEqual([
        'id',
        'type',
        'color',
        'header',
        'lineName',
        'subheader',
        'x',
        'xFormat',
        'xLabel',
        'xScale',
        'y',
        'yFormat',
        'yLabel',
        'yScale',
      ]));
    });

    it('computs balances over time graph content', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.budgets = Budgets(); state.loans = Instruments();

      expect(
        Object.keys(state.graphs[constants.GRAPH_BALANCES_OVER_TIME].graphs)
      ).toStrictEqual(
        state.instrumentsWithTotals.map((instrument: instrument.IInstrument) => instrument.id)
      );
    });

    it('computs purchasing power over time graph content', async () => {
      const state: AppreciateCoreStore = useAppreciateCoreStore();
      state.budgets = Budgets();
      state.instruments = Instruments();

      expect(
        Object.keys(state.graphs[constants.GRAPH_PURCHASING_POWER_OVER_TIME].graphs)
      ).toStrictEqual(
        state.instrumentsWithTotals.map((instrument: instrument.IInstrument) => instrument.id)
      );
    })
  });
});
