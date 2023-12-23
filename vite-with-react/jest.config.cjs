module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
  testEnvironment: 'jest-environment-jsdom',
  "transform": {
  "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "./src/axios.js": "babel-jest"
  },
  "moduleNameMapper": {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
};
