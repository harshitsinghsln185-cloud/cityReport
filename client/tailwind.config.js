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
          DEFAULT: '#0A1F44',
          hover: '#12306A',
          light: '#EBF1FA',
        },
        accent: {
          DEFAULT: '#C8A24A',
          hover: '#B38E37',
          light: '#FAF4E6',
          text: '#8A6A1F',
          border: '#EEDCB2',
        },
        navy: {
          DEFAULT: '#0A1F44',
          dark: '#06132B',
          light: '#12306A',
        },
        canvas: '#FAF8F3',
        surface: '#FFFFFF',
        surfaceAlt: '#F1EEE6',
        surfaceSubtle: '#F7F5EE',
        ink: '#101828',
        muted: '#5B6577',
        secondaryText: '#5B6577',
        border: {
          DEFAULT: '#E7E2D6',
          neutral: '#E7E2D6',
          subtle: '#EFECE3',
        },
        focusRing: '#C8A24A',
        status: {
          success: '#0E6E4C',
          'success-bg': '#E8F5F0',
          info: '#1D4ED8',
          'info-bg': '#EFF6FF',
          warning: '#B54708',
          'warning-bg': '#FEF6EE',
          danger: '#B42318',
          'danger-bg': '#FEF3F2',
        },
        // Backwards compatibility aliases mapped to new palette
        gold: {
          DEFAULT: '#C8A24A',
          hover: '#B38E37',
          light: '#FAF4E6',
          border: '#EEDCB2',
        },
        indigo: {
          DEFAULT: '#0A1F44',
          dark: '#06132B',
        },
        lavender: '#EBF1FA',
        dark: '#06132B',
        darkSurface: '#0A1F44',
        brand: {
          violet: '#0A1F44',
          indigo: '#0A1F44',
          dark: '#06132B',
          lavender: '#EBF1FA',
          navy: '#0A1F44',
        },
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
