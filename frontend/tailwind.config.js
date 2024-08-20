/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.jsx",
    "./src/**/*.jsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, rgba(17,17,17,0.8), rgba(17,17,17,1))',
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

