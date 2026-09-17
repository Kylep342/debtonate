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
  safelist: [
    'max-w-sm', 'sm:max-w-sm',
    'max-w-md', 'sm:max-w-md',
    'max-w-lg', 'sm:max-w-lg',
    'max-w-xl', 'sm:max-w-xl',
    'max-w-2xl', 'sm:max-w-2xl',
    'max-w-3xl', 'sm:max-w-3xl',
    'max-w-4xl', 'sm:max-w-4xl',
    'max-w-5xl', 'sm:max-w-5xl',
  ],
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
