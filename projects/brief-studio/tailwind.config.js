/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FBF8F3',
          100: '#F5EFE4',
          200: '#EBE0CB',
        },
        oxblood: {
          400: '#8B2635',
          500: '#6B1D2A',
          600: '#4A1420',
          700: '#2E0C14',
        },
        ink: {
          400: '#3D3935',
          500: '#2A2724',
          600: '#1A1816',
          700: '#0E0D0C',
        },
        gold: {
          400: '#C9A961',
          500: '#A88A45',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
