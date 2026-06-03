module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  testMatch: ['<rootDir>/src/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/utils/**/*.js',
    'src/api/**/*.js',
    'src/components/**/*.js',
    '!src/data/**',
  ],
};
