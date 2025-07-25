/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ ДОБАВЬ ЭТУ СТРОКУ
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00BF62',
        secondary: '#004AAE',
        accent: '#FFDE59',
      },
    },
  },
  plugins: [],
};
