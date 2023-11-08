/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f97316",
        secondary: "#6b21a8",
      },
      fontSize: {
        'subheading-sm': '0.8rem',
        'heading-sm': '1.563rem',
        'heading': '3.052rem',
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["halloween"], // Enable the Halloween theme
  },
};
