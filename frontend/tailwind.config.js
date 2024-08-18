/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.jsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#FDFBF0',
        secondary: '#F2EED1',
        accent: '#C3B649',
        black: '#111111',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}

