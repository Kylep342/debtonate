/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,html,js}'],
  theme: {
    extend: {
      spacing: {
        90: '22rem',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['lemonade'],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: '#app',
  },
};
