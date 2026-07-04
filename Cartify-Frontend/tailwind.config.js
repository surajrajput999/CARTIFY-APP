/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandTeal: '#008080', 
        brandTealLight: '#20B2AA', 
        brandDark: '#1F2937', 
      }
    },
  },
  plugins: [],
}