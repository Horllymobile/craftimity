/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontSize: {
        sm: "0.8rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      colors: {
        primary: "#12427A",
        "primary-50": "#e3f0f7",
        "primary-100": "#bbdaee",
        "primary-200": "#92c4e2",
        "primary-300": "#6cadd6",
        "primary-400": "#529ccf",
        "primary-500": "#3a8dc9",
        "primary-600": "#3180bc",
        "primary-700": "#276fab",
        "primary-800": "#1f5f99",
        "primary-900": "#12427A",
      },
    },
  },
  plugins: [],
};
