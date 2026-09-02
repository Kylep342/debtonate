import { describe, expect, it } from 'vitest';

import { useTheme } from '@/apps/shared/composables/useTheme';
import constants from '@/apps/shared/constants/constants';

describe('useTheme composable', () => {
  it('does a thing', () => {
    const { darkMode, colorPalette, toggleTheme } = useTheme();
    // initialize as off
    expect(darkMode.value).toBe(false);
    expect(colorPalette.value).toStrictEqual(constants.COLOR_PALETTE);
    // toggle on
    toggleTheme();
    expect(darkMode.value).toBe(true);
    expect(colorPalette.value).toStrictEqual(constants.COLOR_PALETTE);
    // toggle back off
    toggleTheme();
    expect(darkMode.value).toBe(false);
  });
});
