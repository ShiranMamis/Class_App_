/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx,html}",'./pdf.html',
    "./components/**/*.{js,ts,jsx,tsx,mdx,html}",'./pdf.html',
    "./app/**/*.{js,ts,jsx,tsx,mdx,html}",'./pdf.html'
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
