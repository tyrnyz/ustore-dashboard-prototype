/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1B2A4A', light: '#243660', dark: '#121e35' },
        gold: { DEFAULT: '#F5A623', light: '#F7B84B', dark: '#D4891C' },
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
