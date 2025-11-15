import { ref, watch, Ref, readonly } from 'vue';

const lightTheme = 'retro';
const darkTheme = 'synthwave';
const themeStorageKey = 'user-theme-preference'; // Key for local storage

const themeIsDark: Ref<boolean> = ref(false);

if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem(themeStorageKey);

  if (storedTheme) {
    themeIsDark.value = (storedTheme === darkTheme);
  } else {
    themeIsDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches || false;
  }
}

watch(
  () => themeIsDark.value,
  (newValue) => {
    if (typeof window === 'undefined') return;

    const themeToSet = newValue ? darkTheme : lightTheme;

    localStorage.setItem(themeStorageKey, themeToSet);

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
    themeIsDark.value = !themeIsDark.value;
  };

  return {
    themeIsDark: readonly(themeIsDark),
    toggleTheme
  };
}
