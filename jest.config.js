module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: false, // desliga cobertura por padrão
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
