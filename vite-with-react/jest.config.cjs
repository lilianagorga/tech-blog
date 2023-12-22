// module.exports = {
//   "setupFilesAfterEnv": [
//   "@testing-library/jest-dom/extend-expect"
//   ],
//   "testEnvironment": "jest-environment-jsdom",
//   "transform": {
//   "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
//   },
//   "moduleNameMapper": {
//     "\\.(css|less|sass|scss)$": "identity-obj-proxy"
//   }
// }

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jest-environment-jsdom',
  "transform": {
  "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  "moduleNameMapper": {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy"
  }
};

