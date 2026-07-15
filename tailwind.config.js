/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Jade / traditional-medicine palette — change these to rebrand.
        brand: {
          50: '#eef8fb',
          100: '#d0edf3',
          200: '#a6dbe7',
          300: '#71c2d5',
          400: '#3ba3bd',
          500: '#2286a1',
          600: '#186b86',
          700: '#17566d',
          800: '#17475a',
          900: '#123a49',
          DEFAULT: '#186b86',
        },
        accent: {
          DEFAULT: '#c0873f',
          light: '#e0b981',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
};
