module.exports = {
  prefix: 'aa--',
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: {
          DEFAULT: '#7d01fa',
          light: '#a64cff',
          dark: '#5600c7',
        },
        secondary: {
          DEFAULT: '#e8e1f7',
          light: '#f3edfc',
          dark: '#b5aed0',
        },
        accent: {
          DEFAULT: '#0dbfa9',
          light: '#5ce7d3',
          dark: '#008f79',
        },
        background: {
          light: '#f4f3f7',
          dark: '#1a202c',
        },
        text: {
          light: '#1a202c',
          dark: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
