/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "neonGreen": '#00D54B',
        "lightGrey":'#B6B6B6',
        "cremeWhite": '#F8F6F6',
        "mediumGrey": '#606060'
      },
      fontFamily: {
        workSans: ['Work Sans','serif'], // Add your fonts here
        archivoBlack: ["Archivo Black", 'sans-serif'],
        exo2:["Exo 2", 'sans-serif'],
      },
    },
  },
  plugins: [],
}

