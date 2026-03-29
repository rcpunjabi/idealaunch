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
        mono:  ['var(--font-mono)', 'monospace'],
        sans:  ['var(--font-sans)', 'sans-serif'],
      },
      colors: {
        ink:     { DEFAULT: '#0a0a12', 50: '#f0f0ff', 100: '#e0e0ff', 900: '#0a0a12' },
        violet:  { DEFAULT: '#7c6fff', light: '#a89fff', dark: '#5c4fff' },
        emerald: { DEFAULT: '#00e5a0', dim: '#00b87f' },
        surface: { DEFAULT: '#12121e', raised: '#1a1a2a', border: '#252535' },
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease forwards',
        'shimmer':   'shimmer 1.5s infinite',
        'blink':     'blink 1s step-end infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0 },
        }
      },
    },
  },
  plugins: [],
};
