/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
        },
        indigo: {
          DEFAULT: '#312E81',
          dark: '#171A3B',
        },
        lavender: '#EDE9FE',
        dark: '#171A3B',
        brand: {
          violet: '#7C3AED',
          indigo: '#312E81',
          dark: '#171A3B',
          lavender: '#EDE9FE',
          navy: '#171A3B', // Backwards-compatible alias for dark surfaces
        },
        canvas: '#F8F7FC',
        surface: '#FFFFFF',
        ink: '#1E293B',
        muted: '#64748B',
        secondaryText: '#475569',
        border: {
          DEFAULT: '#E2E8F0',
          neutral: '#E2E8F0',
        },
        focusRing: '#A78BFA',
        status: {
          success: '#166534',
          'success-bg': '#DCFCE7',
          info: '#1D4ED8',
          'info-bg': '#DBEAFE',
          warning: '#92400E',
          'warning-bg': '#FEF3C7',
          danger: '#991B1B',
          'danger-bg': '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        lg: '8px',
      },
      boxShadow: {
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
