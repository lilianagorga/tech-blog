/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        bounce: "bounce 1s infinite",
      },
      height: {
        'custom': '24px',
      },
      width: {
        'custom': '24px',
      },
    },
    fontFamily: {
      nunito: ['Nunito Sans', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

