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
    themes: ['retro', 'synthwave'],
    darkTheme: 'synthwave',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
  },
};
