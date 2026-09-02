import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        90: '22rem',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['retro', 'synthwave'],
    darkTheme: 'synthwave',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
  },
};
