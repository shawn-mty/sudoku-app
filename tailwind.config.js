/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        darkGray: '#1f1f1f',
        charcoal: '#333333',
        brightPurple: '#bf00ff',
        white: '#ffffff',
        deepPurple: '#43268b',
        darkPurple: '#2b003a',
        black: '#000000',
      },
    },
  },
  plugins: [],
}
