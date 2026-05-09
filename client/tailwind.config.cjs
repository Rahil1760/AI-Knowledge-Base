// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 100%, 55%)",
        secondary: "hsl(260, 70%, 65%)",
        accent: "hsl(45, 90%, 55%)",
      },
    },
  },
  plugins: [],
};
