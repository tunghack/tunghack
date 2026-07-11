/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Jade / traditional-medicine palette — change these to rebrand.
        brand: {
          50: '#eef7f2',
          100: '#d6ecdf',
          200: '#aed9c0',
          300: '#7dbf9c',
          400: '#4fa078',
          500: '#2f8560',
          600: '#226a4c',
          700: '#1c543d',
          800: '#184433',
          900: '#12332680',
          DEFAULT: '#226a4c',
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
