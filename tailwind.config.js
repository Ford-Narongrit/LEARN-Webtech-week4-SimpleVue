module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-in-right": {
          "0%": {
            webkitTransform: "translateX(1000px)",
            transform: "translateX(1000px)",
            opacity: "0",
          },
          "100%": {
            webkitTransform: "translateX(0)",
            transform: "translateX(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
