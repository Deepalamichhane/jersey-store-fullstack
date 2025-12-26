/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        // Now you can use 'font-anton' in your components
        anton: ['Anton', 'sans-serif'],
        // Added a standard brand sans-serif if needed
        sans: ['Inter', 'system-ui', 'sans-serif'], 
      },
      colors: {
        'jersey-pink': '#FF4D97',
        'pitch-black': '#000000',
        'stadium-gray': '#F5F5F7',
        'slate-muted': '#64748b',
      },
      keyframes: {
        'cart-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        'cart-bounce': 'cart-bounce 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}