import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import constants from '@/apps/shared/constants/constants';
import keys from '@/apps/shared/constants/keys';
import { useGlobalOptionsStore, type GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

describe('Global Options Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('with global options', () => {
    it('styles currency', async () => {
      const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
      globalOptions.setCurrency('USD');
      globalOptions.setLanguage('en-US');

      expect(globalOptions.currency).toBe('USD');
      expect(globalOptions.language).toBe('en-US');
      expect(globalOptions.CurrencySymbol(globalOptions.currency, globalOptions.locale)).toBe('$');
      expect(globalOptions.Money(100)).toBe('$100.00');

      globalOptions.setLanguage('de-DE');
      globalOptions.setCurrency('EUR');

      expect(globalOptions.language).toBe('de-DE');
      expect(globalOptions.currency).toBe('EUR');
      expect(globalOptions.CurrencySymbol(globalOptions.currency, globalOptions.language)).toBe('€');
    });

    it('styles percentages', async () => {
      const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
      globalOptions.setLanguage('en-US');

      expect(globalOptions.language).toBe('en-US');
      expect(globalOptions.Percent(40.23)).toBe('40.23%')

      globalOptions.setLanguage('es-MX');

      expect(globalOptions.Percent(40.23)).toBe('40.23%')
    });

    it('styles dates', async () => {
      const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
      const baseDate = new Date(globalOptions.baseDate)
      globalOptions.setLanguage('en-US');

      expect(globalOptions.periodsAsDates).toBe(false);
      expect(globalOptions.Time).toBe(constants.PERIOD);
      expect(globalOptions.Period(1, true)).toBe(1);
      expect(globalOptions.Period(1)).toBe(1);

      globalOptions.togglePeriodsAsDates();

      expect(globalOptions.periodsAsDates).toBe(true);
      expect(globalOptions.Time).toBe(constants.DATE);
      expect(globalOptions.Period(1, true)).toBe(new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        baseDate.getDate(),
      ).toLocaleDateString());
      expect(globalOptions.Period(1)).toStrictEqual(new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        baseDate.getDate(),
      ));
    });
  });

  it('handles internal globalOptions', async () => {
    const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
    const initialState = globalOptions.exportState();

    expect(Object.keys(initialState)).toStrictEqual([
      keys.LS_CURRENCY,
      keys.LS_LANGUAGE,
      keys.LS_PERIODS_AS_DATES,
    ]);

    globalOptions.togglePeriodsAsDates();
    globalOptions.setCurrency('JPY');
    globalOptions.setLanguage('en-GB');
    const changedState = globalOptions.exportState();

    globalOptions.saveState();
    globalOptions.clearState();

    expect(globalOptions.currency).toBe(initialState[keys.LS_CURRENCY]);
    expect(globalOptions.language).toBe(initialState[keys.LS_LANGUAGE]);
    expect(globalOptions.periodsAsDates).toBe(initialState[keys.LS_PERIODS_AS_DATES]);

    globalOptions.loadState();

    expect(globalOptions.currency).toBe(changedState[keys.LS_CURRENCY]);
    expect(globalOptions.language).toBe(changedState[keys.LS_LANGUAGE]);
    expect(globalOptions.periodsAsDates).toBe(changedState[keys.LS_PERIODS_AS_DATES]);
  });

  it('uses default currency and language when navigator.language is unrecognized', () => {
    // Mock the 'language' property on the global navigator object
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('');

    const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

    expect(globalOptions.language).toBe('en-US');
    expect(globalOptions.currency).toBe('USD');

    globalOptions.setLanguage('de-DE');
    globalOptions.setCurrency('EUR');

    expect(globalOptions.language).toBe('de-DE');
    expect(globalOptions.currency).toBe('EUR');

    globalOptions.clearState();

    expect(globalOptions.language).toBe('en-US');
    expect(globalOptions.currency).toBe('USD');
  });

  it('uses a default currency symbol when the symbol cannot be determined', () => {
    const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

    globalOptions.setCurrency('WTF');

    expect(globalOptions.CurrencySymbol('WTF', globalOptions.locale)).toBe('$');
  });
});
