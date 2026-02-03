/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#0891b2',
          light: '#06b6d4',
          dark: '#0e7490',
        },
        accent: '#8b5cf6',
      }
    },
  },
  plugins: [],
}
