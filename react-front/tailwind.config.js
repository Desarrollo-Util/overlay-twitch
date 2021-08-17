const {
  generateResponsiveScreens,
  generatePixelRules,
  generateRemRules,
  generateIntRules,
  flexPlugin,
  absolutePlugin,
  transitionPlugin,
  truncatePlugin,
  containerPlugin,
  generateColumnRules,
} = require("@learnthis/tailwind-utils");

const standardRemValues = {
  ...generateRemRules(0, 5, 0.125),
  ...generateRemRules(5, 10, 0.25),
  ...generateRemRules(10, 25, 0.5),
  ...generateRemRules(25, 100, 1),
};

const breakpoints = {
  xs: 450,
  sm: 768,
  md: 1024,
  lg: 1280,
};

module.exports = {
  purge: ["./src/**/*.ts"],
  theme: {
    screens: generateResponsiveScreens(
      breakpoints.xs,
      breakpoints.sm,
      breakpoints.md
    ),
    borderWidth: generatePixelRules(0, 10),
    fontSize: generatePixelRules(10, 60),
    padding: {
      full: "100%",
      ...standardRemValues,
    },
    margin: {
      ...standardRemValues,
    },
    height: {
      auto: "auto",
      screen: "100vh",
      full: "100%",
      ...standardRemValues,
    },
    width: {
      auto: "auto",
      screen: "100vw",
      full: "100%",
      ...generateColumnRules([2, 3, 4, 5, 6, 8, 10, 12]),
      ...standardRemValues,
    },
    maxHeight: {
      auto: "auto",
      screen: "100vh",
      full: "100%",
      ...standardRemValues,
    },
    maxWidth: {
      auto: "auto",
      screen: "100vw",
      full: "100%",
      ...standardRemValues,
    },
    minHeight: {
      auto: "auto",
      screen: "100vh",
      full: "100%",
      ...standardRemValues,
    },
    minWidth: {
      auto: "auto",
      screen: "100vw",
      full: "100%",
      ...standardRemValues,
    },
    top: {},
    right: {},
    left: {},
    bottom: {},
    zIndex: generateIntRules(-100, 100),
  },
  variants: {
    extend: {
      borderOpacity: ["disabled"],
      borderWidth: ["disabled"],
      borderColor: ["responsive", "focus", "disabled"],
      backgroundColor: ["responsive", "hover", "disabled"],
      textColor: ["responsive", "hover", "disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [
    flexPlugin(["responsive"]),
    absolutePlugin(-5, 5, 0.125),
    transitionPlugin(0, 2000, 125),
    truncatePlugin(20),
    containerPlugin(breakpoints),
  ],
};
