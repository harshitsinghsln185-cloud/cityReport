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
        gold: {
          DEFAULT: '#D97706',
          hover: '#B45309',
          light: '#FEF3C7',
          border: '#FDE68A',
        },
        darkSurface: '#0F1123',
        surfaceSubtle: '#FAFAFD',
      },
      fontFamily: {
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['"Manrope Variable"', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '12px',
        lg: '8px',
        card: '16px',
        cardLg: '24px',
        pill: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        subtle: '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.02)',
        card: '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        cardHover: '0 16px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        modal: '0 24px 48px -12px rgba(15, 23, 42, 0.18), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        glow: '0 0 28px -4px rgba(124, 58, 237, 0.25)',
      },
    },
  },
  plugins: [],
};
