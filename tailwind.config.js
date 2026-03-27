/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F7FB',
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
          light: '#ffffff',
          base: '#F5F7FB',
          dark: '#d1d9e6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'clay': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'clay-hover': '12px 12px 20px #d1d9e6, -12px -12px 20px #ffffff',
        'clay-inset': 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff',
        'clay-inset-hover': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
        'clay-card': '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
        'clay-badge': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
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
