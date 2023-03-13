/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      screens: {
        'sm': '100%',
        'md': '100%',
        'lg': '1284px',
        'xl': '1280px',
        '2xl': '1600px',
      }
    },
    extend: {},
  },
  plugins: [],
}
