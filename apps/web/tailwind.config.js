/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Decathlon-like primary blue; refined in Phase 2 design system
        brand: { DEFAULT: '#3643ba', dark: '#2a3490' },
      },
    },
  },
  plugins: [],
};
