/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#06b6d4',
        dark: {
          DEFAULT: '#131620',
          card: '#1a1f2e',
          border: '#2a3142',
          lighter: '#232936',
        }
      }
    },
  },
  plugins: [],
}
