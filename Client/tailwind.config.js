/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3B82F6",
          pink: "#EC4899",
          yellow: "#FBBF24",
          gray: "#F3F4F6",
        },
      },
    },
  },
  plugins: [],
};
