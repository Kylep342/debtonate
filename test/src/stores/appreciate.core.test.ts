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
});
