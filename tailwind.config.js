/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#090d16',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#0284c7',
          success: '#10b981',
          warning: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
