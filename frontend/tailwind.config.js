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
        primary: {
          DEFAULT: '#334155', // slate-700
          dark: '#1e293b',    // slate-800
          light: '#64748b',   // slate-500
        },
        accent: {
          DEFAULT: '#0284c7', // sky-600
          hover: '#0369a1',   // sky-700
        },
        success: {
          DEFAULT: '#059669', // emerald-600
          light: '#d1fae5',   // emerald-100
        },
        danger: {
          DEFAULT: '#dc2626', // red-600
          light: '#fee2e2',   // red-100
        },
        warning: {
          DEFAULT: '#d97706', // amber-600
          light: '#fef3c7',   // amber-100
        },
        'brand-gold': '#FDB813',
        'brand-gold-hover': '#E5A610',
        'brand-gold-light': '#FFF4D6',
        secondary: '#475569', // slate-600
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
      }
    },
  },
  plugins: [],
}
