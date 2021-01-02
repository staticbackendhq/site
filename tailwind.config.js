module.exports = {
  purge: {
    enabled: false,
    content: ["./**/*.html"]
  },

  theme: {
    typography: {
      default: {
        css: {
          'code::before': {
            content: '""',
          },
          'code::after': {
            content: '""',
          },
        },
      },
    },
    extend: {
      fontFamily: {
        lato: ["lato"],
        merri: ["merriweather"],
      },
      margin: {
        '96': '24rem',
        '128': '32rem',
      },
      colors: {
        sb: "#DD0000",
      },
      maxWidth: {
        lg2: "1024px",
        xl2: "1280px"
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/ui"),
  ]
}
