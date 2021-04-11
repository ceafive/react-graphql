module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,}"],
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "brand-mauve": "#880e4f",
      },
    },
  },
  variants: {
    extend: {
      ringWidth: ["hover", "active"],
      ringColor: ["hover", "active"],
      ringOpacity: ["hover", "active"],
    },
  },
  plugins: [],
};
