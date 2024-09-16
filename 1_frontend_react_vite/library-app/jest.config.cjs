module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    // "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^src/(.*)$": "<rootDir>/src/$1", // 如果你在import时使用别名，比如'src/'
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
