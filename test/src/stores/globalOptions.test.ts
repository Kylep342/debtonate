import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import constants from '@/apps/shared/constants/constants';
import keys from '@/apps/shared/constants/keys';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

describe('Global Options Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('with global options', () => {
    it('styles currency', async () => {
      const state = useGlobalOptionsStore();
      state.setCurrency('USD');
      state.setLanguage('en-US');

      expect(state.currency).toBe('USD');
      expect(state.language).toBe('en-US');
      expect(state.currencySymbol).toBe('$');
      expect(state.Money(100)).toBe('$100.00');

      state.setLanguage('de-DE');
      state.setCurrency('EUR');

      expect(state.language).toBe('de-DE');
      expect(state.currency).toBe('EUR');
      expect(state.currencySymbol).toBe('€');
    });

    it('styles percentages', async () => {
      const coreState = useGlobalOptionsStore();
      coreState.setLanguage('en-US');

      expect(coreState.language).toBe('en-US');
      expect(coreState.Percent(40.23)).toBe('40.23%')

      coreState.setLanguage('es-MX');

      expect(coreState.Percent(40.23)).toBe('40.23%')
    });

    it('styles dates', async () => {
      const coreState = useGlobalOptionsStore();
      const baseDate = new Date(coreState.baseDate)
      coreState.setLanguage('en-US');

      expect(coreState.periodsAsDates).toBe(false);
      expect(coreState.Time).toBe(constants.PERIOD);
      expect(coreState.Period(1, true)).toBe(1);
      expect(coreState.Period(1)).toBe(1);

      coreState.togglePeriodsAsDates();

      expect(coreState.periodsAsDates).toBe(true);
      expect(coreState.Time).toBe(constants.DATE);
      expect(coreState.Period(1, true)).toBe(new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        baseDate.getDate(),
      ).toLocaleDateString());
      expect(coreState.Period(1)).toStrictEqual(new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        baseDate.getDate(),
      ));
    });
  });

  it('handles internal state', async () => {
    const state = useGlobalOptionsStore();
    const initialState = state.exportState();

    expect(Object.keys(initialState)).toStrictEqual([
      keys.LS_CURRENCY,
      keys.LS_LANGUAGE,
      keys.LS_PERIODS_AS_DATES,
    ]);

    state.togglePeriodsAsDates();
    state.setCurrency('JPY');
    state.setLanguage('en-GB');
    const changedState = state.exportState();

    state.saveState();
    state.clearState();

    expect(state.currency).toBe(initialState[keys.LS_CURRENCY]);
    expect(state.language).toBe(initialState[keys.LS_LANGUAGE]);
    expect(state.periodsAsDates).toBe(initialState[keys.LS_PERIODS_AS_DATES]);

    state.loadState();

    expect(state.currency).toBe(changedState[keys.LS_CURRENCY]);
    expect(state.language).toBe(changedState[keys.LS_LANGUAGE]);
    expect(state.periodsAsDates).toBe(changedState[keys.LS_PERIODS_AS_DATES]);
  });
});