/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans:    ['var(--font-sans)', 'sans-serif'],
      },
      colors: {
        cream:  { DEFAULT: '#FAF8F4', dark: '#F2EDE6', darker: '#E8DDD0' },
        navy:   { DEFAULT: '#1B2E4F', light: '#2D4A7A', dark: '#0F1C30' },
        terra:  { DEFAULT: '#C4693B', light: '#D4804F', dark: '#A8562F' },
        gold:   { DEFAULT: '#D4973A', light: '#E0AC52', dark: '#B37D28' },
        coral:  { DEFAULT: '#E05C3A', light: '#E87A5C', dark: '#C24828' },
        ink:    { DEFAULT: '#2D3748', light: '#4A5568', lighter: '#718096' },
        border: { DEFAULT: '#E2D9CE', dark: '#CEC3B5' },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'shimmer': 'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
