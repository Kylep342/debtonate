import { onMounted, ref, watch, Ref } from 'vue';

const lightTheme = 'retro';
const darkTheme = 'synthwave';

const themeIsDark: Ref<boolean> = ref(false);

export function useTheme() {

    const toggleTheme = () => themeIsDark.value = !themeIsDark.value

    onMounted(() => {
        themeIsDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches || false;
    });

    watch(
        () => themeIsDark.value,
        (newValue) => {
            if (typeof window === 'undefined') return;

            const themeToSet = newValue ? darkTheme : lightTheme;

            const root = document.querySelector('#app');
            if (root) {
                root.setAttribute('data-theme', themeToSet);
            } else {
                document.documentElement.setAttribute('data-theme', themeToSet);
            }
        }
    )

    return { themeIsDark, toggleTheme };
};
