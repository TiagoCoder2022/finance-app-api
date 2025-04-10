/** @type {import('jest').Config} */
const config = {  
  collectCoverageFrom: ['src/**/*.js'], 
  coverageDirectory: "coverage", 
  coverageProvider: "v8",  
  globalSetup: '<rootDir>/jest.global-setup.mjs', 
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],  
  //watchPathIgnorePatterns: [".postgres"],  
};

export default config;
