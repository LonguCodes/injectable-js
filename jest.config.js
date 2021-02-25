module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.(test).{js,jsx,ts,tsx}'],
  testPathIgnorePatterns:["node_modules","dist"]

};