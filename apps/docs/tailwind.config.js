module.exports = {
  darkMode: ["class", "[data-theme=\"dark\"]"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./docs/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    "./docs/**/*.{md,mdx}", 
  ], 
   corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        //Custom Colors
      },
    },
  },
};