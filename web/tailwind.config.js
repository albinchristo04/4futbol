/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // slate-950
        surface: "#0f172a", // slate-900
        primary: "#22c55e", // green-500
        accent: "#ef4444", // red-500
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "2px",
        lg: "4px",
        xl: "6px",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
