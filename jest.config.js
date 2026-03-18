module.exports = {
  testEnvironment: "jsdom",

  testPathIgnorePatterns: [
    "/node_modules/",
    "frontend/tests/e2e/playwright",
    "frontend/tests/e2e/seleniumwebdriver",
    "frontend/tests/e2e/robotframework",
  ],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "frontend/tests/e2e/playwright",
    "frontend/tests/e2e/seleniumwebdriver",
    "frontend/tests/e2e/robotframework",
  ],

  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],

  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};
