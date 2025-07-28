/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Mystery Quest", "sans-serif"],
        secondary: ["Playwrite AU QLD", "sans-serif"],
      },
    },
  },
  plugins: [],
};
