/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'aa--',
  content: ['./src/**/*.{html,ts}'],
  heme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: '#7d01fa',
        secondary: '#e8e1f7',
        accent: '#0dbfa9',
      },
    },
  },
  plugins: [],
};
