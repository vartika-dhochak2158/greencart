/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: { fontFamily: { sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'] }, keyframes: { 'shimmer-slide': { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } } }, animation: { shimmer: 'shimmer-slide 1.4s infinite linear' } } },
  plugins: [],
}
