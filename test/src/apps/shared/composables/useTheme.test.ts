import { describe, expect, it } from 'vitest';

import { useTheme } from '@/apps/shared/composables/useTheme';
import constants from '@/apps/shared/constants/constants';

describe('useTheme composable', () => {
  it('does a thing', () => {
    const { darkMode, colorPalate, toggleTheme } = useTheme();
    // initialize as off
    expect(darkMode.value).toBe(false);
    expect(colorPalate).toStrictEqual(constants.COLORS_SMART);
    // toggle on
    toggleTheme();
    expect(darkMode.value).toBe(true);
    // toggle back off
    toggleTheme();
    expect(darkMode.value).toBe(false);
  });
});
