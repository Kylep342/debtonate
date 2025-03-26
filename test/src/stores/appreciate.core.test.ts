import { Instrument } from "moneyfunx";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import constants from '@/apps/appreciate/constants/constants';
import keys from '@/apps/appreciate/constants/keys';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';

const Instruments = () => [
  new Instrument(10000, () => 0.11, 12, 'IRA', () => 6500),
  new Instrument(45000, () => 0.085, 12, '401(K)', () => 23500),
  new Instrument(0, () => 0.042666667, 12, 'ABC'),
];

const Budgets = () => [
  { id: String(Math.floor(Math.random() * Date.now())), relative: 1200 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 555 },
  { id: String(Math.floor(Math.random() * Date.now())), relative: 200 },
];

describe('Appreciate Core Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has correct total values', async () => {
    const state = useAppreciateCoreStore();
    state.budgets = Budgets();
    state.instruments = Instruments();

    expect(
      state.instrumentsWithTotals.map((instrument) => instrument.name)
    ).toStrictEqual([constants.NAME_TOTALS_AS_AN_INSTRUMENT, "IRA", "401(K)", "ABC"]);

    expect(
      state.monthlyBudgets.map((budget) => budget.relative)
    ).toStrictEqual([1200, 555, 200, 0]);

  });

  describe('with budgets', async () => {
    it('creates a budget', async () => {
      const state = useAppreciateCoreStore();
      state.createBudget(100);
      expect(
        state.monthlyBudgets.map((budget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['100.00', '0.00']);

      state.instruments = Instruments();
      expect(state.getBudget(constants.DEFAULT).absolute.toFixed(2)).toBe('0.00');

      state.createBudget(200);
      expect(
        state.monthlyBudgets.map((budget) => budget.absolute.toFixed(2))
      ).toStrictEqual(['200.00', '100.00', '0.00']);
    });

    it('deletes a budget', async () => {
      const state = useAppreciateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      const firstBudgetId = state.monthlyBudgets[0].id;
      const firstBudget = state.getBudget(firstBudgetId);
      state.deleteBudget(firstBudget.id);
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([555, 200, 0]);
    });

    it('edits a budget', async () => {
      const state = useAppreciateCoreStore();
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
      const state = useAppreciateCoreStore();
      state.budgets = Budgets();
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 200, 0]);

      state.createBudget(350);
      expect(
        state.monthlyBudgets.map((budget) => budget.relative)
      ).toStrictEqual([1200, 555, 350, 200, 0]);
    });
  });

  describe('with instruments', async () => {
    it('creates an instrument', async () => {
      const state = useAppreciateCoreStore();
      const firstInstrumentDummy = Instruments()[0]
      state.createInstrument(
        firstInstrumentDummy.currentBalance,
        () => 0,
        firstInstrumentDummy.name,
        () => 0
      );

      expect(
        state.instruments.map((loan) => loan.name)
      ).toStrictEqual(
        ["IRA"]
      );

      expect(
        state.instrumentsWithTotals.map((loan) => loan.name)
      ).toStrictEqual(
        [constants.NAME_TOTALS_AS_AN_INSTRUMENT, "IRA"]
      );
    });

    it('deletes an instrument', async () => {
      const state = useAppreciateCoreStore();
      state.instruments = Instruments();
      const firstInstrumentId = state.instruments[0].id;
      expect(state.instruments.length).toBe(3);

      state.deleteInstrument(firstInstrumentId);
      expect(state.instruments.length).toBe(2);
      expect(state.instruments.map((instrument) => instrument.name)).toStrictEqual(["401(K)", "ABC"]);
    });

    it('edits an instrument', async () => {
      const state = useAppreciateCoreStore();
      state.instruments = Instruments();
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
      const state = useAppreciateCoreStore();
      state.instruments = Instruments();
      const firstInstrumentId = state.instruments[0].id;
      expect(state.getInstrumentIndex(constants.TOTALS)).toBe(0);
      expect(state.getInstrumentName(constants.TOTALS)).toBe(constants.NAME_TOTALS_AS_AN_INSTRUMENT);
      expect(state.getInstrumentIndex(firstInstrumentId)).toBe(1);
      expect(state.getInstrumentName(firstInstrumentId)).toBe('IRA');
    });
  });
});
