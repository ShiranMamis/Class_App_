/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./pages/**/*.{js,ts,jsx,tsx,mdx,html}",'./pdf.html',
  "./components/**/*.{js,ts,jsx,tsx,mdx,html}",'./pdf.html',
  "./app/**/*.{js,ts,jsx,tsx,mdx,html}",'./pdf.html',
  "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: 
      {
        "footer_blue": " rgba(116, 137, 196, 1)",
        "dark_text" :" rgba(59, 68, 92, 1)",
      },
      backgroundImage:
      {
        "idf": "url('/public/groupLogo.png')"
      }
  },
  },
  plugins: [],
}

