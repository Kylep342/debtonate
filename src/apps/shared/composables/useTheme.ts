import { computed, ref, watch, ComputedRef, Ref, readonly } from 'vue';

import constants from '@/apps/shared/constants/constants';
import keys from '@/apps/shared/constants/keys';

const darkMode: Ref<boolean> = ref(false);
const colorPalate: ComputedRef<string[]> = computed(() => constants.COLOR_PALETTE);

// set initial theme on composable initalization
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem(keys.LS_THEME);

  if (storedTheme) {
    darkMode.value = (storedTheme === constants.THEME_DARK);
  } else if (window.matchMedia) {
    const userPreference = !!window.matchMedia('(prefers-color-scheme: dark)').matches;
    darkMode.value = userPreference;
  }
} else {
  darkMode.value = false;
}

// register watcher to track user preference via darkMode
watch(
  () => darkMode.value,
  (newValue) => {
    if (typeof window === 'undefined') return;

    const themeToSet = newValue ? constants.THEME_DARK : constants.THEME;
    localStorage.setItem(keys.LS_THEME, themeToSet);

    const root = document.querySelector('#app');
    if (root) {
      root.setAttribute('data-theme', themeToSet);
    } else {
      document.documentElement.setAttribute('data-theme', themeToSet);
    }
  },
  {
    immediate: true
  }
);

export function useTheme() {
  const toggleTheme = () => {
    darkMode.value = !darkMode.value;
  };

  return {
    darkMode: readonly(darkMode),
    colorPalate: colorPalate,
    toggleTheme
  };
};
