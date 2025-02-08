/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,html,js}'],
  theme: {
    extend: {
      spacing: {
        90: '22rem',
      },
    },
  },
  plugins: ['daisyui'],
  daisyui: {
    themes: ['retro'],
    darkTheme: 'synthwave',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: '#app',
  },
};
