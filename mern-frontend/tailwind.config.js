/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Deep navy primary
        ink: {
          50:  '#f5f7fb',
          100: '#e9eef7',
          200: '#cdd6e6',
          300: '#9faecb',
          400: '#6c7fa6',
          500: '#475a85',
          600: '#324269',
          700: '#243353',
          800: '#1a2740',
          900: '#0f1830',
          950: '#0a1024',
        },
        // Emerald accent
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      boxShadow: {
        elegant: '0 10px 30px -12px rgba(15, 24, 48, 0.18)',
        glow: '0 0 0 1px rgba(16,185,129,0.15), 0 20px 60px -20px rgba(16,185,129,0.35)',
        card: '0 1px 2px rgba(15,24,48,0.04), 0 1px 3px rgba(15,24,48,0.06)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #10b981, #059669)',
        'gradient-primary': 'linear-gradient(135deg, #0f1830, #243353)',
        'gradient-hero':
          'radial-gradient(1200px 600px at 70% -10%, rgba(16,185,129,0.18), transparent 60%), radial-gradient(900px 500px at 10% 10%, rgba(99,102,241,0.18), transparent 60%)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: 0, transform: 'scale(0.97)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
