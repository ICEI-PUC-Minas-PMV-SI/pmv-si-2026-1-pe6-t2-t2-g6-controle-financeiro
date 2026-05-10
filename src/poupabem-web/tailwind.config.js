/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // PoupaBem brand palette
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          700: '#047857',
          900: '#064E3B'
        },
        income: '#047857',
        expense: '#B91C1C',
        accent: '#F59E0B',
        bg: '#FAFAF7',
        surface: '#FFFFFF',
        surface2: '#F5F5F0',
        border: '#E7E5E0',
        ink: '#1C1917',
        ink2: '#57534E',
        muted: '#A8A29E'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.625rem'
      },
      boxShadow: {
        card: '0 2px 8px rgba(6, 78, 59, 0.05)'
      }
    }
  },
  plugins: []
}
