/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A', // Dark Navy/Slate 900
          light: '#1E293B',   // Slate 800
          dark: '#020617',    // Slate 950
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber 500 (Gold-ish)
          hover: '#D97706',   // Amber 600
        },
        secondary: {
          DEFAULT: '#3B82F6', // Blue 500
        },
        surface: {
          DEFAULT: '#1E293B',
          hover: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
