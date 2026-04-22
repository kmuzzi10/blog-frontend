/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-color)',
        foreground: 'var(--text-color)',
        white: 'rgb(var(--color-white) / <alpha-value>)',
        gray: {
          50:  'rgb(var(--color-gray-50) / <alpha-value>)',
          100: 'rgb(var(--color-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-gray-800) / <alpha-value>)',
          900: 'rgb(var(--color-gray-900) / <alpha-value>)',
        },
        primary: {
          light: '#8884FF',
          DEFAULT: '#6C63FF',
          dark: '#554DCC',
        },
        secondary: {
          light: '#FF95A8',
          DEFAULT: '#FF7A90',
          dark: '#CC6273',
        },
        accent: {
          light: '#33D4B8',
          DEFAULT: '#00C9A7',
          dark: '#00A186',
        },
        clay: {
          light: 'var(--clay-light)',
          base: 'var(--bg-color)',
          dark: 'var(--clay-dark)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'clay': '8px 8px 16px var(--clay-dark), -8px -8px 16px var(--clay-light)',
        'clay-hover': '12px 12px 20px var(--clay-dark), -12px -12px 20px var(--clay-light)',
        'clay-inset': 'inset 6px 6px 12px var(--clay-dark), inset -6px -6px 12px var(--clay-light)',
        'clay-inset-hover': 'inset 8px 8px 16px var(--clay-dark), inset -8px -8px 16px var(--clay-light)',
        'clay-card': '10px 10px 20px var(--clay-dark), -10px -10px 20px var(--clay-light)',
        'clay-badge': '4px 4px 8px var(--clay-dark), -4px -4px 8px var(--clay-light)',
      },
      borderRadius: {
        'clay': '20px',
        'clay-sm': '12px',
        'clay-lg': '24px',
        'clay-full': '9999px',
      }
    },
  },
  plugins: [],
}
