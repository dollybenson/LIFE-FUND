import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#3898D0',
          600: '#2E86C1'
        }
      }
    },
  },
  plugins: [],
} satisfies Config
