/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",     
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
    
    colors: {
      myGray: "#6b7280",
      myWhite: "#f8f8ff",
      myBlack: "#0F0F0F",
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

